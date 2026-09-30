import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Download, 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Loader2, 
  Calendar, 
  User, 
  Briefcase,
  Users,
  CheckSquare,
  Square,
  SlidersHorizontal,
  BookmarkCheck,
  FileDown
} from 'lucide-react';
import { ProjectKnowledgeAsset } from '../data/knowledgeAssets';
import { exportKnowledgeAssetsPDF, exportSingleAssetMeetingBrief } from '../services/assetsPdfExport';
import { cn } from '../lib/utils';

interface KnowledgeAssetsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: string;
  assets: ProjectKnowledgeAsset[];
}

export default function KnowledgeAssetsReportModal({
  isOpen,
  onClose,
  project,
  assets
}: KnowledgeAssetsReportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  // Meeting Customization State
  const [meetingTitle, setMeetingTitle] = useState('اجتماع اللجنة التوجيهية لنقل وتوطين المعرفة ومواءمة المحتوى المحلي');
  const [meetingType, setMeetingType] = useState('اجتماع رسمي للجنة التوجيهية العليا');
  const [chairperson, setChairperson] = useState('مدير عام إدارة وتوطين المعرفة');
  const [attendees, setAttendees] = useState('صندوق الاستثمارات العامة، هيئة المحتوى المحلي، المقاول الرئيسي، الشركاء الوطنيين');
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(() => assets.map(a => a.id));
  const [showConfig, setShowConfig] = useState(true);

  if (!isOpen) return null;

  const toggleAssetSelection = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      if (selectedAssetIds.length === 1) return; // keep at least 1
      setSelectedAssetIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedAssetIds(prev => [...prev, id]);
    }
  };

  const selectAllAssets = () => {
    setSelectedAssetIds(assets.map(a => a.id));
  };

  const filteredAssets = assets.filter(a => selectedAssetIds.includes(a.id));
  const technicalAssets = filteredAssets.filter(a => a.classification === 'فنية');
  const adminAssets = filteredAssets.filter(a => a.classification === 'إدارية');
  const strategicAssets = filteredAssets.filter(a => a.classification === 'استراتيجية');

  const handleExportMeetingDossier = async () => {
    try {
      setIsExporting(true);
      setSuccessMessage(false);
      await exportKnowledgeAssetsPDF({
        project,
        assets: filteredAssets,
        meetingTitle,
        meetingType,
        chairperson,
        attendees,
        includeRecommendations,
        onProgress: (status) => setExportProgress(status)
      });
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);
    } catch (err) {
      console.error('Export PDF failed:', err);
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const handleExportSingleAsset = async (asset: ProjectKnowledgeAsset) => {
    try {
      setIsExporting(true);
      setSuccessMessage(false);
      await exportSingleAssetMeetingBrief(asset, (status) => setExportProgress(status));
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);
    } catch (err) {
      console.error('Export Single Asset failed:', err);
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const reportDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-150"
        >
          {/* Header Bar with Official Mawred Colors */}
          <div className="p-5 sm:p-6 bg-saudi-dark text-white flex items-center justify-between border-b border-saudi-gold/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-saudi-green flex items-center justify-center text-saudi-gold border border-saudi-gold/30 shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-saudi-gold bg-saudi-gold/10 px-2 py-0.5 rounded-full border border-saudi-gold/30">
                    حقيبة الاجتماعات الرسمية • منصة مورد
                  </span>
                  <span className="text-xs text-gray-400 font-mono">MEET-KA-{project}-2026</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  تصدير الأصول المعرفية للاجتماعات الرسمية ({project})
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 text-gray-600 font-bold">
              <span>تاريخ الإعداد: {reportDate}</span>
              <span>•</span>
              <span className="text-saudi-green font-extrabold">{filteredAssets.length} من أصل {assets.length} أصل مختار</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer border text-xs",
                  showConfig 
                    ? "bg-saudi-green/10 text-saudi-green border-saudi-green/30" 
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showConfig ? 'إخفاء تخصيص الاجتماع' : 'تخصيص بيانات الاجتماع'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-saudi-dark border border-gray-200 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
              >
                <Printer className="w-3.5 h-3.5 text-gray-600" />
                <span>طباعة</span>
              </button>

              <button
                onClick={handleExportMeetingDossier}
                disabled={isExporting}
                className="px-4 py-1.5 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl font-extrabold shadow-md shadow-saudi-green/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 text-xs"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-saudi-gold" />
                    <span>{exportProgress || 'جاري التصدير...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-saudi-gold" />
                    <span>تصدير ملف PDF للاجتماع</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success Notification Banner */}
          {successMessage && (
            <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-2 text-xs font-bold shrink-0">
              <CheckCircle2 className="w-4 h-4 text-saudi-green shrink-0" />
              <span>تم بنجاح تصدير وتحميل ملف PDF بهوية منصة مورد الرسمية وجاهز للمشاركة في الاجتماع!</span>
            </div>
          )}

          {/* Report Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Meeting Configuration Panel */}
            {showConfig && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-saudi-green" />
                    <h3 className="text-xs font-black text-saudi-dark">
                      تخصيص ترويسة وهوية وثيقة الاجتماع الرسمي
                    </h3>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">تظهر في الصفحة الأولى للملف المطبوع</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">عنوان الاجتماع / المذكرة الرسمية:</label>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-saudi-dark focus:border-saudi-green outline-none"
                      placeholder="عنوان الاجتماع..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">نوع الجلسة / المستوى الإداري:</label>
                    <select
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-saudi-dark focus:border-saudi-green outline-none cursor-pointer"
                    >
                      <option value="اجتماع رسمي للجنة التوجيهية العليا">اجتماع رسمي للجنة التوجيهية العليا</option>
                      <option value="اجتماع مجلس الإدارة ومراجعة المعرفة">اجتماع مجلس الإدارة ومراجعة المعرفة</option>
                      <option value="لجنة توطين المعرفة والمحتوى المحلي">لجنة توطين المعرفة والمحتوى المحلي</option>
                      <option value="ورشة مواءمة فنية مع الشركات الشريكة">ورشة مواءمة فنية مع الشركات الشريكة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">رئيس الجلسة / مقدم العرض:</label>
                    <input
                      type="text"
                      value={chairperson}
                      onChange={(e) => setChairperson(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-saudi-dark focus:border-saudi-green outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">الجهات المشاركة والحضور المستهدف:</label>
                    <input
                      type="text"
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-saudi-dark focus:border-saudi-green outline-none"
                    />
                  </div>
                </div>

                {/* Additional Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-200/80 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={includeRecommendations}
                      onChange={(e) => setIncludeRecommendations(e.target.checked)}
                      className="rounded text-saudi-green focus:ring-saudi-green w-4 h-4"
                    />
                    <span>تضمين مصفوفة التوصيات والقرارات المقترحة للاجتماع الرسمي</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllAssets}
                      className="text-[11px] text-saudi-green hover:underline font-bold"
                    >
                      تحديد كافة الأصول ({assets.length})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Top KPI Cards Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                <span className="text-[11px] font-bold text-gray-500 block mb-1">الأصول المختارة للعرض</span>
                <span className="text-2xl font-black text-saudi-green">{filteredAssets.length}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">مشروع {project}</span>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                <span className="text-[11px] font-bold text-blue-700 block mb-1">أصول فنية وتقنية</span>
                <span className="text-2xl font-black text-blue-800">{technicalAssets.length}</span>
                <span className="text-[10px] text-blue-600 block mt-0.5">حلول هندسية وتطبيقية</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
                <span className="text-[11px] font-bold text-amber-700 block mb-1">أصول إدارية وتنظيمية</span>
                <span className="text-2xl font-black text-amber-800">{adminAssets.length}</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">إجراءات وتشغيل</span>
              </div>

              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                <span className="text-[11px] font-bold text-purple-700 block mb-1">أصول استراتيجية</span>
                <span className="text-2xl font-black text-purple-800">{strategicAssets.length}</span>
                <span className="text-[10px] text-purple-600 block mt-0.5">توطين سيادي طويل الأمد</span>
              </div>
            </div>

            {/* Official Meeting Governance Notice */}
            <div className="p-4 bg-saudi-green/5 border border-saudi-green/20 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-saudi-green shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-saudi-dark">ميثاق التداول في الاجتماعات الرسمية</h4>
                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                  هذه الوثيقة صادرة ومعتمدة عبر منصة "مورد" لحفظ ونقل الملكية الفكرية، مخصصة لتمكين أصحاب القرار وأعضاء اللجان التوجيهية في مشروع {project} من متابعة جاهزية الكوادر والشركات الوطنية لاستيعاب وتطبيق المعارف الموثقة.
                </p>
              </div>
            </div>

            {/* Assets List with Selection Checkboxes & Quick Export */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-saudi-dark flex items-center gap-2">
                  <Layers className="w-4 h-4 text-saudi-green" />
                  بنود الأصول المعرفية المرفوعة للعرض في الاجتماع ({filteredAssets.length})
                </h3>
                <span className="text-xs text-gray-400 font-medium">انقر على المربع لاختيار الأصول المدرجة</span>
              </div>

              {assets.length === 0 ? (
                <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-500">لا توجد أصول معرفية مسجلة حتى الآن لمشروع {project}.</p>
                  <p className="text-xs text-gray-400 mt-1">يمكنك توثيق أول أصل معرفي عبر ميزة "تسجيل فكرة" في القائمة الرئيسية.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assets.map((asset, idx) => {
                    const isSelected = selectedAssetIds.includes(asset.id);
                    const badgeClass = asset.classification === 'فنية'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : asset.classification === 'إدارية'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200';

                    return (
                      <div 
                        key={asset.id || idx}
                        className={cn(
                          "p-4 sm:p-5 rounded-2xl border transition-all shadow-xs space-y-3",
                          isSelected ? "bg-white border-gray-300 hover:border-saudi-green" : "bg-gray-50/70 border-gray-200 opacity-60"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => toggleAssetSelection(asset.id)}
                              className="mt-1 text-saudi-green cursor-pointer"
                              title={isSelected ? "إلغاء التضمين من الاجتماع" : "تضمين في الاجتماع"}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-saudi-green" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-400" />
                              )}
                            </button>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black bg-saudi-dark text-white px-2 py-0.5 rounded">
                                  بند #{idx + 1}
                                </span>
                                <span className={cn("text-[10px] font-extrabold px-2.5 py-0.5 rounded border", badgeClass)}>
                                  {asset.classification || 'أصل معرفي'}
                                </span>
                                {asset.subCategory && (
                                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                                    {asset.subCategory}
                                  </span>
                                )}
                                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                  {asset.category}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-saudi-dark leading-snug pt-1">
                                {asset.title}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleExportSingleAsset(asset)}
                              disabled={isExporting}
                              title="تصدير مذكرة إحاطة منفصلة لهذا الأصل بصيغة PDF"
                              className="px-2.5 py-1 bg-saudi-green/10 hover:bg-saudi-green/20 text-saudi-green rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <FileDown className="w-3 h-3 text-saudi-green" />
                              <span>مذكرة فردية</span>
                            </button>

                            <span className="text-[10px] bg-saudi-green/10 text-saudi-green font-extrabold px-2.5 py-1 rounded-md shrink-0">
                              {asset.project}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed font-medium mr-8">
                          {asset.content}
                        </p>

                        {/* Meta and Due Date */}
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 mr-8">
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                              <User className="w-3.5 h-3.5 text-saudi-gold" />
                              {asset.author || 'الكوادر الفنية'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              تاريخ التوثيق: {asset.date}
                            </span>
                            {asset.dueDate && (
                              <span className="flex items-center gap-1 text-amber-800 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                استحقاق النقل: {asset.dueDate}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 flex-wrap">
                            {(asset.tags || []).slice(0, 4).map((tag, tIdx) => (
                              <span key={tIdx} className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer with Primary Export Button */}
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-saudi-green shrink-0" />
              <span>يحمل هوية منصة مورد المعتمدة والأختام الرقمية الرسمية لاجتماعات رؤية 2030</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportMeetingDossier}
                disabled={isExporting || filteredAssets.length === 0}
                className="w-full sm:w-auto px-6 py-2.5 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl font-extrabold shadow-md shadow-saudi-green/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-saudi-gold" />
                    <span>{exportProgress || 'جاري التصدير...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-saudi-gold" />
                    <span>تصدير حقيبة الاجتماع المعتمدة (PDF)</span>
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
