import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  Calendar,
  Building2,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Zap,
  BookOpen,
  PieChart as PieIcon,
  Download,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface MonthlyGrowthData {
  monthKey: string;
  monthName: string;
  monthEn: string;
  totalAssets: number;
  newAssets: number;
  localizedAssets: number;
  growthRate: number; // percentage
  technical: number;
  administrative: number;
  strategic: number;
  targetAssets: number;
  milestone: string;
}

const MONTHLY_GROWTH_DATA: MonthlyGrowthData[] = [
  {
    monthKey: '2026-01',
    monthName: 'يناير',
    monthEn: 'Jan',
    totalAssets: 210,
    newAssets: 65,
    localizedAssets: 54,
    growthRate: 12.5,
    technical: 38,
    administrative: 16,
    strategic: 11,
    targetAssets: 200,
    milestone: 'تدشين بروتوكولات استخلاص المعرفة الضمنية بمشاريع نيوم'
  },
  {
    monthKey: '2026-02',
    monthName: 'فبراير',
    monthEn: 'Feb',
    totalAssets: 295,
    newAssets: 85,
    localizedAssets: 72,
    growthRate: 14.8,
    technical: 49,
    administrative: 22,
    strategic: 14,
    targetAssets: 280,
    milestone: 'ربط أصول الهندسة الساحلية في البحر الأحمر وأمالا'
  },
  {
    monthKey: '2026-03',
    monthName: 'مارس',
    monthEn: 'Mar',
    totalAssets: 395,
    newAssets: 100,
    localizedAssets: 88,
    growthRate: 16.4,
    technical: 58,
    administrative: 26,
    strategic: 16,
    targetAssets: 370,
    milestone: 'اعتماد 50 أصلاً معرفياً لأنفاق ومسارات ذا لاين العميقة'
  },
  {
    monthKey: '2026-04',
    monthName: 'أبريل',
    monthEn: 'Apr',
    totalAssets: 515,
    newAssets: 120,
    localizedAssets: 106,
    growthRate: 18.2,
    technical: 68,
    administrative: 34,
    strategic: 18,
    targetAssets: 480,
    milestone: 'إطلاق برنامج التوأمة المعرفية الميدانية للكوادر السعودية'
  },
  {
    monthKey: '2026-05',
    monthName: 'مايو',
    monthEn: 'May',
    totalAssets: 650,
    newAssets: 135,
    localizedAssets: 122,
    growthRate: 19.5,
    technical: 78,
    administrative: 36,
    strategic: 21,
    targetAssets: 610,
    milestone: 'توطين معايير خلايا الهيدروجين الأخضر والشبكات المصغرة'
  },
  {
    monthKey: '2026-06',
    monthName: 'يونيو',
    monthEn: 'Jun',
    totalAssets: 805,
    newAssets: 155,
    localizedAssets: 140,
    growthRate: 20.8,
    technical: 88,
    administrative: 42,
    strategic: 25,
    targetAssets: 760,
    milestone: 'تجاوز حاجز 800 أصل معرفي موثق بنسبة موثوقية 96%'
  },
  {
    monthKey: '2026-07',
    monthName: 'يوليو',
    monthEn: 'Jul',
    totalAssets: 975,
    newAssets: 170,
    localizedAssets: 156,
    growthRate: 21.6,
    technical: 96,
    administrative: 46,
    strategic: 28,
    targetAssets: 920,
    milestone: 'تكامل منظومة التوأم الرقمي لموانئ أوكساجون الذكية'
  },
  {
    monthKey: '2026-08',
    monthName: 'أغسطس',
    monthEn: 'Aug',
    totalAssets: 1160,
    newAssets: 185,
    localizedAssets: 170,
    growthRate: 22.4,
    technical: 105,
    administrative: 50,
    strategic: 30,
    targetAssets: 1090,
    milestone: 'اعتماد تقنيات الخرسانة البحرية وحماية الشعاب بالبحر الأحمر'
  },
  {
    monthKey: '2026-09',
    monthName: 'سبتمبر',
    monthEn: 'Sep',
    totalAssets: 1370,
    newAssets: 210,
    localizedAssets: 194,
    growthRate: 24.2,
    technical: 120,
    administrative: 56,
    strategic: 34,
    targetAssets: 1280,
    milestone: 'تسريع توطين أنظمة قطار النقل السريع Spine ومنشآت القدية'
  },
  {
    monthKey: '2026-10',
    monthName: 'أكتوبر (مستهدف)',
    monthEn: 'Oct',
    totalAssets: 1600,
    newAssets: 230,
    localizedAssets: 215,
    growthRate: 25.1,
    technical: 132,
    administrative: 62,
    strategic: 36,
    targetAssets: 1490,
    milestone: 'إدراج معايير المحتوى المحلي في منظومة المشتريات الذكية'
  },
  {
    monthKey: '2026-11',
    monthName: 'نوفمبر (مستهدف)',
    monthEn: 'Nov',
    totalAssets: 1850,
    newAssets: 250,
    localizedAssets: 234,
    growthRate: 26.3,
    technical: 145,
    administrative: 68,
    strategic: 37,
    targetAssets: 1720,
    milestone: 'إطلاق شبكة التوأمة الذاتية بين مهندسي المشاريع الوطنية'
  },
  {
    monthKey: '2026-12',
    monthName: 'ديسمبر (مستهدف)',
    monthEn: 'Dec',
    totalAssets: 2130,
    newAssets: 280,
    localizedAssets: 262,
    growthRate: 27.8,
    technical: 160,
    administrative: 75,
    strategic: 45,
    targetAssets: 1980,
    milestone: 'تحقيق مستهدف 2026 بتوثيق وتوطين أكثر من 2,000 أصل معرفي'
  }
];

