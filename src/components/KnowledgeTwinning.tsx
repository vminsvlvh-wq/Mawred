import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  ChevronDown,
  UserPlus,
  Target,
  ArrowRight,
  Loader2,
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
  BookOpen,
  MapPin,
  Check,
  Zap,
  Info,
  Gauge,
  Clock,
  Activity,
  FileText,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  INITIAL_EXPERTS, 
  INITIAL_NOVICES, 
  NATIONAL_PROJECTS_LIST, 
  ExpertProfile, 
  NoviceCadre, 
  LinkedProject,
  TwinningReadinessLevel,
  getExpertTwinningReadiness,
  computeMatchScore 
} from '../data/expertsData';
import ExpertProjectsModal from './ExpertProjectsModal';
import ExpertProjectsPdfModal from './ExpertProjectsPdfModal';
import TwinningReadinessBadge from './TwinningReadinessBadge';

export type ReadinessFilterOption = 'ALL' | 'متاحون بالكامل' | 'مشغولون جزئياً' | 'متاحون قريباً';

interface KnowledgeTwinningProps {
  selectedProject?: string;
}

export default function KnowledgeTwinning({ selectedProject }: KnowledgeTwinningProps) {
  // Data States
  const [expertsList, setExpertsList] = useState<ExpertProfile[]>(INITIAL_EXPERTS);
  const [novicesList] = useState<NoviceCadre[]>(INITIAL_NOVICES);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>(
    selectedProject && selectedProject !== 'جميع المشاريع' ? selectedProject : 'جميع المشاريع'
  );
  const [selectedReadinessFilter, setSelectedReadinessFilter] = useState<ReadinessFilterOption>('ALL');

  // PDF Export Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Selection States for Smart Twinning
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(INITIAL_EXPERTS[0]);
  const [selectedNovice, setSelectedNovice] = useState<NoviceCadre | null>(INITIAL_NOVICES[0]);
  
  // Interactive UI States
  const [expandedProjectsExpertId, setExpandedProjectsExpertId] = useState<Record<string, boolean>>({
    '1': true // Expand first expert by default to showcase linked projects immediately
  });
  const [modalExpert, setModalExpert] = useState<ExpertProfile | null>(null);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [twinningPlanResult, setTwinningPlanResult] = useState<{
    score: number;
    planTitle: string;
    objectives: string[];
    timeline: string;
    fieldLocation: string;
    ipTransferIndicator: string;
  } | null>(null);
  const [confirmedTwinningNotice, setConfirmedTwinningNotice] = useState<string | null>(null);

  // Toggle projects list expansion inside card
  const toggleCardProjects = (expertId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedProjectsExpertId(prev => ({
      ...prev,
      [expertId]: !prev[expertId]
    }));
  };

  // Open Full Projects Modal
  const handleOpenProjectsModal = (expert: ExpertProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setModalExpert(expert);
    setIsProjectsModalOpen(true);
  };

  // Filtered Experts List
  const filteredExperts = useMemo(() => {
    return expertsList.filter(expert => {
      // Project filter matching
      const matchesProject = selectedProjectFilter === 'جميع المشاريع' || 
        expert.currentProjects.some(p => p.projectName.toLowerCase() === selectedProjectFilter.toLowerCase());

      // Twinning Readiness filter matching (متاحون بالكامل / مشغولون جزئياً / متاحون قريباً)
      const readiness = getExpertTwinningReadiness(expert);
      const matchesReadiness = selectedReadinessFilter === 'ALL' || 
        readiness.pluralStatus === selectedReadinessFilter;

      // Search query matching
      const matchesSearch = !searchQuery.trim() || 
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        readiness.statusText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        readiness.availabilityStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        expert.currentProjects.some(p => 
          p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );

      return matchesProject && matchesReadiness && matchesSearch;
    });
  }, [expertsList, selectedProjectFilter, selectedReadinessFilter, searchQuery]);

  // Project expert counts
  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = { 'جميع المشاريع': expertsList.length };
    NATIONAL_PROJECTS_LIST.forEach(proj => {
      if (proj !== 'جميع المشاريع') {
        counts[proj] = expertsList.filter(e => e.currentProjects.some(p => p.projectName === proj)).length;
      }
    });
    return counts;
  }, [expertsList]);

  // Twinning readiness expert counts
  const readinessCounts = useMemo(() => {
    const counts = { 
      ALL: expertsList.length, 
      'متاحون بالكامل': 0, 
      'مشغولون جزئياً': 0, 
      'متاحون قريباً': 0 
    };
    expertsList.forEach(e => {
      const r = getExpertTwinningReadiness(e);
      if (r.availabilityStatus === 'متاح بالكامل' || r.level === 'high') {
        counts['متاحون بالكامل']++;
      } else if (r.availabilityStatus === 'مشغول جزئياً' || r.level === 'medium') {
        counts['مشغولون جزئياً']++;
      } else {
        counts['متاحون قريباً']++;
      }
    });
    return counts;
  }, [expertsList]);

  // Match Calculation between currently selected Expert and Novice
  const currentMatchAnalysis = useMemo(() => {
    if (!selectedExpert || !selectedNovice) return null;
    return computeMatchScore(selectedExpert, selectedNovice);
  }, [selectedExpert, selectedNovice]);

  // Execute Gap Analysis and Twinning Execution
  const handleRunTwinningMatch = () => {
    if (!selectedExpert || !selectedNovice) return;
    setIsMatching(true);
    setTwinningPlanResult(null);

    setTimeout(() => {
      setIsMatching(false);
      const matchedProject = selectedExpert.currentProjects.find(
        p => p.projectName.toLowerCase() === selectedNovice.project.toLowerCase()
      );
      
      const projectName = matchedProject ? matchedProject.projectName : selectedNovice.project;
      const expertReadiness = getExpertTwinningReadiness(selectedExpert);
      
      setTwinningPlanResult({
        score: currentMatchAnalysis?.score || 92,
        planTitle: `برنامج التوأمة الميدانية ونقل المعرفة في مشروع "${projectName}"`,
        objectives: [
          `الملازمة الميدانية للخبير ${selectedExpert.name} (${expertReadiness.statusText} - متاح ${expertReadiness.availableHoursPerWeek} ساعة استشارية أسبوعياً)`,
          `سد الفجوة في "${selectedNovice.targetSkill}" من خلال التطبيق العملي على الأصول المعرفية الحية`,
          `المشاركة في مراجعة وتوثيق أصل معرفي جديد معتمد لدى ${selectedNovice.department}`
        ],
        timeline: `برنامج مكثف لمدة 8 أسابيع (${expertReadiness.availableHoursPerWeek * 2} ساعة تطبيقية)`,
        fieldLocation: `مقر إدارة المشروع الميداني - قطاع ${selectedNovice.department}`,
        ipTransferIndicator: `نقل ملكية فكرية بنسبة 100% (جاهزية التوأمة: ${expertReadiness.statusText} %${expertReadiness.score} بناءً على ${expertReadiness.projectsCount} مشاريع)`
      });
    }, 1200);
  };

  const handleConfirmTwinning = () => {
    if (!selectedExpert || !selectedNovice) return;
    setConfirmedTwinningNotice(`تم بنجاح اعتماد خطة التوأمة المعرفية بين ${selectedExpert.name} و ${selectedNovice.name} في مشروع "${selectedNovice.project}". تم إرسال جدول الجلسات الميدانية للطرفين.`);
    setTimeout(() => {
      setConfirmedTwinningNotice(null);
    }, 6000);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-saudi-dark via-emerald-950 to-saudi-green rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-saudi-gold/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-saudi-gold/20 text-saudi-gold border border-saudi-gold/30">
                منظومة التوأمة المعرفية • رؤية 2030
              </span>
              <span className="text-[10px] font-mono text-emerald-200 bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                MEGAPROJECT EXPERTISE MAPPING
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              ربط الكوادر الوطنية بالمشاريع الحالية للخبراء
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              استكشف المشاريع الوطنية الكبرى التي يعمل بها كل خبير حالياً، وطابق المهارات المطلوبة بمواقع المشاريع الميدانية لضمان انتقال حقيقي ومستدام للخبرات الضمنية.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button 
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 bg-saudi-gold hover:bg-saudi-gold/90 text-saudi-dark rounded-2xl text-xs font-black transition-all border border-saudi-gold/40 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 text-saudi-dark" />
              <span>تصدير المشاريع والجاهزية (PDF)</span>
            </button>
            <button 
              onClick={() => {
                // Preselect first expert with Trojena/The Line
                setSelectedProjectFilter('ذا لاين');
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all border border-white/15 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Target className="w-4 h-4 text-saudi-gold" />
              <span>مطابقة سريعة حسب المشاريع</span>
            </button>
            <div className="px-4 py-2.5 bg-saudi-gold/20 border border-saudi-gold/40 text-saudi-gold rounded-2xl text-xs font-black flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{expertsList.reduce((acc, e) => acc + e.currentProjects.length, 0)} مشاركة ميدانية نشطة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Filter Chips Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-saudi-green" />
            <span className="text-xs font-bold text-saudi-dark">
              تصفية الخبراء حسب المشروع الوطني الحالي المرتبط بهم:
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            اختر مشروعاً لعرض الخبراء المتواجدين فيه ميدانياً ومطابقة الكوادر السعودية العاملة هناك
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {NATIONAL_PROJECTS_LIST.map((proj) => {
            const count = projectCounts[proj] || 0;
            const isSelected = selectedProjectFilter === proj;
            return (
              <button
                key={proj}
                onClick={() => setSelectedProjectFilter(proj)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0",
                  isSelected
                    ? "bg-saudi-green text-white border-saudi-green shadow-md shadow-saudi-green/10"
                    : "bg-gray-50/70 hover:bg-gray-100 text-gray-600 border-gray-200/80 hover:border-gray-300"
                )}
              >
                <span>{proj}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
                  isSelected ? "bg-white/20 text-white" : "bg-gray-200/70 text-gray-600"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Twinning Readiness Filter Tool */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-150 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-saudi-green" />
            <span className="text-xs font-black text-saudi-dark">
              أداة فلترة الخبراء حسب حالة الجاهزية والتوفر:
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            اختر حالة الجاهزية لعرض الخبراء (متاحون بالكامل، مشغولون جزئياً، أو متاحون قريباً) استناداً لأعباء المشاريع
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          <button
            onClick={() => setSelectedReadinessFilter('ALL')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0",
              selectedReadinessFilter === 'ALL'
                ? "bg-saudi-dark text-white border-saudi-dark shadow-xs"
                : "bg-gray-50/70 hover:bg-gray-100 text-gray-600 border-gray-200"
            )}
          >
            <span>كافة مستويات الجاهزية</span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
              selectedReadinessFilter === 'ALL' ? "bg-white/20 text-white" : "bg-gray-200/70 text-gray-600"
            )}>
              {readinessCounts.ALL}
            </span>
          </button>

          <button
            onClick={() => setSelectedReadinessFilter('متاحون بالكامل')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0",
              selectedReadinessFilter === 'متاحون بالكامل'
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10"
                : "bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 border-emerald-200"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>متاحون بالكامل</span>
            <span className="text-[10px] opacity-80 hidden sm:inline">(مشروع 1 • تفرغ 16 س/أسبوع)</span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
              selectedReadinessFilter === 'متاحون بالكامل' ? "bg-white/20 text-white" : "bg-emerald-200/70 text-emerald-800"
            )}>
              {readinessCounts['متاحون بالكامل']}
            </span>
          </button>

          <button
            onClick={() => setSelectedReadinessFilter('مشغولون جزئياً')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0",
              selectedReadinessFilter === 'مشغولون جزئياً'
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10"
                : "bg-blue-50/60 hover:bg-blue-100/70 text-blue-800 border-blue-200"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>مشغولون جزئياً</span>
            <span className="text-[10px] opacity-80 hidden sm:inline">(مشروعان • تفرغ 8 س/أسبوع)</span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
              selectedReadinessFilter === 'مشغولون جزئياً' ? "bg-white/20 text-white" : "bg-blue-200/70 text-blue-800"
            )}>
              {readinessCounts['مشغولون جزئياً']}
            </span>
          </button>

          <button
            onClick={() => setSelectedReadinessFilter('متاحون قريباً')}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0",
              selectedReadinessFilter === 'متاحون قريباً'
                ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/10"
                : "bg-amber-50/60 hover:bg-amber-100/70 text-amber-800 border-amber-200"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>متاحون قريباً</span>
            <span className="text-[10px] opacity-80 hidden sm:inline">(3+ مشاريع • جدولة مسبقة)</span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold",
              selectedReadinessFilter === 'متاحون قريباً' ? "bg-white/20 text-white" : "bg-amber-200/70 text-amber-800"
            )}>
              {readinessCounts['متاحون قريباً']}
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: Experts List & Smart Twinning Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Main Column: Experts with their Linked Projects (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Search, Filter Summary & PDF Export Toolbar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، المهارة، التخصص، أو اسم المشروع الوطني..." 
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pr-11 pl-4 text-xs focus:ring-2 focus:ring-saudi-green/20 focus:border-saudi-green outline-none shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  مسح
                </button>
              )}
            </div>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3.5 py-3 bg-white hover:bg-emerald-50 text-saudi-green border border-saudi-green/30 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
              title="تصدير قائمة المشاريع المرتبطة بالخبراء كملف PDF منظم مع مؤشرات الجاهزية"
            >
              <Download className="w-4 h-4 text-saudi-gold" />
              <span>تصدير ملف PDF</span>
            </button>

            <div className="text-xs font-bold text-gray-500 shrink-0 bg-gray-50 px-3 py-3 rounded-2xl border border-gray-200/70">
              المتاحون: <span className="text-saudi-green font-black">{filteredExperts.length}</span> خبير
            </div>
          </div>

          {/* Active Filter Notice */}
          {(selectedProjectFilter !== 'جميع المشاريع' || selectedReadinessFilter !== 'ALL') && (
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-xs text-emerald-900 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Building2 className="w-4 h-4 text-saudi-green shrink-0" />
                <span>
                  تصفية نشطة:
                  {selectedProjectFilter !== 'جميع المشاريع' && (
                    <strong className="mr-1">مشروع "{selectedProjectFilter}"</strong>
                  )}
                  {selectedProjectFilter !== 'جميع المشاريع' && selectedReadinessFilter !== 'ALL' && ' • '}
                  {selectedReadinessFilter !== 'ALL' && (
                    <strong className="mr-1">جاهزية "{selectedReadinessFilter}"</strong>
                  )}
                  <span className="text-emerald-700 font-medium"> ({filteredExperts.length} خبراء مطابقين)</span>
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedProjectFilter('جميع المشاريع');
                  setSelectedReadinessFilter('ALL');
                }}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer text-[11px]"
              >
                إلغاء كافة الفلاتر
              </button>
            </div>
          )}

          {/* Experts Cards List */}
          <div className="space-y-4">
            {filteredExperts.map((expert) => {
              const isSelectedForTwinning = selectedExpert?.id === expert.id;
              const isExpanded = !!expandedProjectsExpertId[expert.id];
              const projectCount = expert.currentProjects.length;

              // Check if expert is linked to the currently selected filter
              const isLinkedToFilteredProject = selectedProjectFilter !== 'جميع المشاريع' && 
                expert.currentProjects.some(p => p.projectName === selectedProjectFilter);

              return (
                <motion.div 
                  key={expert.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedExpert(expert)}
                  className={cn(
                    "bg-white rounded-3xl border transition-all cursor-pointer p-5 sm:p-6 space-y-4",
                    isSelectedForTwinning 
                      ? "border-saudi-green ring-4 ring-saudi-green/10 shadow-lg" 
                      : "border-gray-100 hover:border-gray-300 hover:shadow-md",
                    isLinkedToFilteredProject && "bg-gradient-to-r from-emerald-50/20 to-white"
                  )}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${expert.avatarColor} flex items-center justify-center text-white font-black text-xl shadow-md shrink-0 border border-white/30`}>
                        {expert.image}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-base text-saudi-dark hover:text-saudi-green transition-colors">
                            {expert.name}
                          </h3>

                          {/* مؤشر جاهزية التوأمة بجانب اسم كل خبير */}
                          <TwinningReadinessBadge 
                            readiness={getExpertTwinningReadiness(expert)} 
                            expertName={expert.name}
                          />

                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            {expert.availability}
                          </span>
                          {isLinkedToFilteredProject && (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-saudi-gold/20 text-saudi-dark font-black border border-saudi-gold/40 flex items-center gap-1">
                              <Star className="w-3 h-3 text-saudi-gold fill-saudi-gold" />
                              متواجد في {selectedProjectFilter}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 font-medium">{expert.title}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-saudi-green" />
                          <span>{expert.organization}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stats Pill */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                      <div className="flex items-center gap-1 text-saudi-gold">
                        <Star className="w-4 h-4 fill-saudi-gold" />
                        <span className="text-sm font-black text-saudi-dark">{expert.rating}</span>
                        <span className="text-[11px] text-gray-400">({expert.sessions} جلسة)</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 font-mono">
                        {expert.experienceYears} سنة خبرة دولية
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {expert.skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* NEW FEATURE: LINKED CURRENT NATIONAL PROJECTS SECTION */}
                  <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-saudi-green" />
                        <span className="text-xs font-black text-saudi-dark">
                          المشاريع الوطنية الحالية المرتبطة بالخبير ({projectCount})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleCardProjects(expert.id, e)}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 text-saudi-dark rounded-lg text-[11px] font-bold flex items-center gap-1 border border-gray-200 transition-all cursor-pointer"
                        >
                          <span>{isExpanded ? 'إخفاء التفاصيل' : `عرض المشاريع والمهام (${projectCount})`}</span>
                          {isExpanded ? <ChevronDown className="w-3 h-3 rotate-180 transition-transform" /> : <ChevronDown className="w-3 h-3 transition-transform" />}
                        </button>
                      </div>
                    </div>

                    {/* Quick Badges of Linked Projects */}
                    <div className="flex flex-wrap gap-2">
                      {expert.currentProjects.map((p) => {
                        const isMatch = selectedProjectFilter === p.projectName;
                        return (
                          <div 
                            key={p.id}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-2 border transition-all",
                              isMatch
                                ? "bg-saudi-green text-white border-saudi-green shadow-xs"
                                : "bg-white text-gray-700 border-gray-200 hover:border-saudi-green/40"
                            )}
                          >
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              isMatch ? "bg-saudi-gold ring-2 ring-white" : "bg-saudi-green"
                            )} />
                            <span>{p.projectName}</span>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.2 rounded-md font-mono",
                              isMatch ? "bg-white/20 text-white" : "bg-emerald-50 text-saudi-green"
                            )}>
                              %{p.localizationRate}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Expandable Project Details View */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2 space-y-3 border-t border-gray-200/60 overflow-hidden"
                        >
                          {expert.currentProjects.map((project) => (
                            <div 
                              key={project.id}
                              className="p-3.5 rounded-xl bg-white border border-gray-200/70 space-y-2 text-xs hover:border-saudi-green/40 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-saudi-dark text-xs">{project.projectName}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saudi-green/10 text-saudi-green">
                                    {project.status}
                                  </span>
                                </div>
                                <span className="text-[10px] text-gray-500 font-bold">
                                  {project.allocatedCadresCount} كفاءات سعودية مرافقة
                                </span>
                              </div>

                              <p className="text-[11px] font-bold text-saudi-green">
                                الدور الميداني: {project.role}
                              </p>

                              <p className="text-[11px] text-gray-600 leading-relaxed bg-gray-50/70 p-2 rounded-lg">
                                {project.scope}
                              </p>

                              <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                                <span className="flex items-center gap-1 font-medium">
                                  <Building2 className="w-3 h-3 text-saudi-gold" />
                                  {project.partnerEntity}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span>نسبة التوطين:</span>
                                  <strong className="text-saudi-green font-mono">%{project.localizationRate}</strong>
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleOpenProjectsModal(expert, e)}
                        className="text-saudi-green hover:text-emerald-800 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-saudi-gold" />
                        <span>الملف الكامل والمشاريع الوطنية</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedExpert(expert)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        isSelectedForTwinning
                          ? "bg-saudi-green text-white shadow-xs"
                          : "bg-gray-100 hover:bg-saudi-green hover:text-white text-saudi-dark"
                      )}
                    >
                      {isSelectedForTwinning ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تم الاختيار للتوأمة</span>
                        </>
                      ) : (
                        <>
                          <Target className="w-3.5 h-3.5 text-saudi-gold" />
                          <span>تحديد الخبير للمطابقة</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {filteredExperts.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="font-bold text-saudi-dark">لا يوجد خبراء مطابقين للمشروع المحدد</h4>
                <p className="text-xs text-gray-400">
                  يرجى تجربة البحث باسم آخر أو اختيار "جميع المشاريع الوطنية" لاستعراض كافة الخبراء المعتمدين.
                </p>
                <button
                  onClick={() => {
                    setSelectedProjectFilter('جميع المشاريع');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-saudi-green text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  إعادة ضبط التصفية
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Smart Twinning & Project-Expert Matching Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-saudi-dark text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden border border-white/10 space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-saudi-green/20 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-saudi-gold/15 blur-2xl -ml-16 -mb-16 pointer-events-none" />

            {/* Panel Title */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-saudi-green flex items-center justify-center text-white shadow-lg">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">التوأمة الذكية بالمشاريع</h3>
                  <p className="text-[11px] text-gray-300">مطابقة الكوادر السعودية بالخبراء الميدانيين</p>
                </div>
              </div>

              {currentMatchAnalysis && (
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 block">توافق المشروع</span>
                  <span className={cn(
                    "text-lg font-black font-mono",
                    currentMatchAnalysis.isProjectDirectMatch ? "text-emerald-400" : "text-saudi-gold"
                  )}>
                    %{currentMatchAnalysis.score}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Matching Selector */}
            <div className="space-y-4 relative z-10">
              {/* Selected Expert Box */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-bold">الخبير العالمي المختار:</span>
                  {selectedExpert && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-saudi-gold/20 text-saudi-gold font-bold">
                      مرتبط بـ {selectedExpert.currentProjects.length} مشاريع
                    </span>
                  )}
                </div>

                {selectedExpert ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedExpert.avatarColor} text-white font-black flex items-center justify-center text-sm shadow-xs`}>
                        {selectedExpert.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm block truncate text-white">{selectedExpert.name}</span>
                          <TwinningReadinessBadge 
                            readiness={getExpertTwinningReadiness(selectedExpert)} 
                            expertName={selectedExpert.name}
                            compact={true}
                          />
                        </div>
                        <span className="text-[11px] text-gray-300 block truncate">{selectedExpert.role}</span>
                      </div>
                    </div>

                    {/* Expert's Current Projects Chips */}
                    <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-gray-400 font-medium">مشاريعه الحالية ({selectedExpert.currentProjects.length}):</span>
                      {selectedExpert.currentProjects.map(p => (
                        <span key={p.id} className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-emerald-300 font-bold border border-white/10">
                          {p.projectName}
                        </span>
                      ))}
                    </div>

                    {/* Readiness Details Callout */}
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-gray-200">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Gauge className="w-3.5 h-3.5 text-saudi-gold" />
                          <span>تفرغ التوأمة المتاح:</span>
                        </span>
                        <span className="font-mono font-black text-emerald-400">
                          {getExpertTwinningReadiness(selectedExpert).availableHoursPerWeek} ساعة/أسبوعياً
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-300">
                        {getExpertTwinningReadiness(selectedExpert).capacityDescription}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic py-2">انقر على أي خبير من القائمة لتحديده</p>
                )}
              </div>

              {/* Direction Indicator */}
              <div className="flex justify-center my-1">
                <div className="w-8 h-8 rounded-full bg-saudi-green flex items-center justify-center text-white shadow-md">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Target Novice Cadre Selector */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-bold">الكادر الوطني المستهدف (الموظف الجديد):</span>
                  {selectedNovice && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      مشروع: {selectedNovice.project}
                    </span>
                  )}
                </div>

                <select 
                  value={selectedNovice?.id || ''}
                  onChange={(e) => setSelectedNovice(novicesList.find(n => n.id === e.target.value) || null)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-xs text-white font-bold focus:ring-2 focus:ring-saudi-gold outline-none cursor-pointer"
                >
                  {novicesList.map(n => (
                    <option key={n.id} value={n.id} className="text-saudi-dark bg-white font-medium">
                      {n.name} — {n.project} ({n.department})
                    </option>
                  ))}
                </select>

                {selectedNovice && (
                  <div className="pt-2 text-[11px] text-gray-300 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-saudi-gold shrink-0" />
                      <span>المهارة المستهدفة: <strong>{selectedNovice.targetSkill}</strong></span>
                    </p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      {selectedNovice.goal}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* National Project Alignment Banner */}
            {currentMatchAnalysis && selectedExpert && selectedNovice && (
              <div className={cn(
                "p-3.5 rounded-2xl border text-xs space-y-2",
                currentMatchAnalysis.isProjectDirectMatch 
                  ? "bg-emerald-900/30 border-emerald-500/40 text-emerald-200" 
                  : "bg-saudi-gold/10 border-saudi-gold/30 text-amber-200"
              )}>
                <div className="flex items-center gap-2 font-black">
                  {currentMatchAnalysis.isProjectDirectMatch ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>تطابق مباشر في نفس المشروع الوطني ({selectedNovice.project})!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-saudi-gold shrink-0" />
                      <span>نقل خبرات عابرة للمشاريع الوطنية (Cross-Project Mentorship)</span>
                    </>
                  )}
                </div>

                <ul className="space-y-1 text-[11px] opacity-90 pr-2 list-disc list-inside">
                  {currentMatchAnalysis.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Button */}
            <button 
              disabled={!selectedExpert || !selectedNovice || isMatching}
              onClick={handleRunTwinningMatch}
              className="w-full py-3.5 bg-saudi-gold hover:bg-saudi-gold/90 text-saudi-dark rounded-2xl font-black text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-saudi-gold/20 cursor-pointer"
            >
              {isMatching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تحليل مطابقة المشروع والفجوات المهارية...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تحليل الفجوات وإطلاق التوأمة بالمشروع</span>
                </>
              )}
            </button>

            {/* Success Toast */}
            <AnimatePresence>
              {confirmedTwinningNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-saudi-gold shrink-0" />
                  <span>{confirmedTwinningNotice}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Generated Twinning Plan Result */}
          {twinningPlanResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-3xl border border-saudi-green/30 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-saudi-green" />
                  <div>
                    <h4 className="font-black text-saudi-dark text-xs sm:text-sm">
                      خطة التوأمة الميدانية المعتمدة
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono">
                      TWINNING-DOSSIER-PROJECT-ALIGNED
                    </span>
                  </div>
                </div>

                <span className="text-xs font-black text-saudi-green bg-saudi-green/10 px-2.5 py-1 rounded-lg">
                  مؤشر النجاح %{twinningPlanResult.score}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-black text-saudi-dark">{twinningPlanResult.planTitle}</p>
                <div className="space-y-1.5 pt-1">
                  {twinningPlanResult.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-saudi-green shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[10px] text-gray-500 block mb-0.5">الجدول الزمني:</span>
                  <span className="font-bold text-saudi-dark">{twinningPlanResult.timeline}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                  <span className="text-[10px] text-gray-500 block mb-0.5">مقر التطبيق الميداني:</span>
                  <span className="font-bold text-saudi-dark">{twinningPlanResult.fieldLocation}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmTwinning}
                className="w-full py-3 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>اعتماد خطة التوأمة وإصدار التكليف الميداني</span>
              </button>
            </motion.div>
          )}

          {/* Real-time National Twinning Statistics */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h4 className="font-black text-saudi-dark text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-saudi-green" />
                مؤشرات نقل وتوطين المعرفة بالمشاريع الكبرى
              </span>
              <span className="text-[10px] text-saudi-gold font-bold">تحديث فوري</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="text-gray-500">تغطية الكوادر السعودية في مشاريع نيوم وذا لاين</span>
                  <span className="font-black text-saudi-green">88%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-saudi-green rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="text-gray-500">معدل الاحتفاظ بالمعرفة الضمنية في البحر الأحمر وأمالا</span>
                  <span className="font-black text-saudi-gold">91%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[91%] h-full bg-saudi-gold rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="text-gray-500">جاهزية التوأمة الميدانية في أوكساجون والقدية</span>
                  <span className="font-black text-emerald-600">82%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-[82%] h-full bg-emerald-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>رضا الكوادر الوطنية المتدربة:</span>
              <span className="font-black text-saudi-dark flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-saudi-gold fill-saudi-gold" />
                4.92 من 5.0
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Comprehensive Expert & Projects Modal */}
      <ExpertProjectsModal
        expert={modalExpert}
        isOpen={isProjectsModalOpen}
        onClose={() => {
          setIsProjectsModalOpen(false);
          setModalExpert(null);
        }}
        onSelectForTwinning={(expert, project) => {
          setSelectedExpert(expert);
          if (project) {
            // If novice matches or adjust
            const noviceInSameProj = novicesList.find(n => n.project === project.projectName);
            if (noviceInSameProj) {
              setSelectedNovice(noviceInSameProj);
            }
          }
        }}
      />

      {/* Official PDF Export Modal for Linked Projects & Twinning Readiness */}
      <ExpertProjectsPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        filteredExperts={filteredExperts}
        allExperts={expertsList}
        currentProjectFilter={selectedProjectFilter}
        currentReadinessFilter={selectedReadinessFilter === 'ALL' ? 'كافة حالات الجاهزية' : selectedReadinessFilter}
      />
    </div>
  );
}
