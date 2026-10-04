import { Info, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react";

export type CalloutType = "note" | "tip" | "warning" | "important";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  const styles = {
    note: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: <Info className="w-5 h-5 text-blue-400" />,
      titleColor: "text-blue-400",
    },
    tip: {
      bg: "bg-terminal-green/10",
      border: "border-terminal-green/20",
      icon: <Lightbulb className="w-5 h-5 text-terminal-green" />,
      titleColor: "text-terminal-green",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      titleColor: "text-yellow-400",
    },
    important: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      titleColor: "text-red-400",
    },
  };

  const style = styles[type];

  return (
    <div className={`my-6 flex gap-4 p-5 rounded-lg border ${style.bg} ${style.border}`}>
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex-1">
        {title && <h5 className={`font-mono font-bold text-sm mb-2 ${style.titleColor}`}>{title}</h5>}
        <div className="text-sm font-mono text-white/80 leading-relaxed [&>p:last-child]:mb-0 [&>p]:mb-3">
          {children}
        </div>
      </div>
    </div>
  );
}
