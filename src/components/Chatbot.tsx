// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { X } from "lucide-react";
// import { AnimatePresence, motion } from "motion/react";
// import ReactMarkdown from "react-markdown";
// import { VENDORS } from "@/constants";
// import { streamChatbotReply } from "@/lib/chatbot/stream";

// type ChatRole = "user" | "assistant";

// type ChatMessage = {
//   id: string;
//   role: ChatRole;
//   text: string;
// };

// const WELCOME_TEXT =
//   "مرحباً بك في Innovera. يمكنني مساعدتك في الكورسات والأسعار والأكاديمية والخدمات والشراكات والفروع وطرق التواصل. اختر سؤالاً من الخيارات أو اكتب سؤالك.";

// const QUICK_REPLIES = [
//   "الخدمات",
//   "Innovera Academy",
//   "الكورسات والأسعار",
//   "الفروع",
// ] as const;

// function ChatbotFabIcon({ className }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 64 64"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={className}
//       aria-hidden
//     >
//       <circle cx="32" cy="32" r="32" fill="url(#chatbotFabGrad)" />
//       <circle cx="32" cy="32" r="30.5" stroke="#0b2a4a" strokeWidth="3" />
//       <rect x="18" y="22" width="28" height="24" rx="7" fill="white" />
//       <rect x="14" y="28" width="5" height="10" rx="2.5" fill="white" />
//       <rect x="45" y="28" width="5" height="10" rx="2.5" fill="white" />
//       <circle cx="32" cy="14" r="2.2" fill="white" />
//       <path d="M32 16.5V20" stroke="white" strokeWidth="2" strokeLinecap="round" />
//       <circle cx="26" cy="32" r="2.4" fill="#0b2a4a" />
//       <circle cx="38" cy="32" r="2.4" fill="#0b2a4a" />
//       <path
//         d="M26 39c2.2 2.4 9.8 2.4 12 0"
//         stroke="#0b2a4a"
//         strokeWidth="2.2"
//         strokeLinecap="round"
//       />
//       <defs>
//         <radialGradient
//           id="chatbotFabGrad"
//           cx="0"
//           cy="0"
//           r="1"
//           gradientUnits="userSpaceOnUse"
//           gradientTransform="translate(32 18) rotate(90) scale(46)"
//         >
//           <stop stopColor="#5ec8d6" />
//           <stop offset="1" stopColor="#1a6f9a" />
//         </radialGradient>
//       </defs>
//     </svg>
//   );
// }

// export default function Chatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     { id: "welcome", role: "assistant", text: WELCOME_TEXT },
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showQuickReplies, setShowQuickReplies] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const abortRef = useRef<AbortController | null>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isLoading]);

//   useEffect(() => {
//     return () => {
//       abortRef.current?.abort();
//     };
//   }, []);

//   const sendMessage = async (raw: string) => {
//     const userText = raw.trim();
//     if (!userText || isLoading) return;

//     setShowQuickReplies(false);
//     setInput("");
//     const userId = `u-${Date.now()}`;
//     const assistantId = `a-${Date.now()}`;
//     setMessages((prev) => [
//       ...prev,
//       { id: userId, role: "user", text: userText },
//       { id: assistantId, role: "assistant", text: "" },
//     ]);
//     setIsLoading(true);

//     abortRef.current?.abort();
//     const controller = new AbortController();
//     abortRef.current = controller;

//     try {
//       await streamChatbotReply(userText, {
//         signal: controller.signal,
//         onDelta: (delta) => {
//           setMessages((prev) =>
//             prev.map((msg) =>
//               msg.id === assistantId
//                 ? { ...msg, text: `${msg.text}${delta}` }
//                 : msg,
//             ),
//           );
//         },
//       });

