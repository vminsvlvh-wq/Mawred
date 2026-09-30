import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitCompare, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  Wind, 
  Mountain, 
  ShieldCheck, 
  X, 
  Check, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ProjectKnowledgeAsset, CrossProjectAdaptation } from '../data/knowledgeAssets';

interface CrossProjectAdaptationModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: ProjectKnowledgeAsset | null;
  onAdapt?: (targetProject: string) => void;
}

export default function CrossProjectAdaptationModal({
  isOpen,
  onClose,
  asset,
  onAdapt
}: CrossProjectAdaptationModalProps) {
  const [selectedTargetProject, setSelectedTargetProject] = useState<string>('');
  const [adaptedNotice, setAdaptedNotice] = useState<string | null>(null);

  // Default adaptations if none attached
  const adaptations: CrossProjectAdaptation[] = asset?.crossProjectAdaptations || [
    {
      targetProject: 'البحر الأحمر',
      suitabilityScore: 92,
      contextDifferences: {
        climate: 'رطوبة ساحلية تصل إلى 78% مع درجات حرارة صيفية تقارب 46 مئوية مقارنة ببيئة نيوم الأكثر جفافاً.',
        geologyOrEnvironment: 'بيئة جزر مرجانية حساسة ومحميات بحرية طبيعية تحظر أي تصريف كيميائي.',
        supplyChainOrRegulations: 'معايير الهيئة الإقليمية للمحافظة على بيئة البحر الأحمر وخليج عدن (PERSGA).'
      },
      adaptationGuidelines: [
        'تعديل خلطة المواد لزيادة مقاومة التآكل برذاذ الملح البحري بنسبة 25%.',
        'استبدال المبردات الكيميائية بمستحلبات حيوية آمنة بيئياً.',
        'إضافة طبقة عزل ثنائية للحماية من رطوبة الجزر المرتفعة.'
      ],
      status: 'جاهز للتطبيق'
    },
    {
      targetProject: 'أوكساجون',
      suitabilityScore: 88,
      contextDifferences: {
        climate: 'رياح ساحلية مستمرة ورذاذ ملحي خفيف مع بيئة تصنيعية متقدمة.',
        geologyOrEnvironment: 'أرصفة بحرية ومنصات عائمة تتطلب خفة الوزن ومقاومة الاهتزازات المستمرة.',
        supplyChainOrRegulations: 'تطبيق لوائح الموانئ الذكية وأنظمة السلامة البحرية الدولية IMO.'
      },
      adaptationGuidelines: [
        'استخدام سبائك الألمنيوم المقواة والمضخات الغاطسة ذات المحاور الخزفية.',
        'ربط بيانات التشغيل بنظام التوأم الرقمي للميناء لمراقبة الإجهاد الحركي اللحظي.'
      ],
      status: 'جاهز للتطبيق'
    },
    {
      targetProject: 'القدية',
      suitabilityScore: 78,
      contextDifferences: {
        climate: 'مناخ صحراوي جاف جداً ودرجات حرارة شديدة في الصيف وبرودة ملحوظة في الشتاء.',
        geologyOrEnvironment: 'جروف صخرية رسوبية وتضاريس جبلية عميقة مع تفاوت درجات الحرارة بين النهار والليل.',
        supplyChainOrRegulations: 'متطلبات السلامة العامة للزوار في المرافق الترفيهية ومسارات الفعاليات.'
      },
      adaptationGuidelines: [
        'تكييف نظم التبريد لتحمل الفروقات الحرارية اليومية الشديدة (Thermal Shock).',
        'حماية المعدات من العواصف الرملية الدقيقة عبر فلاتر سيكلونية مضاعفة.'
      ],
      status: 'مقترح'
    }
  ];

  React.useEffect(() => {
    if (adaptations.length > 0 && !selectedTargetProject) {
      setSelectedTargetProject(adaptations[0].targetProject);
    }
  }, [adaptations, selectedTargetProject]);

  if (!isOpen || !asset) return null;

  const currentAdaptation = adaptations.find(a => a.targetProject === selectedTargetProject) || adaptations[0];

  const handleAdopt = () => {
    setAdaptedNotice(`تم بنجاح اعتماد وتكييف الأصل المعرفي لصالح مشروع "${selectedTargetProject}" وإضافته لحقيبة المعرفة الميدانية.`);
    if (onAdapt) {
      onAdapt(selectedTargetProject);
    }
    setTimeout(() => {
      setAdaptedNotice(null);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" dir="rtl">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-saudi-dark/70 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl border border-gray-100 z-50 overflow-hidden flex flex-col relative text-right max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-saudi-dark via-emerald-950 to-saudi-dark text-white flex items-center justify-between border-b border-saudi-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-saudi-gold/20 text-saudi-gold flex items-center justify-center border border-saudi-gold/30">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-saudi-gold text-saudi-dark uppercase">
                  تعميم الدروس بين المشاريع الكبرى
                </span>
                <span className="text-xs text-gray-300">
                  المصدر: {asset.project}
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white mt-1">
                {asset.title}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Toast */}
        <AnimatePresence>
          {adaptedNotice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-600 text-white p-3.5 text-center text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{adaptedNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-right">
          {/* Subtitle intro */}
          <p className="text-xs text-gray-600 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 leading-relaxed">
            عند اعتماد تجربة أو أصل ناجح في أحد المشاريع الوطنية، يحلل النظام التشابه التخصصي ويقترح المشاريع الكبرى المرشحة للاستفادة، مع توضيح دقيق لاختلافات البيئة، المناخ، وسلاسل الإمداد لضمان التطبيق الآمن.
          </p>

          {/* Project Selector Buttons */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">
              المشاريع الوطنية المرشحة للاستفادة ونقل التجربة:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {adaptations.map(adap => {
                const isSelected = adap.targetProject === selectedTargetProject;
                return (
                  <button
                    key={adap.targetProject}
                    onClick={() => setSelectedTargetProject(adap.targetProject)}
                    className={cn(
                      "p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between",
                      isSelected
                        ? "bg-saudi-dark text-white border-saudi-gold ring-2 ring-saudi-gold/30 shadow-md"
                        : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-extrabold text-xs">{adap.targetProject}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        isSelected ? "bg-saudi-gold text-saudi-dark" : "bg-emerald-100 text-emerald-800"
                      )}>
                        تطابق {adap.suitabilityScore}%
                      </span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium mt-1",
                      isSelected ? "text-gray-300" : "text-gray-500"
                    )}>
                      الحالة: {adap.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Context Differences for Selected Target */}
          {currentAdaptation && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-black text-saudi-dark flex items-center gap-2">
                <Layers className="w-4 h-4 text-saudi-green" />
                تحليل الفوارق الميدانية بين {asset.project} و {currentAdaptation.targetProject}:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* 1: Climate difference */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <Wind className="w-3.5 h-3.5" />
                    <span>فوارق المناخ والرطوبة:</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed font-medium">
                    {currentAdaptation.contextDifferences.climate}
                  </p>
                </div>

                {/* 2: Geology / Ecology */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <Mountain className="w-3.5 h-3.5" />
                    <span>الجيولوجيا والبيئة الطبيعية:</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed font-medium">
                    {currentAdaptation.contextDifferences.geologyOrEnvironment}
                  </p>
                </div>

                {/* 3: Supply chain & Regulations */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>الأنظمة وسلاسل الإمداد:</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed font-medium">
                    {currentAdaptation.contextDifferences.supplyChainOrRegulations}
                  </p>
                </div>
              </div>

              {/* Actionable Adaptation Guidelines */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <h5 className="font-extrabold text-xs text-saudi-dark flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-saudi-gold" />
                  إرشادات التكييف والمواءمة اللازمة قبل التطبيق في {currentAdaptation.targetProject}:
                </h5>

                <div className="space-y-2">
                  {currentAdaptation.adaptationGuidelines.map((guide, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-800 font-semibold bg-white p-3 rounded-xl border border-gray-200/80">
                      <span className="w-5 h-5 rounded-full bg-saudi-green text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{guide}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs cursor-pointer"
          >
            إغلاق
          </button>

          <button
            onClick={handleAdopt}
            className="px-6 py-2.5 rounded-xl bg-saudi-green hover:bg-saudi-green/90 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            اعتماد وتكييف التجربة في مشروع {selectedTargetProject}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
