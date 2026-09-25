import { CHATBOT_BFF_CHAT_URL } from "./config";
import { getChatbotSessionId } from "./session";

export type ChatStreamHandlers = {
  onDelta: (text: string) => void;
  onDone?: () => void;
  signal?: AbortSignal;
};

function extractDelta(payload: unknown): string | null {
  if (payload == null) return null;
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (!trimmed || trimmed === "[DONE]" || trimmed === "DONE") return null;
    return payload;
  }
  if (typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  for (const key of [
    "delta",
    "content",
    "text",
    "token",
    "message",
    "answer",
    "reply",
    "output",
  ] as const) {
    const value = record[key];
    if (typeof value === "string" && value.length > 0) return value;
  }

  const choices = record.choices;
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
    const choice = choices[0] as Record<string, unknown>;
    const delta = choice.delta;
    if (delta && typeof delta === "object") {
      const content = (delta as Record<string, unknown>).content;
      if (typeof content === "string") return content;
    }
    if (typeof choice.text === "string") return choice.text;
  }

  return null;
}

function isDonePayload(payload: unknown): boolean {
  if (payload == null) return false;
  if (typeof payload === "string") {
    const t = payload.trim();
    return t === "[DONE]" || t === "DONE" || t === "done";
  }
  if (typeof payload !== "object") return false;
  const record = payload as Record<string, unknown>;
  const type = typeof record.type === "string" ? record.type.toLowerCase() : "";
  const event =
    typeof record.event === "string" ? record.event.toLowerCase() : "";
  const status =
    typeof record.status === "string" ? record.status.toLowerCase() : "";
  return (
    record.done === true ||
    type === "done" ||
    type === "end" ||
    event === "done" ||
    event === "end" ||
    status === "done" ||
    status === "complete"
  );
}

/**
 * Consume SSE (or SSE-like) chunks from a ReadableStream.
 * Supports `data: ...` lines and plain streamed text fallback.
 */
export async function consumeChatStream(
  body: ReadableStream<Uint8Array>,
  handlers: ChatStreamHandlers,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawSse = false;

  const flushEventBlock = (block: string) => {
    const lines = block.split(/\r?\n/);
    let dataLines: string[] = [];
    for (const line of lines) {
      if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).replace(/^ /, ""));
      }
    }
    if (dataLines.length === 0) return;
    sawSse = true;
    const data = dataLines.join("\n");
    if (!data.trim() || data.trim() === "[DONE]") {
      handlers.onDone?.();
      return;
    }
    try {
      const parsed: unknown = JSON.parse(data);
      if (isDonePayload(parsed)) {
        handlers.onDone?.();
        return;
      }
      const delta = extractDelta(parsed);
      if (delta) handlers.onDelta(delta);
    } catch {
      handlers.onDelta(data);
    }
  };

  while (true) {
    if (handlers.signal?.aborted) {
      await reader.cancel();
      throw new DOMException("Aborted", "AbortError");
    }
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    if (buffer.includes("\n\n") || buffer.includes("\r\n\r\n")) {
      const parts = buffer.split(/\r?\n\r?\n/);
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        if (part.trim()) flushEventBlock(part);
      }
    }
  }

  buffer += decoder.decode();
  if (buffer.trim()) {
    if (buffer.includes("data:")) {
      flushEventBlock(buffer);
    } else if (!sawSse) {
      // Non-SSE JSON or plain text body
      try {
        const parsed: unknown = JSON.parse(buffer);
        if (!isDonePayload(parsed)) {
          const delta = extractDelta(parsed);
          if (delta) handlers.onDelta(delta);
        }
      } catch {
        handlers.onDelta(buffer);
      }
    } else {
      flushEventBlock(buffer);
    }
  }

  handlers.onDone?.();
}

export async function streamChatbotReply(
  message: string,
  handlers: ChatStreamHandlers,
): Promise<void> {
  const response = await fetch(CHATBOT_BFF_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      message,
      session_id: getChatbotSessionId(),
    }),
    signal: handlers.signal,
  });

  if (!response.ok) {
    let detail = `Chat request failed (${response.status})`;
    try {
      const errBody = (await response.json()) as { error?: string };
      if (errBody.error) detail = errBody.error;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  if (!response.body) {
    throw new Error("Chat stream is empty.");
  }

  await consumeChatStream(response.body, handlers);
}
