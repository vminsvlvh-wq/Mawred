import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Users, 
  BarChart3, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  MessageSquare, 
  Lightbulb, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ChevronDown, 
  Clock,
  Building,
  Lock,
  Fingerprint,
  UserCheck,
  RefreshCw,
  Trash2,
  Plus,
  Check,
  FileCode,
  Wrench,
  Briefcase,
  Target,
  Link,
  Link2,
  Eye,
  BookOpen,
  Calendar,
  Layers,
  Tag
} from 'lucide-react';
import { cn } from './lib/utils';

// Components
import Dashboard from './components/Dashboard';
import KnowledgeExtraction from './components/KnowledgeExtraction';
import KnowledgeTwinning from './components/KnowledgeTwinning';
import Analytics from './components/Analytics';
import SaudiPartners from './components/SaudiPartners';
import SecurityPolicy from './components/SecurityPolicy';
import VoiceInputButton from './components/VoiceInputButton';
import LanguageToggle from './components/LanguageToggle';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// AI Services
import { polishQuickInsight, matchExpertForQuery } from './services/gemini';
import { 
  INITIAL_KNOWLEDGE_ASSETS, 
  KnowledgeClassification, 
  SUBCATEGORIES_BY_CLASSIFICATION 
} from './data/knowledgeAssets';

const BASELINE_ASSETS = INITIAL_KNOWLEDGE_ASSETS;

type Tab = 'dashboard' | 'extraction' | 'twinning' | 'analytics' | 'partners' | 'security';