// Project-level scaling weights for demonstration of filter interactivity
const PROJECT_SCALE_FACTORS: Record<string, { factor: number; label: string }> = {
  'ALL': { factor: 1.0, label: 'كافة المشاريع الوطنية الكبرى' },
  'ذا لاين': { factor: 0.32, label: 'مشروع ذا لاين (NEOM)' },
  'نيوم': { factor: 0.28, label: 'قطاعات نيوم العامة والهيدروجين' },
  'البحر الأحمر': { factor: 0.18, label: 'وجهة البحر الأحمر وجزر أمالا' },
  'أوكساجون': { factor: 0.14, label: 'مدينة أوكساجون للصناعات المتقدمة' },
  'القدية': { factor: 0.08, label: 'مدينة القدية الترفيهية والثقافية' }
};

type ViewMode = 'area' | 'bar' | 'breakdown';
type TimeRange = '6M' | 'YTD' | '12M';

export default function DataVisualization() {
  const [viewMode, setViewMode] = useState<ViewMode>('area');
  const [selectedProject, setSelectedProject] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<TimeRange>('12M');
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);

  // Filtered dataset based on time range and project scaling
  const filteredData = useMemo(() => {
    let sliced = [...MONTHLY_GROWTH_DATA];
    if (timeRange === '6M') {
      sliced = sliced.slice(3, 9); // April to September
    } else if (timeRange === 'YTD') {
      sliced = sliced.slice(0, 9); // Jan to September (Actual current year-to-date)
    }

    const { factor } = PROJECT_SCALE_FACTORS[selectedProject] || { factor: 1.0 };

    return sliced.map(item => ({
      ...item,
      totalAssets: Math.round(item.totalAssets * factor),
      newAssets: Math.round(item.newAssets * factor),
      localizedAssets: Math.round(item.localizedAssets * factor),
      targetAssets: Math.round(item.targetAssets * factor),
      technical: Math.round(item.technical * factor),
      administrative: Math.round(item.administrative * factor),
      strategic: Math.round(item.strategic * factor)
    }));
  }, [timeRange, selectedProject]);

  // Overall Statistics calculated dynamically
  const currentTotal = filteredData[filteredData.length - 1]?.totalAssets || 0;
  const currentNew = filteredData[filteredData.length - 1]?.newAssets || 0;
  const initialTotal = filteredData[0]?.totalAssets || 1;
  const overallGrowth = Math.round(((currentTotal - initialTotal) / initialTotal) * 100);
  const totalLocalized = filteredData.reduce((acc, curr) => acc + curr.localizedAssets, 0);
  const totalNewAdded = filteredData.reduce((acc, curr) => acc + curr.newAssets, 0);
  const localizationEfficiency = totalNewAdded > 0 ? Math.round((totalLocalized / totalNewAdded) * 100) : 92;

  // Custom Interactive Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as MonthlyGrowthData;
      return (
        <div 
          className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 text-xs space-y-2.5 max-w-xs"
          dir="rtl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-black text-sm text-emerald-400">{dataPoint.monthName}</span>
            <span className="text-[10px] text-gray-300 font-mono">{dataPoint.monthKey}</span>
          </div>

          <div className="space-y-1.5 font-medium">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                إجمالي الأصول التراكمية:
              </span>
              <strong className="text-white font-mono font-black">{dataPoint.totalAssets.toLocaleString('ar-SA')}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-saudi-gold" />
                أصول جديدة مضافة:
              </span>
              <strong className="text-saudi-gold font-mono font-bold">+{dataPoint.newAssets}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                أصول موطنة بنجاح:
              </span>
              <strong className="text-blue-300 font-mono font-bold">{dataPoint.localizedAssets}</strong>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
              <span className="text-gray-400">معدل النمو الشهري:</span>
              <span className="text-emerald-400 font-bold font-mono">+{dataPoint.growthRate}%</span>
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
            <span>فنية: <strong className="text-white">{dataPoint.technical}</strong></span>
            <span>إدارية: <strong className="text-white">{dataPoint.administrative}</strong></span>
            <span>استراتيجية: <strong className="text-white">{dataPoint.strategic}</strong></span>
          </div>

          {/* Milestone */}
          {dataPoint.milestone && (
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-emerald-200 flex items-start gap-1.5 leading-snug">
              <Sparkles className="w-3.5 h-3.5 text-saudi-gold shrink-0 mt-0.5" />
              <span>{dataPoint.milestone}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Component Title & Controls Header */}
      <div className="bg-gradient-to-l from-saudi-dark via-emerald-950 to-saudi-green rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 left-0 w-80 h-80 bg-saudi-gold/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-saudi-gold/20 text-saudi-gold text-xs font-bold border border-saudi-gold/30 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>مكون Data Visualization المتقدم</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[11px] font-mono">
                Recharts Engine v3.8
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              مخطط اتجاهات نمو الأصول المعرفية عبر الأشهر
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
              تحليل بياني تفاعلي يُظهر سرعة استخلاص وتوثيق المعرفة الضمنية وتوطينها للكوادر الوطنية عبر مشاريع المملكة الكبرى.
            </p>
          </div>

          {/* Quick Metrics on Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <span className="text-[10px] text-gray-300 block mb-1">إجمالي الأصول</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {currentTotal.toLocaleString('ar-SA')}
              </span>
              <span className="text-[10px] text-emerald-300 font-bold block mt-0.5 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                +{overallGrowth}% نمو تراكمي
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <span className="text-[10px] text-gray-300 block mb-1">المعدل الشهري الحالي</span>
              <span className="text-xl sm:text-2xl font-black text-saudi-gold font-mono">
                +{currentNew}
              </span>
              <span className="text-[10px] text-gray-300 block mt-0.5 font-medium">أصل جديد / شهر</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] text-gray-300 block mb-1">كفاءة التوطين</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                %{localizationEfficiency}
              </span>
              <span className="text-[10px] text-emerald-200 block mt-0.5">نقل تام للكوادر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Chart View Modes Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-2xl w-fit">
            <button
              onClick={() => setViewMode('area')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                viewMode === 'area'
                  ? "bg-white text-saudi-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5 text-saudi-green" />
              <span>النمو التراكمي (Area)</span>
            </button>

            <button
              onClick={() => setViewMode('bar')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                viewMode === 'bar'
                  ? "bg-white text-saudi-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              <BarChart3 className="w-3.5 h-3.5 text-saudi-gold" />
              <span>الإضافات الشهرية والتوطين (Bars)</span>
            </button>

            <button
              onClick={() => setViewMode('breakdown')}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                viewMode === 'breakdown'
                  ? "bg-white text-saudi-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              )}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>التصنيف النوعي للأصول</span>
            </button>
          </div>

          {/* Time Horizon Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-bold hidden sm:inline">النطاق الزمني:</span>
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-200/70">
              <button
                onClick={() => setTimeRange('6M')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  timeRange === '6M'
                    ? "bg-saudi-green text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-200/50"
                )}
              >
                آخر 6 أشهر
              </button>
              <button
                onClick={() => setTimeRange('YTD')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  timeRange === 'YTD'
                    ? "bg-saudi-green text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-200/50"
                )}
              >
                المحقق حتى تاريخه (YTD)
              </button>
              <button
                onClick={() => setTimeRange('12M')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  timeRange === '12M'
                    ? "bg-saudi-green text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-200/50"
                )}
              >
                العام كاملاً 2026 (مع التوقعات)
              </button>
            </div>
          </div>
        </div>

        {/* Project Filter Chips */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-gray-500 font-bold shrink-0 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-saudi-green" />
            <span>تصفية حسب المشروع:</span>
          </span>
          {Object.entries(PROJECT_SCALE_FACTORS).map(([key, item]) => {
            const isSelected = selectedProject === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedProject(key)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border",
                  isSelected
                    ? "bg-saudi-dark text-white border-saudi-dark shadow-xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                )}
              >
                {key === 'ALL' ? 'جميع المشاريع الكبرى' : key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg text-saudi-dark flex items-center gap-2">
              {viewMode === 'area' && <span>منحنى النمو التراكمي للأصول المعرفية</span>}
              {viewMode === 'bar' && <span>مقارنة الإضافات الشهرية بالأصول الموطنة للكوادر</span>}
              {viewMode === 'breakdown' && <span>توزيع الأصول المعرفية حسب التصنيف (فنية، إدارية، استراتيجية)</span>}
              <span className="text-xs font-bold text-gray-400 font-normal">
                ({PROJECT_SCALE_FACTORS[selectedProject]?.label})
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              مؤشر ديناميكي يوضح تصاعد وتيرة توطين المعرفة الضمنية شهرياً مقارنة بالمستهدفات الوطنية
            </p>
          </div>

          {/* Dynamic Chart Legend Badge */}
          <div className="flex items-center gap-3 text-xs font-bold text-gray-600 flex-wrap">
            {viewMode === 'area' && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-saudi-green" />
                  الأصول التراكمية
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-saudi-gold" />
                  خط المستهدف الوطني
                </span>
              </>
            )}
            {viewMode === 'bar' && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-saudi-green" />
                  أصول جديدة مضافة
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-saudi-gold" />
                  أصول تم توطينها
                </span>
              </>
            )}
            {viewMode === 'breakdown' && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-saudi-green" />
                  أصول فنية وهندسية
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-saudi-gold" />
                  أصول إدارية وتنظيمية
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-blue-600" />
                  أصول استراتيجية وحوكمة
                </span>
              </>
            )}
          </div>
        </div>

        {/* Recharts Visualization Container */}
        <div className="h-[400px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'area' ? (
              <AreaChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006C35" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#006C35" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="localizedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="monthName" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  dx={-10}
                  tickFormatter={(val) => val.toLocaleString('ar-SA')}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={filteredData[filteredData.length - 1]?.targetAssets} 
                  stroke="#C5A059" 
                  strokeDasharray="4 4" 
                  label={{ value: 'مستهدف الربع', fill: '#C5A059', fontSize: 11, position: 'right' }} 
                />
                <Area
                  type="monotone"
                  dataKey="totalAssets"
                  name="إجمالي الأصول"
                  stroke="#006C35"
                  strokeWidth={3.5}
                  fillOpacity={1}
                  fill="url(#growthGradient)"
                  activeDot={{ r: 7, stroke: '#FFFFFF', strokeWidth: 2.5, fill: '#006C35' }}
                />
                <Line
                  type="monotone"
                  dataKey="targetAssets"
                  name="المستهدف الوطني"
                  stroke="#C5A059"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            ) : viewMode === 'bar' ? (
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="monthName" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  dx={-10}
                  tickFormatter={(val) => val.toLocaleString('ar-SA')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="newAssets" 
                  name="أصول جديدة مضافة" 
                  fill="#006C35" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="localizedAssets" 
                  name="أصول تم توطينها" 
                  fill="#C5A059" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={40}
                />
              </BarChart>
            ) : (
              <AreaChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="techGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006C35" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#006C35" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="stratGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="monthName" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                  dx={-10}
                  tickFormatter={(val) => val.toLocaleString('ar-SA')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="technical"
                  stackId="1"
                  name="فنية وهندسية"
                  stroke="#006C35"
                  fill="url(#techGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="administrative"
                  stackId="1"
                  name="إدارية وتنظيمية"
                  stroke="#C5A059"
                  fill="url(#adminGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="strategic"
                  stackId="1"
                  name="استراتيجية وحوكمة"
                  stroke="#2563EB"
                  fill="url(#stratGrad)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Milestone Timeline Strip for Displayed Months */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-saudi-dark flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-saudi-gold" />
              <span>محطات الإنجاز وتدفق المعرفة الشهرية الكبرى:</span>
            </span>
            <span className="text-[11px] text-gray-400">مرتبطة بالأحداث التشغيلية الميدانية</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredData.slice(-3).map((item) => (
              <div 
                key={item.monthKey}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 hover:border-saudi-green/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-saudi-green">{item.monthName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white text-gray-700 font-bold border border-gray-200">
                    +{item.newAssets} أصل
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                  {item.milestone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
