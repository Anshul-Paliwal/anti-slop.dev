export default function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center py-12 select-none pointer-events-none">
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-terminal-green/30 to-transparent max-w-3xl" />
      <div className="px-6 text-terminal-green/60 font-mono text-sm tracking-widest drop-shadow-[0_0_8px_rgba(57,255,136,0.5)]">
        {"//"}
      </div>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-terminal-green/30 to-transparent max-w-3xl" />
    </div>
  );
}
