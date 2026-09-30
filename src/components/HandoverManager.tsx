import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Check, 
  ArrowUpRight, 
  Award, 
  ShieldCheck, 
  FileCheck,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export interface HandoverMilestone {
  id: string;
  title: string;
  category: string;
  isCompleted: boolean;
  completedAt?: string;
  verifiedBy?: string;
}

export interface HandoverPlan {
  id: string;
  expertName: string;
  expertRole: string;
  project: string;
  department: string;
  departureDate: string;
  daysRemaining: number;
  successorName: string;
  successorRole: string;
  successorEmail: string;
  remainingSessions: number;
  totalPlannedSessions: number;
  progressPercent: number;
  status: 'on_track' | 'at_risk' | 'completed';
  milestones: HandoverMilestone[];
  clearanceIssued?: boolean;
}

const INITIAL_HANDOVER_PLANS: HandoverPlan[] = [
  {
    id: 'hp-1',
    expertName: 'د. يورغن شتراوس',
    expertRole: 'كبير خبراء كيمياء وتصنيع خلايا الهيدروجين',
    project: 'نيوم',
    department: 'قطاع الهيدروجين الأخضر والطاقة المتجددة',
    departureDate: '٢٠ يوليو ٢٠٢٦',
    daysRemaining: 19,
    successorName: 'م. أحمد القحطاني',
    successorRole: 'مهندس عمليات هيدروجينية أول',
    successorEmail: 'ahmed.q@mawred.gov.sa',
    remainingSessions: 3,
    totalPlannedSessions: 12,
    progressPercent: 78,
    status: 'on_track',
    milestones: [
      { id: 'm1', title: 'توثيق بروتوكول تبريد المغنيسيوم للمحللات تحت ضغط ٣٠ بار', category: 'فنية', isCompleted: true, completedAt: '١٥ يونيو ٢٠٢٦', verifiedBy: 'د. يورغن شتراوس' },
      { id: 'm2', title: 'إعداد دليل صيانة وإصلاح أقطاب التحليل الكهربائي في درجات الحرارة العالية', category: 'معدات', isCompleted: true, completedAt: '٢٤ يونيو ٢٠٢٦', verifiedBy: 'د. يورغن شتراوس' },
      { id: 'm3', title: 'إجراء محاكاة طوارئ ميدانية لإيقاف التشغيل الآمن دون هدر الطاقة', category: 'سلامة', isCompleted: false },
      { id: 'm4', title: 'اختبار كفاءة التشغيل المستقل للمهندس المستلم لمدة ٤٨ ساعة', category: 'تقييم كفاءة', isCompleted: false },
    ]
  },
  {
    id: 'hp-2',
    expertName: 'م. جون سميث',
    expertRole: 'كبير مهندسي ميكانيكا التربة والأنفاق فائقة العمق',
    project: 'ذا لاين',
    department: 'إدارة البنية التحتية والأنفاق',
    departureDate: '١٠ يوليو ٢٠٢٦',
    daysRemaining: 9,
    successorName: 'م. تركي الشمري',
    successorRole: 'مهندس إنشائي جيوتقني',
    successorEmail: 'turki.s@mawred.gov.sa',
    remainingSessions: 2,
    totalPlannedSessions: 10,
    progressPercent: 62,
    status: 'at_risk',
    milestones: [
      { id: 'm21', title: 'توثيق مواصفات حقن الخرسانة البوليمرية في التصدعات الجيولوجية الرطبة', category: 'هندسة', isCompleted: true, completedAt: '١٠ يونيو ٢٠٢٦', verifiedBy: 'جون سميث' },
      { id: 'm22', title: 'تسليم خوارزميات رصد الضغط الهيدروستاتيكي الميدانية', category: 'برمجيات', isCompleted: true, completedAt: '١٨ يونيو ٢٠٢٦', verifiedBy: 'جون سميث' },
      { id: 'm23', title: 'نقل المعرفة الضمنية لآلية معايرة حفارات الأنفاق TBM ذات القطر العملاق', category: 'معدات', isCompleted: false },
      { id: 'm24', title: 'تقييم جاهزية الفريق الوطني لقيادة نوبة الحفر الليلية بالكامل', category: 'تشغيل', isCompleted: false }
    ]
  },
  {
    id: 'hp-3',
    expertName: 'د. ستيفن ووكر',
    expertRole: 'مستشار أنظمة الرصد الهيدرولوجي والسيول الجبلية',
    project: 'البحر الأحمر',
    department: 'الهندسة الساحلية والبيئية',
    departureDate: '١٥ أغسطس ٢٠٢٦',
    daysRemaining: 45,
    successorName: 'م. سارة الغامدي',
    successorRole: 'مهندسة نمذجة بيئية وبيانات ساحلية',
    successorEmail: 'sara.g@mawred.gov.sa',
    remainingSessions: 6,
    totalPlannedSessions: 8,
    progressPercent: 40,
    status: 'on_track',
    milestones: [
      { id: 'm31', title: 'معايرة شبكة الرادارات الحقلية لرصد معدلات السيول الخاطفة', category: 'تقنية', isCompleted: true, completedAt: '٢٠ يونيو ٢٠٢٦', verifiedBy: 'د. ستيفن ووكر' },
      { id: 'm32', title: 'إعداد خرائط التدفق الهيدروليكي للمنتجعات الجزرية', category: 'تخطيط', isCompleted: false },
      { id: 'm33', title: 'جلسة التوأمة العملية لتعديل سدود التهدئة الذكية في الأودية', category: 'ميداني', isCompleted: false }
    ]
  }
];

