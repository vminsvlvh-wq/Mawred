import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  FileText, 
  Download, 
  CheckCircle2, 
  Building2, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Loader2,
  Filter,
  Layers,
  Award,
  Clock
} from 'lucide-react';
import { ExpertProfile, getExpertTwinningReadiness } from '../data/expertsData';
import { exportExpertProjectsPDF } from '../services/expertProjectsPdfExport';

interface ExpertProjectsPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredExperts: ExpertProfile[];
  allExperts: ExpertProfile[];
  currentProjectFilter: string;
  currentReadinessFilter: string;
}

export default function ExpertProjectsPdfModal({
  isOpen,
  onClose,
  filteredExperts,
  allExperts,
  currentProjectFilter,
  currentReadinessFilter
}: ExpertProjectsPdfModalProps) {
  const [exportScope, setExportScope] = useState<'filtered' | 'all'>('filtered');
  const [isExporting, setIsExporting] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetExperts = exportScope === 'filtered' ? filteredExperts : allExperts;
  const totalProjects = targetExperts.reduce((acc, exp) => acc + exp.currentProjects.length, 0);
  const totalCadres = targetExperts.reduce((acc, exp) => {
    return acc + exp.currentProjects.reduce((sum, p) => sum + p.allocatedCadresCount, 0);
  }, 0);

  const fullyAvailableCount = targetExperts.filter(
    e => getExpertTwinningReadiness(e).availabilityStatus === 'متاح بالكامل'
  ).length;
  const partiallyBusyCount = targetExperts.filter(
    e => getExpertTwinningReadiness(e).availabilityStatus === 'مشغول جزئياً'
  ).length;
  const soonAvailableCount = targetExperts.filter(
    e => getExpertTwinningReadiness(e).availabilityStatus === 'متاح قريباً'
  ).length;

  const handleExport = async () => {
    setIsExporting(true);
    setProgressStatus('جاري تهيئة الوثيقة الرسمية...');
    setSuccessMessage(null);

    try {
      await exportExpertProjectsPDF({
        experts: targetExperts,
        projectFilter: exportScope === 'filtered' ? currentProjectFilter : 'جميع المشاريع الكبرى',
        readinessFilter: exportScope === 'filtered' ? currentReadinessFilter : 'كافة مستويات الجاهزية',
        reportTitle: 'سجل المشاريع الوطنية المرتبطة بالخبراء ومؤشرات جاهزية التوأمة',
        preparedBy: 'منصة مورد • إدارة توطين المعرفة الضمنية',
        onProgress: (status) => setProgressStatus(status)
      });

      setSuccessMessage('تم تصدير ملف PDF بنجاح وتحميله على جهازك.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.error('PDF export error:', err);
      setProgressStatus('حدث خطأ أثناء إنشاء ملف PDF، يرجى المحاولة ثانية.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-8"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-l from-saudi-dark via-emerald-950 to-saudi-green p-6 text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-saudi-gold/15 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isExporting}
              className="absolute left-5 top-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-saudi-gold/20 border border-saudi-gold/30 flex items-center justify-center text-saudi-gold shadow-md shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-saudi-gold/20 text-saudi-gold border border-saudi-gold/30">
                    تصدير رسمي معتمد
                  </span>
                  <span className="text-[10px] text-gray-300">
                    رؤية المملكة 2030
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">
                  تصدير قائمة المشاريع المرتبطة بالخبراء (PDF)
                </h3>
                <p className="text-xs text-gray-200 mt-0.5">
                  ملف PDF منظم يحمل هوية منصة مورد ويتضمن تفاصيل المشاريع وحالة جاهزية التوأمة لكل خبير.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Scope Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-saudi-dark block">
                نطاق البيانات المراد تصديرها في التقرير:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExportScope('filtered')}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                    exportScope === 'filtered'
                      ? 'border-saudi-green bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-saudi-dark">
                      الخبراء بحسب الفلترة الحالية
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-saudi-green/10 text-saudi-green font-bold">
                      {filteredExperts.length} خبراء
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    مشروع: {currentProjectFilter} • الجاهزية: {currentReadinessFilter}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setExportScope('all')}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                    exportScope === 'all'
                      ? 'border-saudi-green bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-saudi-dark">
                      كافة الخبراء والمشاريع (سجل شامل)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-saudi-gold/20 text-saudi-gold font-bold">
                      {allExperts.length} خبراء
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    حصر كامل لكافة الخبراء المعتمدين والمشاريع الوطنية
                  </p>
                </button>
              </div>
            </div>

            {/* Document Preview Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-saudi-dark flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-saudi-green" />
                  <span>ملخص محتوى وثيقة PDF المعتمدة:</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">PDF-A4-STANDARD</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block mb-0.5">الخبراء المشمولون</span>
                  <span className="font-black text-saudi-dark font-mono text-sm">{targetExperts.length}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block mb-0.5">المشاريع المرتبطة</span>
                  <span className="font-black text-saudi-gold font-mono text-sm">{totalProjects}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block mb-0.5">الكوادر السعودية</span>
                  <span className="font-black text-emerald-600 font-mono text-sm">{totalCadres}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block mb-0.5">توزيع الجاهزية</span>
                  <span className="font-bold text-[10px] text-saudi-dark">
                    {fullyAvailableCount} متاح • {partiallyBusyCount} جزئي • {soonAvailableCount} قريباً
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-saudi-green shrink-0" />
                  <span>تضمين حالة جاهزية التوأمة المحددة لكل خبير (متاح بالكامل، مشغول جزئياً، متاح قريباً).</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-saudi-green shrink-0" />
                  <span>عرض قائمة كافة المشاريع الوطنية (الاسم، الدور الميداني، نطاق العمل، نسبة التوطين، الجهة الشريكة).</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-saudi-green shrink-0" />
                  <span>تنسيق رسمي يحمل شعارات المملكة ورؤية 2030 وأختام التوثيق المعتمدة لمنصة مورد.</span>
                </div>
              </div>
            </div>

            {/* Status Notifications */}
            {isExporting && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-saudi-green animate-spin shrink-0" />
                <span className="font-medium">{progressStatus || 'جاري إنشاء المستند الرسمي...'}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-500 text-white text-xs flex items-center gap-2 shadow-sm font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isExporting}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-2.5 rounded-xl bg-saudi-green hover:bg-saudi-green/90 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التصدير...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>تصدير وطباعة ملف PDF الرسمي</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
