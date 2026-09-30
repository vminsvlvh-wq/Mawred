import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  RotateCcw, 
  X, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  Printer, 
  Plus,
  Tag,
  Building
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LessonLearnedCard, ProjectKnowledgeAsset } from '../data/knowledgeAssets';

interface LessonsLearnedCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: ProjectKnowledgeAsset | null;
  onSave?: (newCard: LessonLearnedCard, assetTitle?: string) => void;
}

export default function LessonsLearnedCardModal({
  isOpen,
  onClose,
  asset,
  onSave
}: LessonsLearnedCardModalProps) {
  // If an asset is provided with an existing card, use its data; else blank
  const [problem, setProblem] = useState(asset?.lessonLearnedCard?.problem || '');
  const [rootCause, setRootCause] = useState(asset?.lessonLearnedCard?.rootCause || '');
  const [testedSolution, setTestedSolution] = useState(asset?.lessonLearnedCard?.testedSolution || '');
  const [whenToReuse, setWhenToReuse] = useState(asset?.lessonLearnedCard?.whenToReuse || '');
  const [outcomeMetric, setOutcomeMetric] = useState(asset?.lessonLearnedCard?.outcomeMetric || asset?.practicalImpact?.achievement || '');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(!asset?.lessonLearnedCard);

  React.useEffect(() => {
    if (asset?.lessonLearnedCard) {
      setProblem(asset.lessonLearnedCard.problem);
      setRootCause(asset.lessonLearnedCard.rootCause);
      setTestedSolution(asset.lessonLearnedCard.testedSolution);
      setWhenToReuse(asset.lessonLearnedCard.whenToReuse);
      setOutcomeMetric(asset.lessonLearnedCard.outcomeMetric);
      setIsEditing(false);
    } else {
      setProblem('');
      setRootCause('');
      setTestedSolution('');
      setWhenToReuse('');
      setOutcomeMetric('');
      setIsEditing(true);
    }
  }, [asset]);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const textToCopy = `
📋 بطاقة درس مستفاد - منصة مورد
المشروع: ${asset?.project || 'مشروع وطني'}
العنوان: ${asset?.title || 'درس ميداني مستفاد'}

١. المشكلة:
${problem}

٢. سببها الجذري:
${rootCause}

٣. الحل المجرّب:
${testedSolution}

٤. متى ينفع نستخدمه تاني؟
${whenToReuse}

٥. النتيجة والأثر العملي:
${outcomeMetric}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (!problem || !testedSolution) return;
    const cardData: LessonLearnedCard = {
      problem,
      rootCause,
      testedSolution,
      whenToReuse,
      outcomeMetric,
      author: asset?.author || 'م. أحمد القحطاني',
      reviewer: asset?.reviewerName || 'خبير معتمد'
    };
    if (onSave) {
      onSave(cardData, asset?.title);
    }
    setIsEditing(false);
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

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 z-50 overflow-hidden flex flex-col relative text-right max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-saudi-dark to-emerald-950 text-white flex items-center justify-between border-b border-saudi-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-saudi-gold/20 text-saudi-gold flex items-center justify-center border border-saudi-gold/30">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saudi-gold text-saudi-dark uppercase">
                  بطاقة درس مستفاد
                </span>
                {asset?.project && (
                  <span className="text-[10px] font-bold text-gray-300">
                    {asset.project}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-base text-white mt-1">
                {asset?.title || 'تسجيل وتعميم درس مستفاد جديد'}
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

        {/* Modal Body: 4 Essential Standard Blocks */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-right">
          {/* Card Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
            <span className="text-gray-600 font-medium">
              صيغة قياسية مبسطة لتوثيق الدروس المستفادة ونقلها بين المشاريع فوراً
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                {copied ? 'تم النسخ بنجاح' : 'نسخ البطاقة'}
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-xl bg-saudi-green/10 text-saudi-green hover:bg-saudi-green/20 font-bold text-[11px] cursor-pointer"
              >
                {isEditing ? 'معاينة البطاقة' : 'تعديل البيانات'}
              </button>
            </div>
          </div>

          {/* Block 1: المشكلة */}
          <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-extrabold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>١. المشكلة (The Challenge / Problem):</span>
            </div>
            {isEditing ? (
              <textarea
                rows={2}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="صف العائق أو التحدي الميداني الذي واجه الفريق بوضوح وبدون تعقيد..."
                className="w-full bg-white border border-red-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-red-500/20"
              />
            ) : (
              <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                {problem || 'لم تُحدد المشكلة بعد.'}
              </p>
            )}
          </div>

          {/* Block 2: سببها */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>٢. سببها الجذري (Root Cause):</span>
            </div>
            {isEditing ? (
              <textarea
                rows={2}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="ما هو السبب الأساسي الذي أدى لحدوث هذه المشكلة؟ (تقني، بيئي، تنظيمي، نقص مواصفات)..."
                className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            ) : (
              <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                {rootCause || 'لم يُحدد السبب الجذري بعد.'}
              </p>
            )}
          </div>

          {/* Block 3: الحل المجرّب */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>٣. الحل المجرّب (The Tested Solution):</span>
            </div>
            {isEditing ? (
              <textarea
                rows={2}
                value={testedSolution}
                onChange={(e) => setTestedSolution(e.target.value)}
                placeholder="ما هو الإجراء الدقيق الذي تم تطبيقه فعلياً ونجح في حل الإشكال؟..."
                className="w-full bg-white border border-emerald-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            ) : (
              <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                {testedSolution || 'لم يُحدد الحل المجرّب بعد.'}
              </p>
            )}
          </div>

          {/* Block 4: متى ينفع نستخدمه تاني؟ */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
            <div className="flex items-center gap-2 text-blue-800 font-extrabold text-xs">
              <RotateCcw className="w-4 h-4" />
              <span>٤. متى ينفع نستخدمه تاني؟ (When & Where to Reuse):</span>
            </div>
            {isEditing ? (
              <textarea
                rows={2}
                value={whenToReuse}
                onChange={(e) => setWhenToReuse(e.target.value)}
                placeholder="حدد الشروط والمشاريع والظروف المشابهة التي تتطلب استدعاء هذا الحل..."
                className="w-full bg-white border border-blue-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            ) : (
              <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                {whenToReuse || 'لم تُحدد شروط الاستخدام اللاحق بعد.'}
              </p>
            )}
          </div>

          {/* Outcome & Impact */}
          <div className="p-3.5 rounded-2xl bg-saudi-dark text-saudi-gold flex items-center justify-between text-xs font-bold">
            <span>الأثر والنتيجة المحققة:</span>
            <span className="text-white text-left font-mono">{outcomeMetric || 'منع هدر وتوفير وقت تنفيذي'}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs cursor-pointer"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-saudi-green hover:bg-saudi-green/90 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                حفظ البطاقة وتعميمها
              </button>
            ) : (
              <button
                onClick={handleCopyText}
                className="px-5 py-2.5 rounded-xl bg-saudi-dark hover:bg-saudi-dark/90 text-saudi-gold font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                مشاركة الدرس مع المهندسين
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
