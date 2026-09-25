/** Upstream chatbot API (SSE over POST). Override with CHATBOT_API_BASE_URL. */
export function getChatbotApiBaseUrl(): string {
  const fromEnv = process.env.CHATBOT_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://innovera-testing-production.up.railway.app/chatbot/api";
}

export const CHATBOT_CHAT_PATH = "/chat.php";
export const CHATBOT_HEALTH_PATH = "/health.php";

/** Browser calls our BFF so CORS never blocks local/dev. */
export const CHATBOT_BFF_CHAT_URL = "/api/chatbot/chat";
