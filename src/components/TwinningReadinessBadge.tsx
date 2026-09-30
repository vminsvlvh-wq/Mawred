import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  Info, 
  Clock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  X,
  Gauge
} from 'lucide-react';
import { cn } from '../lib/utils';
import { TwinningReadiness } from '../data/expertsData';

interface TwinningReadinessBadgeProps {
  readiness: TwinningReadiness;
  expertName?: string;
  compact?: boolean;
  showProjectsCount?: boolean;
  className?: string;
}

export default function TwinningReadinessBadge({
  readiness,
  expertName,
  compact = false,
  showProjectsCount = true,
  className
}: TwinningReadinessBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative inline-block text-right", className)} ref={popoverRef} dir="rtl">
      {/* Badge Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer select-none group",
          readiness.badgeBg,
          readiness.badgeTextColor,
          readiness.badgeBorderColor,
          "hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        )}
        title="انقر لعرض تفاصيل مؤشر جاهزية التوأمة ومدى توفر الخبير"
        aria-label={`مؤشر جاهزية التوأمة: ${readiness.statusText}`}
      >
        {/* Pulsing Readiness Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span 
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              readiness.pulseColor
            )} 
          />
          <span 
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              readiness.dotColor
            )} 
          />
        </span>

        {/* Readiness Label & Score */}
        <span className="font-extrabold tracking-tight">جاهزية التوأمة:</span>
        <span className="font-black">{readiness.availabilityStatus || readiness.statusText}</span>
        
        {/* Score pill */}
        <span className={cn(
          "px-1.5 py-0.5 rounded text-[10px] font-mono font-black border border-current/20",
          readiness.pillBg
        )}>
          %{readiness.score}
        </span>

        {/* Project count indicator */}
        {showProjectsCount && !compact && (
          <span className="text-[10px] opacity-75 font-medium border-r border-current/20 pr-1.5 mr-0.5">
            ({readiness.projectsCount} {readiness.projectsCount === 1 ? 'مشروع' : 'مشاريع'})
          </span>
        )}

        <Info className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
      </button>

      {/* Detailed Popover Breakdown */}
      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 right-0 top-full mt-2 w-80 sm:w-96 p-4 bg-white text-saudi-dark rounded-2xl shadow-2xl border border-gray-200 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Popover Header */}
          <div className="flex items-start justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-lg", readiness.badgeBg, readiness.badgeTextColor)}>
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-xs text-saudi-dark flex items-center gap-1.5">
                  <span>مؤشر جاهزية التوأمة المعرفية</span>
                </h4>
                {expertName && (
                  <p className="text-[11px] text-gray-500 font-medium">الخبير: {expertName}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Readiness Score Progress Bar */}
          <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", readiness.dotColor)} />
                <span className="text-saudi-dark">حالة التوفر: {readiness.availabilityStatus} ({readiness.statusText})</span>
              </span>
              <span className="font-mono font-black text-saudi-green">%{readiness.score}</span>
            </div>
            
            {/* Visual Bar */}
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", readiness.progressColor)} 
                style={{ width: `${readiness.score}%` }} 
              />
            </div>
            
            <p className="text-[10px] text-gray-500 leading-tight">
              يعكس هذا المؤشر مدى توافر الخبير لجلسات التوأمة ونقل المعرفة المباشرة استناداً إلى أعباء مشاريعه الحالية.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-gray-400 block text-[10px] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-saudi-green" />
                المشاريع الحالية
              </span>
              <span className="font-black text-saudi-dark font-mono text-xs">
                {readiness.projectsCount} {readiness.projectsCount === 1 ? 'مشروع وطني' : 'مشاريع وطنية'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-gray-400 block text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-saudi-gold" />
                تفرغ التوأمة المتاح
              </span>
              <span className="font-black text-saudi-dark font-mono text-xs">
                {readiness.availableHoursPerWeek} ساعة / أسبوعياً
              </span>
            </div>
          </div>

          {/* How readiness is calculated from projects */}
          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80 space-y-1 text-[11px] leading-relaxed">
            <span className="font-black text-saudi-dark block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-saudi-green" />
              أثر عدد المشاريع على التفرغ:
            </span>
            <p className="text-gray-600 text-[11px]">
              {readiness.explanation}
            </p>
          </div>

          {/* Scale Guide */}
          <div className="pt-1 text-[10px] text-gray-400 space-y-1 border-t border-gray-100">
            <span className="font-bold block text-gray-500">معايير المؤشر:</span>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-emerald-700 font-bold">● مشروع 1: جاهزية مرتفعة (94%)</span>
              <span className="text-blue-700 font-bold">● مشروعان: متوازنة (68%)</span>
              <span className="text-amber-700 font-bold">● 3+ مشاريع: محدودة (38%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
