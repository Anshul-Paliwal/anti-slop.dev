import { Clock } from "lucide-react";

interface PlannedFeatureProps {
  title: string;
  description: string;
}

export function PlannedFeature({ title, description }: PlannedFeatureProps) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-8 my-10 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Clock className="w-6 h-6 text-white/50" />
      </div>
      <h3 className="text-xl font-mono font-bold text-white mb-3">
        {title} <span className="inline-block ml-2 px-2 py-0.5 rounded bg-white/10 text-[10px] uppercase tracking-widest text-white/50 align-middle -mt-1">Planned</span>
      </h3>
      <p className="text-[#A3A3A3] font-mono text-sm max-w-md mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
