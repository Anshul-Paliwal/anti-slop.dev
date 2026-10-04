import Link from "next/link";

export const metadata = {
  title: "FAQ | AntiSlop.dev",
  description: "Frequently Asked Questions about AntiSlop.",
};

const FAQS = [
  {
    q: "What is AI slop?",
    a: "AI slop consists of patterns commonly introduced during AI-assisted development: redundant abstractions, unnecessary logic, hallucinatory dependencies, and other detectable code-quality problems."
  },
  {
    q: "Does AntiSlop upload my code?",
    a: "No. Standard AntiSlop AST scanning happens entirely locally. Your code is not transmitted to AntiSlop.dev."
  },
  {
    q: "Does AntiSlop require an LLM?",
    a: "No. Detection is 100% deterministic static analysis (AST parsing). An LLM is only required if you explicitly choose to use the optional Auto-Fix remediation layer."
  },
  {
    q: "Can I use AntiSlop without an account?",
    a: "Yes. The core static analysis tool works locally without requiring an AntiSlop.dev account."
  },
  {
    q: "What is antislop-report.md?",
    a: "It is a generated markdown file summarizing all detected structural issues, making it easy for humans or external AI coding agents to understand the context and begin remediation."
  }
];

export default function FAQPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Frequently Asked Questions</h1>
      </div>

      <div className="flex flex-col gap-6">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-[#111] border border-white/10 p-6 rounded-xl">
            <h3 className="text-lg font-mono font-bold text-white mb-3 flex items-start gap-3">
              <span className="text-terminal-green">Q.</span>
              {faq.q}
            </h3>
            <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed pl-7">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/troubleshooting" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> Troubleshooting
        </Link>
        <div />
      </div>
    </div>
  );
}
