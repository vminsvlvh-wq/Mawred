import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Share2, 
  Plus, 
  X, 
  Sparkles,
  Building,
  Target,
  Wrench,
  HelpCircle,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { ProjectKnowledgeAsset } from '../data/knowledgeAssets';

export interface LessonLearnedItem {
  id: string;
  title: string;
  project: string;
  category: string;
  problem: string;
  rootCause: string;
  testedSolution: string;
  whenToReapply: string;
  applicableProjects: string[];
  author: string;
  reviewer: string;
  date: string;
  reviewDate?: string;
  verified: boolean;
}

const INITIAL_LESSONS: LessonLearnedItem[] = [
  {
    id: 'lesson-1',
    title: 'تعديل زمن تشكّل الخرسانة الذاتية الدمك في درجات حرارة تتجاوز ٤٥ مئوية',
    project: 'نيوم',
    category: 'هندسة وبناء',
    problem: 'تسارع تصلب الخرسانة أثناء الصب في أساسات الأنفاق العميقة نهاراً، مما كاد يسبب تعشيشاً وفراغات هوائية خطرة.',
    rootCause: 'تبخر المياه المعالجة السريع وارتفاع حرارة الركام المخزن تحت الشمس المباشرة قبل الخلط.',
    testedSolution: 'تثليج مياه الخلط لدرجة ٤ درجات مئوية وإضافة مبطئات الشك البوليمرية مع نقل عمليات الصب للوردية الليلية من ١١ مساءً حتى ٥ فجراً.',
    whenToReapply: 'عند صب الكتل الخرسانية الضخمة في أي مشروع صحراوي أو ساحلي تتجاوز فيه درجة حرارة الجو ٤٠ درجة مئوية.',
    applicableProjects: ['البحر الأحمر', 'القدية', 'أوكساجون', 'أرامكو'],
    author: 'م. أحمد القحطاني',
    reviewer: 'د. يورغن شتراوس',
    date: '٢٢ يونيو ٢٠٢٦',
    reviewDate: '٢٢ ديسمبر ٢٠٢٦',
    verified: true
  },
  {
    id: 'lesson-2',
    title: 'معالجة انسداد فلاتر التناضح العكسي بفعل العوالق المرجانية الموسمية',
    project: 'البحر الأحمر',
    category: 'بيئة وتقنية مياه',
    problem: 'انخفاض تدفق مياه محطات التحلية بنسبة ٤٠٪ خلال أسبوع تكاثر الشعب المرجانية في فصل الربيع.',
    rootCause: 'الاعتماد على مرشحات رملية تقليدية لا ترصد الكثافة البيولوجية المجهرية الدقيقة للعوالق.',
    testedSolution: 'تركيب منظومة استشعار صوتي بالموجات فوق الصوتية أمام مآخذ المياه لتفريق العوالق بسلام قبل وصولها لأغشية التناضح دون الإضرار بالحياة البحرية.',
    whenToReapply: 'في كافة مآخذ محطات التحلية الساحلية الواقعة قرب المحميات الطبيعية والشعب المرجانية الحساسة.',
    applicableProjects: ['أمالا', 'نيوم', 'ينبع'],
    author: 'م. سارة الغامدي',
    reviewer: 'د. ستيفن ووكر',
    date: '١٠ يونيو ٢٠٢٦',
    reviewDate: '١٠ ديسمبر ٢٠٢٦',
    verified: true
  }
];

