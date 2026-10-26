import React from "react";
import { Info, CheckCircle2, ChevronDown, Headset } from "lucide-react";

interface QuickServiceButtonsProps {
  onOpenAbout: () => void;
  onToggleTrack: () => void;
  isTrackActive: boolean;
  onOpenContact: () => void;
}

export default function QuickServiceButtons({
  onOpenAbout,
  onToggleTrack,
  isTrackActive,
  onOpenContact,
}: QuickServiceButtonsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
      <button
        type="button"
        onClick={onOpenAbout}
        className="md:flex-1 w-full h-14 bg-primary-light hover:bg-primary-subtle border border-primary/20 text-primary-hover rounded-2xl px-5 flex items-center justify-start gap-2.5 font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
      >
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Info className="w-4 h-4" />
        </div>
        <span>عن مكتبة الإيمان</span>
      </button>

      <button
        type="button"
        onClick={onToggleTrack}
        className="md:flex-1 w-full h-14 bg-success-light hover:bg-success-light border border-success-border/60 text-success rounded-2xl px-5 flex items-center justify-between font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>تتبع طلبك</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-success transition-transform duration-300 ${
            isTrackActive ? "rotate-180" : ""
          }`}
        />
      </button>

      <button
        type="button"
        onClick={onOpenContact}
        className="md:flex-1 w-full h-14 bg-info-light hover:bg-info-light border border-info-border/70 text-info rounded-2xl px-5 flex items-center justify-between font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-info/10 flex items-center justify-center text-info">
            <Headset className="w-4 h-4" />
          </div>
          <span>تواصل معنا وشاركنا رأيك</span>
        </div>
        <span className="text-[11px] bg-info/10 text-info px-2.5 py-0.5 rounded-full font-bold">
          دعم وآراء
        </span>
      </button>
    </div>
  );
}
