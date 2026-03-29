import { useCallback, useEffect, useState } from "react";
import { useChat as useAiChat } from "@ai-sdk/react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useMutation } from "convex/react";
import { api as convexApi } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DefaultChatTransport, UIMessage } from "ai";

export interface PersonaProfile {
  userType: "student" | "investor" | "founder" | "professional" | "general";
  interests: string[];
  goals: string[];
}

export function useChat(overrideProfile?: PersonaProfile) {
  const { profile: baseProfile } = useUserProfile();
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const createConversation = useMutation(convexApi.conversations.create);
  
  // Manual input state for AI SDK 6.x compatibility
  const [input, setInput] = useState("");

  const activeProfile = overrideProfile || baseProfile;

  useEffect(() => {
    // Generate a conversation on mount if not exists
    if (typeof window !== "undefined" && !conversationId) {
      const deviceId = localStorage.getItem("deviceId");
      if (deviceId) {
        createConversation({
          deviceId,
          title: "New Session",
          intent: "general",
        })
          .then((id) => setConversationId(id))
          .catch((err) => console.error("Failed to create conversation:", err));
      }
    }
  }, [conversationId, createConversation]);

  const chat = useAiChat({
    // Stable ID avoids clearing the stream when Convex creates a conversation record
    id: "et-marketing-concierge",
    api: "/api/chat",
    body: {
      userProfile: activeProfile
        ? {
            userType: activeProfile.userType,
            interests: activeProfile.interests,
            goals: activeProfile.goals,
          }
        : undefined,
      conversationId,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello. I am GENZET AI. Ask me about markets, news, or your portfolio.",
      } as any,
    ],
  } as any);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const sendMessageCustom = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Clear input before sending
    setInput("");
    
    // Use the sendMessage method from useAiChat (AI SDK v6)
    // sendMessage accepts either text or a message object
    chat.sendMessage({ text: content });
  }, [chat]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    await sendMessageCustom(input);
  }, [input, sendMessageCustom]);

  // Shim for backward compatibility with older AI SDK 'append'
  const append = useCallback(async (message: any) => {
    if (typeof message === 'string') {
      await sendMessageCustom(message);
    } else if (message.content) {
      await sendMessageCustom(message.content);
    }
  }, [sendMessageCustom]);

  // Map messages to include toolInvocations mapping if needed by the UI
  // In SDK 6.x, m.content is automatically populated from the data stream.
  const compatibleMessages = chat.messages.map((m: any) => {
    return {
      ...m,
      // Ensure toolInvocations exists for the UI rendering logic in page.tsx
      toolInvocations: m.toolInvocations || [],
      content: m.content || "",
    };
  });

  return {
    messages: compatibleMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: (chat as any).isLoading || (chat as any).status === "streaming" || (chat as any).status === "submitted",
    stop: chat.stop,
    error: chat.error,
    append,
    reload: (chat as any).reload || (chat as any).regenerate,
    setMessages: chat.setMessages,
  };
}