function AppContent() {
  const { language, direction, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Administrative User State initialized from user's details
  const [adminUser, setAdminUser] = useState({
    name: "أمين قرناص",
    role: "Administrator",
    permissions: ["full_access", "edit", "manage_users"],
    email: "amin.q@mawred.gov.sa",
    avatar: "أق"
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  // Custom user list that the administrator can manage
  const [usersList, setUsersList] = useState([
    { name: "أمين قرناص", role: "Administrator", email: "amin.q@mawred.gov.sa", status: "نشط", permissions: ["full_access", "edit", "manage_users"] },
    { name: "م. أحمد القحطاني", role: "مدير المعرفة", email: "ahmed.q@mawred.gov.sa", status: "نشط", permissions: ["edit"] },
    { name: "أ. هدى الحربي", role: "محلل بيانات معرفية", email: "hoda.h@mawred.gov.sa", status: "نشط", permissions: ["read"] },
    { name: "د. يورغن شتراوس", role: "خبير طاقة خارجي", email: "juergen.s@mawred.gov.sa", status: "مؤقت", permissions: ["consultation"] }
  ]);

  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("محلل بيانات");
  const [newUserEmail, setNewUserEmail] = useState("");
  
  // Administrative audit log
  const [auditLogs, setAuditLogs] = useState([
    { id: "log-1", user: "أمين قرناص", action: "تسجيل الدخول للنظام الآمن كمسؤول عام", time: "اليوم، 09:12 ص" },
    { id: "log-2", user: "أمين قرناص", action: "عرض قاعدة بيانات الشركاء الوطنيين وتصدير الهيكل البرمجي", time: "اليوم، 09:20 ص" },
    { id: "log-3", user: "م. أحمد القحطاني", action: "توطين أصل معرفي جديد في قطاع الهيدروجين الأخضر", time: "اليوم، 08:30 ص" }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Project Switcher state
  const [selectedProject, setSelectedProject] = useState('نيوم');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  // Quick Actions drawer state
  const [isQuickDrawerOpen, setIsQuickDrawerOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'insight' | 'expert' | null>(null);
  
  // Log New Insight states
  const [roughInsight, setRoughInsight] = useState('');
  const [assetClassification, setAssetClassification] = useState<KnowledgeClassification>('فنية');
  const [subCategory, setSubCategory] = useState<string>('معدات');
  const [dueDate, setDueDate] = useState('');
  const [polishedInsight, setPolishedInsight] = useState<any | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);

  const handleClassificationChange = (newClass: KnowledgeClassification) => {
    setAssetClassification(newClass);
    const available = SUBCATEGORIES_BY_CLASSIFICATION[newClass] || [];
    if (!available.includes(subCategory)) {
      setSubCategory(available[0] || 'معدات');
    }
  };
  
  // Related Assets linking
  const [selectedRelatedAsset, setSelectedRelatedAsset] = useState<any | null>(null);
  const [linkedAssetIds, setLinkedAssetIds] = useState<string[]>([]);

  const relatedAssets = useMemo(() => {
    if (!polishedInsight || !polishedInsight.tags) return [];
    
    let extraList: any[] = [];
    try {
      const saved = localStorage.getItem('mawred_extra_assets');
      if (saved) {
        extraList = JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    
    const allAssets = [...BASELINE_ASSETS, ...extraList];
    const targetTags = polishedInsight.tags.map((t: string) => t.trim().replace(/^#/, '').toLowerCase());
    
    const matches = allAssets
      .map(asset => {
        const matchingTags = (asset.tags || []).filter((t: string) => 
          targetTags.includes(t.trim().replace(/^#/, '').toLowerCase())
        );
        
        let score = matchingTags.length * 10;
        
        if (asset.category && polishedInsight.category && 
            (asset.category.toLowerCase().includes(polishedInsight.category.toLowerCase()) || 
             polishedInsight.category.toLowerCase().includes(asset.category.toLowerCase()))) {
          score += 5;
        }
        
        return {
          ...asset,
          score,
          matchingTags
        };
      })
      .filter(asset => asset.score > 0)
      .sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
      return BASELINE_ASSETS.slice(0, 3).map(asset => ({
        ...asset,
        score: 0,
        matchingTags: [],
        isFallback: true
      }));
    }

    return matches.slice(0, 3);
  }, [polishedInsight]);

  const docProgress = useMemo(() => {
    let score = 0;
    const steps = [
      { id: 'classification', label: 'تصنيف الأصل والتصنيف الفرعي', met: !!assetClassification && !!subCategory, value: 20 },
      { id: 'dueDate', label: 'تاريخ الاستحقاق', met: !!dueDate, value: 20 },
      { id: 'roughInsight', label: 'الفكرة الخام (أكثر من 10 حروف)', met: roughInsight.trim().length >= 10, value: 30 },
      { id: 'polishedInsight', label: 'صياغة الذكاء الاصطناعي الفورية', met: !!polishedInsight, value: 20 },
      { id: 'linkedAssets', label: 'ربط الأصول المرتبطة', met: linkedAssetIds.length > 0, value: 10 },
    ];
    
    steps.forEach(step => {
      if (step.met) {
        score += step.value;
      }
    });
    
    return {
      percentage: score,
      steps
    };
  }, [assetClassification, dueDate, roughInsight, polishedInsight, linkedAssetIds]);
  
  // Request Expert Help states
  const [expertQuery, setExpertQuery] = useState('');
  const [matchedExpert, setMatchedExpert] = useState<any | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  
  // UI Status
  const [quickActionStatus, setQuickActionStatus] = useState('idle');

  // Notifications state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'n1',
      type: 'consultation_request',
      project: 'نيوم',
      title: 'طلب استشارة عاجل: بروتوكولات التبريد لمحلات الهيدروجين',
      description: 'طلب المهندس خالد الدوسري مراجعة عاجلة لمواصفات صمامات الضغط العالي مع خبير الطاقة الألماني.',
      time: 'منذ ١٥ دقيقة',
      status: 'pending',
      expert: 'د. يورغن شتراوس'
    },
    {
      id: 'n2',
      type: 'project_update',
      project: 'البحر الأحمر',
      title: 'اكتمال توطين أصل معرفي: الشعب المرجانية الفائقة',
      description: 'تم التحقق من تقرير استدامة الشعب المرجانية بنجاح واعتماده كأصل معرفي وطني بنسبة 100%.',
      time: 'منذ ساعتين',
      status: 'success'
    },
    {
      id: 'n3',
      type: 'consultation_request',
      project: 'أرامكو',
      title: 'طلب استشارة معلق: أنظمة فرز المستودعات اللوجستية',
      description: 'طلب المهندس أحمد الشمري جلسة عمل تفاعلية حول تحسين خوارزميات المسارات بالذكاء الاصطناعي.',
      time: 'منذ ٥ ساعات',
      status: 'pending',
      expert: 'د. ستيفن ووكر'
    },
    {
      id: 'n4',
      type: 'project_update',
      project: 'نيوم',
      title: 'تنبيه فجوة معرفية: مخاطر السيول الجبلية',
      description: 'مؤشر خطر مرتفع لعدم كفاية توطين خبرات هندسة التصريف للمناطق الوعرة في ذا لاين.',
      time: 'أمس',
      status: 'critical'
    },
    {
      id: 'n5',
      type: 'project_update',
      project: 'أرامكو',
      title: 'انطلاق جلسة التوأمة الثنائية رقم #42',
      description: 'انطلقت الآن الجلسة الافتراضية للتوأمة المعرفية لتطوير مهارات الأمن السيبراني الصناعي.',
      time: 'قبل يومين',
      status: 'info'
    }
  ]);

  const handleApproveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'success', approved: true } : n));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handlePolishInsight = async () => {
    setIsPolishing(true);
    try {
      const result = await polishQuickInsight(roughInsight, assetClassification, subCategory);
      setPolishedInsight(result);
    } catch (error) {
      console.error("Error polishing insight:", error);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleMatchExpert = async () => {
    setIsMatching(true);
    try {
      const result = await matchExpertForQuery(expertQuery);
      setMatchedExpert(result);
    } catch (error) {
      console.error("Error matching expert:", error);
    } finally {
      setIsMatching(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard', 'لوحة التحكم'), icon: LayoutDashboard },
    { id: 'extraction', label: t('nav.extraction', 'استخلاص المعرفة'), icon: BrainCircuit },
    { id: 'twinning', label: t('nav.twinning', 'التوأمة المعرفية'), icon: Users },
    { id: 'analytics', label: t('nav.analytics', 'التحليلات'), icon: BarChart3 },
    { id: 'partners', label: t('nav.partners', 'المنشآت الوطنية'), icon: Building },
    { id: 'security', label: t('nav.security', 'أمن البيانات'), icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans" dir={direction}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-saudi-dark text-white flex flex-col transition-all duration-300 z-50 shrink-0"
      >
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl saudi-gradient flex items-center justify-center shrink-0">
            <Globe className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight text-saudi-gold"
            >
              {t('app.name', 'مورد | MAWRED')}
            </motion.span>
          )}
        </div>

        {/* Project Switcher in Upper Sidebar */}
        {isSidebarOpen && (
          <div className="px-6 mb-4 relative z-50">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">{t('project.current', 'المشروع الحالي')}</div>
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-saudi-gold transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-saudi-green animate-pulse"></span>
                {selectedProject}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <AnimatePresence>
              {isProjectDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProjectDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-6 right-6 mt-1.5 bg-saudi-dark border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-white/5"
                  >
                    {['نيوم', 'البحر الأحمر', 'أرامكو'].map((proj) => (
                      <button
                        key={proj}
                        onClick={() => {
                          setSelectedProject(proj);
                          setIsProjectDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-right px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between",
                          selectedProject === proj 
                            ? "text-saudi-gold bg-saudi-green/10 font-bold" 
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {proj}
                        {selectedProject === proj && <span className="w-1.5 h-1.5 rounded-full bg-saudi-gold"></span>}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-saudi-green text-white shadow-lg shadow-saudi-green/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "text-white" : "group-hover:text-saudi-gold")} />
              {isSidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Actions Sidebar Widget */}
        <div className="border-t border-white/5 py-4 shrink-0">
          {isSidebarOpen ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 p-4 rounded-2xl bg-[#004D26]/40 border border-saudi-green/40 space-y-3"
            >
              <div className="flex items-center gap-2 text-saudi-gold">
                <Zap className="w-4 h-4 fill-saudi-gold animate-pulse shrink-0" />
                <span className="text-xs font-bold tracking-wider">{t('quick.title', 'الإجراءات السريعة')}</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">{t('quick.desc', 'أدوات فورية ومسارات ذكية لتسهيل مهام التوطين اليومية.')}</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={() => { setQuickActionType('expert'); setIsQuickDrawerOpen(true); }}
                  className="py-2.5 px-2 bg-saudi-green hover:bg-saudi-green/80 text-white rounded-xl text-[10px] font-bold flex flex-col items-center gap-1.5 transition-all border border-white/5 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-saudi-gold" />
                  {t('quick.consult', 'استشارة خبير')}
                </button>
                <button 
                  onClick={() => { setQuickActionType('insight'); setIsQuickDrawerOpen(true); }}
                  className="py-2.5 px-2 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white rounded-xl text-[10px] font-bold flex flex-col items-center gap-1.5 transition-all border border-white/5 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-saudi-gold" />
                  {t('quick.logIdea', 'تسجيل فكرة')}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="px-4 py-2 flex justify-center">
              <button
                onClick={() => { setQuickActionType('insight'); setIsQuickDrawerOpen(true); }}
                className="p-3 bg-[#004D26]/60 hover:bg-saudi-green text-saudi-gold rounded-full transition-all border border-saudi-green/40 shadow-md cursor-pointer"
                title={t('quick.title', 'الإجراءات السريعة')}
              >
                <Zap className="w-5 h-5 fill-saudi-gold" />
              </button>
            </div>
          )}
        </div>

        <div className="p-4 mt-auto border-t border-white/10">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>{t('nav.logout', 'تسجيل الخروج')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 cursor-pointer"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('header.search', 'البحث في قاعدة المعرفة...')} 
                className="bg-gray-50 border-none rounded-full py-2 pr-10 pl-4 w-64 text-sm focus:ring-2 focus:ring-saudi-green/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <LanguageToggle />

            <div className="flex items-center gap-2 px-3 py-1.5 bg-saudi-green/5 rounded-full text-saudi-green text-xs font-bold border border-saudi-green/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('header.secure', 'نظام آمن')}</span>
            </div>
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2.5 text-gray-400 hover:text-saudi-green hover:bg-gray-50 rounded-xl relative transition-all"
              title="تنبيهات حالة المشاريع والاستشارات"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
            <button 
              onClick={() => {
                setIsAdminModalOpen(true);
                // Log view action in audit log
                setAuditLogs(prev => [
                  {
                    id: `log-${Date.now()}`,
                    user: adminUser.name,
                    action: "فتح بوابة صلاحيات المسؤولين والمدراء",
                    time: "منذ ثانية"
                  },
                  ...prev
                ]);
              }}
              className="flex items-center gap-3 hover:bg-gray-50 p-1.5 px-2.5 rounded-xl transition-all border border-transparent hover:border-gray-150 text-right cursor-pointer group"
              title="لوحة الصلاحيات والمدراء للمسؤول"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-saudi-dark leading-none flex items-center gap-1.5 justify-end group-hover:text-saudi-green transition-colors">
                  {adminUser.name}
                  <span className="w-1.5 h-1.5 rounded-full bg-saudi-gold animate-pulse"></span>
                </p>
                <p className="text-[9px] text-saudi-gold font-bold mt-1.5 uppercase tracking-wider">
                  {adminUser.role === 'Administrator' ? 'المسؤول العام' : adminUser.role}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-saudi-green/10 border border-saudi-green/20 flex items-center justify-center text-saudi-green font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
                {adminUser.avatar}
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {activeTab === 'dashboard' && <Dashboard selectedProject={selectedProject} />}
              {activeTab === 'extraction' && <KnowledgeExtraction selectedProject={selectedProject} />}
              {activeTab === 'twinning' && <KnowledgeTwinning selectedProject={selectedProject} />}
              {activeTab === 'analytics' && <Analytics />}
              {activeTab === 'partners' && <SaudiPartners />}
              {activeTab === 'security' && <SecurityPolicy />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Interactive Quick Actions Sliding Drawer */}
      <AnimatePresence>
        {isQuickDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex" dir="rtl">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickDrawerOpen(false)}
              className="absolute inset-0 bg-saudi-dark/60 backdrop-blur-sm"
            />
            
            {/* Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col border-r border-gray-100 z-50 text-right"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl saudi-gradient flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 text-saudi-gold fill-saudi-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-saudi-dark">الإجراءات السريعة الفورية</h3>
                    <p className="text-[10px] text-gray-400">أدوات مخصصة لتسريع عملية توطين المعرفة</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsQuickDrawerOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-xl transition-all text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Selector Tab Header */}
              <div className="grid grid-cols-2 border-b border-gray-100">
                <button
                  onClick={() => { setQuickActionType('expert'); setMatchedExpert(null); }}
                  className={cn(
                    "py-4 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2",
                    quickActionType === 'expert' 
                      ? "border-saudi-green text-saudi-green bg-saudi-green/5" 
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  {t('quick.consultTitle', 'طلب استشارة خبير')}
                </button>
                <button
                  onClick={() => { setQuickActionType('insight'); setPolishedInsight(null); }}
                  className={cn(
                    "py-4 text-center text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2",
                    quickActionType === 'insight' 
                      ? "border-saudi-green text-saudi-green bg-saudi-green/5" 
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Lightbulb className="w-4 h-4" />
                  {t('quick.registerIdea', 'تسجيل فكرة جديدة')}
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {quickActionType === 'expert' && (
                  <div className="space-y-5 text-right">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/60 text-xs text-blue-800 space-y-1">
                      <p className="font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-saudi-gold fill-saudi-gold" /> مطابقة الكفاءة والذكاء الاصطناعي</p>
                      <p className="text-gray-600 leading-relaxed">اكتب تفاصيل المشكلة أو المعرفة التي تبحث عنها، وسيقوم النظام بمطابقتك مع الخبير الأنسب فوراً واقتراح حلول أولية.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-saudi-dark block">موضوع الاستفسار أو المشكلة الفنية</label>
                      <textarea
                        value={expertQuery}
                        onChange={(e) => setExpertQuery(e.target.value)}
                        placeholder="مثال: بحاجة لمعرفة بروتوكولات الحماية من الرطوبة والصدأ في عوازل أنابيب الهيدروجين تحت ضغط عالٍ جداً..."
                        className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-saudi-green/20 outline-none resize-none leading-relaxed text-right"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleMatchExpert}
                        disabled={isMatching || !expertQuery.trim()}
                        className="w-full py-3 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-saudi-green/10 disabled:opacity-50"
                      >
                        {isMatching ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            جاري تحليل الطلب ومطابقة الخبراء...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-saudi-gold fill-saudi-gold" />
                            مطابقة الخبير واقتراح الحلول
                          </>
                        )}
                      </button>
                    </div>

                    {matchedExpert && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-4 border-t border-gray-100 text-right"
                      >
                        <div className="p-4 bg-gradient-to-br from-saudi-green/10 to-transparent rounded-2xl border border-saudi-green/20 space-y-2">
                          <span className="text-[10px] font-bold text-saudi-gold bg-saudi-dark px-2.5 py-0.5 rounded-full uppercase">الخبير المقترح للمطابقة</span>
                          <h4 className="font-bold text-sm text-saudi-dark">{matchedExpert.recommendedExpertProfile}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed font-medium"><span className="text-saudi-green font-bold">سبب الترشيح:</span> {matchedExpert.matchingReason}</p>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-saudi-dark flex items-center gap-1">💡 نصائح وإرشادات مبدئية من الخبير:</h5>
                          <div className="space-y-2">
                            {matchedExpert.quickTips?.map((tip: string, idx: number) => (
                              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed flex items-start gap-2">
                                <span className="w-5 h-5 rounded-full bg-saudi-gold text-saudi-dark flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setQuickActionStatus('طلب استشارة رسمي تم إرساله بنجاح! سيقوم مكتب إدارة المعرفة بالتواصل معك ومطابقتك رسمياً مع الخبير.');
                            setTimeout(() => {
                              setQuickActionStatus('idle');
                              setIsQuickDrawerOpen(false);
                              setExpertQuery('');
                              setMatchedExpert(null);
                            }, 4000);
                          }}
                          className="w-full py-2.5 bg-saudi-dark hover:bg-saudi-dark/90 text-saudi-gold rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                        >
                          <CheckCircle className="w-4 h-4" />
                          إرسال طلب استشارة رسمي وربط فوري
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                {quickActionType === 'insight' && (
                  <div className="space-y-5 text-right">
                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/60 text-xs text-amber-800 space-y-1">
                      <p className="font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-saudi-gold fill-saudi-gold" /> الصقل الفوري بالذكاء الاصطناعي</p>
                      <p className="text-gray-600 leading-relaxed">اكتب فكرة سريعة أو درس مستفاد بطريقتك البسيطة، وسيتولى مستشار الذكاء الاصطناعي تحويلها فوراً إلى أصل معرفي منسق ومصنف لإضافته إلى مكتبة المشاريع.</p>
                    </div>

                    {/* Progress Ring and Checklist Section */}
                    <div className="bg-gradient-to-br from-saudi-dark to-saudi-dark/95 text-white p-4 rounded-2xl border border-saudi-green/20 space-y-3.5 shadow-md">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-right space-y-1 flex-1">
                          <span className="text-[9px] font-extrabold text-saudi-gold bg-saudi-gold/10 border border-saudi-gold/20 px-2 py-0.5 rounded-full inline-block">
                            حوكمة المعرفة الرقمية
                          </span>
                          <h4 className="font-extrabold text-xs text-white">معدل اكتمال التوثيق المعرفي</h4>
                          <p className="text-[10px] text-gray-300 leading-normal">تتحسن فرصة قبول الأصل واعتماده في المكتبة بزيادة الاكتمال.</p>
                        </div>
                        
                        {/* Circular Progress Ring */}
                        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            {/* Track circle */}
                            <circle
                              cx="32"
                              cy="32"
                              r="26"
                              stroke="rgba(255, 255, 255, 0.1)"
                              strokeWidth="4"
                              fill="transparent"
                            />
                            {/* Progress circle */}
                            <motion.circle
                              cx="32"
                              cy="32"
                              r="26"
                              stroke="#006C35"
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 26}
                              initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                              animate={{ strokeDashoffset: (2 * Math.PI * 26) - (docProgress.percentage / 100) * (2 * Math.PI * 26) }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-xs font-black font-sans text-saudi-gold">
                            {docProgress.percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Checklist Grid */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2.5 border-t border-white/10 text-right">
                        {docProgress.steps.map((step) => (
                          <div key={step.id} className="flex items-center gap-1.5 justify-end">
                            <span className={cn("text-[9px] font-bold transition-all", step.met ? "text-saudi-gold" : "text-gray-400")}>
                              {step.label}
                            </span>
                            <div className={cn(
                              "w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all",
                              step.met ? "bg-saudi-green/20 text-saudi-green border border-saudi-green/30" : "bg-white/5 text-transparent border border-white/10"
                            )}>
                              {step.met ? (
                                <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              ) : (
                                <div className="w-1 h-1 rounded-full bg-white/25"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-saudi-dark block">تصنيف الأصول المعرفية</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'فنية', label: 'فنية', desc: 'هندسة، طاقة، بروتوكولات', icon: Wrench },
                          { value: 'إدارية', label: 'إدارية', desc: 'إجراءات، تشغيل، عمليات', icon: Briefcase },
                          { value: 'استراتيجية', label: 'استراتيجية', desc: 'رؤية، خطط، حوكمة', icon: Target }
                        ].map((option) => {
                          const IconComp = option.icon;
                          const isSelected = assetClassification === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleClassificationChange(option.value as any)}
                              className={cn(
                                "p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer relative",
                                isSelected 
                                  ? "border-saudi-green bg-saudi-green/5 text-saudi-green shadow-xs font-bold" 
                                  : "border-gray-150 bg-white text-gray-500 hover:border-gray-200"
                              )}
                            >
                              <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                                isSelected ? "bg-saudi-green/10 text-saudi-green" : "bg-gray-50 text-gray-400"
                              )}>
                                <IconComp className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-extrabold">{option.label}</span>
                              <span className="text-[8px] text-gray-400 font-medium leading-none line-clamp-1">{option.desc}</span>
                              {isSelected && (
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-saudi-green"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dynamic Subcategory Selection */}
                    <div className="space-y-2 p-3 bg-gray-50/90 rounded-2xl border border-gray-200">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-saudi-dark flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-saudi-green" />
                          <span>التصنيف الفرعي الديناميكي:</span>
                          <span className="text-[11px] font-black text-saudi-green bg-saudi-green/10 px-2 py-0.5 rounded">
                            {assetClassification}
                          </span>
                        </label>
                        <span className="text-[10px] text-gray-500 font-medium">لتسهيل التصفية المعرفية</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {SUBCATEGORIES_BY_CLASSIFICATION[assetClassification]?.map((sub) => {
                          const isSelected = subCategory === sub;
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setSubCategory(sub)}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border",
                                isSelected
                                  ? "bg-saudi-green text-white border-saudi-green shadow-xs"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-saudi-green/40 hover:bg-emerald-50/40"
                              )}
                            >
                              {isSelected ? (
                                <Check className="w-3 h-3 text-saudi-gold" />
                              ) : (
                                <Tag className="w-3 h-3 text-gray-400" />
                              )}
                              <span>{sub}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-saudi-dark flex items-center justify-end gap-1 block">
                        تاريخ الاستحقاق والمتابعة (المستهدف)
                        <Calendar className="w-3.5 h-3.5 text-saudi-green" />
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-saudi-green/20 outline-none text-right font-sans cursor-pointer"
                      />
                      <p className="text-[9px] text-gray-500">تحديد تاريخ مستهدف لمتابعة تطبيق الفكرة وتحويلها لمبادرة رسمية.</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-bold text-saudi-dark block">{t('quick.rawIdea', 'الفكرة أو الملاحظة الفنية الخام')}</label>
                        <VoiceInputButton
                          onTranscript={(spokenText, isAppend) => {
                            setRoughInsight(prev => {
                              if (!prev.trim()) return spokenText;
                              return isAppend ? `${prev} ${spokenText}` : spokenText;
                            });
                          }}
                        />
                      </div>
                      <textarea
                        value={roughInsight}
                        onChange={(e) => setRoughInsight(e.target.value)}
                        placeholder={t('quick.rawIdeaPlaceholder', 'مثال: لاحظنا اليوم خلال صب القواعد أن نسبة الرطوبة تحتاج تعديل طفيف لتفادي تشققات الطقس الحار في نيوم...')}
                        className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-saudi-green/20 outline-none resize-none leading-relaxed text-right"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handlePolishInsight}
                        disabled={isPolishing || !roughInsight.trim()}
                        className="w-full py-3 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-saudi-green/10 disabled:opacity-50 cursor-pointer"
                      >
                        {isPolishing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('quick.polishing', 'جاري صياغة الفكرة وتوطينها مهنياً...')}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-saudi-gold fill-saudi-gold" />
                            {t('quick.polishBtn', 'صقل الفكرة وحفظها')}
                          </>
                        )}
                      </button>
                    </div>

                    {polishedInsight && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-4 border-t border-gray-100"
                      >
                        <div className="p-5 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-inner text-right relative overflow-hidden">
                          <div className="absolute top-0 right-0 left-0 h-1 bg-saudi-green"></div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-saudi-gold bg-saudi-dark px-2.5 py-0.5 rounded-full">{polishedInsight.category}</span>
                              <span className="text-[10px] font-bold text-saudi-green bg-saudi-green/10 px-2 py-0.5 rounded border border-saudi-green/20">أصل {assetClassification}</span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                <Tag className="w-2.5 h-2.5 text-saudi-green" />
                                {subCategory}
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              {polishedInsight.tags?.map((t: string, i: number) => (
                                <span key={i} className="text-[9px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">#{t}</span>
                              ))}
                            </div>
                          </div>
                          <h4 className="font-bold text-xs text-saudi-dark">{polishedInsight.polishedTitle}</h4>
                          <p className="text-[11px] text-gray-600 leading-relaxed font-medium bg-gray-50 p-3 rounded-xl border border-gray-100/60">{polishedInsight.polishedContent}</p>
                          {dueDate && (
                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5 flex items-center justify-between text-[10px] text-amber-900 font-bold">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-saudi-gold" />
                                تاريخ الاستحقاق المحدد:
                              </span>
                              <span className="font-sans text-saudi-dark">{dueDate}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Related Assets Section */}
                        <div className="space-y-3 pt-4 border-t border-gray-150">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-black text-saudi-dark flex items-center gap-1.5 justify-end">
                              <Link className="w-3.5 h-3.5 text-saudi-green" />
                              الأصول المعرفية المرتبطة تلقائياً
                            </h5>
                            <span className="text-[10px] bg-saudi-green/10 text-saudi-green font-extrabold px-1.5 py-0.5 rounded-sm">
                              مطابقة ذكية
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-normal">
                            بناءً على وسوم الفكرة الجديدة، تم العثور على أصول تتقاطع معها في نظام المعرفة التوطيني. يرجى مراجعتها وربطها لتعزيز الترابط المعرفي:
                          </p>
                          
                          <div className="space-y-2.5">
                            {relatedAssets.map((asset: any) => {
                              const isLinked = linkedAssetIds.includes(asset.id);
                              return (
                                <div 
                                  key={asset.id} 
                                  className={cn(
                                    "p-3 rounded-xl border transition-all text-right space-y-2",
                                    isLinked 
                                      ? "bg-saudi-green/5 border-saudi-green/30 shadow-xs" 
                                      : "bg-white border-gray-150 hover:border-gray-200"
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded">
                                      {asset.project}
                                    </span>
                                    
                                    {asset.matchingTags && asset.matchingTags.length > 0 ? (
                                      <div className="flex items-center gap-1 flex-wrap justify-end">
                                        <span className="text-[8px] text-gray-400 font-medium">يتطابق في:</span>
                                        {asset.matchingTags.map((mt: string, idx: number) => (
                                          <span key={idx} className="text-[8px] font-bold text-saudi-green bg-saudi-green/10 px-1 py-0.2 rounded">
                                            #{mt}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-[8px] text-saudi-gold bg-saudi-gold/10 font-bold px-1 py-0.2 rounded">
                                        توصية عامة
                                      </span>
                                    )}
                                  </div>
                                  
                                  <h6 className="font-extrabold text-[11px] text-saudi-dark leading-tight line-clamp-1">
                                    {asset.title}
                                  </h6>
                                  
                                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                    {asset.content}
                                  </p>
                                  
                                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100/60">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedRelatedAsset(asset)}
                                      className="text-[10px] font-bold text-gray-500 hover:text-saudi-green flex items-center gap-1 cursor-pointer transition-all"
                                    >
                                      <Eye className="w-3 h-3" />
                                      عرض التفاصيل الكاملة
                                    </button>
                                    
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isLinked) {
                                          setLinkedAssetIds(prev => prev.filter(id => id !== asset.id));
                                        } else {
                                          setLinkedAssetIds(prev => [...prev, asset.id]);
                                        }
                                      }}
                                      className={cn(
                                        "px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer border",
                                        isLinked
                                          ? "bg-saudi-green border-saudi-green text-white hover:bg-saudi-green/90"
                                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                      )}
                                    >
                                      {isLinked ? (
                                        <>
                                          <Check className="w-2.5 h-2.5" />
                                          تم ربط الفكرة
                                        </>
                                      ) : (
                                        <>
                                          <Link2 className="w-2.5 h-2.5 text-saudi-green" />
                                          ربط بالفكرة
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            // Save to localStorage as a mock asset
                            const savedAssets = JSON.parse(localStorage.getItem('mawred_extra_assets') || '[]');
                            savedAssets.unshift({
                              id: `extra-${Date.now()}`,
                              title: polishedInsight.polishedTitle,
                              content: polishedInsight.polishedContent,
                              category: polishedInsight.category,
                              tags: polishedInsight.tags,
                              classification: assetClassification,
                              subCategory: subCategory,
                              lifecycleStatus: 'مسودة',
                              isDemoData: false,
                              dueDate: dueDate || undefined,
                              linkedAssets: linkedAssetIds,
                              date: new Date().toLocaleDateString('ar-SA'),
                              author: 'م. أحمد القحطاني',
                              project: selectedProject
                            });
                            localStorage.setItem('mawred_extra_assets', JSON.stringify(savedAssets));

                            // Add a log entry for the linked relationship if any
                            if (linkedAssetIds.length > 0) {
                              const relatedCount = linkedAssetIds.length;
                              setAuditLogs(prev => [
                                {
                                  id: `log-${Date.now()}`,
                                  user: "م. أحمد القحطاني",
                                  action: `ربط الأصل المعرفي الجديد بـ (${relatedCount}) من الأصول المعرفية القائمة ومطابقتها`,
                                  time: "منذ ثانية"
                                },
                                ...prev
                              ]);
                            }

                            // Add a log entry for the scheduled execution if a due date is set
                            if (dueDate) {
                              setAuditLogs(prev => [
                                {
                                  id: `log-due-${Date.now()}`,
                                  user: "م. أحمد القحطاني",
                                  action: `جدولة تنفيذ ومتابعة الأصل المعرفي الجديد مع تاريخ استحقاق مستهدف في: ${dueDate}`,
                                  time: "منذ ثانية"
                                },
                                ...prev
                              ]);
                            }

                            setQuickActionStatus('تم بنجاح صياغة الأصل المعرفي وحفظه وتعميمه في مكتبة الأصول المشتركة لمشروع نيوم!');
                            setTimeout(() => {
                              setQuickActionStatus('idle');
                              setIsQuickDrawerOpen(false);
                              setRoughInsight('');
                              setAssetClassification('فنية');
                              setDueDate('');
                              setPolishedInsight(null);
                              setSelectedRelatedAsset(null);
                              setLinkedAssetIds([]);
                            }, 4000);
                          }}
                          className="w-full py-2.5 bg-saudi-dark hover:bg-saudi-dark/90 text-saudi-gold rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          تعميم واعتماد الفكرة في مكتبة الأصول المعرفية
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Success Banner */}
              <AnimatePresence>
                {quickActionStatus !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-0 left-0 right-0 p-6 bg-saudi-dark border-t border-saudi-gold/20 flex flex-col items-center text-center space-y-3 z-50 text-right"
                    dir="rtl"
                  >
                    <CheckCircle className="w-10 h-10 text-saudi-gold animate-bounce" />
                    <p className="text-xs font-bold text-white leading-relaxed">{quickActionStatus}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Notifications Timeline Modal */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" dir="rtl">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="fixed inset-0 bg-saudi-dark/70 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 z-50 overflow-hidden flex flex-col text-right relative max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saudi-green/10 flex items-center justify-center text-saudi-green">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-saudi-dark">مركز التنبيهات وتحديثات المشاريع</h3>
                    <p className="text-xs text-gray-500">تابع تحديثات التوطين والطلبات المعلقة وجلسات الاستشارة أولاً بأول</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-xl transition-all text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Summary Bar */}
              <div className="px-6 py-3.5 bg-saudi-dark text-saudi-gold text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>الطلبات المستعجلة تتطلب اتخاذ إجراء فوري لضمان كفاءة سلاسل المعرفة</span>
                </div>
                <span className="bg-saudi-green text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {notifications.filter(n => n.status === 'pending').length} استشارة معلقة
                </span>
              </div>

              {/* Chronological Timeline Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 relative max-h-[50vh]">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto shadow-inner">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-saudi-dark text-sm">أداء معرفي مثالي ومستقر!</p>
                      <p className="text-xs text-gray-500">جميع طلبات التوطين معتمدة وتحديثات المشاريع مستقرة حالياً.</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative border-r-2 border-dashed border-gray-100 pr-5 mr-3 space-y-8">
                    {notifications.map((item, index) => {
                      // Status colors & icon definitions
                      let statusBg = "bg-blue-50 text-blue-600 border-blue-100";
                      let statusLabel = "تحديث";
                      let statusIcon = <Clock className="w-4 h-4" />;

                      if (item.status === 'pending') {
                        statusBg = "bg-amber-50 text-amber-600 border-amber-100 animate-pulse";
                        statusLabel = "استشارة معلقة";
                        statusIcon = <MessageSquare className="w-4 h-4" />;
                      } else if (item.status === 'critical') {
                        statusBg = "bg-red-50 text-red-600 border-red-100";
                        statusLabel = "فجوة حرجة";
                        statusIcon = <AlertCircle className="w-4 h-4" />;
                      } else if (item.status === 'success') {
                        statusBg = "bg-green-50 text-green-600 border-green-100";
                        statusLabel = "مكتمل";
                        statusIcon = <CheckCircle className="w-4 h-4" />;
                      } else if (item.status === 'info') {
                        statusBg = "bg-purple-50 text-purple-600 border-purple-100";
                        statusLabel = "جلسة توأمة";
                        statusIcon = <Sparkles className="w-4 h-4" />;
                      }

                      return (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="relative group text-right"
                        >
                          {/* Timeline Node Point Icon */}
                          <div className={cn(
                            "absolute right-[-31px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm shrink-0 z-10 transition-transform duration-300 group-hover:scale-125",
                            statusBg
                          )}>
                            {statusIcon}
                          </div>

                          {/* Event Card Content */}
                          <div className="bg-gray-50 hover:bg-gray-100/50 rounded-2xl p-5 border border-gray-100 transition-all duration-300 relative">
                            {/* Card Header Info */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                  item.project === 'نيوم' && "bg-[#004D26]/10 text-saudi-green border-[#004D26]/20",
                                  item.project === 'البحر الأحمر' && "bg-sky-50 text-sky-700 border-sky-100",
                                  item.project === 'أرامكو' && "bg-amber-50 text-amber-700 border-amber-100"
                                )}>
                                  {item.project}
                                </span>
                                <span className="text-[10px] text-gray-400">{item.time}</span>
                              </div>
                              <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded-md",
                                statusBg
                              )}>
                                {statusLabel}
                              </span>
                            </div>

                            {/* Title & Body */}
                            <h4 className="font-bold text-xs text-saudi-dark leading-snug">{item.title}</h4>
                            <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>

                            {/* Expert Info Box if present */}
                            {item.expert && (
                              <div className="mt-3 p-2.5 bg-white border border-gray-100 rounded-xl flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-saudi-gold/10 text-saudi-gold flex items-center justify-center text-[10px] font-bold">
                                    {item.expert[0]}
                                  </div>
                                  <span className="font-medium text-gray-700 text-[11px]">الخبير المقترح: {item.expert}</span>
                                </div>
                                <span className="text-[10px] text-saudi-gold font-bold bg-saudi-dark px-2.5 py-0.5 rounded-lg">خبير معتمد</span>
                              </div>
                            )}

                            {/* Timeline Actions */}
                            <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100/60 pt-3">
                              {item.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleDismissNotification(item.id)}
                                    className="px-3 py-1.5 bg-white hover:bg-red-50 hover:text-red-500 border border-gray-200 hover:border-red-100 rounded-xl text-[10px] font-bold transition-all"
                                  >
                                    رفض
                                  </button>
                                  <button
                                    onClick={() => handleApproveNotification(item.id)}
                                    className="px-4 py-1.5 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm"
                                  >
                                    <ShieldCheck className="w-3 h-3" />
                                    اعتماد وربط الخبير
                                  </button>
                                </>
                              ) : item.approved ? (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-xl">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  تم ربط الخبير واعتماد الاستشارة بنجاح
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleDismissNotification(item.id)}
                                  className="px-3.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-500 transition-all"
                                >
                                  تأكيد القراءة وأرشفة
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <button
                  onClick={() => setNotifications([])}
                  disabled={notifications.length === 0}
                  className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  قراءة وتصفير كافة التنبيهات
                </button>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="px-5 py-2 bg-saudi-dark text-saudi-gold rounded-xl text-xs font-bold hover:bg-saudi-dark/90 transition-all shadow-md"
                >
                  إغلاق النافذة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Administrator Settings and Credentials Control Center */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center" dir="rtl">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminModalOpen(false)}
              className="absolute inset-0 bg-saudi-dark/65 backdrop-blur-md"
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-150 overflow-hidden z-50 text-right m-4"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-saudi-dark/5 via-transparent to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-saudi-green/10 flex items-center justify-center text-saudi-green">
                    <Lock className="w-5 h-5 text-saudi-gold" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-saudi-dark flex items-center gap-2">
                      لوحة إدارة الصلاحيات ومستخدمي النظام الآمن
                      <span className="text-[10px] bg-saudi-gold/15 text-saudi-gold px-2 py-0.5 rounded-full border border-saudi-gold/20 font-bold">بوابة المسؤول العام</span>
                    </h3>
                    <p className="text-xs text-gray-400">التحكم في تراخيص الوصول وهويات المدراء، وإدارة سجل التدقيق الأمني (Audit Logs).</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAdminModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Right Panel: Admin Identity & Permissions Management (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Section 1: Active Identity Details */}
                  <div className="bg-[#004D26]/5 p-5 rounded-2xl border border-saudi-green/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-saudi-green tracking-wider uppercase">الهوية النشطة حالياً</h4>
                      <span className="text-[10px] font-mono bg-white border border-saudi-green/10 text-saudi-green px-2 py-0.5 rounded font-bold">جلسة آمنة وموثقة</span>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div className="w-14 h-14 rounded-full bg-saudi-gold/15 border border-saudi-gold/20 flex items-center justify-center text-saudi-gold text-xl font-black shrink-0">
                        {adminUser.avatar}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold text-base text-saudi-dark">{adminUser.name}</h5>
                          <span className="text-[9px] bg-saudi-gold/20 text-saudi-gold px-2 py-0.5 rounded font-bold">أدمن مفوض</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1 justify-end md:justify-start">
                          <Fingerprint className="w-3.5 h-3.5 text-gray-400" />
                          {adminUser.email}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          const original = {
                            name: "أمين قرناص",
                            role: "Administrator",
                            permissions: ["full_access", "edit", "manage_users"],
                            email: "amin.q@mawred.gov.sa",
                            avatar: "أق"
                          };
                          setAdminUser(original);
                          setAuditLogs(prev => [
                            {
                              id: `log-${Date.now()}`,
                              user: "النظام",
                              action: "إعادة تعيين المسؤول الأصلي (أمين قرناص)",
                              time: "منذ ثانية"
                            },
                            ...prev
                          ]);
                        }}
                        className="p-2 bg-white hover:bg-gray-50 text-gray-500 hover:text-saudi-green rounded-xl border border-gray-150 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                        title="إعادة تعيين المسؤول الافتراضي"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>إعادة تعيين</span>
                      </button>
                    </div>

                    {/* Permissions Grid Toggles */}
                    <div className="pt-4 border-t border-saudi-green/10 space-y-3">
                      <label className="text-xs font-black text-gray-400 block tracking-wider uppercase">صلاحيات الهوية الحالية (انقر للتعديل المؤقت):</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        
                        {/* Full Access Toggle */}
                        <button
                          onClick={() => {
                            const newPerms = adminUser.permissions.includes("full_access")
                              ? adminUser.permissions.filter(p => p !== "full_access")
                              : [...adminUser.permissions, "full_access"];
                            setAdminUser(prev => ({ ...prev, permissions: newPerms }));
                            setAuditLogs(prev => [
                              {
                                id: `log-${Date.now()}`,
                                user: adminUser.name,
                                action: `${adminUser.permissions.includes("full_access") ? 'سحب' : 'منح'} صلاحية الوصول الكامل (full_access)`,
                                time: "منذ ثانية"
                              },
                              ...prev
                            ]);
                          }}
                          className={cn(
                            "p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer",
                            adminUser.permissions.includes("full_access")
                              ? "bg-saudi-green/10 border-saudi-green text-saudi-dark"
                              : "bg-white border-gray-200 text-gray-400"
                          )}
                        >
                          <div className="space-y-0.5 text-right">
                            <span className="text-xs font-bold block">وصول كامل</span>
                            <span className="text-[9px] text-gray-400">Full Access</span>
                          </div>
                          {adminUser.permissions.includes("full_access") ? (
                            <CheckCircle className="w-4 h-4 text-saudi-green shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                          )}
                        </button>

                        {/* Edit Access Toggle */}
                        <button
                          onClick={() => {
                            const newPerms = adminUser.permissions.includes("edit")
                              ? adminUser.permissions.filter(p => p !== "edit")
                              : [...adminUser.permissions, "edit"];
                            setAdminUser(prev => ({ ...prev, permissions: newPerms }));
                            setAuditLogs(prev => [
                              {
                                id: `log-${Date.now()}`,
                                user: adminUser.name,
                                action: `${adminUser.permissions.includes("edit") ? 'سحب' : 'منح'} صلاحية التعديل والكتابة (edit)`,
                                time: "منذ ثانية"
                              },
                              ...prev
                            ]);
                          }}
                          className={cn(
                            "p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer",
                            adminUser.permissions.includes("edit")
                              ? "bg-saudi-green/10 border-saudi-green text-saudi-dark"
                              : "bg-white border-gray-200 text-gray-400"
                          )}
                        >
                          <div className="space-y-0.5 text-right">
                            <span className="text-xs font-bold block">تعديل وكتابة</span>
                            <span className="text-[9px] text-gray-400">Write/Edit</span>
                          </div>
                          {adminUser.permissions.includes("edit") ? (
                            <CheckCircle className="w-4 h-4 text-saudi-green shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                          )}
                        </button>

                        {/* Manage Users Toggle */}
                        <button
                          onClick={() => {
                            const newPerms = adminUser.permissions.includes("manage_users")
                              ? adminUser.permissions.filter(p => p !== "manage_users")
                              : [...adminUser.permissions, "manage_users"];
                            setAdminUser(prev => ({ ...prev, permissions: newPerms }));
                            setAuditLogs(prev => [
                              {
                                id: `log-${Date.now()}`,
                                user: adminUser.name,
                                action: `${adminUser.permissions.includes("manage_users") ? 'سحب' : 'منح'} صلاحية إدارة المستخدمين (manage_users)`,
                                time: "منذ ثانية"
                              },
                              ...prev
                            ]);
                          }}
                          className={cn(
                            "p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer",
                            adminUser.permissions.includes("manage_users")
                              ? "bg-saudi-green/10 border-saudi-green text-saudi-dark"
                              : "bg-white border-gray-200 text-gray-400"
                          )}
                        >
                          <div className="space-y-0.5 text-right">
                            <span className="text-xs font-bold block">إدارة المدراء</span>
                            <span className="text-[9px] text-gray-400">Manage Users</span>
                          </div>
                          {adminUser.permissions.includes("manage_users") ? (
                            <CheckCircle className="w-4 h-4 text-saudi-green shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                          )}
                        </button>

                      </div>
                    </div>
                  </div>

                  {/* Section 2: Manage Registered Team Users */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 block tracking-wider uppercase">فريق العمل والمدراء المسجلين</h4>
                    
                    <div className="bg-white rounded-2xl border border-gray-150 divide-y divide-gray-100 overflow-hidden">
                      {usersList.map((user, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-saudi-green/5 text-saudi-green font-bold flex items-center justify-center text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-right">
                              <h5 className="text-xs font-extrabold text-saudi-dark flex items-center gap-2 justify-end md:justify-start">
                                {user.name}
                                <span className={cn(
                                  "text-[9px] font-bold px-1.5 py-0.5 rounded",
                                  user.status === "نشط" ? "bg-green-50 text-green-700 font-sans" : "bg-amber-50 text-amber-700 font-sans"
                                )}>
                                  {user.status}
                                </span>
                              </h5>
                              <p className="text-[10px] text-gray-400 mt-0.5">{user.email} • {user.role}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Switch to this user button */}
                            <button
                              onClick={() => {
                                setAdminUser({
                                  name: user.name,
                                  role: user.role,
                                  permissions: user.permissions,
                                  email: user.email,
                                  avatar: user.name.split(' ').map(n => n[0]).join('')
                                });
                                setAuditLogs(prev => [
                                  {
                                    id: `log-${Date.now()}`,
                                    user: "النظام",
                                    action: `تبديل الهوية النشطة ومحاكاة وصول: ${user.name}`,
                                    time: "منذ ثانية"
                                  },
                                  ...prev
                                ]);
                              }}
                              className="px-2.5 py-1.5 bg-gray-50 hover:bg-saudi-green/10 text-gray-500 hover:text-saudi-green text-[10px] font-bold rounded-lg transition-all border border-gray-200/50 flex items-center gap-1 cursor-pointer font-sans"
                              title="تقمص هوية هذا المستخدم لاختبار صلاحياته"
                            >
                              <UserCheck className="w-3 h-3 text-saudi-green" />
                              <span>تبديل الهوية</span>
                            </button>

                            {/* Delete User Button (except main admin) */}
                            {user.name !== "أمين قرناص" && (
                              <button
                                onClick={() => {
                                  setUsersList(prev => prev.filter(u => u.name !== user.name));
                                  setAuditLogs(prev => [
                                    {
                                      id: `log-${Date.now()}`,
                                      user: adminUser.name,
                                      action: `حذف الحساب المعرفي العائد لـ: ${user.name}`,
                                      time: "منذ ثانية"
                                    },
                                    ...prev
                                  ]);
                                }}
                                className="p-1.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-150 hover:border-red-100 rounded-lg transition-all cursor-pointer"
                                title="حذف المستخدم"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Add New User Form */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-3.5">
                    <h5 className="text-xs font-extrabold text-saudi-dark flex items-center gap-1.5 justify-end">
                      <Plus className="w-4 h-4 text-saudi-green" />
                      إضافة مستخدم أو مدير جديد للنظام
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="الاسم الكامل..."
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 text-saudi-dark outline-none focus:ring-1 focus:ring-saudi-green/30"
                      />
                      <input
                        type="email"
                        placeholder="البريد الإلكتروني..."
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 text-saudi-dark outline-none focus:ring-1 focus:ring-saudi-green/30 text-left"
                      />
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-saudi-dark outline-none focus:ring-1 focus:ring-saudi-green/30 cursor-pointer"
                      >
                        <option value="Administrator">Administrator (مسؤول عام)</option>
                        <option value="مدير المعرفة">مدير المعرفة (مستشار)</option>
                        <option value="محلل بيانات">محلل بيانات معرفية</option>
                        <option value="مستشار وطني">مستشار وطني خارجي</option>
                      </select>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          if (!newUserName.trim() || !newUserEmail.trim()) return;
                          
                          const formattedRole = newUserRole;
                          const samplePermissions = formattedRole === "Administrator" 
                            ? ["full_access", "edit", "manage_users"] 
                            : formattedRole === "مدير المعرفة" ? ["edit"] : ["read"];

                          const newUserObj = {
                            name: newUserName,
                            role: formattedRole,
                            email: newUserEmail,
                            status: "نشط",
                            permissions: samplePermissions
                          };

                          setUsersList(prev => [...prev, newUserObj]);
                          setAuditLogs(prev => [
                            {
                              id: `log-${Date.now()}`,
                              user: adminUser.name,
                              action: `تسجيل مستخدم جديد بنجاح: ${newUserName} بصلاحية ${formattedRole}`,
                              time: "منذ ثانية"
                            },
                            ...prev
                          ]);

                          // Reset inputs
                          setNewUserName("");
                          setNewUserEmail("");
                        }}
                        disabled={!newUserName.trim() || !newUserEmail.trim()}
                        className="px-4 py-2 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-[11px] font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1 font-sans"
                      >
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>تسجيل المستخدم وحفظه</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Left Panel: Audit Logs & Security Information (5 Cols) */}
                <div className="lg:col-span-5 space-y-6 lg:border-r lg:border-gray-100 lg:pr-8">
                  
                  {/* System Health Indicators */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 block tracking-wider uppercase">حالة بيئة العمل السيبرانية</h4>
                    
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                        <span>نوع الترخيص النشط:</span>
                        <span className="text-saudi-green font-extrabold font-sans">المؤسسة الحكومية السيادية</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                        <span>قناة التشفير (SSL/TLS):</span>
                        <span className="text-saudi-gold flex items-center gap-1 font-sans">
                          <ShieldCheck className="w-4 h-4 text-saudi-gold" />
                          نشطة 256-bit
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                        <span>توقيت الخادم المحلي:</span>
                        <span className="font-mono text-gray-500 font-medium">2026-07-03</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Audit Trails */}
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-gray-400 block tracking-wider uppercase">سجل التدقيق والعمليات (Audit Logs)</h4>
                      <button
                        onClick={() => {
                          const headers = ['المعرف', 'المستخدم المسؤول', 'الإجراء المتخذ', 'الوقت والسرية'];
                          const rows = auditLogs.map(l => [
                            `"${l.id}"`,
                            `"${l.user}"`,
                            `"${l.action}"`,
                            `"${l.time}"`
                          ]);
                          const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.setAttribute("href", url);
                          link.setAttribute("download", `audit_logs_mawred_${new Date().toISOString().slice(0,10)}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="text-[10px] text-saudi-green hover:underline font-bold flex items-center gap-1 cursor-pointer font-sans"
                        title="تحميل سجل التدقيق بصيغة CSV"
                      >
                        <FileCode className="w-3.5 h-3.5 text-saudi-green" />
                        <span>تحميل السجل CSV</span>
                      </button>
                    </div>

                    <div className="bg-gray-900 text-emerald-400 p-4 rounded-2xl border border-gray-800 font-mono text-[11px] overflow-y-auto max-h-[320px] space-y-3.5 text-left" dir="ltr">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="border-b border-gray-800/60 pb-2 space-y-1 text-right">
                          <div className="flex items-center justify-between text-[9px] text-gray-400">
                            <span>[{log.time}]</span>
                            <span className="font-extrabold text-emerald-500">#{log.id}</span>
                          </div>
                          <p className="text-emerald-300 font-sans text-right leading-relaxed text-[11px]">
                            <strong className="text-saudi-gold font-sans">{log.user}:</strong> {log.action}
                          </p>
                        </div>
                      ))}
                      
                      <div className="text-[10px] text-gray-500 text-center font-sans italic pt-2">
                        -- نهاية سجل عمليات المسؤول للحدث الحالي --
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-gray-150 bg-gray-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    setAuditLogs([
                      { id: `log-${Date.now()}`, user: adminUser.name, action: "مسح وتصفير سجل العمليات والتدقيق الأمني", time: "منذ ثانية" }
                    ]);
                  }}
                  className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer font-sans"
                >
                  تصفير سجل التدقيق الحالي
                </button>
                <button
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-6 py-2.5 bg-saudi-dark text-saudi-gold rounded-xl text-xs font-black hover:bg-saudi-dark/95 transition-all shadow-md cursor-pointer font-sans"
                >
                  إغلاق نافذة المسؤول
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal to view related asset details side-by-side or as an overlay */}
      <AnimatePresence>
        {selectedRelatedAsset && (
          <div className="fixed inset-0 z-[110] bg-saudi-dark/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl text-right space-y-4 relative border border-gray-100"
            >
              <button 
                onClick={() => setSelectedRelatedAsset(null)}
                className="absolute top-4 left-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 pt-2 justify-end">
                <span className="text-[10px] font-bold text-white bg-saudi-dark px-2.5 py-0.5 rounded-full">
                  {selectedRelatedAsset.category}
                </span>
                {selectedRelatedAsset.classification && (
                  <span className="text-[10px] font-bold text-saudi-green bg-saudi-green/10 px-2 py-0.5 rounded border border-saudi-green/20">
                    أصل {selectedRelatedAsset.classification}
                  </span>
                )}
                <span className="text-[10px] font-bold text-saudi-gold bg-saudi-gold/10 px-2 py-0.5 rounded border border-saudi-gold/20">
                  {selectedRelatedAsset.project}
                </span>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-saudi-dark">
                  {selectedRelatedAsset.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-medium">
                  المصدر والمستشار: {selectedRelatedAsset.author || 'نظام إدارة المعرفة'} • متاح للمشاريع السيادية
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 text-xs text-gray-600 leading-relaxed font-medium">
                {selectedRelatedAsset.content}
              </div>
              
              <div className="flex flex-wrap gap-1 justify-end">
                {selectedRelatedAsset.tags?.map((t: string, i: number) => (
                  <span key={i} className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    #{t.replace(/^#/, '')}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedRelatedAsset(null)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                >
                  إغلاق النافذة
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedRelatedAsset.id;
                    if (linkedAssetIds.includes(id)) {
                      setLinkedAssetIds(prev => prev.filter(i => i !== id));
                    } else {
                      setLinkedAssetIds(prev => [...prev, id]);
                    }
                  }}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border",
                    linkedAssetIds.includes(selectedRelatedAsset.id)
                      ? "bg-saudi-green border-saudi-green text-white hover:bg-saudi-green/90"
                      : "bg-saudi-dark border-saudi-dark text-saudi-gold hover:opacity-90"
                  )}
                >
                  {linkedAssetIds.includes(selectedRelatedAsset.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      إلغاء ربط المعرفة
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5 text-saudi-gold" />
                      ربط هذا الأصل بالفكرة
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
