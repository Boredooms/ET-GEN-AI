"use client";

import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import {
  AssistantRuntimeProvider,
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  BranchPickerPrimitive,
  ActionBarPrimitive,
} from "@assistant-ui/react";
import { Zap, Sparkles, Plus, Send, StopCircle, Copy, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useState, useMemo } from "react";

const PERSONAS = {
  general: { interests: ["Markets", "Business news"], goals: ["Stay informed"] },
  investor: { interests: ["Equities", "Derivatives", "Wealth"], goals: ["Alpha generation", "Risk management"] },
  student: { interests: ["Economy", "Policy", "MBA insights"], goals: ["Learning foundations", "Career prep"] },
  founder: { interests: ["VC funding", "SaaS", "DeepTech"], goals: ["Market intelligence", "Competitor tracking"] },
  professional: { interests: ["Leadership", "Business strategy", "Industry trends"], goals: ["Career growth", "Market insights"] },
};

export default function ConciergePage() {
  const { profile, convexUserId } = useUserProfile();
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const userType = (profile?.userType as keyof typeof PERSONAS) || "general";
  const persona = PERSONAS[userType];

  // Create custom transport with user profile in body
  const transport = useMemo(
    () =>
      new AssistantChatTransport({
        api: "/api/chat",
        body: {
          userProfile: {
            userType: profile?.userType || "general",
            interests: persona.interests,
            goals: persona.goals,
          },
          conversationId,
        },
      }),
    [profile?.userType, persona.interests, persona.goals, conversationId]
  );

  // Create assistant-ui runtime for streaming chat
  const runtime = useChatRuntime({
    transport,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full flex-col bg-[oklch(0.05_0_0)] text-foreground">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[oklch(0.08_0_0)] px-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background shadow-lg">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground">FINANCIAL CONCIERGE</h1>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Ollama Cloud Active
            </div>
          </div>
        </div>

        {profile?.userType && (
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-1.5 md:flex">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.6_0.15_270)]" />
            <span className="text-xs font-semibold capitalize text-foreground">
              {profile.userType} Mode
            </span>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/10"
        >
          <Plus className="h-3.5 w-3.5" />
          New Thread
        </button>
      </header>

      {/* Assistant UI Thread */}
      <ThreadPrimitive.Root className="flex flex-1 flex-col overflow-hidden">
        {/* Messages Viewport */}
        <ThreadPrimitive.Viewport className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto max-w-3xl px-6 py-4">
            {/* Welcome Message */}
            <ThreadPrimitive.Empty>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.6_0.15_270)] to-[oklch(0.5_0.15_300)] shadow-2xl">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h2 className="mb-2 text-3xl font-bold text-foreground">Hello there!</h2>
                <p className="mb-8 text-muted-foreground">
                  How can I help you today?
                </p>

                {/* Suggestion Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <ThreadPrimitive.Suggestion
                    prompt="Analyze my financial health"
                    method="replace"
                    autoSend
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-white/20 hover:bg-white/10 active:scale-95 cursor-pointer"
                  >
                    Check my financial health
                  </ThreadPrimitive.Suggestion>
                  <ThreadPrimitive.Suggestion
                    prompt="What are the best investment options for me?"
                    method="replace"
                    autoSend
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-white/20 hover:bg-white/10 active:scale-95 cursor-pointer"
                  >
                    Investment recommendations
                  </ThreadPrimitive.Suggestion>
                  <ThreadPrimitive.Suggestion
                    prompt="Calculate EMI for a ₹10L home loan"
                    method="replace"
                    autoSend
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-white/20 hover:bg-white/10 active:scale-95 cursor-pointer"
                  >
                    EMI Calculator
                  </ThreadPrimitive.Suggestion>
                  <ThreadPrimitive.Suggestion
                    prompt="Why are IT stocks rallying today?"
                    method="replace"
                    autoSend
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-white/20 hover:bg-white/10 active:scale-95 cursor-pointer"
                  >
                    Market insights
                  </ThreadPrimitive.Suggestion>
                </div>
              </div>
            </ThreadPrimitive.Empty>

            {/* Messages */}
            <ThreadPrimitive.Messages
              components={{
                UserMessage: () => (
                  <MessagePrimitive.Root className="mb-4 flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-white px-5 py-3 text-black shadow-xl">
                      <MessagePrimitive.Content />
                    </div>
                  </MessagePrimitive.Root>
                ),
                AssistantMessage: () => (
                  <MessagePrimitive.Root className="mb-4 flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-white/10 bg-zinc-900 px-5 py-3 text-white shadow-xl ring-1 ring-white/5">
                      {/* Message Content */}
                      <div className="prose prose-invert max-w-none text-[15px] leading-relaxed [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_a]:text-blue-400 [&_a]:underline hover:[&_a]:text-blue-300 [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:leading-relaxed [&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/40 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0">
                        <MessagePrimitive.Content />
                      </div>
                      
                      {/* Branch Picker */}
                      <div className="mt-3 flex items-center gap-2">
                        <BranchPickerPrimitive.Root hideWhenSingleBranch className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BranchPickerPrimitive.Previous className="h-6 w-6 rounded-md border border-white/10 bg-white/5 p-1 hover:bg-white/10 transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                          </BranchPickerPrimitive.Previous>
                          <span className="text-xs">
                            <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
                          </span>
                          <BranchPickerPrimitive.Next className="h-6 w-6 rounded-md border border-white/10 bg-white/5 p-1 hover:bg-white/10 transition-colors">
                            <ChevronRight className="h-4 w-4" />
                          </BranchPickerPrimitive.Next>
                        </BranchPickerPrimitive.Root>

                        {/* Action Bar */}
                        <ActionBarPrimitive.Root hideWhenRunning autohide="not-last" className="flex items-center gap-1">
                          <ActionBarPrimitive.Copy className="h-7 w-7 rounded-md border border-white/10 bg-white/5 p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors">
                            <Copy className="h-full w-full" />
                          </ActionBarPrimitive.Copy>
                          <ActionBarPrimitive.Reload className="h-7 w-7 rounded-md border border-white/10 bg-white/5 p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors">
                            <RotateCcw className="h-full w-full" />
                          </ActionBarPrimitive.Reload>
                        </ActionBarPrimitive.Root>
                      </div>
                    </div>
                  </MessagePrimitive.Root>
                ),
              }}
            />
          </div>
        </ThreadPrimitive.Viewport>

        {/* Scroll to Bottom */}
        <ThreadPrimitive.ScrollToBottom className="absolute bottom-24 right-6 h-10 w-10 rounded-full border border-white/10 bg-zinc-900/90 backdrop-blur-lg flex items-center justify-center shadow-lg transition-all hover:bg-zinc-800">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground">
            <path d="M8 12L8 4M8 12L4 8M8 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ThreadPrimitive.ScrollToBottom>

        {/* Composer (Input Area) */}
        <div className="shrink-0 border-t border-white/5 bg-[oklch(0.08_0_0)] p-4 backdrop-blur-2xl">
          <div className="mx-auto max-w-3xl">
            <ComposerPrimitive.Root className="group relative flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition-all focus-within:border-white/25 focus-within:bg-[oklch(0.12_0_0)] focus-within:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
              <ComposerPrimitive.Input
                placeholder="Send a message... (type @ to mention a tool)"
                className="max-h-52 min-h-[44px] w-full resize-none bg-transparent px-2 py-2 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none custom-scrollbar"
                rows={1}
                autoFocus
              />

              <ComposerPrimitive.Send className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-20 disabled:hover:scale-100">
                <Send className="h-5 w-5" />
              </ComposerPrimitive.Send>

              <ThreadPrimitive.If running>
                <ComposerPrimitive.Cancel className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-foreground transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
                  <StopCircle className="h-5 w-5" />
                </ComposerPrimitive.Cancel>
              </ThreadPrimitive.If>
            </ComposerPrimitive.Root>

            {/* Footer Info */}
            <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
              <span className="font-semibold">Powered by Ollama Cloud • Qwen3-Coder-Next</span>
              <span className="text-white/10">•</span>
              <span className="font-semibold">Real-time Financial Data</span>
            </div>
          </div>
        </div>
      </ThreadPrimitive.Root>
      </div>
    </AssistantRuntimeProvider>
  );
}
