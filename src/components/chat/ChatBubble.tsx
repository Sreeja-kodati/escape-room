import { Bot, User, Zap } from "lucide-react";
import type { ChatMessage } from "../../types";
import { FormattedText } from "./FormattedText";
import { TypewriterText } from "./TypewriterText";

interface ChatBubbleProps {
  message: ChatMessage;
  onTypewriterComplete?: () => void;
}

const roleConfig = {
  user: {
    icon: User,
    align: "justify-end",
    bubble: "bg-[#00f5ff]/15 border-[#00f5ff]/25 text-slate-100",
    iconColor: "text-[#00f5ff]",
    label: "You",
  },
  assistant: {
    icon: Bot,
    align: "justify-start",
    bubble: "glass border-white/10 text-slate-200",
    iconColor: "text-[#a855f7]",
    label: "AI Guide",
  },
  system: {
    icon: Zap,
    align: "justify-center",
    bubble: "bg-[#ff00aa]/10 border-[#ff00aa]/20 text-[#ff00aa]/90 text-center text-sm italic",
    iconColor: "text-[#ff00aa]",
    label: "System",
  },
};

export function ChatBubble({ message, onTypewriterComplete }: ChatBubbleProps) {
  const config = roleConfig[message.role];
  const Icon = config.icon;
  const isSystem = message.role === "system";

  return (
    <div
      className={`flex ${config.align} animate-slide-up`}
      style={{ animationFillMode: "both" }}
    >
      <div
        className={[
          "flex max-w-[85%] gap-3 sm:max-w-[75%]",
          message.role === "user" ? "flex-row-reverse" : "flex-row",
          isSystem ? "max-w-full w-full" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {!isSystem && (
          <div
            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 ${config.iconColor}`}
          >
            <Icon size={16} />
          </div>
        )}

        <div className="flex flex-col gap-1">
          {!isSystem && (
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-600">
              {config.label}
            </span>
          )}
          <div
            className={[
              "rounded-2xl border px-4 py-3 text-[15px] leading-relaxed",
              config.bubble,
              message.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm",
              isSystem ? "rounded-xl w-full" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {message.role === "assistant" && message.animate ? (
              <TypewriterText
                text={message.content}
                onComplete={onTypewriterComplete}
              />
            ) : (
              <FormattedText content={message.content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