export default function LessonsLearnedModal({
  isOpen,
  onClose,
  selectedProject = 'نيوم'
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedProject?: string;
}) {
  const { t } = useLanguage();
  const [lessons, setLessons] = useState<LessonLearnedItem[]>(() => {
    try {
      const saved = localStorage.getItem('mawred_lessons_learned');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LESSONS;
  });

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedLesson, setSelectedLesson] = useState<LessonLearnedItem | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    project: selectedProject,
    category: 'هندسة وبناء',
    problem: '',
    rootCause: '',
    testedSolution: '',
    whenToReapply: '',
    applicableProjects: ['البحر الأحمر', 'نيوم']
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mawred_lessons_learned', JSON.stringify(lessons));
    } catch {
      // ignore
    }
  }, [lessons]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.problem || !form.testedSolution) return;

    const newLesson: LessonLearnedItem = {
      id: 'lesson-' + Date.now(),
      title: form.title,
      project: form.project,
      category: form.category,
      problem: form.problem,
      rootCause: form.rootCause || 'تحليل ميداني قيد التوثيق الإضافي',
      testedSolution: form.testedSolution,
      whenToReapply: form.whenToReapply || 'في المشروعات ذات الطبيعة الهندسية المشابهة',
      applicableProjects: form.applicableProjects,
      author: 'المهندس الميداني (أمين قرناص)',
      reviewer: 'مراجعة خبير معتمد',
      date: 'اليوم، ' + new Date().toLocaleDateString('ar-SA'),
      reviewDate: 'بعد ٦ أشهر',
      verified: true
    };

    setLessons([newLesson, ...lessons]);

    // Also register as dynamic knowledge asset in mawred_extra_assets
    try {
      const extraSaved = localStorage.getItem('mawred_extra_assets');
      const existingList = extraSaved ? JSON.parse(extraSaved) : [];
      const newAsset: Partial<ProjectKnowledgeAsset> = {
        id: 'asset-lesson-' + Date.now(),
        title: form.title,
        content: `【الدرس المستفاد】\nالمشكلة: ${form.problem}\nالسبب: ${form.rootCause}\nالحل المجرّب: ${form.testedSolution}\nظروف التطبيق: ${form.whenToReapply}`,
        category: form.category,
        classification: 'فنية',
        subCategory: 'معدات',
        lifecycleStatus: 'معتمد',
        reviewerName: 'فريق الاعتماد الهندسي لمنصة مورد',
        approvalDate: new Date().toLocaleDateString('ar-SA'),
        practicalImpact: {
          appliedAt: form.project,
          achievement: form.testedSolution.slice(0, 100),
          type: 'تجنب خطأ',
          evidence: 'سجل بطاقة الدرس المستفاد الميداني #LSN-' + Date.now().toString().slice(-4),
        },
        tags: ['درس_مستفاد', form.category, form.project],
        project: form.project,
        author: 'المهندس الميداني',
        date: new Date().toLocaleDateString('ar-SA'),
        isDemoData: false
      };
      localStorage.setItem('mawred_extra_assets', JSON.stringify([newAsset, ...existingList]));
    } catch {
      // ignore
    }

    setActiveTab('list');
    setSelectedLesson(newLesson);
    showToast('تم اعتماد وحفظ الدرس المستفاد ونشره في قاعدة المعرفة الوطنية!');
    setForm({
      title: '',
      project: selectedProject,
      category: 'هندسة وبناء',
      problem: '',
      rootCause: '',
      testedSolution: '',
      whenToReapply: '',
      applicableProjects: ['البحر الأحمر', 'نيوم']
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {t('lesson.title', 'بطاقة «درس مستفاد»')}
                <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">({lessons.length} دروس موثقة)</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t('lesson.subtitle', 'نموذج موحد لتوثيق المشكلة، سببها الجذري، الحل المجرّب، ومتى يمكن تكرار الاستخدام')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={cn(
                  "px-3 py-1 rounded-md font-medium transition-colors",
                  activeTab === 'list'
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                استعراض الدروس
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={cn(
                  "px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1",
                  activeTab === 'create'
                    ? "bg-emerald-600 text-white shadow-2xs font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>توثيق درس جديد</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {toastMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {activeTab === 'create' ? (
            <form onSubmit={handleCreateLesson} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl text-slate-700 dark:text-slate-300">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">لماذا بطاقة الدرس المستفاد؟</span>
                تساعد البطاقة على تجنب تكرار الأخطاء المكلفة وتوثيق الحل الميداني المبتكر لتعميمه فوراً على كافة المشاريع الكبرى المشابهة في المملكة.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">عنوان الدرس المستفاد *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="مثال: ضبط زمن تشكل الخرسانة الذاتية في حرارة الصيف"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">المشروع</label>
                    <select
                      value={form.project}
                      onChange={(e) => setForm({ ...form, project: e.target.value })}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    >
                      <option value="نيوم">نيوم</option>
                      <option value="البحر الأحمر">البحر الأحمر</option>
                      <option value="أرامكو">أرامكو</option>
                      <option value="ذا لاين">ذا لاين</option>
                      <option value="أوكساجون">أوكساجون</option>
                      <option value="القدية">القدية</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">القطاع</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    >
                      <option value="هندسة وبناء">هندسة وبناء</option>
                      <option value="طاقة متجددة">طاقة متجددة</option>
                      <option value="بيئة وتقنية مياه">بيئة وتقنية مياه</option>
                      <option value="لوجستيات ونقل">لوجستيات ونقل</option>
                      <option value="أنظمة وتقنية">أنظمة وتقنية</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 1. Problem */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  ١. {t('lesson.problem', 'المشكلة أو التحدي الميداني')} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.problem}
                  onChange={(e) => setForm({ ...form, problem: e.target.value })}
                  placeholder={t('lesson.problemPlaceholder', 'صف المشكلة الفنية التي واجهها الفريق في الموقع...')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* 2. Root Cause */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  ٢. {t('lesson.rootCause', 'السبب الجذري الكامن')}
                </label>
                <textarea
                  rows={2}
                  value={form.rootCause}
                  onChange={(e) => setForm({ ...form, rootCause: e.target.value })}
                  placeholder={t('lesson.rootCausePlaceholder', 'ما العامل الخفي أو التقني الذي سبب هذه المشكلة؟')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* 3. Tested Solution */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  ٣. {t('lesson.solution', 'الحل المجرّب والنتائج المحققة')} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.testedSolution}
                  onChange={(e) => setForm({ ...form, testedSolution: e.target.value })}
                  placeholder={t('lesson.solutionPlaceholder', 'ما الإجراء العملي الذي تم تطبيقه وأثبت نجاحه؟')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* 4. When to Reapply */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  ٤. {t('lesson.whenToReapply', 'متى وأين ينفع نستخدم هذا الحل ثانية؟')}
                </label>
                <textarea
                  rows={2}
                  value={form.whenToReapply}
                  onChange={(e) => setForm({ ...form, whenToReapply: e.target.value })}
                  placeholder={t('lesson.whenToReapplyPlaceholder', 'حدد الظروف أو المشروعات التي ينطبق عليها هذا الحل...')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('lesson.saveBtn', 'اعتماد ونشر الدرس المستفاد')}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{lesson.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span>مشروع: <strong className="text-slate-700 dark:text-slate-300">{lesson.project}</strong></span>
                        <span>·</span>
                        <span>{lesson.category}</span>
                        <span>·</span>
                        <span>{lesson.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        معتمد كأصل معرفي
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                      <strong className="text-rose-700 dark:text-rose-400 block mb-1">المشكلة والتحدي الميداني:</strong>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.problem}</p>
                      {lesson.rootCause && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-rose-200/50 dark:border-rose-900/30">
                          <strong>السبب الجذري:</strong> {lesson.rootCause}
                        </p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">الحل المجرّب والنتائج:</strong>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.testedSolution}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs">
                    <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                      {t('lesson.whenToReapply', 'متى وأين ينفع نستخدم هذا الحل ثانية؟')}
                    </strong>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{lesson.whenToReapply}</p>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/50 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">مشاريع مقترحة للاستفادة:</span>
                      {lesson.applicableProjects.map(p => (
                        <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
