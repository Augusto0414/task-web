import React from "react";

interface SummaryCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
}

function SummaryCard({ label, count, icon }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-white p-5 shadow-[0px_18px_40px_rgba(112,144,176,0.12)] border border-slate-50 transition-all hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-xs font-bold uppercase tracking-wider text-[#A3AED0]">{label}</p>
          <span className="text-2xl font-bold text-[#1B2559]">{count}</span>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4F7FE] text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
