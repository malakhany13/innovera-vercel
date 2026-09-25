# Restore hidden UI elements

These UI pieces were hidden (removed from render) but their component files were kept. Use this guide to put them back.

## Summary of removals

| Item | Removed from | Component file (still present) |
|------|--------------|--------------------------------|
| Chatbot | `src/app/layout.tsx` | `src/components/Chatbot.tsx`, `src/components/layout/ChatbotLazy.tsx` |
| Language switcher | `src/components/layout/Navbar.tsx` | (inline in Navbar) |
| Search button | `src/components/layout/Navbar.tsx` | (inline in Navbar) |
| Contact form | `src/components/pages/Contact/index.tsx` | `src/components/pages/Contact/ContactFormSection.tsx` |

---

## 1. Restore chatbot

**File:** `src/app/layout.tsx`

### Add import

```tsx
import ChatbotLazy from "@/components/layout/ChatbotLazy";
```

### Add render (after `<Footer />`)

```tsx
<Footer />
<ChatbotLazy />
```

---

## 2. Restore language switcher and search button

**File:** `src/components/layout/Navbar.tsx`

### Update lucide import

```tsx
import { Globe, Search, Menu, X } from "lucide-react";
```

### Add state (inside `Navbar`)

```tsx
const [language, setLanguage] = useState<"EN" | "AR">("EN");
const [isLangOpen, setIsLangOpen] = useState(false);
```

### Restore language switcher

Place after the Partners & Clients link in the top utility bar:

```tsx
<Link href="/how-to-buy" className="hover:text-brand-cyan transition-colors">How to buy</Link>
<Link href="/partners" className="hover:text-brand-cyan transition-colors">Partners &amp; Clients</Link>
<div className="relative">
  <button onClick={() => setIsLangOpen(!isLangOpen)} className="hover:text-brand-cyan transition-colors flex items-center gap-1.5 focus:outline-none">
    <Globe className="w-3.5 h-3.5" /> {language}
  </button>
  <AnimatePresence>
    {isLangOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full right-0 mt-3 bg-white border border-slate-100 shadow-md rounded-lg p-1.5 z-50 text-slate-700 w-28 origin-top-right flex flex-col gap-1"
      >
        <button onClick={() => { setLanguage("EN"); setIsLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-md text-[13px] hover:bg-slate-50 transition-colors ${language === "EN" ? "font-bold text-brand-cyan bg-brand-cyan/5" : ""}`}>English</button>
        <button onClick={() => { setLanguage("AR"); setIsLangOpen(false); }} className={`w-full text-left px-3 py-2 rounded-md text-[13px] hover:bg-slate-50 transition-colors ${language === "AR" ? "font-bold text-brand-cyan bg-brand-cyan/5" : ""}`}>العربية</button>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

### Restore search button

Place after the Contact Us link in the desktop actions row:

```tsx
<div className="hidden md:flex items-center gap-6">
  <Link href="/contact" className="px-6 py-2 border-2 border-brand-cyan text-brand-cyan rounded-full text-[15px] font-medium hover:bg-brand-cyan hover:text-white transition-all">
    Contact Us
  </Link>
  <button onClick={(e) => e.preventDefault()} className="text-slate-800 hover:text-brand-cyan transition-colors">
    <Search className="w-5 h-5" />
  </button>
</div>
```

---

## 3. Restore contact form

**File:** `src/components/pages/Contact/index.tsx`

Replace the file contents with:

```tsx
"use client";

import ContactFormSection from "./ContactFormSection";
import ContactInfoSection from "./ContactInfoSection";

export default function Contact() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          <ContactInfoSection />
          <ContactFormSection />
        </div>
      </div>
    </div>
  );
}
```

`ContactFormSection.tsx` was not deleted and needs no changes.
