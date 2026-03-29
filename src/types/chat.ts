// Chat and conversation types

export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "pending" | "streaming" | "complete" | "error";

export interface Source {
  id: string;
  title: string;
  url?: string;
  excerpt: string;
  publishedAt?: string;
  topic?: string;
}

export interface ActionButton {
  id: string;
  label: string;
  type: "save" | "subscribe" | "register" | "explore" | "share" | "ask";
  href?: string;
  payload?: Record<string, unknown>;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  sources?: Source[];
  actions?: ActionButton[];
  createdAt: string;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: Message[];
  intent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StreamChunk {
  type: "delta" | "sources" | "actions" | "done" | "error";
  delta?: string;
  sources?: Source[];
  actions?: ActionButton[];
  error?: string;
}
