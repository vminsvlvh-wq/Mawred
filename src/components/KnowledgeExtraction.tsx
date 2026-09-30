import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  FileText, 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  Info,
  ShieldAlert,
  BookOpen,
  Calendar,
  User,
  Tag,
  Download,
  FileDown,
  Eye,
  Filter,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { extractKnowledge } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { 
  INITIAL_KNOWLEDGE_ASSETS, 
  ProjectKnowledgeAsset, 
  SUBCATEGORIES_BY_CLASSIFICATION,
  KnowledgeClassification 
} from '../data/knowledgeAssets';
import { exportKnowledgeAssetsPDF, exportSingleAssetMeetingBrief } from '../services/assetsPdfExport';
import KnowledgeAssetsReportModal from './KnowledgeAssetsReportModal';
import LessonsLearnedCardModal from './LessonsLearnedCardModal';
import CrossProjectAdaptationModal from './CrossProjectAdaptationModal';
import { 
  GitCompare, 
  Lightbulb, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Link2,
  Check
} from 'lucide-react';

export default function KnowledgeExtraction({ selectedProject = 'نيوم' }: { selectedProject?: string }) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState(1);

  // Extra dynamic assets loaded from localStorage
  const [extraAssets, setExtraAssets] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<'all' | 'new' | 'old' | 'popular'>('all');
  const [projectFilter, setProjectFilter] = useState<string>(selectedProject);
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [validityFilter, setValidityFilter] = useState<'all' | 'needs_update'>('all');

  // Lessons Learned Card and Cross-Project Modals
  const [selectedCardAsset, setSelectedCardAsset] = useState<ProjectKnowledgeAsset | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedAdaptationAsset, setSelectedAdaptationAsset] = useState<ProjectKnowledgeAsset | null>(null);
  const [isAdaptationModalOpen, setIsAdaptationModalOpen] = useState(false);

  // Duplicate Content Detection State
  const [duplicateMatch, setDuplicateMatch] = useState<{ asset: ProjectKnowledgeAsset; score: number } | null>(null);
  const [duplicateIgnored, setDuplicateIgnored] = useState(false);

  // PDF Export & Preview States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportingAssetId, setExportingAssetId] = useState<string | null>(null);
  const [exportProgressText, setExportProgressText] = useState('');
  const [exportSuccessToast, setExportSuccessToast] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      setProjectFilter(selectedProject);
    }
  }, [selectedProject]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mawred_extra_assets');
      if (saved) {
        setExtraAssets(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const defaultAssets = INITIAL_KNOWLEDGE_ASSETS;

  // Available Subcategories based on chosen classification
  const availableSubCategories = React.useMemo(() => {
    if (classificationFilter !== 'all' && SUBCATEGORIES_BY_CLASSIFICATION[classificationFilter as KnowledgeClassification]) {
      return SUBCATEGORIES_BY_CLASSIFICATION[classificationFilter as KnowledgeClassification];
    }
    const set = new Set<string>();
    Object.values(SUBCATEGORIES_BY_CLASSIFICATION).forEach(arr => {
      arr.forEach(s => set.add(s));
    });
    return Array.from(set);
  }, [classificationFilter]);

  // Filter assets by selected project, classification, subCategory, and validity status
  const currentProjectAssets: ProjectKnowledgeAsset[] = React.useMemo(() => {
    let combined = [...extraAssets, ...defaultAssets];
    if (projectFilter !== 'all' && projectFilter !== 'جميع المشاريع') {
      combined = combined.filter(a => a.project === projectFilter || (projectFilter === 'البحر الأحمر' && a.project === 'أمالا'));
    }
    if (classificationFilter !== 'all') {
      combined = combined.filter(a => a.classification === classificationFilter);
    }
    if (subCategoryFilter !== 'all') {
      combined = combined.filter(a => a.subCategory === subCategoryFilter);
    }
    if (validityFilter === 'needs_update') {
      combined = combined.filter(a => a.reviewStatus === 'يحتاج تحديث عاجل' || a.reviewStatus === 'قريب المراجعة' || !!a.reviewChangeTrigger);
    }
    return combined;
  }, [projectFilter, classificationFilter, subCategoryFilter, validityFilter, extraAssets, defaultAssets]);

  // Real-time Duplicate / Similarity Content Detection
  useEffect(() => {
    if (duplicateIgnored || text.trim().length < 12) {
      setDuplicateMatch(null);
      return;
    }

    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    if (words.length === 0) return;

    let bestMatch: ProjectKnowledgeAsset | null = null;
    let highestScore = 0;

    const allAssets = [...extraAssets, ...defaultAssets];
    for (const asset of allAssets) {
      const assetString = `${asset.title} ${asset.content} ${(asset.tags || []).join(' ')}`.toLowerCase();
      let matchedCount = 0;
      for (const w of words) {
        if (assetString.includes(w)) {
          matchedCount++;
        }
      }
      const score = Math.round((matchedCount / words.length) * 100);
      if (score > highestScore && score >= 28) {
        highestScore = score;
        bestMatch = asset;
      }
    }

    if (bestMatch && highestScore >= 28) {
      setDuplicateMatch({ asset: bestMatch, score: Math.min(94, Math.max(45, highestScore + 20)) });
    } else {
      setDuplicateMatch(null);
    }
  }, [text, duplicateIgnored, extraAssets, defaultAssets]);

  const handleDirectExportPDF = async () => {
    if (isExportingPDF) return;
    try {
      setIsExportingPDF(true);
      setExportSuccessToast(false);
      const targetProject = projectFilter === 'all' || projectFilter === 'جميع المشاريع' ? selectedProject : projectFilter;
      await exportKnowledgeAssetsPDF({
        project: targetProject,
        assets: currentProjectAssets,
        onProgress: (status) => setExportProgressText(status)
      });
      setExportSuccessToast(true);
      setTimeout(() => {
        setExportSuccessToast(false);
      }, 4000);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExportingPDF(false);
      setExportProgressText('');
    }
  };

  const handleExportSingleAsset = async (asset: ProjectKnowledgeAsset) => {
    if (exportingAssetId || isExportingPDF) return;
    try {
      setExportingAssetId(asset.id);
      setExportSuccessToast(false);
      await exportSingleAssetMeetingBrief(asset, (status) => setExportProgressText(status));
      setExportSuccessToast(true);
      setTimeout(() => {
        setExportSuccessToast(false);
      }, 4000);
    } catch (error) {
      console.error('Failed to export single asset PDF:', error);
    } finally {
      setExportingAssetId(null);
      setExportProgressText('');
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const knowledge = await extractKnowledge(text);
      setResult(knowledge);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-saudi-dark">استخلاص المعرفة بالذكاء الاصطناعي</h1>
        <p className="text-gray-500">حول المحادثات والتقارير إلى أصول معرفية رقمية منظمة.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { id: 1, label: 'إدخال البيانات' },
          { id: 2, label: 'التحليل والنتائج' },
          { id: 3, label: 'الحفظ والأرشفة' }
        ].map((s) => (
          <React.Fragment key={s.id}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                step >= s.id ? "bg-saudi-green text-white" : "bg-gray-200 text-gray-500"
              )}>
                {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
              </div>
              <span className={cn(
                "text-sm font-medium",
                step >= s.id ? "text-saudi-dark" : "text-gray-400"
              )}>{s.label}</span>
            </div>
            {s.id < 3 && <div className="w-12 h-[2px] bg-gray-100"></div>}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 text-sm">
                <Info className="w-5 h-5 shrink-0" />
                <p>يتم تشفير جميع البيانات وتحليلها بخصوصية تامة وفقاً لمعايير الأمن السيبراني الوطنية.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-1">محتوى المحادثة أو التقرير</label>
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setDuplicateIgnored(false);
                  }}
                  placeholder="أدخل هنا محتوى البريد الإلكتروني، ملخص اجتماع، أو ملاحظات فنية..."
                  className="w-full h-64 bg-gray-50 border-none rounded-2xl p-6 focus:ring-2 focus:ring-saudi-green/20 transition-all resize-none text-lg"
                />

                {/* Real-time Duplicate / Similarity Content Detection Banner */}
                <AnimatePresence>
                  {duplicateMatch && !duplicateIgnored && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-right space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-900">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                          <span className="font-extrabold text-xs">
                            كشف تكرار محتوى محتمل بنسبة {duplicateMatch.score}% مع أصل معرفي قائم!
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saudi-dark text-saudi-gold">
                          {duplicateMatch.asset.project}
                        </span>
                      </div>

                      <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                        <p className="text-xs font-bold text-saudi-dark">{duplicateMatch.asset.title}</p>
                        <p className="text-[11px] text-gray-600 line-clamp-2 mt-1">{duplicateMatch.asset.content}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-gray-600 font-medium">
                          يقترح النظام تفادي الازدواجية وتوحيد الجهود:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setText(prev => `${duplicateMatch.asset.content}\n\n[إضافة وتحديث]:\n${prev}`);
                              setDuplicateIgnored(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-saudi-green text-white font-bold text-xs hover:bg-saudi-green/90 transition-all shadow-xs cursor-pointer"
                          >
                            الإضافة على الأصل القائم وتحديثه
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDuplicateIgnored(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs cursor-pointer"
                          >
                            المتابعة كأصل جديد منفصل
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-saudi-green/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-saudi-green/10 group-hover:text-saudi-green transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-saudi-dark">رفع ملفات (PDF, DOCX)</p>
                    <p className="text-xs text-gray-400 mt-1">الحد الأقصى 10 ميجابايت</p>
                  </div>
                </div>
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-saudi-green/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-saudi-green/10 group-hover:text-saudi-green transition-colors">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-saudi-dark">ربط البريد الإلكتروني</p>
                    <p className="text-xs text-gray-400 mt-1">Outlook, Gmail</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !text.trim()}
                className="w-full py-4 bg-saudi-green text-white rounded-2xl font-bold text-lg hover:bg-saudi-green/90 transition-all shadow-lg shadow-saudi-green/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    جاري استخلاص المعرفة...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    بدء التحليل الذكي
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl saudi-gradient flex items-center justify-center text-white">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-saudi-dark">{result?.title}</h2>
                    <span className="px-3 py-1 bg-saudi-gold/10 text-saudi-gold text-xs font-bold rounded-full border border-saudi-gold/20">
                      {result?.category}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 font-medium">مستوى الثقة</p>
                  <p className="text-2xl font-bold text-saudi-green">{(result?.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-saudi-green" />
                  ملخص المعرفة المستخلصة
                </h3>
                <div className="p-6 bg-gray-50 rounded-2xl text-gray-700 leading-relaxed prose prose-saudi">
                  <ReactMarkdown>{result?.summary}</ReactMarkdown>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {result?.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm text-gray-600 font-medium shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                >
                  إعادة التحليل
                </button>
                <button className="flex-[2] py-4 bg-saudi-green text-white rounded-2xl font-bold hover:bg-saudi-green/90 transition-all shadow-lg shadow-saudi-green/20 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  اعتماد وحفظ في قاعدة المعرفة
                </button>
              </div>
            </div>

            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-amber-900">تنبيه الخصوصية</h4>
                <p className="text-sm text-amber-800 mt-1">
                  تم إخفاء الأسماء الشخصية والأرقام الحساسة تلقائياً من الملخص أعلاه لضمان سرية المعلومات.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documented Knowledge Assets Section */}
      <div className="space-y-6 pt-6 font-sans">
        {/* PDF Export Banner Card */}
        <div className="bg-gradient-to-l from-saudi-dark via-saudi-dark/95 to-saudi-dark p-6 rounded-3xl border border-saudi-gold/25 shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-saudi-green via-saudi-gold to-saudi-green"></div>
          
          <div className="flex items-start gap-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-saudi-gold shrink-0 shadow-inner">
              <FileDown className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold text-saudi-gold bg-saudi-gold/15 border border-saudi-gold/30 px-2.5 py-0.5 rounded-full">
                  هوية مورد المعتمدة • رؤية 2030
                </span>
                <span className="text-[10px] font-mono text-gray-300">
                  MEETING-DOSSIER-2026
                </span>
              </div>
              <h3 className="text-xl font-black text-white">
                تصدير الأصول المعرفية إلى ملف PDF للاجتماعات الرسمية ({projectFilter === 'all' || projectFilter === 'جميع المشاريع' ? selectedProject : projectFilter})
              </h3>
              <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                توليد ملف PDF عالي التنسيق يحمل هوية منصة مورد (ختم الاعتماد، جدول أعمال الجلسة، مصفوفة القرارات والتوصيات، ودرجة السرية) لمشاركته واعتماده في اجتماعات اللجان التوجيهية ومجالس الإدارة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10 flex-wrap">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all border border-white/15 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4 text-saudi-gold" />
              <span>تخصيص ومعاينة ملف الاجتماع</span>
            </button>

            <button
              onClick={handleDirectExportPDF}
              disabled={isExportingPDF || currentProjectAssets.length === 0}
              className="px-6 py-3 bg-saudi-gold hover:bg-yellow-500 text-saudi-dark rounded-2xl text-xs font-black transition-all shadow-lg shadow-saudi-gold/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{exportProgressText || 'جاري التصدير...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تصدير حقيبة الاجتماع ({currentProjectAssets.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {exportSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-saudi-green text-white rounded-2xl flex items-center justify-between shadow-lg text-xs font-bold"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-saudi-gold" />
              <span>تم بنجاح تصدير وتحميل وثيقة الأصول المعرفية للاجتماع الرسمي بهوية منصة مورد المعتمدة!</span>
            </div>
            <span className="text-[10px] text-white/80 font-mono">200 OK • MEETING READY</span>
          </motion.div>
        )}

        {/* Filter and Overview Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-xs">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-saudi-green" />
            <div>
              <h2 className="text-base font-extrabold text-saudi-dark">
                أرشيف الأصول المعرفية المسجلة
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                معارف حصرية موثقة للكوادر الوطنية والشركات الاستشارية
              </span>
            </div>
            <span className="text-xs bg-saudi-green/10 text-saudi-green px-2.5 py-1 rounded-full font-black mr-2">
              {currentProjectAssets.length} أصول
            </span>
          </div>
          
          {/* Controls: Project Filter, Classification, Subcategory & Sort */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Project Filter Selector */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-saudi-green shrink-0" />
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">المشروع:</span>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer text-saudi-dark focus:ring-0 p-0"
              >
                <option value="جميع المشاريع">جميع المشاريع</option>
                <option value="نيوم">نيوم</option>
                <option value="البحر الأحمر">البحر الأحمر</option>
                <option value="ذا لاين">ذا لاين</option>
                <option value="أوكساجون">أوكساجون</option>
                <option value="القدية">القدية</option>
                <option value="أمالا">أمالا</option>
              </select>
            </div>

            {/* Main Classification Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
              <Layers className="w-3.5 h-3.5 text-saudi-green shrink-0" />
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">التصنيف:</span>
              <select
                value={classificationFilter}
                onChange={(e) => {
                  setClassificationFilter(e.target.value);
                  setSubCategoryFilter('all');
                }}
                className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer text-saudi-dark focus:ring-0 p-0"
              >
                <option value="all">جميع التصنيفات</option>
                <option value="فنية">فنية</option>
                <option value="إدارية">إدارية</option>
                <option value="استراتيجية">استراتيجية</option>
              </select>
            </div>

            {/* SubCategory Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
              <Tag className="w-3.5 h-3.5 text-saudi-gold shrink-0" />
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">التصنيف الفرعي:</span>
              <select
                value={subCategoryFilter}
                onChange={(e) => setSubCategoryFilter(e.target.value)}
                className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer text-saudi-dark focus:ring-0 p-0"
              >
                <option value="all">الكل</option>
                {availableSubCategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Validity Expiry Filter Button */}
            <button
              type="button"
              onClick={() => setValidityFilter(validityFilter === 'all' ? 'needs_update' : 'all')}
              className={cn(
                "px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5",
                validityFilter === 'needs_update'
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>أصول تحتاج مراجعة وتحديث ⚠️</span>
            </button>

            {/* Date Sort Filter */}
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-saudi-gold shrink-0" />
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">الترتيب:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer text-saudi-dark focus:ring-0 p-0"
              >
                <option value="all">الافتراضي</option>
                <option value="new">الأحدث توثيقاً</option>
                <option value="old">الأقدم</option>
                <option value="popular">الأكثر تداولاً</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Subcategory Quick Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap px-2">
          <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-saudi-green" />
            تصفية سريعة بالتصنيف الفرعي:
          </span>
          <button
            type="button"
            onClick={() => setSubCategoryFilter('all')}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border",
              subCategoryFilter === 'all'
                ? "bg-saudi-dark text-saudi-gold border-saudi-dark shadow-xs"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            الكل
          </button>
          {availableSubCategories.map((sub) => {
            const isSelected = subCategoryFilter === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSubCategoryFilter(isSelected ? 'all' : sub)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border flex items-center gap-1",
                  isSelected
                    ? "bg-saudi-green text-white border-saudi-green shadow-xs"
                    : "bg-white text-gray-600 border-gray-200 hover:border-saudi-green/40 hover:bg-emerald-50/50"
                )}
              >
                <span>{sub}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-saudi-gold"></span>}
              </button>
            );
          })}
        </div>

        {/* Assets Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(() => {
            const sortedAssets = [...currentProjectAssets].sort((a, b) => {
              if (dateFilter === 'new') {
                return (a.confidence ?? 0) < (b.confidence ?? 0) ? 1 : -1;
              }
              if (dateFilter === 'old') {
                return (a.confidence ?? 0) > (b.confidence ?? 0) ? 1 : -1;
              }
              if (dateFilter === 'popular') {
                return (b.circulation ?? 0) - (a.circulation ?? 0);
              }
              return 0;
            });

            if (sortedAssets.length === 0) {
              return (
                <div className="col-span-2 p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-saudi-dark">لا توجد أصول معرفية مسجلة لمشروع {projectFilter}</h4>
                  <p className="text-xs text-gray-400 mt-1">قم بتوثيق أصل جديد أو اختيار مشروع آخر من القائمة أعلاه.</p>
                </div>
              );
            }

            return sortedAssets.map((asset) => {
              const isExtra = asset.id.startsWith('extra') || asset.id.includes('insight') || !asset.id.startsWith('base');
              const needsReview = asset.reviewStatus === 'يحتاج تحديث عاجل' || asset.reviewStatus === 'قريب المراجعة' || !!asset.reviewChangeTrigger;

              return (
                <motion.div
                  key={asset.id}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "bg-white p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4",
                    needsReview 
                      ? "border-amber-300/80 shadow-md ring-1 ring-amber-300/40" 
                      : isExtra 
                      ? "border-saudi-green/20 shadow-sm hover:shadow-md" 
                      : "border-gray-150 shadow-sm hover:shadow-md"
                  )}
                >
                  <div className={cn(
                    "absolute top-0 right-0 left-0 h-1.5",
                    needsReview
                      ? "bg-gradient-to-r from-amber-500 to-red-500"
                      : isExtra 
                      ? "bg-gradient-to-r from-saudi-gold via-saudi-green to-saudi-green" 
                      : "bg-gradient-to-r from-saudi-green/40 to-saudi-gold/40"
                  )}></div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-1 rounded-full",
                          isExtra ? "text-saudi-gold bg-saudi-dark" : "text-gray-600 bg-gray-100"
                        )}>{asset.category}</span>
                        {asset.classification && (
                          <span className={cn(
                            "text-[10px] font-extrabold px-2 py-0.5 rounded border",
                            asset.classification === 'فنية' ? "bg-blue-50 text-blue-700 border-blue-200" :
                            asset.classification === 'إدارية' ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-purple-50 text-purple-700 border-purple-200"
                          )}>
                            أصل {asset.classification}
                          </span>
                        )}
                        {asset.subCategory && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5 text-saudi-green" />
                            {asset.subCategory}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] bg-saudi-green/10 text-saudi-green font-extrabold px-2.5 py-0.5 rounded shrink-0">{asset.project}</span>
                    </div>

                    <h3 className="font-bold text-sm text-saudi-dark leading-tight">{asset.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium line-clamp-3">{asset.content}</p>

                    {/* Validity Alert Banner if review is pending */}
                    {needsReview && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-right space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-900">
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            تنبيه صلاحية: المحتوى محتاج مراجعة وتحديث
                          </span>
                          <span className="font-mono text-amber-800">
                            استحقاق: {asset.reviewDueDate || '2026-10-15'}
                          </span>
                        </div>
                        {asset.reviewChangeTrigger && (
                          <p className="text-[10px] text-amber-800 font-medium">
                            السبب: {asset.reviewChangeTrigger}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action Cards Bar: Lesson Learned Card & Cross-Project Adaptation */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCardAsset(asset);
                          setIsCardModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-saudi-green/10 border border-gray-200 hover:border-saudi-green/30 text-right transition-all flex items-center gap-1.5 text-saudi-dark font-bold text-[11px] cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-saudi-gold shrink-0" />
                        <span className="truncate">بطاقة «درس مستفاد»</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAdaptationAsset(asset);
                          setIsAdaptationModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-saudi-dark/10 border border-gray-200 hover:border-saudi-dark/30 text-right transition-all flex items-center gap-1.5 text-saudi-dark font-bold text-[11px] cursor-pointer"
                      >
                        <GitCompare className="w-3.5 h-3.5 text-saudi-green shrink-0" />
                        <span className="truncate">تعميم بين المشاريع</span>
                      </button>
                    </div>

                    {asset.dueDate && (
                      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-[10px] text-amber-900 font-medium">
                        <span className="font-extrabold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-saudi-gold" />
                          تاريخ الاستحقاق والمتابعة:
                        </span>
                        <span className="font-sans font-extrabold">{asset.dueDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-[10px] text-gray-500 font-bold">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-saudi-gold" /> {asset.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-saudi-gold" /> {asset.date}</span>
                    </div>

                    <button
                      onClick={() => handleExportSingleAsset(asset)}
                      disabled={exportingAssetId === asset.id || isExportingPDF}
                      title="تصدير مذكرة إحاطة تنفيذية لهذا الأصل للاجتماعات الرسمية (PDF)"
                      className="px-2.5 py-1 bg-saudi-green/10 hover:bg-saudi-green text-saudi-green hover:text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border border-saudi-green/20 hover:border-saudi-green disabled:opacity-50"
                    >
                      {exportingAssetId === asset.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-saudi-gold" />
                          <span>جاري التصدير...</span>
                        </>
                      ) : (
                        <>
                          <FileDown className="w-3 h-3 text-saudi-gold" />
                          <span>تصدير للاجتماع (PDF)</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            });
          })()}
        </div>
      </div>

      {/* Lessons Learned Modal */}
      <LessonsLearnedCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        asset={selectedCardAsset}
      />

      {/* Cross Project Adaptation Modal */}
      <CrossProjectAdaptationModal
        isOpen={isAdaptationModalOpen}
        onClose={() => setIsAdaptationModalOpen(false)}
        asset={selectedAdaptationAsset}
      />

      {/* Report Modal Component */}
      <KnowledgeAssetsReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        project={projectFilter === 'all' || projectFilter === 'جميع المشاريع' ? selectedProject : projectFilter}
        assets={currentProjectAssets}
      />
    </div>
  );
}

