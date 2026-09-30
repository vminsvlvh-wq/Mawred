import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Target, 
  BookOpen, 
  Award, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  INITIAL_EMPLOYEE_SKILLS_DATA, 
  EmployeeSkillProfile, 
  SkillItem 
} from '../data/skillsMatrixData';

interface SkillsMatrixProps {
  selectedProject?: string;
  onOpenAsset?: (assetId: string) => void;
  onStartTwinningSession?: (expertName: string) => void;
}

export default function SkillsMatrix({
  selectedProject,
  onOpenAsset,
  onStartTwinningSession
}: SkillsMatrixProps) {
  const [profiles, setProfiles] = useState<EmployeeSkillProfile[]>(INITIAL_EMPLOYEE_SKILLS_DATA);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(INITIAL_EMPLOYEE_SKILLS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Evaluation Modal
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [evaluatingSkill, setEvaluatingSkill] = useState<SkillItem | null>(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskScore, setTaskScore] = useState('95');
  const [taskFeedback, setTaskFeedback] = useState('');
  const [evalSuccessNotice, setEvalSuccessNotice] = useState<string | null>(null);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];

  // Filter skills
  const filteredSkills = selectedProfile.skills.filter(sk => {
    const matchesCategory = categoryFilter === 'all' || sk.category === categoryFilter;
    const matchesSearch = sk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sk.linkedExpert.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenEvaluation = (skill: SkillItem) => {
    setEvaluatingSkill(skill);
    setTaskDescription(`تنفيذ مهمة عملية ميدانية في: ${skill.name}`);
    setTaskScore('95');
    setTaskFeedback('أظهر الموظف كفاءة تشغيلية ممتازة ونسبة استقلالية بلغت 100%.');
    setIsEvaluationModalOpen(true);
  };

  const handleSaveEvaluation = () => {
    if (!evaluatingSkill) return;
    const scoreNum = parseInt(taskScore) || 90;

    setProfiles(prev => prev.map(p => {
      if (p.id !== selectedProfileId) return p;
      const updatedSkills = p.skills.map(sk => {
        if (sk.id === evaluatingSkill.id) {
          const newCurrentLevel = scoreNum >= 90 ? Math.min(5, sk.currentLevel + 1) : sk.currentLevel;
          const newGap = Math.max(0, sk.targetLevel - newCurrentLevel);
          return {
            ...sk,
            currentLevel: newCurrentLevel,
            gap: newGap,
            learningPlan: {
              ...sk.learningPlan,
              completedPracticalTasks: sk.learningPlan.completedPracticalTasks + 1,
              completionPercentage: Math.min(100, sk.learningPlan.completionPercentage + 15),
              lastEvaluationScore: scoreNum,
              currentMilestone: scoreNum >= 90 ? 'تم اجتياز المهمة بنجاح وترقية مستوى الإتقان' : sk.learningPlan.currentMilestone
            }
          };
        }
        return sk;
      });

      return {
        ...p,
        overallSkillReadiness: Math.min(100, p.overallSkillReadiness + 5),
        skills: updatedSkills
      };
    }));

    setIsEvaluationModalOpen(false);
    setEvalSuccessNotice(`تم بنجاح تقييم المهمة العملية للموظف "${selectedProfile.employeeName}" واعتماد انتقال المهارة.`);
    setTimeout(() => setEvalSuccessNotice(null), 3500);
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-saudi-dark via-[#082a17] to-saudi-dark p-8 text-white shadow-xl border border-saudi-gold/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saudi-gold/20 text-saudi-gold border border-saudi-gold/30 text-xs font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>منظومة قياس انتقال الخبرة وتتبع المهارات الوطنية</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              خريطة مهارات الموظفين ومسارات التعلم الميدانية
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              توضيح المهارات الحالية والمطلوبة لكل دور وظيفي وطني، ورصد الفجوة المهارية مع ربطها المباشر بالخبير المرجعي، المحتوى المعرفي المعتمد في المنصة، وخطة التعلم والمهام العملية المنفذة.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm text-center min-w-[200px]">
              <p className="text-gray-400 text-xs font-medium">جاهزية الكوادر الميدانية</p>
              <p className="text-3xl font-black text-saudi-gold mt-1">
                {selectedProfile.overallSkillReadiness}%
              </p>
              <span className="text-[10px] text-emerald-400 font-bold">قياس فعلي مبني على مهام عملية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notice */}
      <AnimatePresence>
        {evalSuccessNotice && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-600 text-white p-3.5 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{evalSuccessNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee Selector Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {profiles.map(p => {
          const isSelected = p.id === selectedProfileId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={cn(
                "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 shrink-0 text-right",
                isSelected
                  ? "bg-saudi-dark text-white border-saudi-gold shadow-md ring-2 ring-saudi-gold/20"
                  : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0",
                isSelected ? "bg-saudi-gold text-saudi-dark" : "bg-saudi-green/10 text-saudi-green"
              )}>
                {p.avatarInitials}
              </div>
              <div>
                <p className="font-extrabold text-xs">{p.employeeName}</p>
                <p className={cn("text-[10px]", isSelected ? "text-gray-300" : "text-gray-500")}>
                  {p.role} • {p.project}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في المهارات أو الخبراء..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pr-9 pl-4 text-xs font-medium focus:ring-2 focus:ring-saudi-green/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs font-bold">
          {['all', 'فنية تخصصية', 'تشغيلية وهندسية', 'رقمية وأتمتة', 'حوكمة وسلامة'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                categoryFilter === cat ? "bg-saudi-green text-white shadow-xs" : "text-gray-600 hover:text-saudi-dark"
              )}
            >
              {cat === 'all' ? 'جميع التصنيفات' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Matrix Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-saudi-dark flex items-center gap-2">
            <Users className="w-4 h-4 text-saudi-green" />
            مهارات {selectedProfile.employeeName} ({filteredSkills.length} مهارات)
          </h2>
          <span className="text-xs text-gray-500">
            {selectedProfile.department}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSkills.map(skill => {
            const isCritical = skill.priority === 'حرجة وعاجلة';

            return (
              <div
                key={skill.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 shadow-sm transition-all text-right space-y-5"
              >
                {/* Header: Skill Name & Priority */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {skill.category}
                    </span>
                    <h3 className="font-extrabold text-sm text-saudi-dark leading-snug">
                      {skill.name}
                    </h3>
                  </div>

                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0",
                    isCritical ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"
                  )}>
                    {skill.priority}
                  </span>
                </div>

                {/* Level Comparison: Current vs Target */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700">مستوى الإتقان الحالي مقابل المطلوب:</span>
                    <span className={cn(
                      "font-black text-xs px-2 py-0.5 rounded-md",
                      skill.gap > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    )}>
                      {skill.gap > 0 ? `الفجوة: ${skill.gap} مستويات` : 'متقنة بالكامل ✓'}
                    </span>
                  </div>

                  {/* 5-step Level Visualization */}
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(lvl => {
                      const isCurrent = lvl <= skill.currentLevel;
                      const isTarget = lvl <= skill.targetLevel;

                      return (
                        <div key={lvl} className="space-y-1 text-center">
                          <div className={cn(
                            "h-3 rounded-full transition-all",
                            isCurrent 
                              ? "bg-saudi-green" 
                              : isTarget 
                              ? "bg-amber-300 border border-dashed border-amber-500" 
                              : "bg-gray-200"
                          )} />
                          <span className="text-[9px] font-bold text-gray-400">
                            مستوى {lvl}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>المستوى الحالي: <strong className="text-saudi-green">{skill.currentLevel} من 5</strong></span>
                    <span>المستوى المستهدف: <strong className="text-saudi-dark">{skill.targetLevel} من 5</strong></span>
                  </div>
                </div>

                {/* 3 Linked Connections: Expert / Asset / Learning Plan */}
                <div className="space-y-2.5 text-xs">
                  {/* Linked Expert */}
                  <div className="p-3 rounded-xl bg-saudi-green/5 border border-saudi-green/15 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-saudi-green text-white font-bold text-xs flex items-center justify-center">
                        {skill.linkedExpert.avatarInitials}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-medium">الخبير المرجعي المعتمد:</p>
                        <p className="font-extrabold text-saudi-dark text-xs">{skill.linkedExpert.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-saudi-green font-bold">
                      {skill.linkedExpert.sessionsCompleted} جلسات توأمة
                    </span>
                  </div>

                  {/* Linked Knowledge Asset */}
                  <div className="p-3 rounded-xl bg-saudi-gold/10 border border-saudi-gold/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-saudi-gold shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium">الأصل المعرفي المعتمد في المنصة:</p>
                        <p className="font-bold text-saudi-dark text-xs truncate max-w-[200px]">{skill.linkedAsset.title}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saudi-dark text-saudi-gold">
                      {skill.linkedAsset.project}
                    </span>
                  </div>

                  {/* Learning Plan Milestone */}
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-gray-600">المرحلة التطبيقية الحالية:</span>
                      <span className="font-black text-saudi-green">إنجاز {skill.learningPlan.completionPercentage}%</span>
                    </div>
                    <p className="text-[11px] text-gray-800 font-medium leading-relaxed">
                      {skill.learningPlan.currentMilestone}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                      <span>مهام عملية منفذة: {skill.learningPlan.completedPracticalTasks} من أصل {skill.learningPlan.practicalTasksCount}</span>
                      {skill.learningPlan.lastEvaluationScore && (
                        <span className="text-emerald-700 font-bold">آخر تقييم: {skill.learningPlan.lastEvaluationScore}/100</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Practical Mission Evaluation Trigger */}
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenEvaluation(skill)}
                    className="w-full py-2.5 rounded-xl bg-saudi-dark hover:bg-saudi-dark/90 text-saudi-gold font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    تقييم أداء مهمة عملية جديدة واحتساب المهارة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Mission Evaluation Modal */}
      <AnimatePresence>
        {isEvaluationModalOpen && evaluatingSkill && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEvaluationModalOpen(false)}
              className="fixed inset-0 bg-saudi-dark/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-gray-100 z-50 overflow-hidden flex flex-col relative text-right p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-black text-base text-saudi-dark">
                    تقييم أداء مهمة عملية ميدانية
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    للموظف: {selectedProfile.employeeName} • المهارة: {evaluatingSkill.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">وصف المهمة العملية المنفذة بدون مساعدة:</label>
                  <input
                    type="text"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-saudi-green/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">درجة تقييم الخبير (0 - 100):</label>
                  <input
                    type="number"
                    value={taskScore}
                    onChange={(e) => setTaskScore(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-saudi-green/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">تقرير الخبير عن استقلالية الموظف:</label>
                  <textarea
                    rows={3}
                    value={taskFeedback}
                    onChange={(e) => setTaskFeedback(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-saudi-green/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveEvaluation}
                  className="px-5 py-2 rounded-xl bg-saudi-green hover:bg-saudi-green/90 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  اعتماد التقييم وترقية المهارة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