export default function HandoverManager({ 
  selectedProject = 'نيوم',
  onClose
}: { 
  selectedProject?: string;
  onClose?: () => void;
}) {
  const { t, formatNumber } = useLanguage();
  const [plans, setPlans] = useState<HandoverPlan[]>(() => {
    try {
      const saved = localStorage.getItem('mawred_handover_plans');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_HANDOVER_PLANS;
  });

  const [expandedPlanId, setExpandedPlanId] = useState<string | null>('hp-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    expertName: '',
    expertRole: '',
    project: selectedProject,
    department: '',
    departureDate: '',
    daysRemaining: 30,
    successorName: '',
    successorRole: '',
    successorEmail: '',
    remainingSessions: 4,
    totalPlannedSessions: 8,
    firstMilestone: ''
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mawred_handover_plans', JSON.stringify(plans));
    } catch {
      // ignore
    }
  }, [plans]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleMilestone = (planId: string, milestoneId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const updatedMilestones = p.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        const newCompleted = !m.isCompleted;
        return {
          ...m,
          isCompleted: newCompleted,
          completedAt: newCompleted ? new Date().toLocaleDateString('ar-SA') : undefined,
          verifiedBy: newCompleted ? p.expertName : undefined
        };
      });
      const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
      const progress = Math.round((completedCount / updatedMilestones.length) * 100);
      const newStatus = progress >= 100 ? 'completed' : p.daysRemaining <= 10 && progress < 70 ? 'at_risk' : 'on_track';
      return {
        ...p,
        milestones: updatedMilestones,
        progressPercent: progress,
        status: newStatus
      };
    }));
  };

  const handleAddMilestone = (planId: string, title: string) => {
    if (!title.trim()) return;
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const newM: HandoverMilestone = {
        id: 'm-' + Date.now(),
        title: title.trim(),
        category: 'معرفة تشغيلية',
        isCompleted: false
      };
      const newMilestones = [...p.milestones, newM];
      const completedCount = newMilestones.filter(m => m.isCompleted).length;
      const progress = Math.round((completedCount / newMilestones.length) * 100);
      return {
        ...p,
        milestones: newMilestones,
        progressPercent: progress
      };
    }));
    showToast('تمت إضافة المعرفة المطلوب توثيقها بنجاح.');
  };

  const handleIssueClearance = (planId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, clearanceIssued: true, status: 'completed' };
      }
      return p;
    }));
    showToast('تم إصدار شهادة المخالصة المعرفية الرسمية واعتماد انتقال الخبرة!');
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.expertName || !newPlan.successorName) return;

    const created: HandoverPlan = {
      id: 'hp-' + Date.now(),
      expertName: newPlan.expertName,
      expertRole: newPlan.expertRole || 'خبير فني دولي',
      project: newPlan.project || selectedProject,
      department: newPlan.department || 'إدارة التوطين الفني',
      departureDate: newPlan.departureDate || 'خلال ٣٠ يوماً',
      daysRemaining: Number(newPlan.daysRemaining) || 30,
      successorName: newPlan.successorName,
      successorRole: newPlan.successorRole || 'مهندس وطني',
      successorEmail: newPlan.successorEmail || 'staff@mawred.gov.sa',
      remainingSessions: Number(newPlan.remainingSessions) || 4,
      totalPlannedSessions: Number(newPlan.totalPlannedSessions) || 8,
      progressPercent: 0,
      status: 'on_track',
      milestones: [
        {
          id: 'm-' + Date.now(),
          title: newPlan.firstMilestone || 'توثيق المعرفة الضمنية الأساسية في المنظومة',
          category: 'فنية',
          isCompleted: false
        }
      ]
    };

    setPlans([created, ...plans]);
    setShowAddModal(false);
    setExpandedPlanId(created.id);
    showToast('تم إنشاء خطة تسليم المعرفة الجديدة بنجاح.');
    setNewPlan({
      expertName: '',
      expertRole: '',
      project: selectedProject,
      department: '',
      departureDate: '',
      daysRemaining: 30,
      successorName: '',
      successorRole: '',
      successorEmail: '',
      remainingSessions: 4,
      totalPlannedSessions: 8,
      firstMilestone: ''
    });
  };

  const filteredPlans = plans.filter(p => {
    const matchesProject = !selectedProject || p.project === selectedProject || p.project === 'جميع المشاريع';
    const matchesSearch = p.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.successorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {t('dash.section.handover', 'خطط تسليم المعرفة قبل مغادرة الخبير')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('dash.section.handoverDesc', 'تحديد المعارف الواجب توثيقها، الموظف المستلم، الجلسات المتبقية ونسبة الإنجاز الفعلية')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالخبير أو المستلم..."
              className="ps-8 pe-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44 sm:w-56"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('handover.addBtn', 'إنشاء خطة تسليم')}</span>
          </button>
        </div>
      </div>

      {/* Handover Plans Cards */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">لا توجد خطط تسليم مطابقة في مشروع {selectedProject}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إنشاء خطة لهذا المشروع</span>
            </button>
          </div>
        ) : (
          filteredPlans.map(plan => {
            const isExpanded = expandedPlanId === plan.id;
            const completedCount = plan.milestones.filter(m => m.isCompleted).length;

            return (
              <div 
                key={plan.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Header summary */}
                <div 
                  onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center font-bold text-sm shrink-0">
                      {plan.expertName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{plan.expertName}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">({plan.expertRole})</span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{plan.project}</span>
                        {plan.clearanceIssued && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            مكتمل ومخالص معرفياً
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>المستلم: <strong className="text-slate-700 dark:text-slate-200">{plan.successorName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          المغادرة: <span className={cn(plan.daysRemaining <= 10 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300")}>{plan.daysRemaining} يوماً متبقية</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          جلسات التوأمة المتبقية: <strong>{plan.remainingSessions}</strong> من {plan.totalPlannedSessions}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 ps-12 md:ps-0">
                    <div className="text-end">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">الإنجاز:</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{plan.progressPercent}%</span>
                      </div>
                      <div className="w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            plan.progressPercent >= 80 ? "bg-emerald-500" :
                            plan.progressPercent >= 50 ? "bg-amber-500" : "bg-rose-500"
                          )}
                          style={{ width: `${plan.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800/80 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/40 space-y-5">
                    {/* Successor and timeline info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">الموظف المستلم (الرديف):</span>
                        <strong className="text-slate-800 dark:text-slate-100 font-medium block mt-0.5">{plan.successorName}</strong>
                        <span className="text-slate-500 dark:text-slate-400 text-[10px]">{plan.successorRole} · {plan.successorEmail}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">تاريخ المغادرة المستهدف:</span>
                        <strong className="text-slate-800 dark:text-slate-100 font-medium block mt-0.5">{plan.departureDate}</strong>
                        <span className="text-slate-500 dark:text-slate-400 text-[10px]">{plan.department}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">مؤشر الجاهزية والاعتماد:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {completedCount} من {plan.milestones.length} بنود معرفية موثقة
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Milestones list */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>المعارف والبروتوكولات المطلوبة للتوثيق والاعتماد:</span>
                        </h5>
                        <span className="text-[11px] text-slate-400 font-medium">
                          انقر على المربع لتحديث إنجاز البند
                        </span>
                      </div>

                      <div className="space-y-2">
                        {plan.milestones.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleToggleMilestone(plan.id, m.id)}
                            className={cn(
                              "p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer",
                              m.isCompleted
                                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                                : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0",
                                m.isCompleted
                                  ? "bg-emerald-600 text-white"
                                  : "border border-slate-300 dark:border-slate-600"
                              )}>
                                {m.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <p className={cn(
                                  "text-xs font-medium leading-relaxed",
                                  m.isCompleted
                                    ? "text-slate-600 dark:text-slate-400 line-through"
                                    : "text-slate-800 dark:text-slate-200"
                                )}>
                                  {m.title}
                                </p>
                                {m.completedAt && (
                                  <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-700 dark:text-emerald-400">
                                    <span>تم التوثيق والاعتماد في {m.completedAt}</span>
                                    <span>·</span>
                                    <span>المراجع: {m.verifiedBy}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                              {m.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick add milestone input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="إضافة معرفة فنية أو بروتوكول تشغيلي آخر مطلوب توثيقه..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddMilestone(plan.id, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                          handleAddMilestone(plan.id, input.value);
                          input.value = '';
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        إضافة بند
                      </button>
                    </div>

                    {/* Action footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        متبقي {plan.remainingSessions} جلسات توأمة عملية لتقييم المهارة المكتسبة ميدانياً
                      </div>

                      <div className="flex items-center gap-2">
                        {!plan.clearanceIssued && (
                          <button
                            type="button"
                            onClick={() => handleIssueClearance(plan.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{t('handover.clearanceBtn', 'إصدار شهادة مخالصة معرفية')}</span>
                          </button>
                        )}
                        {plan.clearanceIssued && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                            <span>تم اعتماد التسليم رسمياً برقم توثيق: MW-{plan.id.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add New Handover Plan */}
      {showAddModal && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                إنشاء خطة تسليم معرفة لخبير مغادر
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">اسم الخبير المغادر *</label>
                  <input
                    type="text"
                    required
                    value={newPlan.expertName}
                    onChange={(e) => setNewPlan({ ...newPlan, expertName: e.target.value })}
                    placeholder="مثال: د. هانز شنايدر"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">المسمى والتخصص</label>
                  <input
                    type="text"
                    value={newPlan.expertRole}
                    onChange={(e) => setNewPlan({ ...newPlan, expertRole: e.target.value })}
                    placeholder="كبير مهندسي معالجة المياه"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">الموظف المستلم (الرديف) *</label>
                  <input
                    type="text"
                    required
                    value={newPlan.successorName}
                    onChange={(e) => setNewPlan({ ...newPlan, successorName: e.target.value })}
                    placeholder="م. نواف العتيبي"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">البريد أو الدور</label>
                  <input
                    type="text"
                    value={newPlan.successorRole}
                    onChange={(e) => setNewPlan({ ...newPlan, successorRole: e.target.value })}
                    placeholder="مهندس تشغيل مشاريع أول"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">المشروع</label>
                  <select
                    value={newPlan.project}
                    onChange={(e) => setNewPlan({ ...newPlan, project: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="نيوم">نيوم</option>
                    <option value="البحر الأحمر">البحر الأحمر</option>
                    <option value="أرامكو">أرامكو</option>
                    <option value="ذا لاين">ذا لاين</option>
                    <option value="أوكساجون">أوكساجون</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">أيام المغادرة المتبقية</label>
                  <input
                    type="number"
                    min="1"
                    value={newPlan.daysRemaining}
                    onChange={(e) => setNewPlan({ ...newPlan, daysRemaining: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">جلسات التوأمة</label>
                  <input
                    type="number"
                    min="1"
                    value={newPlan.remainingSessions}
                    onChange={(e) => setNewPlan({ ...newPlan, remainingSessions: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">أول معرفة أو بروتوكول مطلوب توثيقه</label>
                <input
                  type="text"
                  value={newPlan.firstMilestone}
                  onChange={(e) => setNewPlan({ ...newPlan, firstMilestone: e.target.value })}
                  placeholder="مثال: بروتوكول التشغيل والصيانة للمعدات الحساسة"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  حفظ واعتماد الخطة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