//       setMessages((prev) => {
//         const current = prev.find((m) => m.id === assistantId);
//         if (current?.text.trim()) return prev;
//         return prev.map((msg) =>
//           msg.id === assistantId
//             ? {
//                 ...msg,
//                 text: "لم أتمكن من الحصول على رد الآن. حاول مرة أخرى.",
//               }
//             : msg,
//         );
//       });
//     } catch (error) {
//       if (error instanceof DOMException && error.name === "AbortError") return;
//       const message =
//         error instanceof Error
//           ? error.message
//           : "حدث خطأ أثناء الاتصال بالمساعد.";
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === assistantId ? { ...msg, text: message } : msg,
//         ),
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     void sendMessage(input);
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 16, scale: 0.96 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 16, scale: 0.96 }}
//             transition={{ duration: 0.2 }}
//             className="w-[min(92vw,360px)] h-[min(74vh,580px)] bg-[#f7f8fa] rounded-[18px] shadow-[0_12px_40px_rgba(15,47,85,0.28)] flex flex-col overflow-hidden border border-slate-200/70"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-[#0c2d52] via-[#123a66] to-[#1b4d78] text-white px-3 py-3 flex items-center justify-between gap-3 shrink-0">
//               <button
//                 type="button"
//                 onClick={() => setIsOpen(false)}
//                 aria-label="Close chat"
//                 className="w-8 h-8 rounded-lg bg-[#061a33]/55 hover:bg-[#061a33]/75 flex items-center justify-center transition-colors"
//               >
//                 <X className="w-4 h-4" strokeWidth={2.5} />
//               </button>
//               <div className="flex items-center gap-2.5 min-w-0">
//                 <div className="text-right min-w-0">
//                   <h3 className="font-sans font-bold text-[15px] leading-tight truncate">
//                     Innovera Assistant
//                   </h3>
//                   <p className="text-[11px] text-white/90 leading-tight mt-0.5" dir="rtl">
//                     مساعد Innovera
//                   </p>
//                 </div>
//                 <div className="relative w-10 h-10 rounded-[10px] overflow-hidden bg-[#2b7fd0] shadow-[0_0_14px_rgba(61,192,200,0.65)] shrink-0 flex items-center justify-center p-1 ring-1 ring-cyan-300/40">
//                   <Image
//                     src={VENDORS.INNOVERA.logo}
//                     alt="Innovera"
//                     width={36}
//                     height={36}
//                     className="object-contain"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 bg-[#f7f8fa]">
//               {messages.map((msg) => (
//                 <div key={msg.id} className="space-y-2.5">
//                   <div
//                     className={`flex ${
//                       msg.role === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`max-w-[88%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
//                         msg.role === "user"
//                           ? "bg-[#0f2f55] text-white rounded-2xl rounded-br-md shadow-sm"
//                           : "bg-[#e8ecf0] text-[#1f2937] rounded-2xl border border-slate-200/60"
//                       }`}
//                       dir="auto"
//                     >
//                       {msg.role === "user" ? (
//                         msg.text
//                       ) : msg.text ? (
//                         <div className="markdown-body prose prose-sm prose-slate max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ul]:pl-4 [&>ul]:list-disc [&>ol]:mb-2 [&>ol]:pl-4 [&>ol]:list-decimal [&_strong]:font-bold [&_a]:text-[#2eb6c0]">
//                           <ReactMarkdown>{msg.text}</ReactMarkdown>
//                         </div>
//                       ) : (
//                         <span className="inline-flex gap-1 py-1">
//                           <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
//                           <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
//                           <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {msg.id === "welcome" && showQuickReplies && (
//                     <div className="flex flex-wrap gap-2 justify-start" dir="rtl">
//                       {QUICK_REPLIES.map((label) => (
//                         <button
//                           key={label}
//                           type="button"
//                           disabled={isLoading}
//                           onClick={() => void sendMessage(label)}
//                           className="px-3.5 py-1.5 rounded-full text-[12px] font-medium bg-white text-[#2eb6c0] border border-[#2eb6c0] hover:bg-[#2eb6c0]/5 disabled:opacity-50 transition-colors"
//                         >
//                           {label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Composer */}
//             <div className="bg-white border-t border-slate-200/90 px-3 pt-3 pb-2.5 shrink-0">
//               <form
//                 onSubmit={handleSubmit}
//                 className="flex items-center gap-2.5"
//                 dir="ltr"
//               >
//                 <button
//                   type="submit"
//                   disabled={!input.trim() || isLoading}
//                   className="shrink-0 min-w-[64px] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#c5c9d4] disabled:bg-[#c5c9d4] disabled:text-white/90 enabled:bg-[#2eb6c0] enabled:hover:bg-[#25a3ac] transition-colors"
//                 >
//                   Send
//                 </button>
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="...اكتب سؤالك هنا"
//                   disabled={isLoading}
//                   className="flex-1 min-w-0 px-4 py-2.5 bg-white border-[1.5px] border-[#2eb6c0] rounded-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2eb6c0]/25 disabled:opacity-60"
//                   dir="rtl"
//                 />
//               </form>
//               <p className="text-center text-[11px] text-slate-400 mt-2.5">
//                 Powered by{" "}
//                 <span className="text-[#2eb6c0] font-semibold">Innovera</span>
//               </p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <button
//         type="button"
//         onClick={() => setIsOpen((open) => !open)}
//         aria-label={isOpen ? "Close Innovera Assistant" : "Open Innovera Assistant"}
//         className="w-[68px] h-[68px] rounded-full shadow-[0_8px_24px_rgba(10,39,72,0.35)] hover:scale-105 transition-transform relative z-10 overflow-hidden"
//       >
//         {isOpen ? (
//           <span className="w-full h-full flex items-center justify-center bg-[#0f2f55] text-white">
//             <X className="w-7 h-7" />
//           </span>
//         ) : (
//           <ChatbotFabIcon className="w-full h-full" />
//         )}
//       </button>
//     </div>
//   );
// }

/** AI chatbot temporarily disabled — UI commented above. */
export default function Chatbot() {
  return null;
}
