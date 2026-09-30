import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Download, 
  Plus, 
  Check, 
  UserCheck, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Award, 
  ShieldCheck, 
  Search, 
  Filter, 
  X, 
  ExternalLink,
  ChevronDown,
  Printer,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  INITIAL_HANDOVER_PLANS, 
  ExpertHandoverPlan, 
  HandoverTask, 
  HandoverSession 
} from '../data/handoverData';

interface ExpertHandoverPlansProps {
  selectedProject?: string;
}

export default function ExpertHandoverPlans({ selectedProject }: ExpertHandoverPlansProps) {
  const [plans, setPlans] = useState<ExpertHandoverPlan[]>(INITIAL_HANDOVER_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(INITIAL_HANDOVER_PLANS[0].id);
  const [projectFilter, setProjectFilter] = useState<string>(
    selectedProject && selectedProject !== 'جميع المشاريع' ? selectedProject : 'جميع المشاريع'
  );
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  // New session form
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionHours, setSessionHours] = useState('3.5');
  const [sessionTask, setSessionTask] = useState('');
  const [sessionScore, setSessionScore] = useState('92');
  const [sessionTraineeNote, setSessionTraineeNote] = useState('');
  const [sessionExpertNote, setSessionExpertNote] = useState('');

  // Filter plans
  const filteredPlans = plans.filter(p => {
    const matchesProject = projectFilter === 'جميع المشاريع' || p.project === projectFilter;
    const matchesUrgency = urgencyFilter === 'all' || p.urgency === urgencyFilter;
    const matchesSearch = 
      p.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receivingEmployee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.expertRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesUrgency && matchesSearch;
  });

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || filteredPlans[0] || plans[0];

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== selectedPlanId) return plan;
      const updatedTasks = plan.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: !t.completed,
            completionDate: !t.completed ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return t;
      });

      const completedCount = updatedTasks.filter(t => t.completed).length;
      const newCompletionRate = Math.round((completedCount / updatedTasks.length) * 100);

      return {
        ...plan,
        tasks: updatedTasks,
        completionRate: newCompletionRate,
        handoverCertificateStatus: newCompletionRate === 100 ? 'جاهز للاعتماد' : plan.handoverCertificateStatus
      };
    }));
  };

  // Add new session
  const handleAddSession = () => {
    if (!sessionTopic || !sessionTask) return;

    setPlans(prev => prev.map(plan => {
      if (plan.id !== selectedPlanId) return plan;
      const newSession: HandoverSession = {
        id: `s-${Date.now()}`,
        sessionNumber: plan.completedSessions + 1,
        date: new Date().toISOString().split('T')[0],
        topic: sessionTopic,
        hoursSpent: parseFloat(sessionHours) || 3,
        practicalTaskAssigned: sessionTask,
        taskEvaluationScore: parseInt(sessionScore) || 90,
        traineeFeedback: sessionTraineeNote || 'تم استيعاب وتطبيق المعارف الميدانية بنجاح.',
        expertFeedback: sessionExpertNote || 'أظهر الموظف كفاءة عالية وجاهزية للاستقلالية.',
        status: 'منفذة'
      };

      const updatedCompleted = plan.completedSessions + 1;
      const updatedRemaining = Math.max(0, plan.totalPlannedSessions - updatedCompleted);

      return {
        ...plan,
        completedSessions: updatedCompleted,
        remainingSessions: updatedRemaining,
        sessionsLog: [newSession, ...plan.sessionsLog]
      };
    }));

    setIsNewSessionModalOpen(false);
    setSessionTopic('');
    setSessionTask('');
    setSessionTraineeNote('');
    setSessionExpertNote('');
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-saudi-dark via-emerald-950 to-saudi-dark p-8 text-white shadow-xl border border-saudi-gold/20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-saudi-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saudi-gold/20 text-saudi-gold border border-saudi-gold/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>إجراء استراتيجي حاسم لحفظ رأس المال المعرفي الوطني</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              خطط تسليم معرفة الخبراء قبل المغادرة
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              تحويل هدف استبقاء المعرفة إلى إجراءات قيادية دقيقة: تحديد المعارف الحرجة المطلوب توثيقها، تعيين الموظف الوطني المستلم، وحساب الجلسات المتبقية ونسبة الإنجاز الفعلية قبل انتهاء عقود الخبراء.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition-all shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-saudi-gold" />
              عرض وتصدير محضر التسليم
            </button>
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-saudi-gold hover:bg-saudi-gold/90 text-saudi-dark font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              تسجيل جلسة تسليم منفذة
            </button>
          </div>
        </div>

        {/* Vital KPIs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <p className="text-gray-400 text-xs font-medium">إجمالي خطط التسليم النشطة</p>
            <p className="text-2xl font-black text-white mt-1">{plans.length} خطط</p>
            <span className="text-[10px] text-emerald-400 font-bold">تغطي 4 مشاريع كبرى</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <p className="text-gray-400 text-xs font-medium">خطط في مرحلة حرجة (أقل من 50 يوماً)</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {plans.filter(p => p.daysRemaining <= 50).length} خبراء
            </p>
            <span className="text-[10px] text-amber-300 font-bold">تتطلب أولوية قصوى</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <p className="text-gray-400 text-xs font-medium">متوسط نسبة إنجاز التسليم</p>
            <p className="text-2xl font-black text-saudi-gold mt-1">
              {Math.round(plans.reduce((acc, curr) => acc + curr.completionRate, 0) / plans.length)}%
            </p>
            <span className="text-[10px] text-gray-300 font-bold">قياس فعلي مبني على مهام عملية</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <p className="text-gray-400 text-xs font-medium">الجلسات المتبقية للتسليم النهائي</p>
            <p className="text-2xl font-black text-cyan-300 mt-1">
              {plans.reduce((acc, curr) => acc + curr.remainingSessions, 0)} جلسات
            </p>
            <span className="text-[10px] text-cyan-200 font-bold">مجدولة للشهرين القادمين</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم الخبير، الموظف المستلم، أو التخصص..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pr-9 pl-4 text-xs font-medium focus:ring-2 focus:ring-saudi-green/20 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Project Filters */}
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs font-bold">
            {['جميع المشاريع', 'نيوم', 'البحر الأحمر', 'ذا لاين', 'أوكساجون'].map(proj => (
              <button
                key={proj}
                onClick={() => setProjectFilter(proj)}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                  projectFilter === proj ? "bg-saudi-dark text-saudi-gold shadow-xs" : "text-gray-600 hover:text-saudi-dark"
                )}
              >
                {proj}
              </button>
            ))}
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setUrgencyFilter('all')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg transition-all cursor-pointer",
                urgencyFilter === 'all' ? "bg-saudi-green text-white shadow-xs" : "text-gray-600"
              )}
            >
              الكل
            </button>
            <button
              onClick={() => setUrgencyFilter('حرجة ومستعجلة')}
              className={cn(
                "px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1",
                urgencyFilter === 'حرجة ومستعجلة' ? "bg-red-600 text-white shadow-xs" : "text-red-600 hover:bg-red-50"
              )}
            >
              <AlertTriangle className="w-3 h-3" />
              حرجة ومستعجلة
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Handover Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Handover Plans Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-saudi-dark flex items-center gap-2">
              <Users className="w-4 h-4 text-saudi-green" />
              الخبراء المغادرون والخطط النشطة ({filteredPlans.length})
            </h2>
            <span className="text-xs text-gray-400">انقر لعرض تفاصيل التسليم والمهام</span>
          </div>

          <div className="space-y-3">
            {filteredPlans.map(plan => {
              const isSelected = plan.id === selectedPlanId;
              const isUrgent = plan.daysRemaining <= 50;

              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "p-5 rounded-2xl border transition-all cursor-pointer text-right relative overflow-hidden",
                    isSelected 
                      ? "bg-white border-saudi-gold/60 shadow-lg ring-2 ring-saudi-gold/20" 
                      : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                  )}
                >
                  {/* Top Row: Project & Urgency & Countdown */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-saudi-dark text-saudi-gold">
                        {plan.project}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1",
                        isUrgent 
                          ? "bg-red-50 text-red-700 border-red-200 animate-pulse" 
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      )}>
                        <Clock className="w-3 h-3" />
                        متبقي {plan.daysRemaining} يوماً
                      </span>
                    </div>

                    <span className="text-[11px] font-black text-saudi-dark">
                      إنجاز: {plan.completionRate}%
                    </span>
                  </div>

                  {/* Expert Profile Line */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-saudi-green/10 text-saudi-green font-black flex items-center justify-center text-sm shrink-0 border border-saudi-green/20">
                      {plan.expertName.split(' ')[1]?.[0] || 'خ'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-saudi-dark truncate">
                        {plan.expertName}
                      </h3>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {plan.expertRole}
                      </p>
                    </div>
                  </div>

                  {/* Receiving Employee Connection Card */}
                  <div className="mt-3.5 p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-saudi-gold/20 text-saudi-dark font-black text-[11px] flex items-center justify-center">
                        {plan.receivingEmployee.avatarInitials}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-medium">الموظف الوطني المستلم:</p>
                        <p className="text-xs font-bold text-saudi-dark">{plan.receivingEmployee.name}</p>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] font-bold text-gray-500 block">الجلسات المتبقية:</span>
                      <span className="text-xs font-black text-amber-600">{plan.remainingSessions} من أصل {plan.totalPlannedSessions}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          plan.completionRate >= 80 ? "bg-saudi-green" : plan.completionRate >= 50 ? "bg-saudi-gold" : "bg-amber-500"
                        )}
                        style={{ width: `${plan.completionRate}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Handover Deep Details & Tasks & Sessions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedPlan ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
              {/* Top Banner with Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-saudi-dark text-saudi-gold">
                      {selectedPlan.project}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      تاريخ المغادرة: {selectedPlan.departingDate} ({selectedPlan.daysRemaining} يوماً متبقية)
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-saudi-dark">
                    خطة استلام عهدة {selectedPlan.expertName}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedPlan.expertTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => setIsCertificateModalOpen(true)}
                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="معاينة محضر التسليم"
                  >
                    <Printer className="w-4 h-4 text-saudi-green" />
                    <span>المحضر الرسمي</span>
                  </button>
                </div>
              </div>

              {/* 3 Core Highlights (Knowledge Scope / Receiver / Sessions) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1: Receiving Employee Box */}
                <div className="p-4 rounded-2xl bg-saudi-green/5 border border-saudi-green/15 space-y-2">
                  <div className="flex items-center gap-2 text-saudi-green">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-xs font-bold">الموظف الوطني المستلم</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-saudi-dark">{selectedPlan.receivingEmployee.name}</p>
                    <p className="text-[11px] text-gray-500">{selectedPlan.receivingEmployee.role}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{selectedPlan.receivingEmployee.department}</p>
                  </div>
                </div>

                {/* 2: Sessions Counter */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold">الجلسات المتبقية والمنفذة</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-amber-700">{selectedPlan.remainingSessions}</span>
                      <span className="text-xs text-gray-500">جلسات متبقية</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1">
                      نُفّذ {selectedPlan.completedSessions} من أصل {selectedPlan.totalPlannedSessions} جلسات عملية
                    </p>
                  </div>
                </div>

                {/* 3: Completion Rate */}
                <div className="p-4 rounded-2xl bg-saudi-dark text-white space-y-2">
                  <div className="flex items-center gap-2 text-saudi-gold">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-bold">نسبة إنجاز التسليم</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-saudi-gold">{selectedPlan.completionRate}%</span>
                      <span className="text-[10px] text-gray-300">جاهزية تشغيل مستقل</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {selectedPlan.tasks.filter(t => t.completed).length} من {selectedPlan.tasks.length} مهام معتمدة
                    </p>
                  </div>
                </div>
              </div>

              {/* Knowledge Scope Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-saudi-dark flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-saudi-green" />
                    المعارف والوثائق الحرجة المطلوب نقلها وتوثيقها
                  </h3>
                  <span className="text-xs font-bold text-gray-400">
                    {selectedPlan.knowledgeScope.completedAssetsCount} من {selectedPlan.knowledgeScope.requiredAssetsCount} أصول مكتملة
                  </span>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100 leading-relaxed">
                  {selectedPlan.knowledgeScope.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPlan.knowledgeScope.criticalAreas.map((area, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-gray-200/80 flex items-start gap-2.5 text-xs text-gray-800">
                      <span className="w-5 h-5 rounded-full bg-saudi-green/10 text-saudi-green font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-semibold leading-relaxed">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist & Verification Tasks */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-saudi-dark flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-saudi-green" />
                      قائمة مهام التحقق العملي ومحطات الاستلام (Checklist)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      انقر على علامة الصح لتأكيد إتمام المهمة وتحديث نسبة الإنجاز اللحظية
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {selectedPlan.tasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={cn(
                        "p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 text-right",
                        task.completed 
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                          : "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5",
                          task.completed 
                            ? "bg-saudi-green text-white shadow-xs" 
                            : "border-2 border-gray-300 hover:border-saudi-green"
                        )}>
                          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <div>
                          <p className={cn(
                            "text-xs font-bold leading-relaxed",
                            task.completed && "line-through opacity-80"
                          )}>
                            {task.title}
                          </p>
                          {task.notes && (
                            <p className="text-[11px] text-gray-500 mt-1 font-medium">
                              ملاحظات: {task.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {task.category}
                        </span>
                        {task.completionDate && (
                          <span className="text-[9px] text-emerald-700 font-bold">
                            أُنجزت: {task.completionDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sessions Log Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-saudi-dark flex items-center gap-2">
                    <Layers className="w-4 h-4 text-saudi-gold" />
                    سجل جلسات التوأمة والتسليم المنفذة ({selectedPlan.sessionsLog.length})
                  </h3>
                  <button
                    onClick={() => setIsNewSessionModalOpen(true)}
                    className="text-xs font-bold text-saudi-green hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    إضافة جلسة جديدة
                  </button>
                </div>

                {selectedPlan.sessionsLog.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-xl">
                    لم يتم تسجيل جلسات منفذة بعد لهذه الخطة، ابدأ بتسجيل أول جلسة.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedPlan.sessionsLog.map(session => (
                      <div key={session.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 text-right space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-saudi-dark">
                            الجلسة #{session.sessionNumber}: {session.topic}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            تقييم المهمة: {session.taskEvaluationScore}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium">
                          المهمة العملية المنجزة: {session.practicalTaskAssigned}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-gray-500 pt-1 border-t border-gray-200/50">
                          <p><strong className="text-saudi-dark">إفادة الموظف:</strong> {session.traineeFeedback}</p>
                          <p><strong className="text-saudi-dark">تقييم الخبير:</strong> {session.expertFeedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100">
              اختر خطة تسليم لعرض التفاصيل
            </div>
          )}
        </div>
      </div>

      {/* Handover Official Certificate / Report Modal */}
      <AnimatePresence>
        {isCertificateModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCertificateModalOpen(false)}
              className="fixed inset-0 bg-saudi-dark/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl border border-gray-200 z-50 overflow-hidden flex flex-col relative text-right p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Document Header */}
              <div className="flex items-center justify-between border-b-2 border-saudi-dark pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl saudi-gradient flex items-center justify-center text-white font-black text-xl shadow-md">
                    م
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-saudi-dark tracking-tight">
                      منصة مورد | المملكة العربية السعودية
                    </h2>
                    <p className="text-xs text-gray-500">
                      محضر استلام وتسليم العهدة المعرفية والفنية الرسمية
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs font-mono font-bold text-gray-600 block">رقم الوثيقة: #HND-2026-09</span>
                  <span className="text-[10px] text-gray-400">تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</span>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-saudi-green/10 border border-saudi-green/30 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-saudi-dark">
                    حالة التسليم: {selectedPlan.handoverCertificateStatus} (نسبة الإنجاز {selectedPlan.completionRate}%)
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    مشروع: {selectedPlan.project} • المتبقي على مغادرة الخبير: {selectedPlan.daysRemaining} يوماً
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-saudi-green text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              {/* Party Information */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <p className="font-bold text-gray-400 text-[10px]">الطرف الأول (الخبير المورّد للمعرفة):</p>
                  <p className="font-extrabold text-saudi-dark text-sm">{selectedPlan.expertName}</p>
                  <p className="text-gray-600">{selectedPlan.expertRole}</p>
                  <p className="text-gray-500 text-[10px]">{selectedPlan.expertTitle}</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <p className="font-bold text-gray-400 text-[10px]">الطرف الثاني (الموظف الوطني المستلم):</p>
                  <p className="font-extrabold text-saudi-dark text-sm">{selectedPlan.receivingEmployee.name}</p>
                  <p className="text-gray-600">{selectedPlan.receivingEmployee.role}</p>
                  <p className="text-gray-500 text-[10px]">{selectedPlan.receivingEmployee.department}</p>
                </div>
              </div>

              {/* Tasks Summary in Table */}
              <div className="space-y-2">
                <h5 className="font-extrabold text-xs text-saudi-dark">جدول مهام التحقق ونقل الأصول:</h5>
                <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-right">
                    <thead className="bg-gray-100 text-gray-700 text-[11px] font-bold">
                      <tr>
                        <th className="p-2.5">المهمة المعرفية</th>
                        <th className="p-2.5">التصنيف</th>
                        <th className="p-2.5">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedPlan.tasks.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50">
                          <td className="p-2.5 font-medium">{t.title}</td>
                          <td className="p-2.5 text-gray-500 text-[10px]">{t.category}</td>
                          <td className="p-2.5 font-bold">
                            {t.completed ? (
                              <span className="text-emerald-700">✓ مكتملة وموثقة</span>
                            ) : (
                              <span className="text-amber-600">قيد الإجراء</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures Area */}
              <div className="pt-6 border-t border-gray-200 grid grid-cols-3 gap-6 text-center text-xs">
                <div className="space-y-4">
                  <p className="font-bold text-gray-500">توقيع الخبير المستشار</p>
                  <div className="h-12 border-b border-dashed border-gray-300 flex items-center justify-center font-serif italic text-gray-400">
                    {selectedPlan.expertName}
                  </div>
                  <p className="text-[10px] text-gray-400">تاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
                </div>

                <div className="space-y-4">
                  <p className="font-bold text-gray-500">توقيع الموظف المستلم</p>
                  <div className="h-12 border-b border-dashed border-gray-300 flex items-center justify-center font-serif italic text-gray-400">
                    {selectedPlan.receivingEmployee.name}
                  </div>
                  <p className="text-[10px] text-gray-400">تاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
                </div>

                <div className="space-y-4">
                  <p className="font-bold text-gray-500">ختم مدير إدارة المعرفة</p>
                  <div className="h-12 border-b border-dashed border-gray-300 flex items-center justify-center">
                    <span className="w-10 h-10 rounded-full border-2 border-saudi-green/40 text-saudi-green font-bold flex items-center justify-center text-[10px]">
                      معتمد
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400">إدارة رأس المال الفكري</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsCertificateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  إغلاق النافذة
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 rounded-xl bg-saudi-dark text-saudi-gold hover:bg-saudi-dark/90 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    طباعة المحضر الرسمي (PDF)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Record New Session Modal */}
      <AnimatePresence>
        {isNewSessionModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewSessionModalOpen(false)}
              className="fixed inset-0 bg-saudi-dark/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-gray-200 z-50 overflow-hidden flex flex-col relative text-right p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-saudi-gold/20 text-saudi-dark flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5 text-saudi-gold" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-saudi-dark">
                      تسجيل جلسة تسليم وتوأمة جديدة
                    </h3>
                    <p className="text-xs text-gray-400">
                      مع الخبير: {selectedPlan?.expertName} • الموظف: {selectedPlan?.receivingEmployee.name}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">موضوع الجلسة التخصصي:</label>
                  <input
                    type="text"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    placeholder="مثال: فحص صمامات الأمان وإجراء محاكاة ضغط الطوارئ الميدانية"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-saudi-green/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">ساعات الجلسة:</label>
                    <input
                      type="text"
                      value={sessionHours}
                      onChange={(e) => setSessionHours(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-saudi-green/20"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">تقييم المهمة العملية (0 - 100):</label>
                    <input
                      type="number"
                      value={sessionScore}
                      onChange={(e) => setSessionScore(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-saudi-green/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">المهمة العملية التي نُفذت بشكل مستقل:</label>
                  <textarea
                    rows={2}
                    value={sessionTask}
                    onChange={(e) => setSessionTask(e.target.value)}
                    placeholder="ما الذي قام الموظف بتطبيقه عملياً دون مساعدة الخبير؟"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-saudi-green/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">ملاحظات وتقييم الخبير لجاهزية الموظف:</label>
                  <textarea
                    rows={2}
                    value={sessionExpertNote}
                    onChange={(e) => setSessionExpertNote(e.target.value)}
                    placeholder="أثبت الموظف استيعابه الكامل لمعادلات الضغط..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-saudi-green/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddSession}
                  className="px-5 py-2 rounded-xl bg-saudi-green hover:bg-saudi-green/90 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  حفظ واحتساب الجلسة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
