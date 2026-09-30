import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  TrendingUp, 
  Users, 
  BrainCircuit, 
  FileText, 
  ArrowUpRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Printer,
  Download,
  X,
  Loader2,
  Award,
  ShieldCheck,
  Building,
  Calendar,
  Layers,
  ChevronDown,
  Cpu,
  Briefcase,
  Leaf,
  Hammer,
  Heart,
  Bookmark,
  ListTodo,
  Check,
  RotateCcw,
  Plus,
  Target,
  Percent,
  ArrowDownRight,
  Zap,
  BookOpen,
  Maximize2,
  Minimize2,
  Type,
  Moon,
  Sun,
  Undo2,
  BookText,
  ChevronLeft,
  GitCompare
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Line
} from 'recharts';
import { cn } from '../lib/utils';
import { generateWeeklyReport, generateGapMitigationPlan } from '../services/gemini';
import { exportKnowledgeAssetsPDF } from '../services/assetsPdfExport';
import { getProjectKnowledgeAssets } from '../data/knowledgeAssets';
import GlobalExpertiseMap from './GlobalExpertiseMap';
import { useLanguage } from '../context/LanguageContext';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 600 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 900 },
  { name: 'May', value: 800 },
  { name: 'Jun', value: 1200 },
];

const categoryData = [
  { name: 'هندسة', value: 45, color: '#006C35' },
  { name: 'إدارة مشاريع', value: 30, color: '#C5A059' },
  { name: 'سلاسل إمداد', value: 15, color: '#1A1A1A' },
  { name: 'تقنية معلومات', value: 10, color: '#4A5568' },
];

interface WeeklyReportData {
  reportTitle: string;
  executiveSummary: string;
  achievements: {
    title: string;
    description: string;
    impact: string;
  }[];
  skillsLocalized: {
    skill: string;
    percentage: number;
    expertName: string;
  }[];
  criticalGaps: {
    gapName: string;
    severity: string;
    remediationAction: string;
  }[];
}

const calculateTrendline = (dataPoints: number[]) => {
  const n = dataPoints.length;
  if (n === 0) return { trendValues: [], forecastValue: 0 };
  
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += dataPoints[i];
    sumXY += i * dataPoints[i];
    sumX2 += i * i;
  }
  
  const denominator = (n * sumX2 - sumX * sumX);
  const m = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const c = (sumY - m * sumX) / n;
  
  const trendValues = dataPoints.map((_, i) => Number((m * i + c).toFixed(1)));
  
  // Forecast value for the end of the next quarter. Since Q2 ends in June (index 5), Q3 ends 3 months later (index 8).
  // We project to index 8.
  const forecastIndex = 8;
  const forecastValue = Number((m * forecastIndex + c).toFixed(1));
  
  return { m, c, trendValues, forecastValue };
};

export default function Dashboard({ selectedProject = 'نيوم' }: { selectedProject?: string }) {
  const { language, t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<WeeklyReportData | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Smart Alerts state
  const [alerts, setAlerts] = useState([
    {
      id: 'alert-1',
      department: 'قسم تطوير الطاقة المتجددة (نيوم)',
      gapName: 'تشغيل وصيانة المحللات الكهربائية الكبرى للهيدروجين الأخضر',
      description: 'مغادرة كبير المهندسين الأجانب (خبير تصنيع الخلايا) خلال 30 يوماً دون توثيق بروتوكولات التشغيل الضمنية الحساسة.',
      severity: 'حرجة جداً',
      detectedDate: 'منذ ساعتين',
      isResolved: false
    },
    {
      id: 'alert-2',
      department: 'إدارة الهندسة البحرية (البحر الأحمر)',
      gapName: 'تصاميم الهياكل العائمة المقاومة للملوحة البحرية العالية',
      description: 'اقتراب تسليم الفنادق العائمة مع ضعف توطين المعرفة الضمنية الخاصة بنظام التوازن وتأثير التيارات المائية.',
      severity: 'عالية الخطورة',
      detectedDate: 'منذ يوم',
      isResolved: false
    },
    {
      id: 'alert-3',
      department: 'قطاع اللوجستيات الذكية (أرامكو)',
      gapName: 'بروتوكولات التفريغ الأوتوماتيكي بالذكاء الاصطناعي في الموانئ الرقمية',
      description: 'تقاعد الكادر الفني المشرف الرئيسي وحاجة الكفاءات السعودية الحالية إلى معارف ضمنية دقيقة قبل الاستلام الكامل.',
      severity: 'متوسطة',
      detectedDate: 'منذ يومين',
      isResolved: false
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [isAnalyzingGap, setIsAnalyzingGap] = useState(false);
  const [mitigationPlan, setMitigationPlan] = useState<any | null>(null);
  const [isMitigationOpen, setIsMitigationOpen] = useState(false);
  const [isLaunchingPlan, setIsLaunchingPlan] = useState(false);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('الكل');
  const [savedAssets, setSavedAssets] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('mawred_saved_assets');
    return saved ? JSON.parse(saved) : {};
  });

  const [knowledgeTasks, setKnowledgeTasks] = useState<any[]>(() => {
    const saved = localStorage.getItem('mawred_knowledge_tasks');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'kt1',
        project: 'نيوم',
        title: 'مراجعة كفاءة تصاميم تصريف السيول في المناطق الجبلية الوعرة بمشروع ذا لاين',
        dueDate: 'غداً، ١٢:٠٠ م',
        daysLeft: 1,
        type: 'مراجعة هندسية',
        severity: 'حرجة',
        isCompleted: false,
        notes: 'التحقق من كفاية قطر القنوات ونقاط التحويل المقترحة لموسم الأمطار القادم.'
      },
      {
        id: 'kt2',
        project: 'نيوم',
        title: 'اعتماد مواصفات التبريد بالسوائل لمحللات الهيدروجين الأخضر الوطنية',
        dueDate: 'خلال يومين',
        daysLeft: 2,
        type: 'اعتماد مواصفات',
        severity: 'عالية',
        isCompleted: false,
        notes: 'مقارنة سبائك المغنيسيوم مع النيكل من حيث التوصيل والأمان تحت ضغط ٣٠ بار.'
      },
      {
        id: 'kt3',
        project: 'نيوم',
        title: 'تقييم بروتوكولات الأمن السيبراني لقطار الهيدروجين فائق السرعة',
        dueDate: 'خلال ٤ أيام',
        daysLeft: 4,
        type: 'تقييم أمني',
        severity: 'متوسطة',
        isCompleted: false,
        notes: 'التحقق من كفاءة بروتوكولات الاتصال بين القاطرات ومراكز التحكم الأرضية.'
      },
      {
        id: 'kt4',
        project: 'أرامكو',
        title: 'مراجعة خوارزميات الذكاء الاصطناعي لفرز الشحنات في مستودعات التوزيع فائقة الضخامة',
        dueDate: 'غداً، ٠٢:٠٠ م',
        daysLeft: 1,
        type: 'مراجعة تقنية',
        severity: 'حرجة',
        isCompleted: false,
        notes: 'تحليل معدلات الخطأ في قراءة الأكواد بنماذج الرؤية الحاسوبية الحالية.'
      },
      {
        id: 'kt5',
        project: 'أرامكو',
        title: 'اعتماد نظم الاستشعار والتحكم الذاتي لخطوط الإمداد الهيدروكربونية',
        dueDate: 'خلال ٣ أيام',
        daysLeft: 3,
        type: 'اعتماد فني',
        severity: 'عالية',
        isCompleted: false,
        notes: 'مراجعة فترات الاستجابة لصمامات الغلق التلقائي في حال رصد أي تسرب.'
      },
      {
        id: 'kt6',
        project: 'أرامكو',
        title: 'تقييم تقنيات الاحتجاز المباشر للهواء والانبعاثات الكربونية بالمنطقة الشرقية',
        dueDate: 'خلال أسبوع',
        daysLeft: 7,
        type: 'تقييم استدامة',
        severity: 'متوسطة',
        isCompleted: false,
        notes: 'دراسة كفاءة طاقة الامتصاص وجدوى التخزين الجيولوجي المستقر.'
      },
      {
        id: 'kt7',
        project: 'البحر الأحمر',
        title: 'مراجعة تصاميم الهياكل العائمة المقاومة للملوحة البحرية العالية بالجزر',
        dueDate: 'أمس (متأخر)',
        daysLeft: -1,
        type: 'مراجعة هندسية',
        severity: 'حرجة',
        isCompleted: false,
        notes: 'التأكد من طلاء الحماية ضد التآكل والعمر الافتراضي المقدر بـ ٥٠ عاماً.'
      },
      {
        id: 'kt8',
        project: 'البحر الأحمر',
        title: 'اعتماد بروتوكولات حماية وتكاثر الشعب المرجانية فائقة التكيف',
        dueDate: 'خلال يومين',
        daysLeft: 2,
        type: 'اعتماد بيئي',
        severity: 'عالية',
        isCompleted: false,
        notes: 'مراجعة معدلات البقاء للأشتال المرجانية المستزرعة في الخزانات الحرارية.'
      },
      {
        id: 'kt9',
        project: 'البحر الأحمر',
        title: 'تقييم نظم الطاقة الشمسية وتخزين البطاريات للجزر المنعزلة بالبحر الأحمر',
        dueDate: 'خلال ٥ أيام',
        daysLeft: 5,
        type: 'تقييم طاقة',
        severity: 'متوسطة',
        isCompleted: false,
        notes: 'التحقق من كفاية سعة التخزين لتغطية ٣ أيام متتالية من الغيوم الموسمية.'
      }
    ];
  });

  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [activeKPI, setActiveKPI] = useState<'monthlyGrowth' | 'localization' | 'transfer' | 'speed'>('monthlyGrowth');
  const [analyticsViewMode, setAnalyticsViewMode] = useState<'chart' | 'heatmap' | 'compare'>('chart');
  const [compareProjectA, setCompareProjectA] = useState<string>('نيوم');
  const [compareProjectB, setCompareProjectB] = useState<string>('البحر الأحمر');
  const [compareChecklist, setCompareChecklist] = useState<Record<string, boolean>>({});
  const [extractionFilter, setExtractionFilter] = useState<'all' | 'new' | 'old' | 'popular'>('all');
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ row: string; col: string } | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSeverity, setNewTaskSeverity] = useState('متوسطة');
  const [newTaskType, setNewTaskType] = useState('مراجعة عامة');
  const [aboutTab, setAboutTab] = useState<'vision' | 'mission' | 'impact'>('vision');

  // Focus Reading Mode States
  const [selectedAssetForReading, setSelectedAssetForReading] = useState<any | null>(null);
  const [isFocusReadingMode, setIsFocusReadingMode] = useState<boolean>(false);
  const [readingFontSize, setReadingFontSize] = useState<number>(18);
  const [readingTheme, setReadingTheme] = useState<'sepia' | 'emerald' | 'white' | 'dark'>('sepia');
  const [readingFontFamily, setReadingFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [isAutoscrolling, setIsAutoscrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2);

  const handleCompleteTask = (id: string) => {
    const updated = knowledgeTasks.map(t => t.id === id ? { ...t, isCompleted: true } : t);
    setKnowledgeTasks(updated);
    localStorage.setItem('mawred_knowledge_tasks', JSON.stringify(updated));
  };

  const handleResetTasks = () => {
    localStorage.removeItem('mawred_knowledge_tasks');
    const defaults = [
      {
        id: 'kt1',
        project: 'نيوم',
        title: 'مراجعة كفاءة تصاميم تصريف السيول في المناطق الجبلية الوعرة بمشروع ذا لاين',
        dueDate: 'غداً، ١٢:٠٠ م',
        daysLeft: 1,
        type: 'مراجعة هندسية',
        severity: 'حرجة',
        isCompleted: false,
        notes: 'التحقق من كفاية قطر القنوات ونقاط التحويل المقترحة لموسم الأمطار القادم.'
      },
      {
        id: 'kt2',
        project: 'نيوم',
        title: 'اعتماد مواصفات التبريد بالسوائل لمحللات الهيدروجين الأخضر الوطنية',
        dueDate: 'خلال يومين',
        daysLeft: 2,
        type: 'اعتماد مواصفات',
        severity: 'عالية',
        isCompleted: false,
        notes: 'مقارنة سبائك المغنيسيوم مع النيكل من حيث التوصيل والأمان تحت ضغط ٣٠ بار.'
      },
      {
        id: 'kt3',
        project: 'نيوم',
        title: 'تقييم بروتوكولات الأمن السيبراني لقطار الهيدروجين فائق السرعة',
        dueDate: 'خلال ٤ أيام',
        daysLeft: 4,
        type: 'تقييم أمني',
        severity: 'متوسطة',
        isCompleted: false,
        notes: 'التحقق من كفاءة بروتوكولات الاتصال بين القاطرات ومراكز التحكم الأرضية.'
      },
      {
        id: 'kt4',
        project: 'أرامكو',
        title: 'مراجعة خوارزميات الذكاء الاصطناعي لفرز الشحنات في مستودعات التوزيع فائقة الضخامة',
        dueDate: 'غداً، ٠٢:٠٠ م',
        daysLeft: 1,
        type: 'مراجعة تقنية',
        severity: 'حرجة',
        isCompleted: false,
        notes: 'تحليل معدلات الخطأ في قراءة الأكواد بنماذج الرؤية الحاسوبية الحالية.'
      },
      {
        id: 'kt5',
        project: 'أرامكو',
        title: 'اعتماد نظم الاستشعار والتحكم الذاتي لخطوط الإمداد الهيدروكربونية',
        dueDate: 'خلال ٣ أيام',
        daysLeft: 3,
        type: 'اعتماد فني',
        severity: 'عالية',
        isCompleted: false,
        notes: 'مراجعة فترات الاستجابة لصمامات الغلق التلقائي في حال رصد أي تسرب.'
      },
      {
        id: 'kt6',
        project: 'أرامكو',
        title: 'تقييم تقنيات الاحتجاز المباشر للهواء والانبعاثات الكربونية بالمنطقة الشرقية',
        dueDate: 'خلال أسبوع',
        daysLeft: 7,
        type: 'تقييم استدامة',
        severity: 'متوسطة',
        isCompleted: false,
        notes: 'دراسة كفاءة طاقة الامتصاص وجدوى التخزين الجيولوجي المستقر.'
      },
      {
        id: 'kt7',
        project: 'البحر الأحمر',
        title: 'مراجعة تصاميم الهياكل العائمة المقاومة للملوحة البحرية العالية بالجزر',
        dueDate: 'أمس (متأخر)',
        daysLeft: -1,
        type: 'مراجعة هندسية',
        severity: 'حرجة',
        isCompleted: false,
        notes: 'التأكد من طلاء الحماية ضد التآكل والعمر الافتراضي المقدر بـ ٥٠ عاماً.'
      },
      {
        id: 'kt8',
        project: 'البحر الأحمر',
        title: 'اعتماد بروتوكولات حماية وتكاثر الشعب المرجانية فائقة التكيف',
        dueDate: 'خلال يومين',
        daysLeft: 2,
        type: 'اعتماد بيئي',
        severity: 'عالية',
        isCompleted: false,
        notes: 'مراجعة معدلات البقاء للأشتال المرجانية المستزرعة في الخزانات الحرارية.'
      },
      {
        id: 'kt9',
        project: 'البحر الأحمر',
        title: 'تقييم نظم الطاقة الشمسية وتخزين البطاريات للجزر المنعزلة بالبحر الأحمر',
        dueDate: 'خلال ٥ أيام',
        daysLeft: 5,
        type: 'تقييم طاقة',
        severity: 'متوسطة',
        isCompleted: false,
        notes: 'التحقق من كفاية سعة التخزين لتغطية ٣ أيام متتالية من الغيوم الموسمية.'
      }
    ];
    setKnowledgeTasks(defaults);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: 'kt-custom-' + Date.now(),
      project: selectedProject,
      title: newTaskTitle,
      dueDate: 'خلال ٢٤ ساعة',
      daysLeft: 1,
      type: newTaskType,
      severity: newTaskSeverity,
      isCompleted: false,
      notes: 'تمت إضافة هذه المهمة يدوياً للمتابعة السريعة.'
    };
    const updated = [newTask, ...knowledgeTasks];
    setKnowledgeTasks(updated);
    localStorage.setItem('mawred_knowledge_tasks', JSON.stringify(updated));
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const toggleExpandTask = (id: string) => {
    setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSaveAsset = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...savedAssets, [title]: !savedAssets[title] };
    setSavedAssets(updated);
    localStorage.setItem('mawred_saved_assets', JSON.stringify(updated));
  };

  const getProjectStats = () => {
    switch (selectedProject) {
      case 'البحر الأحمر':
        return {
          totalAssets: '842',
          activeExperts: '28',
          twinningSessions: '94',
          localizationRate: '58%',
          totalAssetsNum: 842,
          activeExpertsNum: 28,
          twinningSessionsNum: 94,
          localizationRateNum: 58
        };
      case 'أرامكو':
        return {
          totalAssets: '1,950',
          activeExperts: '65',
          twinningSessions: '210',
          localizationRate: '72%',
          totalAssetsNum: 1950,
          activeExpertsNum: 65,
          twinningSessionsNum: 210,
          localizationRateNum: 72
        };
      case 'نيوم':
      default:
        return {
          totalAssets: '1,284',
          activeExperts: '42',
          twinningSessions: '156',
          localizationRate: '64%',
          totalAssetsNum: 1284,
          activeExpertsNum: 42,
          twinningSessionsNum: 156,
          localizationRateNum: 64
        };
    }
  };

  const projectStats = getProjectStats();

  // Load saved report from localStorage if any, dynamic based on selectedProject
  useEffect(() => {
    const savedReport = localStorage.getItem(`mawred_weekly_report_${selectedProject}`);
    if (savedReport) {
      try {
        setReport(JSON.parse(savedReport));
      } catch (e) {
        console.error("Error parsing saved report:", e);
        setReport(null);
      }
    } else {
      setReport(null);
    }

    const savedAlerts = localStorage.getItem('mawred_smart_alerts');
    if (savedAlerts) {
      try {
        setAlerts(JSON.parse(savedAlerts));
      } catch (e) {
        console.error("Error parsing saved alerts:", e);
      }
    }
  }, [selectedProject]);

  const saveAlerts = (updatedAlerts: any) => {
    setAlerts(updatedAlerts);
    localStorage.setItem('mawred_smart_alerts', JSON.stringify(updatedAlerts));
  };

  const handleAnalyzeGap = async (alertItem: any) => {
    setSelectedAlert(alertItem);
    setIsAnalyzingGap(true);
    setIsMitigationOpen(true);
    try {
      const plan = await generateGapMitigationPlan(alertItem.gapName, alertItem.department);
      setMitigationPlan(plan);
    } catch (error) {
      console.error("Error generating mitigation plan:", error);
    } finally {
      setIsAnalyzingGap(false);
    }
  };

  const handleLaunchPlan = () => {
    setIsLaunchingPlan(true);
    setTimeout(() => {
      setIsLaunchingPlan(false);
      // Mark as resolved
      if (selectedAlert) {
        const updated = alerts.map(a => a.id === selectedAlert.id ? { ...a, isResolved: true } : a);
        saveAlerts(updated);
      }
      setIsMitigationOpen(false);
    }, 2500);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateWeeklyReport({
        totalAssets: projectStats.totalAssetsNum,
        activeExperts: projectStats.activeExpertsNum,
        twinningSessions: projectStats.twinningSessionsNum,
        localizationRate: projectStats.localizationRateNum
      }, selectedProject);
      setReport(generated);
      localStorage.setItem(`mawred_weekly_report_${selectedProject}`, JSON.stringify(generated));
      setIsReportOpen(true);
    } catch (error) {
      console.error("Error generating weekly report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getSubcategoryName = (category: string, title: string = ''): string => {
    const text = (category + ' ' + title).toLowerCase();
    if (text.includes('هندسة') || text.includes('خرسانة') || text.includes('إنشائي') || text.includes('هياكل') || text.includes('سيول') || text.includes('سلامة')) return 'إنشائي';
    if (text.includes('تقني') || text.includes('أتمتة') || text.includes('أمن') || text.includes('حوسبة') || text.includes('ذكاء')) return 'تقني';
    if (text.includes('إدار') || text.includes('إدارة') || text.includes('سلاسل') || text.includes('لوجست') || text.includes('ضيافة')) return 'إداري';
    if (text.includes('بيئ') || text.includes('طاقة') || text.includes('مائية') || text.includes('مرجان') || text.includes('هيدروجين') || text.includes('كربون')) return 'بيئي';
    return 'إداري'; // fallback
  };

  const filteredAlerts = alerts.filter(a => {
    if (a.isResolved) return false;
    if (!a.department.includes(selectedProject)) return false;
    return activeSubCategory === 'الكل' || getSubcategoryName(a.department, a.gapName) === activeSubCategory;
  });

  const getChartsData = () => {
    switch (selectedProject) {
      case 'البحر الأحمر':
        return {
          growth: [
            { name: 'Jan', value: 300 },
            { name: 'Feb', value: 450 },
            { name: 'Mar', value: 400 },
            { name: 'Apr', value: 700 },
            { name: 'May', value: 650 },
            { name: 'Jun', value: 940 },
          ],
          categories: [
            { name: 'هندسة بحرية', value: 50, color: '#005288' },
            { name: 'استدامة بيئية', value: 25, color: '#00A3E0' },
            { name: 'إدارة سياحية', value: 15, color: '#C5A059' },
            { name: 'تشغيل وصيانة', value: 10, color: '#4A5568' },
          ]
        };
      case 'أرامكو':
        return {
          growth: [
            { name: 'Jan', value: 600 },
            { name: 'Feb', value: 800 },
            { name: 'Mar', value: 750 },
            { name: 'Apr', value: 1100 },
            { name: 'May', value: 1050 },
            { name: 'Jun', value: 1560 },
          ],
          categories: [
            { name: 'أتمتة ولوجستيات', value: 55, color: '#00A3E0' },
            { name: 'أمن سيبراني', value: 20, color: '#008F4C' },
            { name: 'إدارة طاقة', value: 15, color: '#1A1A1A' },
            { name: 'جودة وسلامة', value: 10, color: '#4A5568' },
          ]
        };
      case 'نيوم':
      default:
        return {
          growth: [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 600 },
            { name: 'Mar', value: 500 },
            { name: 'Apr', value: 900 },
            { name: 'May', value: 800 },
            { name: 'Jun', value: 1200 },
          ],
          categories: [
            { name: 'هندسة', value: 45, color: '#006C35' },
            { name: 'إدارة مشاريع', value: 30, color: '#C5A059' },
            { name: 'سلاسل إمداد', value: 15, color: '#1A1A1A' },
            { name: 'تقنية معلومات', value: 10, color: '#4A5568' },
          ]
        };
    }
  };

  const getHeatmapData = () => {
    const columns = ['قراءة الأصول', 'جلسات التوأمة', 'مراجعة المهام', 'الاستعلام الذكي'];
    let rows: string[] = [];
    let cells: Record<string, { value: number; expert: string; details: string }> = {};

    if (selectedProject === 'البحر الأحمر') {
      rows = ['هندسة البيئة البحرية', 'المنشآت العائمة', 'التكامل الطاقي', 'الضيافة المستدامة'];
      cells = {
        'هندسة البيئة البحرية-قراءة الأصول': { value: 85, expert: 'د. يورغن شتراوس', details: 'تفاعل استثنائي مع أبحاث مرونة المرجان الجينية وجدول الفحوصات الفائقة الطيف.' },
        'هندسة البيئة البحرية-جلسات التوأمة': { value: 90, expert: 'د. يورغن شتراوس', details: 'نسبة حضور كاملة من المهندسين السعوديين لجلسات استزراع المرجان الميكروي.' },
        'هندسة البيئة البحرية-مراجعة المهام': { value: 55, expert: 'م. سليم الصغير', details: 'مراجعة دورية لمهام المسح الجغرافي للشواطئ.' },
        'هندسة البيئة البحرية-الاستعلام الذكي': { value: 70, expert: 'نظام مورد الآلي', details: 'استفسارات مكثفة حول فجوات التكاثر الطبيعي للشعب في الصيف.' },

        'المنشآت العائمة-قراءة الأصول': { value: 95, expert: 'م. سليم الصغير', details: 'تحميل مكثف لوثيقة الحسابات الإنشائية الكاثودية لزيادة عمر الهيكل لـ ١٠٠ عام.' },
        'المنشآت العائمة-جلسات التوأمة': { value: 65, expert: 'م. سليم الصغير', details: 'تطبيق عملي لتوطين نظام الإرساء التوتري (Tension-Leg Mooring).' },
        'المنشآت العائمة-مراجعة المهام': { value: 80, expert: 'م. سليم الصغير', details: 'اكتمال ٨ من أصل ١٠ مهام لفحص غاطس الفنادق العائمة.' },
        'المنشآت العائمة-الاستعلام الذكي': { value: 50, expert: 'نظام مورد الآلي', details: 'استشارات حول نسب خلط الخرسانة فائقة النفاذية ضد الملوحة.' },

        'التكامل الطاقي-قراءة الأصول': { value: 60, expert: 'م. فهد الجابري', details: 'اطلاع على معايير كفاءة الخلايا ثنائية الوجه ثنائية الألبييدو.' },
        'التكامل الطاقي-جلسات التوأمة': { value: 75, expert: 'م. فهد الجابري', details: 'جلسة توأمة ناجحة مع مهندسي ميكروجريد الشبكات المستقلة بالجزر.' },
        'التكامل الطاقي-مراجعة المهام': { value: 45, expert: 'م. فهد الجابري', details: 'متابعة تصميم أنظمة التنظيف الروبوتي الجاف للرمل.' },
        'التكامل الطاقي-الاستعلام الذكي': { value: 80, expert: 'نظام مورد الآلي', details: 'طلب توصيات لحجم بطاريات فوسفات الليثيوم الاحتياطية.' },

        'الضيافة المستدامة-قراءة الأصول': { value: 40, expert: 'مستشار الضيافة الدولي', details: 'قراءة دليل تشغيل الفنادق الخالية من البلاستيك.' },
        'الضيافة المستدامة-جلسات التوأمة': { value: 50, expert: 'إدارة الكفاءات', details: 'مقدمة في بروتوكولات حماية بيئة الجزر الطبيعية للزوار.' },
        'الضيافة المستدامة-مراجعة المهام': { value: 35, expert: 'م. سارة الغامدي', details: 'اعتماد المهام الإجرائية لإدارة النفايات الفندقية.' },
        'الضيافة المستدامة-الاستعلام الذكي': { value: 60, expert: 'نظام مورد الآلي', details: 'استفسارات حول تقييم أثر الحركة السياحية على المرجان.' }
      };
    } else if (selectedProject === 'أرامكو') {
      rows = ['سلاسل الإمداد', 'الأمن السيبراني الصناعي', 'إنترنت الأشياء', 'سلامة العمليات'];
      cells = {
        'سلاسل الإمداد-قراءة الأصول': { value: 80, expert: 'م. سارة الغامدي', details: 'تحليل دقيق لوثائق خوارزميات الذكاء الاصطناعي لفرز الشحنات الآلي.' },
        'سلاسل الإمداد-جلسات التوأمة': { value: 95, expert: 'م. سارة الغامدي', details: 'توأمة مكثفة لنقل أسرار تشغيل رافعات الشحن الذكية ورؤية الحاسوب.' },
        'سلاسل الإمداد-مراجعة المهام': { value: 75, expert: 'م. سارة الغامدي', details: 'متابعة أداء الشاحنات ذاتية القيادة (AGVs) في الموانئ الرقمية.' },
        'سلاسل الإمداد-الاستعلام الذكي': { value: 85, expert: 'نظام مورد الآلي', details: 'بحث متقدم في زمن تفريغ الحاويات والتكامل اللوجستي.' },

        'الأمن السيبراني الصناعي-قراءة الأصول': { value: 70, expert: 'د. خالد الدوسري', details: 'قراءة دورية لأحدث معايير التشفير السيادي لخطوط الأنابيب.' },
        'الأمن السيبراني الصناعي-جلسات التوأمة': { value: 60, expert: 'خبراء حماية الأنظمة', details: 'محاكاة اختبار اختراق بروتوكول اتصال LoRaWAN الذكي.' },
        'الأمن السيبراني الصناعي-مراجعة المهام': { value: 85, expert: 'د. خالد الدوسري', details: 'التحقق التام من جدار الحماية لعقد الاستشعار الميكروية.' },
        'الأمن السيبراني الصناعي-الاستعلام الذكي': { value: 90, expert: 'نظام مورد الآلي', details: 'استفسارات طارئة حول محاولات تزييف القراءات وحقن البيانات.' },

        'إنترنت الأشياء-قراءة الأصول': { value: 85, expert: 'د. خالد الدوسري', details: 'دراسة جدوى استبدال بطاريات مستشعرات الأنابيب بعمر ١٠ سنوات.' },
        'إنترنت الأشياء-جلسات التوأمة': { value: 50, expert: 'م. فهد الجابري', details: 'عرض تقني لوحدات الحوسبة الطرفية (Edge Computing) لرصد الضغط.' },
        'إنترنت الأشياء-مراجعة المهام': { value: 90, expert: 'د. خالد الدوسري', details: 'اكتمال فحص صمامات الإغلاق التلقائي الهيدروليكية.' },
        'إنترنت الأشياء-الاستعلام الذكي': { value: 75, expert: 'نظام مورد الآلي', details: 'استفسارات حول التغير الطفيف في درجات الحرارة والترددات الصوتية.' },

        'سلامة العمليات-قراءة الأصول': { value: 90, expert: 'مستشار السلامة الرئيسي', details: 'مراجعة دليل الاستجابة السريعة للتسربات الكيميائية.' },
        'سلامة العمليات-جلسات التوأمة': { value: 80, expert: 'د. خالد الدوسري', details: 'تدريب سيناريو إغلاق الصمامات المستقل عن الغرف المركزية.' },
        'سلامة العمليات-مراجعة المهام': { value: 65, expert: 'إدارة المخاطر', details: 'تفتيش دوري للسلامة والبيئة المهنية بالمنطقة الشرقية.' },
        'سلامة العمليات-الاستعلام الذكي': { value: 60, expert: 'نظام مورد الآلي', details: 'توصيات لتقليل زمن الاستجابة الهيدروليكي تحت ٨٠ ملي ثانية.' }
      };
    } else {
      rows = ['هندسة الإنشاءات', 'الطاقة النظيفة', 'المياه والسيول', 'الأمن السيبراني'];
      cells = {
        'هندسة الإنشاءات-قراءة الأصول': { value: 90, expert: 'د. ستيفن ووكر', details: 'دراسة مواصفات الأنفاق وسرعات الجريان في مرتفعات ذا لاين.' },
        'هندسة الإنشاءات-جلسات التوأمة': { value: 75, expert: 'د. ستيفن ووكر', details: 'توأمة فنية لبناء قنوات التوجيه الهيدروليكية المبطنة.' },
        'هندسة الإنشاءات-مراجعة المهام': { value: 60, expert: 'م. سليم الصغير', details: 'متابعة تصميم الحواجز المرنة للسلال الصخرية (Gabions).' },
        'هندسة الإنشاءات-الاستعلام الذكي': { value: 45, expert: 'نظام مورد الآلي', details: 'استفسارات عادية حول تصريف مياه الأمطار في المنحدرات.' },

        'الطاقة النظيفة-قراءة الأصول': { value: 40, expert: 'م. فهد الجابري', details: 'قراءة وثيقة تبريد الخلايا بالسوائل لمحللات الهيدروجين الأخضر.' },
        'الطاقة النظيفة-جلسات التوأمة': { value: 85, expert: 'م. فهد الجابري', details: 'توأمة مكثفة مع كبار خبراء تصنيع غشاء تبادل البروتونات (PEM).' },
        'الطاقة النظيفة-مراجعة المهام': { value: 70, expert: 'م. فهد الجابري', details: 'مراجعة كفاءة سبائك المغنيسيوم تحت ضغط ٣٠ بار للتخزين.' },
        'الطاقة النظيفة-الاستعلام الذكي': { value: 95, expert: 'نظام مورد الآلي', details: 'استعلامات متكررة جداً حول حركية التبريد وسبل منع الانفجار.' },

        'المياه والسيول-قراءة الأصول': { value: 65, expert: 'د. ستيفن ووكر', details: 'قراءة أطلس السيول والنمذجة الرياضية ثنائية الأبعاد لنيوم.' },
        'المياه والسيول-جلسات التوأمة': { value: 50, expert: 'د. ستيفن ووكر', details: 'مقدمة في بناء السدود الترشيحية الحصادية للمياه الجوفية.' },
        'المياه والسيول-مراجعة المهام': { value: 80, expert: 'د. ستيفن ووكر', details: 'اكتمال فحص ومطابقة قنوات تصريف السيول بمرتفعات ذا لاين.' },
        'المياه والسيول-الاستعلام الذكي': { value: 30, expert: 'نظام مورد الآلي', details: 'تفتيش روتيني لبيانات هيدرولوجيا الجبال.' },

        'الأمن السيبراني-قراءة الأصول': { value: 55, expert: 'خبراء حماية الأنظمة', details: 'مراجعة خوارزميات التشفير بين قاطرات القطار السريع وغرفة التحكم.' },
        'الأمن السيبراني-جلسات التوأمة': { value: 60, expert: 'م. سارة الغامدي', details: 'جلسة محاكاة لصد هجمات الاختراق وحقن الأوامر التكتيكية.' },
        'الأمن السيبراني-مراجعة المهام': { value: 40, expert: 'إدارة أمن النقل', details: 'اعتماد شروط الأمان لتواصل عقد التحكم الأرضية.' },
        'الأمن السيبراني-الاستعلام الذكي': { value: 85, expert: 'نظام مورد الآلي', details: 'استشارات متطورة لتأمين طبقات تواصل القطار المغناطيسي فائق السرعة.' }
      };
    }

    return { columns, rows, cells };
  };

  const getProjectKPIs = () => {
    switch (selectedProject) {
      case 'البحر الأحمر':
        return [
          {
            id: 'monthlyGrowth',
            name: 'معدل النمو الشهري',
            current: '٤.٨٪+',
            target: '٥.٠٪+',
            status: 'warning',
            statusText: 'أقل بـ ٠.٢٪ من الهدف',
            desc: 'معدل زيادة الأصول المعرفية الموطنة شهرياً',
            formula: '((الأصول الجديدة هذا الشهر - أصول الشهر السابق) / أصول الشهر السابق) × ١٠٠',
            trajectory: 'تصاعدي تدريجي',
            tips: 'يُنصح بتكثيف استخلاص المعرفة في قطاع "البيئة المائية" وخاصةً الشعب المرجانية الفائقة للتغلب على الفارق وسد الفجوة الحالية.'
          },
          {
            id: 'localization',
            name: 'نسبة التوطين الإجمالية',
            current: '٦٨٪',
            target: '٧٥٪',
            status: 'warning',
            statusText: 'المتبقي ٧٪ للمستهدف',
            desc: 'المعارف الوطنية الموطنة مقارنة بالمتطلبات المعرفية للمشروع',
            formula: '(الأصول المعرفية المعتمدة / إجمالي المعارف المطلوبة) × ١٠٠',
            trajectory: 'نمو مستقر',
            tips: 'توطين مواصفات الهياكل العائمة المقاومة للملوحة العالية بالجزر كأصل وطني سيرفع مؤشر التوطين بمقدار ٣.٥٪ فورياً.'
          },
          {
            id: 'transfer',
            name: 'كفاءة انتقال المعرفة',
            current: '٨٨٪',
            target: '٩٠٪',
            status: 'success',
            statusText: 'مستوى ممتاز وقريب من الهدف',
            desc: 'تقييم كفاءة وملاءمة التوأمة المعرفية للكوادر الوطنية',
            formula: '(عدد الجلسات الناجحة / عدد التوأمات المستهدفة) × ١٠٠',
            trajectory: 'قوي ومستقر',
            tips: 'تفاعل المتدربين مع الخبراء الدوليين في المنتجعات ممتاز. يوصى بجدولة لقاء تقييمي شهري لتعزيز جودة المخرجات.'
          },
          {
            id: 'speed',
            name: 'متوسط زمن سد الفجوات',
            current: '٤.٢ أيام',
            target: '٥.٠ أيام',
            status: 'success',
            statusText: 'أسرع بـ ٠.٨ يوم من المستهدف',
            desc: 'الفترة المستغرقة من رصد الفجوة حتى اعتماد شريك المعرفة للحل',
            formula: 'مجموع أيام إغلاق الفجوات / عدد الفجوات المعالجة',
            trajectory: 'تحسن مستمر',
            tips: 'تساهم أدوات الاستجابة التلقائية بمورد في تقليص زمن التنسيق وحل المشكلات الهندسية واللوجستية بنسبة ٣٠٪.'
          }
        ];
      case 'أرامكو':
        return [
          {
            id: 'monthlyGrowth',
            name: 'معدل النمو الشهري',
            current: '٦.٢٪+',
            target: '٥.٥٪+',
            status: 'success',
            statusText: 'متجاوز للمستهدف بـ ٠.٧٪',
            desc: 'معدل زيادة الأصول المعرفية الموطنة شهرياً',
            formula: '((الأصول الجديدة هذا الشهر - أصول الشهر السابق) / أصول الشهر السابق) × ١٠٠',
            trajectory: 'متسارع وقوي',
            tips: 'أداء استثنائي رائع مدفوع بأتمتة الفرز في مستودعات التوزيع وتوطين بروتوكولات التفريغ الذكي بالموانئ الرقمية.'
          },
          {
            id: 'localization',
            name: 'نسبة التوطين الإجمالية',
            current: '٨٤٪',
            target: '٨٥٪',
            status: 'success',
            statusText: 'على وشك تحقيق المستهدف (١٪ متبقي)',
            desc: 'المعارف الوطنية الموطنة مقارنة بالمتطلبات المعرفية للمشروع',
            formula: '(الأصول المعرفية المعتمدة / إجمالي المعارف المطلوبة) × ١٠٠',
            trajectory: 'تحسن تصاعدي',
            tips: 'اعتماد صمامات التحكم والغلق التلقائي الذكية لخطوط الإمداد سيتجاوز بك المستهدف الاستراتيجي السنوي قبل الموعد.'
          },
          {
            id: 'transfer',
            name: 'كفاءة انتقال المعرفة',
            current: '٩٢٪',
            target: '٩٠٪',
            status: 'success',
            statusText: 'متجاوز للمستهدف بـ ٢٪',
            desc: 'تقييم كفاءة وملاءمة التوأمة المعرفية للكوادر الوطنية',
            formula: '(عدد الجلسات الناجحة / عدد التوأمات المستهدفة) × ١٠٠',
            trajectory: 'تصاعدي قوي',
            tips: 'إقبال وشغف عالي من الكوادر الصناعية الوطنية مع الخبراء يعزز من كفاءة بروتوكولات الأمن السيبراني والأتمتة.'
          },
          {
            id: 'speed',
            name: 'متوسط زمن سد الفجوات',
            current: '٢.٨ أيام',
            target: '٣.٥ أيام',
            status: 'success',
            statusText: 'أسرع بـ ٠.٧ يوم من المستهدف',
            desc: 'الفترة المستغرقة من رصد الفجوة حتى اعتماد شريك المعرفة للحل',
            formula: 'مجموع أيام إغلاق الفجوات / عدد الفجوات المعالجة',
            trajectory: 'سرعة استثنائية',
            tips: 'التكامل التقني الفوري لخطوط الإمداد مع غرف المراقبة والتحكم يقلص الفترات البينية لمعالجة الثغرات بنجاح.'
          }
        ];
      case 'نيوم':
      default:
        return [
          {
            id: 'monthlyGrowth',
            name: 'معدل النمو الشهري',
            current: '٥.٤٪+',
            target: '٦.٠٪+',
            status: 'warning',
            statusText: 'أقل بـ ٠.٦٪ من الهدف',
            desc: 'معدل زيادة الأصول المعرفية الموطنة شهرياً',
            formula: '((الأصول الجديدة هذا الشهر - أصول الشهر السابق) / أصول الشهر السابق) × ١٠٠',
            trajectory: 'تصاعدي مستمر',
            tips: 'يُنصح بجدولة جلستي عمل إضافيتين أسبوعياً في قطاع "هندسة تصريف السيول" بالمناطق الوعرة بذا لاين لمعالجة الفارق.'
          },
          {
            id: 'localization',
            name: 'نسبة التوطين الإجمالية',
            current: '٧٢٪',
            target: '٨٠٪',
            status: 'warning',
            statusText: 'المتبقي ٨٪ للمستهدف',
            desc: 'المعارف الوطنية الموطنة مقارنة بالمتطلبات المعرفية للمشروع',
            formula: '(الأصول المعرفية المعتمدة / إجمالي المعارف المطلوبة) × ١٠٠',
            trajectory: 'نمو قوي',
            tips: 'توطين تكنولوجيا التبريد بالسوائل لمحللات الهيدروجين الأخضر كأصل معرفي وطني سيزيد المؤشر بمقدار ٢.٤٪ فور الاعتماد.'
          },
          {
            id: 'transfer',
            name: 'كفاءة انتقال المعرفة',
            current: '٨٥٪',
            target: '٨٥٪',
            status: 'success',
            statusText: 'مطابق للمستهدف تماماً',
            desc: 'تقييم كفاءة وملاءمة التوأمة المعرفية للكوادر الوطنية',
            formula: '(عدد الجلسات الناجحة / عدد التوأمات المستهدفة) × ١٠٠',
            trajectory: 'مستقر ومثالي',
            tips: 'الأداء مطابق تماماً للخطط الاستراتيجية المرسومة. استمر في تنفيذ بروتوكولات المتابعة الأسبوعية لتجنب أي تراخٍ.'
          },
          {
            id: 'speed',
            name: 'متوسط زمن سد الفجوات',
            current: '٣.٦ أيام',
            target: '٤.٠ أيام',
            status: 'success',
            statusText: 'أسرع بـ ٠.٤ يوم من المستهدف',
            desc: 'الفترة المستغرقة من رصد الفجوة حتى اعتماد شريك المعرفة للحل',
            formula: 'مجموع أيام إغلاق الفجوات / عدد الفجوات المعالجة',
            trajectory: 'كفاءة ممتازة',
            tips: 'المعالجة الذكية الفورية المدعومة بالذكاء الاصطناعي تقلل الحاجة للاستشارات المطولة وتسد الفجوات بسرعة فائقة.'
          }
        ];
    }
  };

  const currentKPIs = getProjectKPIs();

  const { growth: currentGrowthData, categories: currentCategoryData } = getChartsData();

  const getChartDataWithTrendline = () => {
    const baseData = activeKPI === 'monthlyGrowth' ? currentGrowthData : 
      activeKPI === 'localization' ? currentGrowthData.map((d, index) => ({ name: d.name, value: Math.round(30 + index * 7.5) })) :
      activeKPI === 'transfer' ? currentGrowthData.map((d, index) => ({ name: d.name, value: Math.round(70 + index * 3.4) })) :
      currentGrowthData.map((d, index) => ({ name: d.name, value: Number((5.5 - index * 0.45).toFixed(1)) }));

    const values = baseData.map(d => d.value);
    const { trendValues, forecastValue } = calculateTrendline(values);

    // Map historical values with their trend value
    const chartData = baseData.map((d, i) => ({
      name: d.name,
      value: d.value,
      trend: trendValues[i]
    }));

    // Append forecast point for end of next quarter (September)
    chartData.push({
      name: 'سبتمبر (تنبؤ Q3)',
      value: null,
      trend: forecastValue
    } as any);

    return { chartData, forecastValue };
  };

  const getProjectKPIValues = (proj: string, kpiId: string) => {
    let growthData = [];
    if (proj === 'البحر الأحمر') {
      growthData = [
        { name: 'Jan', value: 300 },
        { name: 'Feb', value: 450 },
        { name: 'Mar', value: 400 },
        { name: 'Apr', value: 700 },
        { name: 'May', value: 650 },
        { name: 'Jun', value: 940 },
      ];
    } else if (proj === 'أرامكو') {
      growthData = [
        { name: 'Jan', value: 600 },
        { name: 'Feb', value: 800 },
        { name: 'Mar', value: 750 },
        { name: 'Apr', value: 1100 },
        { name: 'May', value: 1050 },
        { name: 'Jun', value: 1560 },
      ];
    } else { // نيوم
      growthData = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 600 },
        { name: 'Mar', value: 500 },
        { name: 'Apr', value: 900 },
        { name: 'May', value: 800 },
        { name: 'Jun', value: 1200 },
      ];
    }

    if (kpiId === 'monthlyGrowth') {
      return growthData;
    } else if (kpiId === 'localization') {
      return growthData.map((d, index) => ({ name: d.name, value: Math.round(30 + index * 7.5) }));
    } else if (kpiId === 'transfer') {
      return growthData.map((d, index) => ({ name: d.name, value: Math.round(70 + index * 3.4) }));
    } else { // speed
      return growthData.map((d, index) => ({ name: d.name, value: Number((5.5 - index * 0.45).toFixed(1)) }));
    }
  };

  const getComparisonChartData = (projA: string, projB: string, kpiId: string) => {
    const dataA = getProjectKPIValues(projA, kpiId);
    const dataB = getProjectKPIValues(projB, kpiId);
    
    return dataA.map((d, idx) => ({
      name: d.name,
      valueA: d.value,
      valueB: dataB[idx]?.value || 0
    }));
  };

  const handleExportKPIsPDF = () => {
    setIsExportingPDF(true);

    const reportContainer = document.createElement('div');
    reportContainer.id = 'kpi-report-pdf-template';
    reportContainer.style.position = 'fixed';
    reportContainer.style.top = '-10000px';
    reportContainer.style.left = '-10000px';
    reportContainer.style.width = '850px';
    reportContainer.style.padding = '40px';
    reportContainer.style.backgroundColor = '#ffffff';
    reportContainer.style.color = '#111827';
    reportContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    reportContainer.style.direction = 'rtl';
    reportContainer.style.zIndex = '-9999';

    const kpisList = getProjectKPIs();
    const stats = getProjectStats();
    
    const projectStatusMap: Record<string, string> = {
      'البحر الأحمر': 'مستقر وتصاعدي',
      'أرامكو': 'متسارع واستثنائي',
      'نيوم': 'تصاعدي مستمر - مع وجود ثغرات طفيفة'
    };
    
    const overallStatus = projectStatusMap[selectedProject] || 'نشط ومستقر';

    reportContainer.innerHTML = `
      <div class="border-[6px] border-[#006C35] p-8 bg-white relative overflow-hidden" style="min-height: 1050px; box-sizing: border-box;">
        <!-- Top Golden Header Accent -->
        <div class="absolute top-0 right-0 left-0 h-3 bg-gradient-to-r from-[#C5A059] via-[#006C35] to-[#C5A059]"></div>
        
        <!-- Royal State Header -->
        <div class="flex items-center justify-between border-b-2 border-gray-100 pb-6 mb-8 mt-4">
          <div class="text-right">
            <h1 class="text-xl font-black text-[#006C35] leading-tight" style="font-family: system-ui, sans-serif;">المملكة العربية السعودية</h1>
            <p class="text-[10px] font-bold text-gray-400 mt-1">منصة مورد الوطنية لتوطين المعرفة</p>
            <p class="text-[9px] font-medium text-gray-400">لجنة الإشراف والمتابعة الاستراتيجية</p>
          </div>
          
          <!-- Elegant Crest Logo Placeholder -->
          <div class="flex flex-col items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-[#006C35]/10 border border-[#C5A059]/40 flex items-center justify-center">
              <span class="text-[#C5A059] font-black text-lg">م</span>
            </div>
            <span class="text-[10px] text-[#C5A059] font-bold tracking-widest mt-1">MAWRID</span>
          </div>
          
          <div class="text-left" style="direction: ltr;">
            <p class="text-[10px] font-bold text-gray-400">DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
            <p class="text-[9px] text-gray-400">REPORT ID: MWR-${selectedProject.toUpperCase()}-2026</p>
            <p class="text-[9px] text-gray-400">CONFIDENTIALITY: HIGH</p>
          </div>
        </div>

        <!-- Document Main Title -->
        <div class="text-center mb-8">
          <span class="text-[10px] font-bold text-[#C5A059] tracking-widest uppercase bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/20" style="font-family: system-ui, sans-serif;">
            تقرير الأداء الاستراتيجي للمؤشرات والتحليلات
          </span>
          <h2 class="text-2xl font-extrabold text-[#1A1A1A] mt-3" style="font-family: system-ui, sans-serif;">
            تقرير تقييم مؤشرات الأداء الاستراتيجية (KPIs)
          </h2>
          <div class="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500 font-medium">
            <span>المشروع المستهدف:</span>
            <span class="text-[#006C35] font-black underline" style="text-decoration-color: #C5A059;">${selectedProject}</span>
            <span class="text-gray-300">|</span>
            <span>حالة المشروع:</span>
            <span class="text-green-700 font-bold">${overallStatus}</span>
          </div>
        </div>

        <!-- Project Performance Metadata Grid -->
        <div class="grid grid-cols-4 gap-4 mb-8 bg-gray-50 border border-gray-100 p-4 rounded-xl">
          <div class="text-center border-l border-gray-200">
            <span class="text-[10px] text-gray-400 font-bold block mb-1">إجمالي الأصول المعرفة</span>
            <span class="text-lg font-black text-[#006C35]">${stats.totalAssets}</span>
          </div>
          <div class="text-center border-l border-gray-200">
            <span class="text-[10px] text-gray-400 font-bold block mb-1">الكوادر والعلماء النشطين</span>
            <span class="text-lg font-black text-[#006C35]">${stats.activeExperts}</span>
          </div>
          <div class="text-center border-l border-gray-200">
            <span class="text-[10px] text-gray-400 font-bold block mb-1">جلسات التوأمة المنجزة</span>
            <span class="text-lg font-black text-[#006C35]">${stats.twinningSessions}</span>
          </div>
          <div class="text-center">
            <span class="text-[10px] text-gray-400 font-bold block mb-1">معدل التوطين الكلي</span>
            <span class="text-lg font-black text-[#C5A059]">${stats.localizationRate}</span>
          </div>
        </div>

        <!-- Section Title: KPIs Performance Table -->
        <div class="border-r-4 border-[#C5A059] pr-3 mb-4">
          <h3 class="text-base font-bold text-[#1A1A1A]">أولاً: أداء المؤشرات الرئيسية مقارنة بالمستهدف الاستراتيجي</h3>
          <p class="text-xs text-gray-500 mt-0.5">مقارنة دقيقة للقيم الفعلية المحققة مقابل المستهدفات الموضوعة لدعم صناعة القرار:</p>
        </div>

        <!-- KPIs Table -->
        <table class="w-full text-right mb-8 border border-gray-200 rounded-lg overflow-hidden" style="border-collapse: collapse;">
          <thead>
            <tr class="bg-[#006C35] text-white text-xs">
              <th class="p-3 border-b border-gray-200 font-bold" style="width: 25%;">اسم مؤشر الأداء</th>
              <th class="p-3 border-b border-gray-200 font-bold text-center" style="width: 15%;">القيمة الفعلية</th>
              <th class="p-3 border-b border-gray-200 font-bold text-center" style="width: 15%;">المستهدف الاستراتيجي</th>
              <th class="p-3 border-b border-gray-200 font-bold text-center" style="width: 25%;">الانحراف وحالة التقييم</th>
              <th class="p-3 border-b border-gray-200 font-bold" style="width: 20%;">الاتجاه الحالي</th>
            </tr>
          </thead>
          <tbody class="text-xs">
            ${kpisList.map((kpi, idx) => `
              <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-100">
                <td class="p-3 font-bold text-[#1A1A1A]">${kpi.name}</td>
                <td class="p-3 font-black text-[#006C35] text-center" style="direction: ltr;">${kpi.current}</td>
                <td class="p-3 font-bold text-gray-600 text-center" style="direction: ltr;">${kpi.target}</td>
                <td class="p-3 text-center">
                  <span class="px-2.5 py-1 rounded-md font-bold text-[10px] ${kpi.status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}">
                    ${kpi.statusText}
                  </span>
                </td>
                <td class="p-3 text-gray-500 font-semibold">${kpi.trajectory}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Section Title: Recommendations -->
        <div class="border-r-4 border-[#006C35] pr-3 mb-4">
          <h3 class="text-base font-bold text-[#1A1A1A]">ثانياً: التوجيهات الاستراتيجية والتوصيات الذكية لكل مؤشر</h3>
          <p class="text-xs text-gray-500 mt-0.5">خطوات عملية وتدخلات فورية مصممة خصيصاً للتغلب على الفجوات وتعظيم معدلات التوطين:</p>
        </div>

        <!-- Recommendations Grid -->
        <div class="space-y-4 mb-10">
          ${kpisList.map(kpi => `
            <div class="p-4 bg-gray-50 border-r-4 ${kpi.status === 'success' ? 'border-green-600' : 'border-amber-500'} rounded-l-xl">
              <div class="flex items-center justify-between mb-1.5">
                <h4 class="font-bold text-sm text-[#1A1A1A]">${kpi.name} (${kpi.current})</h4>
                <span class="text-[10px] font-bold ${kpi.status === 'success' ? 'text-green-600' : 'text-amber-600'}">توصية نشطة</span>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed font-medium">${kpi.tips}</p>
              <div class="mt-2 text-[9px] text-gray-400 font-semibold font-mono" style="direction: ltr;">
                Formula: ${kpi.formula}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Administrative Approval and Signing Section -->
        <div class="mt-12 border-t border-gray-200 pt-8">
          <div class="grid grid-cols-2 gap-8 text-center">
            <div>
              <p class="text-xs font-bold text-gray-400 mb-10">توقيع واعتماد مستشار التوطين المعرفي:</p>
              <div class="w-40 mx-auto border-b border-gray-400"></div>
              <p class="text-[10px] font-bold text-gray-500 mt-2">منصة مورد للتنمية والسيادة المعرفية</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 mb-10">توقيع مدير عام قطاع التوطين والخبرات:</p>
              <div class="w-40 mx-auto border-b border-gray-400"></div>
              <p class="text-[10px] font-bold text-gray-500 mt-2">اللجنة العليا للمشاريع الكبرى</p>
            </div>
          </div>
        </div>

        <!-- Footer watermark -->
        <div class="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[9px] text-gray-300 font-mono">
          <span>SECURE GENERATION ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
          <span>صفحة 1 من 1</span>
          <span>© 2026 مورد لتوطين المعرفة - رؤية 2030</span>
        </div>
      </div>
    `;

    document.body.appendChild(reportContainer);

    setTimeout(() => {
      html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
        pdf.save(`Mawred-KPI-Report-${selectedProject}-2026.pdf`);
        
        document.body.removeChild(reportContainer);
        setIsExportingPDF(false);
      }).catch((err) => {
        console.error("Error generating PDF:", err);
        if (document.getElementById('kpi-report-pdf-template')) {
          document.body.removeChild(reportContainer);
        }
        setIsExportingPDF(false);
      });
    }, 150);
  };

  const [isExportingKnowledgePDF, setIsExportingKnowledgePDF] = useState(false);

  const handleExportKnowledgeAssetsPDF = async () => {
    if (isExportingKnowledgePDF) return;
    try {
      setIsExportingKnowledgePDF(true);
      const assets = getProjectKnowledgeAssets(selectedProject);
      await exportKnowledgeAssetsPDF({
        project: selectedProject,
        assets: assets
      });
    } catch (err) {
      console.error("Error exporting knowledge assets PDF:", err);
    } finally {
      setIsExportingKnowledgePDF(false);
    }
  };

  const getRecentActivities = () => {
    switch (selectedProject) {
      case 'البحر الأحمر':
        return [
          { title: 'تصاميم الهياكل العائمة المقاومة للملوحة البحرية العالية', expert: 'م. سليم الصغير', date: 'منذ يوم', status: 'pending', category: 'هندسة بحرية', ageDays: 1, circulation: 1420 },
          { title: 'حماية وتكاثر الشعب المرجانية الفائقة التكيف', expert: 'د. يورغن شتراوس', date: 'منذ يومين', status: 'verified', category: 'بيئة مائية', ageDays: 2, circulation: 2850 },
          { title: 'إدارة الطاقة الشمسية في الجزر المنعزلة بالبحر الأحمر', expert: 'م. فهد الجابري', date: 'منذ ٣ أيام', status: 'verified', category: 'طاقة متجددة', ageDays: 3, circulation: 1980 },
          { title: 'نظم حجز التذاكر والتحقق البيومتري للمنتجعات الفاخرة', expert: 'م. أمل العتيبي', date: 'منذ ٤ أيام', status: 'verified', category: 'تقنية معلومات', ageDays: 4, circulation: 920 },
          { title: 'بروتوكولات الضيافة الفاخرة وإدارة تجارب الزوار الجدد', expert: 'جون سميث', date: 'منذ أسبوع', status: 'verified', category: 'إدارة سياحية', ageDays: 7, circulation: 560 },
        ];
      case 'أرامكو':
        return [
          { title: 'بروتوكولات التفريغ الأوتوماتيكي بالذكاء الاصطناعي في الموانئ الرقمية', expert: 'م. سارة الغامدي', date: 'منذ يومين', status: 'verified', category: 'لوجستيات', ageDays: 2, circulation: 3410 },
          { title: 'أتمتة الفرز في مستودعات التوزيع فائقة الضخامة', expert: 'د. ستيفن ووكر', date: 'منذ ٤ أيام', status: 'pending', category: 'أتمتة', ageDays: 4, circulation: 1210 },
          { title: 'نظم الاستشعار والتحكم الذاتي لخطوط الإمداد الهيدروكربونية', expert: 'م. خالد الدوسري', date: 'منذ أسبوع', status: 'verified', category: 'سلامة صناعية', ageDays: 7, circulation: 1890 },
          { title: 'رصد الانبعاثات الكربونية وتقنيات الاحتجاز المباشر للهواء', expert: 'د. ياسمين الحربي', date: 'منذ ٨ أيام', status: 'verified', category: 'استدامة بيئية', ageDays: 8, circulation: 2430 },
        ];
      case 'نيوم':
      default:
        return [
          { title: 'إدارة مخاطر السيول في المناطق الجبلية', expert: 'د. ستيفن ووكر', date: 'منذ ساعتين', status: 'verified', category: 'هندسة مدنية', ageDays: 0.1, circulation: 4210 },
          { title: 'بروتوكولات التبريد بالسوائل والمغنيسيوم لمحللات الهيدروجين', expert: 'م. خالد الدوسري', date: 'منذ 5 ساعات', status: 'pending', category: 'طاقة متجددة', ageDays: 0.2, circulation: 1850 },
          { title: 'تحسين سلاسل الإمداد اللوجستية في تشييد الأنفاق الضخمة', expert: 'جون دو', date: 'أمس', status: 'verified', category: 'لوجستيات', ageDays: 1, circulation: 2940 },
          { title: 'نظم الحوسبة المتطورة والتحكم الذاتي لقطار الهيدروجين فائق السرعة', expert: 'د. ليلى السالم', date: 'منذ ٣ أيام', status: 'verified', category: 'تقنية معلومات', ageDays: 3, circulation: 1530 },
        ];
    }
  };

  const getAssetDetailedContent = (title: string, defaultExpert?: string, defaultCategory?: string) => {
    switch (title) {
      // Red Sea
      case 'تصاميم الهياكل العائمة المقاومة للملوحة البحرية العالية':
        return {
          title,
          expert: 'م. سليم الصغير',
          role: 'كبير مهندسي الإنشاءات البحرية ورئيس التوطين الهيكلي',
          classification: 'سري للغاية - محمي بموجب لوائح الموانئ والسيادة المائية',
          date: 'أبريل ٢٠٢٦',
          readTime: '٤ دقائق',
          category: 'هندسة بحرية',
          summary: 'مواصفات ودراسة حركية حول خلطات الخرسانة فائقة النفاذية، وحسابات الوقاية الكاثودية لزيادة العمر الافتراضي للمنشآت العائمة بالبحر الأحمر إلى ١٠٠ عام دون تدهور إنشائي.',
          sections: [
            {
              heading: '١. التحديات المناخية وظروف الملوحة الاستثنائية',
              text: 'تعد ملوحة البحر الأحمر من بين الأعلى عالمياً (تتجاوز ٤١ جزءاً في الألف) مقارنة بمتوسط ملوحة المحيطات (٣٥ جزءاً في الألف)، مما يسرع التآكل الكهروكيميائي للخرسانات المسلحة بالحديد بنسبة ٢٥٠٪. يتطلب تشييد الفنادق والمنتجعات والمنصات العائمة هندسة كيميائية وهيكلية متطورة تصمد لقرن كامل دون تسرب للرطوبة أو تفتت الركام.'
            },
            {
              heading: '٢. الخرسانة البوليمرية المتقدمة ونسب السيليكا النانوية الفعالة',
              text: 'لتحقيق الديمومة والوقاية من الكلوريدات، تم تصميم خلطة خرسانية بوليمرية خالية من الإسمنت البورتلاندي التقليدي أو معززة به بنسبة استبدال عالية. تم خلط الملاط بـ ١٥٪ رماد متطاير فئة F و٨٪ غبار السيليكا النانوي (Nano-Silica) لملء المسام الشعرية. معامل الماء إلى المادة الرابطة (Water-Binder Ratio) ضُبط عند ٠.٢٦ للوصول إلى مقاومة نفاذية مطلقة.'
            },
            {
              heading: '٣. نظام الوقاية الكاثودية بالتيار المسلط (ICCP)',
              text: 'لمقاومة أي تسرب شارد في البيئة البحرية، تم دمج شبكة حماية كاثودية بجهد مستمر مسلط (ICCP) مدعومة بأنودات تضحية استراتيجية من سبائك الألومنيوم والزنك والإنديوم (Al-Zn-In) موزعة هيدروديناميكياً على نقاط الإجهاد السفلية للهيكل لمنع تفكك ذرات الفولاذ المحاطة بالبلمرة الزجاجية.'
            },
            {
              heading: '٤. أنظمة الإرساء التوتري (Tension-Leg Mooring) وامتصاص طاقة الأمواج',
              text: 'لثبات المكونات العائمة في مواجهة الرياح والتيارات البحرية النشطة، اعتمدنا نظام ربط شد مسبق ذو أوتاد توترية مصنوعة من ألياف الأراميد الاصطناعية فائقة المقاومة والمغلفة بالبولي إيثيلين عالي الكثافة. يبلغ معامل السحب الهيدروديناميكي للغاطس (Cd ≤ 0.45)، مما يحد من اهتزازات الهيكل لمدى لا يتجاوز ±٥ سم أثناء عواصف البحر الأحمر الموسمية.'
            }
          ]
        };
      case 'حماية وتكاثر الشعب المرجانية الفائقة التكيف':
        return {
          title,
          expert: 'د. يورغن شتراوس',
          role: 'أخصائي بيولوجيا البحار وشعب المرجان ورئيس وحدة الإحياء البيئي',
          classification: 'بيانات علمية عامة وموطنة لتطوير السياحة البيئية والمستدامة',
          date: 'مايو ٢٠٢٦',
          readTime: '٥ دقائق',
          category: 'بيئة مائية',
          summary: 'بروتوكولات عملية لتسريع نمو الشعب المرجانية بمقدار ٣٠ ضعفاً عبر التجزئة الدقيقة واختيار سلالات الطحالب المستقرة حرارياً.',
          sections: [
            {
              heading: '١. المرونة الجينية لشعب البحر الأحمر كميزة وطنية سيادية',
              text: 'تتميز شعب البحر الأحمر بمرونة جينية فريدة تمكنها من تحمل درجات حرارة مياه تصل لـ ٣٤ درجة مئوية دون حدوث ظاهرة الابيضاض الشهيرة التي تدمر بيئات المرجان العالمية. يمثل هذا الأصل المعرفي كنزاً لتوطين تكنولوجيا الهندسة البيئية المرجانية وإعادة إحياء البيئات المتضررة دولياً.'
            },
            {
              heading: '٢. تكنولوجيا التجزئة الميكروية المتسارعة (Micro-Fragmentation)',
              text: 'يتم استئصال جزء صغير من مستعمرات المرجان الأم وتقطيعه بمنشار ماسي مبرد بالماء إلى أجزاء دقيقة جداً (١-٣ ملم). هذا الإجراء يستثير آلية النمو الخلوي المتسارعة للمرجان، مما يزيد سرعة الترسيب الكالسيومي بمقدار ٣٠ إلى ٤٠ ضعفاً مقارنة بمعدلات النمو البري في البيئة الطبيعية.'
            },
            {
              heading: '٣. التلقيح الخلوي بالطحالب التكافلية (Symbiodiniaceae)',
              text: 'يتم عزل السلالات الجينية لطحالب Symbiodiniaceae المستقرة حرارياً (من عائلات Cladocopium و Durusdinium) وحقن الشتلات المرجانية بها. يسهم هذا التكامل في بناء جيل جديد فائق المقاومة لتقلبات درجات الحرارة والابيضاض وتأمين مستعمرات مستدامة لسنوات قادمة.'
            },
            {
              heading: '٤. القواعد الكربوناتية المطبوعة ثلاثياً والمراقبة الهيدروغرافية بالذكاء الاصطناعي',
              text: 'تثبت الشتلات الفائقة على ركائز مطبوعة ثلاثية الأبعاد بمركبات الكالسيوم والأراجونيت المماثلة للهيكل المرجاني الطبيعي. وتتم حماية وتتبع المستعمرات عبر غواصات ذكية بدون طيار وكاميرات فائقة الطيف (Hyperspectral) لقياس صبغات الكلوروفيل وصحة الأنسجة الفورية وتوجيه أعمال الغوص الاستكشافي بكفاءة.'
            }
          ]
        };
      case 'إدارة الطاقة الشمسية في الجزر المنعزلة بالبحر الأحمر':
        return {
          title,
          expert: 'م. فهد الجابري',
          role: 'مدير قطاع الشبكات والميكروجريد والطاقة المتكاملة',
          classification: 'سري داخلي - حماية مصادر الطاقة النظيفة بجزر نيوم وريد سي',
          date: 'يونيو ٢٠٢٦',
          readTime: '٣ دقائق',
          category: 'طاقة متجددة',
          summary: 'تخطيط وتكامل ميكروجريد الجزر المستقلة بالكامل، مع دراسة حجم التخزين واستخدام الروبوتات الذكية للتنظيف الجاف لمنع تدهور كفاءة التوليد الشمسي.',
          sections: [
            {
              heading: '١. الميكروجريد المستقل والهندسة الخالية من الكربون',
              text: 'يتم توليد الطاقة بنسبة ١٠٠٪ من مصادر نظيفة في الجزر المستهدفة كجزء من أهداف الاستدامة الصفرية. التحدي التشغيلي الأساسي يكمن في الحفاظ على ثبات الجهد والتردد للشبكات المستقلة تماماً (Off-grid) في ظل غياب خطوط الربط القارية والاعتماد الكامل على التوليد الموزع.'
            },
            {
              heading: '٢. الخلايا ثنائية الوجه (Bifacial Panels) والاستفادة من ألبيدو الرمال البيضاء',
              text: 'تم اختيار خلايا السيليكون أحادي البلورة ثنائية الوجه لاستغلال الإشعاع الساقط من الأعلى والمنعكس من الأسفل (Albedo) عن رمال الجزر شديدة البياض (التي تمتلك معامل ألبيدو ممتاز يتجاوز ٠.٤٠). ترفع هذه الميزة الكفاءة التشغيلية وحصيلة التوليد بنسبة ١٨٪ للمتر المربع الواحد.'
            },
            {
              heading: '٣. بطاريات حديد وفوسفات الليثيوم (LFP) والتوليد الهيدروجيني الداعم',
              text: 'تُربط حقول التوليد بمصفوفات بطاريات BESS من خلايا LFP الآمنة التي تدوم لـ ٨٠٠٠ دورة تفريغ كاملة. لضمان الأمان السيادي، يُخزن جزء من الفائض كهيدروجين أخضر محلي لإعادة توليد الكهرباء بالتوربينات الهيدروجينية في فترات الغبار الكثيف أو العواصف الممتدة لأكثر من ٧٢ ساعة متصلة.'
            },
            {
              heading: '٤. بروتوكولات الكنس الروبوتي الجاف وحماية الخلايا',
              text: 'تتراكم الأتربة والأملاح البحرية بسرعة وتقلل التوليد بـ ٤٪ يومياً في فترات الصيف. تم دمج روبوتات آلية ذكية تعمل بالكنس الدوار الجاف بدون مياه عذبة شحيحة بالجزر، لتقوم بمسح كامل مرتين يومياً (قبل شروق الشمس وبعد غروبها) لضمان أعلى توليد على مدار اليوم.'
            }
          ]
        };
      case 'إدارة مخاطر السيول في المناطق الجبلية':
        return {
          title,
          expert: 'د. ستيفن ووكر',
          role: 'كبير مستشاري الهندسة الهيدرولوجية والسدود وحصاد الموارد',
          classification: 'حساس ومقيد للاستخدام الداخلي للمشروعات الكبرى ورؤية ٢٠٣٠',
          date: 'يونيو ٢٠٢٦',
          readTime: '٤ دقائق',
          category: 'هندسة مدنية',
          summary: 'النمذجة الرياضية ثلاثية الأبعاد لمجاري السيول الوميضية بمرتفعات نيوم، وتصاميم السدود الحصادية لدرء العواصف وحصاد الموارد المائية الثمينة.',
          sections: [
            {
              heading: '١. هيدرولوجيا المناطق الجبلية الصحراوية الجافة',
              text: 'تتسبب العواصف الرعدية المكثفة في تدفق سيول جارفة ومفاجئة (Flash Floods) عبر المنحدرات الجبلية القاسية لنيوم، مما يهدد مشاريع التشييد والأنفاق الجارية. تكمن الرؤية الاستراتيجية في تحويل التهديد الخطر إلى ميزة مائية ومخزون استراتيجي عبر التوجيه الذكي.'
            },
            {
              heading: '٢. النمذجة ثنائية الأبعاد (HEC-RAS 2D) والمسح الليزري الجوي (LIDAR)',
              text: 'تم بناء خريطة محاكاة رياضية لتدفق المياه بناءً على بيانات مسح جوي ليزري فائق الدقة. تتيح النمذجة معرفة سرعات الجريان ومستوى غمر المياه المتوقع بدقة نصف متر مربع، مما يوجه أعمال التشييد واختيار الأماكن الآمنة بدقة تامة.'
            },
            {
              heading: '٣. حواجز السلال الصخرية (Gabions) وتشتيت الطاقة الحركية للمياه',
              text: 'تم اعتماد بناء سدود ترشيحية مرنة باستخدام سلال الجابيون الصخرية التي تمتص طاقة تدفق المياه الهائلة تدريجياً وتسمح بمرورها المفلتر بدلاً من الاصطدام العنيف بالسدود الخرسانية المصمتة، مما يقلل احتمالات الانهيار الهيكلي بنسبة ٩٠٪.'
            },
            {
              heading: '٤. قنوات التوجيه الهيدروليكية وخزانات الحصاد الجوفية',
              text: 'توجَّه المياه المفلترة عبر قنوات التفافية اصطناعية مبطنة بخرسانة فائقة النعومة لتسريع التدفق المنضبط وصب المياه في خزانات جوفية عملاقة، ليتم إعادة معالجتها وضخها للري أو للاستخدامات الإنشائية والصناعية المختلفة في ذا لاين.'
            }
          ]
        };
      case 'بروتوكولات التفريغ الأوتوماتيكي بالذكاء الاصطناعي في الموانئ الرقمية':
        return {
          title,
          expert: 'م. سارة الغامدي',
          role: 'قائدة التحول الرقمي بالموانئ والشحن واللوجستيات الذكية',
          classification: 'سري وتجاري - براءة اختراع سعودية موثقة',
          date: 'مايو ٢٠٢٦',
          readTime: '٣ دقائق',
          category: 'لوجستيات',
          summary: 'تطبيق الرؤية الحاسوبية على رافعات الشحن لفرز وتفريغ الحاويات تلقائياً بالكامل وتنسيق اللوجستيات مع شاحنات النقل ذاتية القيادة.',
          sections: [
            {
              heading: '١. دمج الرؤية الحاسوبية في الرافعات العملاقة',
              text: 'تجهيز رافعات الموانئ بكاميرات عالية الدقة معززة بمعالجة الذكاء الاصطناعي الفوري (Edge AI) للتعرف على أبعاد ومواقع مقابض الحاويات بدقة مليمترية، مما يلغي تماماً التدخل البشري والخطأ اليدوي أثناء عمليات الرفع والتوجيه الهيدروليكي السريع.'
            },
            {
              heading: '٢. التنسيق اللوجستي مع المركبات ذاتية القيادة (AGVs)',
              text: 'تم تصميم بروتوكول تواصل لاسلكي فوري ذي استجابة سريعة يربط الرافعة الذكية بالمركبات الناقلة الأرضية بدون سائق. يتم احتساب مسار التفريغ والموقع الأمثل للسيارة تلقائياً لتفادي فترات الانتظار البينية، مما يرفع الكفاءة التشغيلية الكلية بنسبة ٣٤٪.'
            },
            {
              heading: '٣. إدارة الأمان الذكية والاستشعار بالليزر ثلاثي الأبعاد (Lidar)',
              text: 'إنشاء هالة أمان ثلاثية الأبعاد حول منطقة العمل النشطة باستخدام مستشعرات الليدار والرادارات الصوتية المتكاملة. في حال دخول أي عنصر غريب أو عامل للمنطقة النشطة، تقف الرافعة فوراً في غضون ٨٠ ملي ثانية لضمان بيئة عمل آمنة بالكامل.'
            }
          ]
        };
      case 'نظم الاستشعار والتحكم الذاتي لخطوط الإمداد الهيدروكربونية':
        return {
          title,
          expert: 'م. خالد الدوسري',
          role: 'خبير نظم إنترنت الأشياء والتحكم الصناعي ورئيس التوطين بأرامكو',
          classification: 'سري للغاية ومحمي تحت اللوائح الوطنية للطاقة والنفط',
          date: 'يونيو ٢٠٢٦',
          readTime: '٤ دقائق',
          category: 'سلامة صناعية',
          summary: 'تصميم وبناء شبكة استشعار ميكروية ذكية على امتداد خطوط أنابيب النفط والغاز لرصد أي تسريبات هيدروكربونية ومعالجتها تلقائياً عبر صمامات غلق ذكية.',
          sections: [
            {
              heading: '١. الحوسبة الطرفية واستشعار التسرب الصوتي والحراري الفوري',
              text: 'توزيع عقد استشعار دقيقة ومنخفضة الطاقة على طول خطوط الأنابيب، تستمع للموجات الصوتية الدقيقة الناتجة عن تذبذب التدفق والضغط، وتقيس التغير الطفيف في درجات الحرارة المحيطة للتحذير من أي تسريبات هيدروكربونية فور حدوثها.'
            },
            {
              heading: '٢. بروتوكول اتصال لاسلكي محمي LoRaWAN مشفر سيادياً',
              text: 'تنقل العقد الذكية البيانات عبر شبكة لاسلكية مشفرة ببروتوكولات وطنية، وذات مدى بعيد جداً ومقاومة للتشويش والبيئات الجوية القاسية، وتعمل ببطارية ذكية تدوم لعشر سنوات بفضل الدخول في حالة النوم العميق والإرسال عند الطوارئ فقط.'
            },
            {
              heading: '٣. صمامات الإغلاق الهيدروليكي التلقائي والتحكم المستقل',
              text: 'في حال رصد تسريب حاد، تتخذ وحدة التحكم الطرفية قراراً مستقلاً بإغلاق الصمامات الهيدروليكية المحيطة بنقطة التسريب فوراً دون انتظار أمر مركزي من غرفة التحكم البعيدة، مما يقلص زمن الاستجابة من دقائق إلى أجزاء من الثانية لضمان السلامة الكاملة.'
            }
          ]
        };
      // Fallback
      default:
        return {
          title,
          expert: defaultExpert || 'خبير توطين المعرفة',
          role: 'مستشار فني وباحث رئيسي بمنصة مورد الوطنية',
          classification: 'مقيد للاستخدام الداخلي للمشروعات الاستراتيجية الكبرى - رؤية ٢٠٣٠',
          date: '٢٠٢٦',
          readTime: '٣ دقائق',
          category: defaultCategory || 'توطين المعرفة',
          summary: 'دراسة مرجعية تهدف إلى توثيق الأصول الهندسية والتقنية وتطويرها وفق أعلى المعايير القياسية لرؤية المملكة العربية السعودية ٢٠٣٠ للسيادة الفكرية والتنموية.',
          sections: [
            {
              heading: '١. أهمية توطين المعرفة ونقل الخبرات الدولية للمشاريع الكبرى',
              text: 'تكمن القيمة الاستراتيجية الكبرى للمشاريع الوطنية الكبرى في استخلاص المعارف والدروس المستفادة وتوطينها كبنى معرفية قابلة للتكرار ومحمية كأصول فكرية وطنية لضمان السيادة والاستدامة التشغيلية للكوادر السعودية بالكامل.'
            },
            {
              heading: '٢. آلية التحقق والاعتماد للأصول المستخلصة',
              text: 'يخضع كل أصل معرفي لدورة حياة صارمة تبدأ بالاستخلاص من الخبراء الدوليين ثم التدقيق الجيد من اللجان الاستشارية الوطنية لضمان توافقها مع البيئة والمقاييس المحلية ثم إتاحتها للتدريب ونقل الخبرات.'
            },
            {
              heading: '٣. التوصيات الاستراتيجية لتسريع التبادل والتكامل المعرفي الميداني',
              text: 'يُوصى بجدولة دورات تقييم ربع سنوية وربط مؤشرات الأداء الوظيفي للشركاء العالميين بمستويات نجاح انتقال المعرفة الفعلي لضمان الالتزام الكامل بخطط التوطين الطموحة وبناء كادر من العلماء الوطنيين.'
            }
          ]
        };
    }
  };

  const recentActivities = getRecentActivities();

  const filteredActivities = recentActivities.filter(item => 
    activeSubCategory === 'الكل' || getSubcategoryName(item.category, item.title) === activeSubCategory
  );

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (extractionFilter === 'new') {
      return (a.ageDays ?? 0) - (b.ageDays ?? 0);
    }
    if (extractionFilter === 'old') {
      return (b.ageDays ?? 0) - (a.ageDays ?? 0);
    }
    if (extractionFilter === 'popular') {
      return (b.circulation ?? 0) - (a.circulation ?? 0);
    }
    return 0;
  });

  const getSubcategoryCounts = () => {
    const activities = getRecentActivities();
    const projectAlerts = alerts.filter(a => !a.isResolved && a.department.includes(selectedProject));
    
    const counts: Record<string, number> = {
      'الكل': activities.length + projectAlerts.length,
      'إنشائي': 0,
      'تقني': 0,
      'إداري': 0,
      'بيئي': 0
    };

    activities.forEach(item => {
      const sub = getSubcategoryName(item.category, item.title);
      if (sub in counts) {
        counts[sub]++;
      }
    });

    projectAlerts.forEach(item => {
      const sub = getSubcategoryName(item.department, item.gapName);
      if (sub in counts) {
        counts[sub]++;
      }
    });

    return counts;
  };

  const subcategoryCounts = getSubcategoryCounts();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-saudi-dark">{t('dash.welcome', 'أهلاً بك في مورد')}</h1>
          <p className="text-gray-500 mt-1">{t('dash.overview', 'نظرة عامة على حالة توطين المعرفة في مشروع')} {selectedProject}.</p>
        </div>
        <div className="flex gap-3">
          {report ? (
            <button 
              onClick={() => setIsReportOpen(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-saudi-green"
            >
              <FileText className="w-4 h-4" />
              {t('dash.reportCurrent', 'عرض التقرير الأسبوعي الحالي')}
            </button>
          ) : null}
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-4 py-2 bg-saudi-green text-white rounded-xl text-sm font-medium hover:bg-saudi-green/90 transition-colors shadow-lg shadow-saudi-green/20 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('dash.generating', 'جاري توليد التقرير الأسبوعي...')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-saudi-gold fill-saudi-gold" />
                {t('dash.reportBtn', 'توليد التقرير الأسبوعي الآلي')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive About Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden font-sans">
        <div className="p-6 bg-gradient-to-br from-[#004D26]/5 to-transparent border-b border-gray-50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-saudi-green/10 flex items-center justify-center text-saudi-green shrink-0">
              <Award className="w-6 h-6 text-saudi-green" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-saudi-dark flex flex-wrap items-center gap-2">
                منصة مورد للسيادة المعرفية الوطنية
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-saudi-gold/15 text-saudi-gold rounded-full border border-saudi-gold/20">رؤية السعودية ٢٠٣٠</span>
              </h2>
              <p className="text-xs text-gray-400">بناء الجسور وتوطين المعارف والخبرات الضمنية بين المشاريع الكبرى والكوادر الوطنية.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 self-start xl:self-auto">
            <button
              onClick={() => setAboutTab('vision')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                aboutTab === 'vision'
                  ? "bg-saudi-dark text-saudi-gold shadow-sm"
                  : "text-gray-500 hover:text-saudi-dark"
              )}
            >
              <Target className="w-3.5 h-3.5" />
              رؤية المنصة
            </button>
            <button
              onClick={() => setAboutTab('mission')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                aboutTab === 'mission'
                  ? "bg-saudi-dark text-saudi-gold shadow-sm"
                  : "text-gray-500 hover:text-saudi-dark"
              )}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              مهمة التوطين
            </button>
            <button
              onClick={() => setAboutTab('impact')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                aboutTab === 'impact'
                  ? "bg-saudi-dark text-saudi-gold shadow-sm"
                  : "text-gray-500 hover:text-saudi-dark"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              فعالية ربط الكوادر
            </button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={aboutTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
            >
              {/* Detailed Content */}
              <div className="lg:col-span-2 space-y-4">
                {aboutTab === 'vision' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-saudi-green font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-saudi-gold fill-saudi-gold" />
                      السيادة والاستقلال المعرفي للمستقبل
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      تستشرف منصة <span className="text-saudi-green font-bold">"مورد"</span> مستقبلاً تكون فيه المملكة العربية السعودية هي المرجع الأول عالمياً في إدارة وتشغيل وتنفيذ المشاريع العملاقة بأيدٍ وعقول وطنية بالكامل. نسعى لتمكين السيادة المعرفية لتقليص الاعتماد على الخبرات والاستشارات الأجنبية عبر الزمن وتحويل التجارب والدروس الميدانية في المشاريع الفريدة مثل (نيوم، البحر الأحمر، القدية، وأرامكو) إلى أصول رقمية وفكرية وطنية وموثقة سيادياً.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="text-[11px] font-bold text-saudi-green bg-saudi-green/5 border border-saudi-green/10 px-3 py-1 rounded-full">استدامة وطنية</span>
                      <span className="text-[11px] font-bold text-saudi-gold bg-saudi-gold/5 border border-saudi-gold/10 px-3 py-1 rounded-full">سيادة فكرية بنسبة ١٠٠٪</span>
                    </div>
                  </div>
                )}

                {aboutTab === 'mission' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-saudi-green font-bold text-sm">
                      <BookOpen className="w-4 h-4 text-saudi-gold" />
                      تحويل المعرفة الضمنية إلى قيمة ملموسة
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      تتركز مهمتنا الجوهرية في استخلاص <span className="text-saudi-green font-bold">"المعرفة الضمنية الحساسة"</span> - وهي الخبرات العميقة والحلول الابتكارية السريعة المخزنة في عقول الخبراء العالميين والتي لا تحتويها التقارير التقليدية - وصقلها وتوثيقها لتصبح مراجع عملية مهيأة للتدريب. نعمل عبر نظام ذكي يحدد الفجوات المعرفية تلقائياً ويصنع مسارات تعليمية وتدريبية مخصصة لسدها ونقل الخبرة فورياً للكوادر الوطنية الصاعدة.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="text-[11px] font-bold text-saudi-green bg-saudi-green/5 border border-saudi-green/10 px-3 py-1 rounded-full">استخلاص وتوثيق ذكي</span>
                      <span className="text-[11px] font-bold text-saudi-gold bg-saudi-gold/5 border border-saudi-gold/10 px-3 py-1 rounded-full">معالجة الفجوات الحرجة</span>
                    </div>
                  </div>
                )}

                {aboutTab === 'impact' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-saudi-green font-bold text-sm">
                      <Users className="w-4 h-4 text-saudi-gold" />
                      ربط الكفاءات الوطنية بخبرات المستقبل العالمية
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      تتجلى فعالية منصة <span className="text-saudi-green font-bold">"مورد"</span> في ربطها المباشر بين العلماء والاستشاريين متعددي الجنسيات والخبرات والكوادر السعودية الطموحة من خلال نظام توأمة معرفية متكامل وتفاعلي. نوفر قنوات آمنة للاتصال والاستشارة ومحاكاة الحلول الهندسية والتقنية لتوليد مناخ مهني تفاعلي متميز، يتم فيه صقل الأفكار والملاحظات الميدانية فوراً بالذكاء الاصطناعي وتطبيقها لضمان كفاءة سلاسل المعرفة والتدريب.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <span className="text-[11px] font-bold text-saudi-green bg-saudi-green/5 border border-saudi-green/10 px-3 py-1 rounded-full">توأمة ثنائية ذكية</span>
                      <span className="text-[11px] font-bold text-saudi-gold bg-saudi-gold/5 border border-saudi-gold/10 px-3 py-1 rounded-full">اتصال آمن واستشارات فورية</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Graphical representation / Statistics box (interactive visual design) */}
              <div className="bg-gradient-to-br from-[#004D26]/10 via-transparent to-transparent p-5 rounded-2xl border border-saudi-green/10 space-y-4">
                <div className="text-xs font-bold text-saudi-dark flex items-center gap-1.5 pb-2 border-b border-gray-100">
                  <TrendingUp className="w-4 h-4 text-saudi-green" />
                  مؤشرات نجاح الأثر المعرفي
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-center shadow-xs">
                    <div className="text-2xl font-black text-saudi-green tracking-tight">٨٥٪</div>
                    <div className="text-[10px] text-gray-400 font-bold mt-1">معدل التوطين المستهدف</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-center shadow-xs">
                    <div className="text-2xl font-black text-saudi-gold tracking-tight">+٥٠٠</div>
                    <div className="text-[10px] text-gray-400 font-bold mt-1">خبير عالمي متصل</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-center shadow-xs col-span-2">
                    <div className="text-xl font-black text-saudi-dark tracking-tight">١,٥٠٠ أصل</div>
                    <div className="text-[10px] text-gray-400 font-bold mt-0.5">معرفي موثق ومؤهل وطنياً</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Subcategory Filter Bar */}
      <div className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-2 px-2">
          <span className="w-1.5 h-6 bg-saudi-gold rounded-full animate-pulse"></span>
          <span className="text-sm font-bold text-saudi-dark">تصفية الأصول والمهام حسب القطاع الفرعي:</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
            {[
              { id: 'الكل', label: 'كافة الأصول والمهام', name: 'الكل', icon: Layers },
              { id: 'إنشائي', label: 'إنشائي / هندسي', name: 'إنشائي', icon: Hammer },
              { id: 'تقني', label: 'تقني / برمجيات', name: 'تقني', icon: Cpu },
              { id: 'إداري', label: 'إداري / سلاسل إمداد', name: 'إداري', icon: Briefcase },
              { id: 'بيئي', label: 'بيئي / طاقة مستدامة', name: 'بيئي', icon: Leaf },
            ].map((filter) => {
              const isActive = activeSubCategory === filter.name;
              const Icon = filter.icon;
              const count = subcategoryCounts[filter.name] || 0;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveSubCategory(filter.name)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative shrink-0 cursor-pointer",
                    isActive 
                      ? "bg-saudi-dark text-saudi-gold shadow-md" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-saudi-gold" : "text-gray-500")} />
                  <span>{filter.label}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                    isActive 
                      ? "bg-saudi-green text-white" 
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Extraction Date Filter */}
          <div className="flex items-center gap-2 border-r border-gray-100 pr-3 mr-1 border-t sm:border-t-0 sm:border-r pt-2 sm:pt-0">
            <Calendar className="w-4 h-4 text-saudi-green shrink-0" />
            <span className="text-xs font-bold text-gray-500 whitespace-nowrap">تاريخ الاستخلاص:</span>
            <select
              value={extractionFilter}
              onChange={(e) => setExtractionFilter(e.target.value as any)}
              className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus:ring-saudi-green focus:border-saudi-green outline-none cursor-pointer text-saudi-dark hover:bg-gray-100 transition-colors"
            >
              <option value="all">الكل (الافتراضي)</option>
              <option value="new">جديد (الأحدث)</option>
              <option value="old">قديم (الأقدم)</option>
              <option value="popular">الأكثر تداولاً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Smart Alerts for Critical Knowledge Gaps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <h2 className="text-xl font-bold text-saudi-dark flex items-center gap-2">
              التنبيهات الذكية للفجوات المعرفية النشطة
            </h2>
          </div>
          <span className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full font-bold border border-red-100 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {filteredAlerts.length} فجوات تحتاج تدخل عاجل
          </span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="p-8 bg-green-50/50 border border-green-100 rounded-2xl flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-saudi-green mb-3" />
            <p className="font-bold text-saudi-dark">عمل رائع! تم توطين ومعالجة جميع الفجوات المعرفية بنجاح.</p>
            <p className="text-xs text-gray-500 mt-1">لا توجد أي فجوات حرجة نشطة تتطلب التدخل في مشروع {selectedProject} حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredAlerts.map((alertItem) => (
              <motion.div
                key={alertItem.id}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Accent Bar */}
                <div className={cn(
                  "absolute top-0 right-0 left-0 h-1.5",
                  alertItem.severity.includes("حرجة") ? "bg-red-600" : "bg-amber-500"
                )}></div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-saudi-gold bg-saudi-dark px-2.5 py-1 rounded-full">
                      {alertItem.department}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full border",
                      alertItem.severity.includes("حرجة") 
                        ? "bg-red-50 text-red-700 border-red-100" 
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {alertItem.severity}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-saudi-dark leading-tight mt-2 min-h-[40px]">
                    {alertItem.gapName}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 min-h-[50px]">
                    {alertItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 mt-4 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alertItem.detectedDate}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const updated = alerts.map(a => a.id === alertItem.id ? { ...a, isResolved: true } : a);
                        saveAlerts(updated);
                      }}
                      className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg text-[10px] font-bold transition-all"
                    >
                      تجاهل
                    </button>
                    <button
                      onClick={() => handleAnalyzeGap(alertItem)}
                      className="px-3 py-1.5 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-saudi-gold fill-saudi-gold" />
                      معالجة ذكية
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('dash.totalAssets', 'إجمالي المعارف'), value: projectStats.totalAssets, icon: BrainCircuit, color: 'bg-blue-500', trend: '+12%' },
          { label: t('dash.activeExperts', 'الخبراء النشطون'), value: projectStats.activeExperts, icon: Users, color: 'bg-saudi-green', trend: '+5%' },
          { label: t('dash.twinningSessions', 'جلسات التوأمة'), value: projectStats.twinningSessions, icon: FileText, color: 'bg-saudi-gold', trend: '+18%' },
          { label: t('dash.localizationRate', 'نسبة التوطين'), value: projectStats.localizationRate, icon: TrendingUp, color: 'bg-purple-500', trend: '+3%' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-xl text-white", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                {stat.trend} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-saudi-dark mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Weekly Report Status Widget */}
      <div className="p-6 bg-gradient-to-r from-saudi-green/10 via-saudi-green/5 to-transparent rounded-2xl border border-saudi-green/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-saudi-green/10 text-saudi-green rounded-xl shrink-0">
            <Award className="w-8 h-8 text-saudi-gold" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-saudi-dark">{t('dash.quickReportTitle', 'مركز التقارير الأسبوعية الآلية')}</h3>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              {t('dash.quickReportDesc', 'تساعدك هذه الميزة على صياغة تقارير دورية فاخرة تلخص مؤشرات التوطين، الإنجازات، والفجوات الحرجة باستخدام الذكاء الاصطناعي، ومشاركتها فوراً مع الإدارة العليا بصيغة PDF لـ')} {selectedProject}.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          {report ? (
            <div className="text-right ml-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3" /> تم التوليد بنجاح
              </span>
              <p className="text-[11px] text-gray-400 mt-1">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <AlertCircle className="w-3 h-3" /> لم يتم التوليد بعد
            </span>
          )}
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-saudi-gold fill-saudi-gold" />}
            {report ? 'إعادة التوليد' : 'ابدأ التوليد الآن'}
          </button>
        </div>
      </div>

      {/* Interactive Global Expertise & Saudi Giga-Projects Map Component */}
      <GlobalExpertiseMap selectedProject={selectedProject} />

      {/* Analytics Section Header with Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4" dir="rtl">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-saudi-green" />
          <h2 className="text-xl font-bold text-saudi-dark">التحليلات ومؤشرات الأداء الاستراتيجية (KPIs)</h2>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportKnowledgeAssetsPDF}
            disabled={isExportingKnowledgePDF}
            className="px-4 py-2 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
            title="تصدير الأصول المعرفية الموثقة إلى ملف PDF منسق يحمل هوية منصة مورد للاجتماعات الرسمية"
          >
            {isExportingKnowledgePDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-saudi-gold" />
                <span>جاري إعداد وثيقة الاجتماع...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-saudi-gold" />
                <span>ملف الأصول للاجتماعات (PDF)</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportKPIsPDF}
            disabled={isExportingPDF}
            className="px-4 py-2 bg-saudi-dark hover:bg-saudi-dark/95 border border-saudi-gold/30 hover:border-saudi-gold text-saudi-gold hover:text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isExportingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-saudi-gold" />
                <span>جاري تصدير التقرير...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-saudi-gold" />
                <span>تصدير تقرير الأداء (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
        {/* Strategic KPIs & Targets Integration Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Right side: Interactive KPI Cards list (1/3 of the width) */}
            <div className="md:col-span-1 border-l border-gray-100 pl-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-saudi-gold" />
                  <h3 className="font-bold text-sm text-saudi-dark">مؤشرات الأداء الاستراتيجية (KPIs)</h3>
                </div>
                <div className="space-y-2.5">
                  {currentKPIs.map((kpi) => {
                    const isActive = activeKPI === kpi.id;
                    const isSuccess = kpi.status === 'success';
                    return (
                      <button
                        key={kpi.id}
                        onClick={() => setActiveKPI(kpi.id as any)}
                        className={cn(
                          "w-full text-right p-3 rounded-xl border transition-all flex flex-col gap-1.5 outline-none cursor-pointer",
                          isActive 
                            ? "bg-saudi-dark border-saudi-dark text-white shadow-md shadow-saudi-dark/15 scale-[1.02]" 
                            : "bg-gray-50 hover:bg-gray-100/75 border-gray-100 text-gray-700 hover:scale-[1.01]"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={cn("text-[11px] font-bold", isActive ? "text-saudi-gold" : "text-gray-600")}>
                            {kpi.name}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-md border",
                            isActive 
                              ? "bg-white/10 text-saudi-gold border-white/20"
                              : isSuccess 
                                ? "bg-green-50 text-green-700 border-green-100" 
                                : "bg-amber-50 text-amber-700 border-amber-100"
                          )}>
                            {kpi.current}
                          </span>
                        </div>
                        <div className="flex items-center justify-between w-full text-[10px]">
                          <span className={isActive ? "text-gray-300" : "text-gray-400"}>
                            المستهدف: {kpi.target}
                          </span>
                          <span className={cn(
                            "font-semibold text-[9px]",
                            isActive 
                              ? "text-saudi-gold" 
                              : isSuccess 
                                ? "text-green-600" 
                                : "text-amber-600"
                          )}>
                            {kpi.statusText}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Left side: Dynamic chart and analytics (2/3 of the width) */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                  {/* Visual Tab Selector */}
                  <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
                    <button
                      onClick={() => setAnalyticsViewMode('chart')}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        analyticsViewMode === 'chart'
                          ? "bg-white text-saudi-green shadow-sm border border-gray-100/50 font-extrabold"
                          : "text-gray-500 hover:text-saudi-dark"
                      )}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>منحنى الأداء والاستجابة</span>
                    </button>
                    <button
                      onClick={() => setAnalyticsViewMode('heatmap')}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative",
                        analyticsViewMode === 'heatmap'
                          ? "bg-white text-saudi-green shadow-sm border border-gray-100/50 font-extrabold"
                          : "text-gray-500 hover:text-saudi-dark"
                      )}
                    >
                      <Layers className="w-3.5 h-3.5 text-saudi-gold" />
                      <span>خريطة التفاعل المعرفي (Heatmap)</span>
                      <span className="absolute -top-1.5 -left-1 px-1 bg-red-500 text-white text-[7px] rounded-full scale-90 font-sans animate-pulse">جديد</span>
                    </button>
                    <button
                      onClick={() => setAnalyticsViewMode('compare')}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative",
                        analyticsViewMode === 'compare'
                          ? "bg-white text-saudi-green shadow-sm border border-gray-100/50 font-extrabold"
                          : "text-gray-500 hover:text-saudi-dark"
                      )}
                    >
                      <GitCompare className="w-3.5 h-3.5 text-saudi-green" />
                      <span>مقارنة المشاريع والدروس المستفادة</span>
                      <span className="absolute -top-1.5 -left-1 px-1 bg-emerald-600 text-white text-[7px] rounded-full scale-90 font-sans animate-pulse">تفاعلي</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-xs text-saudi-dark hidden sm:inline-block">
                      {analyticsViewMode === 'chart' ? (
                        activeKPI === 'monthlyGrowth' ? 'منحنى نمو التوطين وحجم الأصول المعرفية' :
                        activeKPI === 'localization' ? 'معدل سد الفجوات وبناء السيادة المعرفية' :
                        activeKPI === 'transfer' ? 'تكامل كفاءة انتقال المعرفة للكوادر الوطنية' :
                        'سرعة الاستجابة الزمنية للفجوات المعرفية'
                      ) : analyticsViewMode === 'compare' ? (
                        'المقارنة البينية ونقل الدروس المستفادة بين المشاريع'
                      ) : (
                        `كفاءة التفاعل المعرفي لمشروع ${selectedProject}`
                      )}
                    </h4>
                    <select className="text-[10px] font-semibold border-none bg-gray-50 rounded-lg px-2.5 py-1.5 focus:ring-0 outline-none cursor-pointer">
                      <option>الربع الحالي (Q2 2026)</option>
                      <option>النصف الأول (H1 2026)</option>
                    </select>
                  </div>
                </div>

                {analyticsViewMode === 'chart' ? (
                  <div className="h-[220px] w-full">
                    {/* Visual Legend indicator */}
                    <div className="flex items-center gap-4 text-[10px] mb-2 pr-1 font-sans justify-end">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-1.5 rounded bg-[#006C35]/20 border border-[#006C35]"></span>
                        <span className="text-gray-500 font-bold">القيمة الفعلية المحققة</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 border-t-2 border-dashed border-[#C5A059] h-0"></span>
                        <span className="text-gray-500 font-bold">خط التنبؤ المستقبلي (نهاية Q3)</span>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getChartDataWithTrendline().chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#006C35" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#006C35" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', direction: 'rtl' }}
                          formatter={(value, name) => {
                            const valStr = value !== null && value !== undefined ? value : 'غير متوفر';
                            if (name === 'trend') {
                              if (activeKPI === 'monthlyGrowth') return [`${valStr} أصل (تنبؤ Q3)`, 'مسار التنبؤ المستقبلي (Trendline)'];
                              if (activeKPI === 'localization') return [`${valStr}% (تنبؤ Q3)`, 'مسار التنبؤ المستقبلي (Trendline)'];
                              if (activeKPI === 'transfer') return [`${valStr}% (تنبؤ Q3)`, 'مسار التنبؤ المستقبلي (Trendline)'];
                              return [`${valStr} أيام (تنبؤ Q3)`, 'مسار التنبؤ المستقبلي (Trendline)'];
                            }
                            
                            if (activeKPI === 'monthlyGrowth') return [`${valStr} أصل معرفي`, 'حجم المعرفة الموطنة'];
                            if (activeKPI === 'localization') return [`${valStr}%`, 'نسبة التوطين المحققة'];
                            if (activeKPI === 'transfer') return [`${valStr}%`, 'كفاءة انتقال المعرفة'];
                            return [`${valStr} أيام`, 'زمن الاستجابة'];
                          }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#006C35" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" name="value" connectNulls={false} />
                        <Line type="monotone" dataKey="trend" stroke="#C5A059" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#C5A059' }} activeDot={{ r: 5 }} name="trend" connectNulls={true} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : analyticsViewMode === 'compare' ? (
                  <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/60 font-sans" dir="rtl">
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mb-4 pb-3 border-b border-gray-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">المشروع الأول (أ):</span>
                        <select 
                          value={compareProjectA} 
                          onChange={(e) => setCompareProjectA(e.target.value)}
                          className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:ring-saudi-green focus:border-saudi-green outline-none cursor-pointer text-saudi-dark"
                        >
                          <option value="نيوم">نيوم</option>
                          <option value="البحر الأحمر">البحر الأحمر</option>
                          <option value="أرامكو">أرامكو</option>
                        </select>
                        <span className="text-xs font-medium text-gray-400">يقارن مع (ب):</span>
                        <select 
                          value={compareProjectB} 
                          onChange={(e) => setCompareProjectB(e.target.value)}
                          className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:ring-saudi-green focus:border-saudi-green outline-none cursor-pointer text-saudi-dark"
                        >
                          <option value="البحر الأحمر">البحر الأحمر</option>
                          <option value="نيوم">نيوم</option>
                          <option value="أرامكو">أرامكو</option>
                        </select>
                      </div>

                      {/* Legends */}
                      <div className="flex items-center gap-4 text-[10px] font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-1.5 rounded bg-[#006C35] border border-[#006C35]"></span>
                          <span className="text-gray-600">{compareProjectA}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-1.5 rounded bg-[#C5A059] border border-[#C5A059]"></span>
                          <span className="text-gray-600">{compareProjectB}</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getComparisonChartData(compareProjectA, compareProjectB, activeKPI)}>
                          <defs>
                            <linearGradient id="colorValueCompA" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#006C35" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#006C35" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorValueCompB" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#C5A059" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', direction: 'rtl' }}
                            formatter={(value, name) => {
                              const valStr = value !== null && value !== undefined ? value : '0';
                              const projName = name === 'valueA' ? compareProjectA : compareProjectB;
                              
                              if (activeKPI === 'monthlyGrowth') return [`${valStr} أصل معرفي`, projName];
                              if (activeKPI === 'localization') return [`${valStr}%`, projName];
                              if (activeKPI === 'transfer') return [`${valStr}%`, projName];
                              return [`${valStr} أيام`, projName];
                            }}
                          />
                          <Area type="monotone" dataKey="valueA" stroke="#006C35" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValueCompA)" name="valueA" />
                          <Area type="monotone" dataKey="valueB" stroke="#C5A059" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValueCompB)" name="valueB" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  /* HIGH FIDELITY INTERACTIVE 2D HEATMAP GRID */
                  (() => {
                    const { columns: hmCols, rows: hmRows, cells: hmCells } = getHeatmapData();
                    return (
                      <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/60 font-sans" dir="rtl">
                        {/* Heatmap Grid Header */}
                        <div className="grid grid-cols-5 gap-2 items-center mb-2 pb-1 border-b border-gray-100">
                          <div className="text-right text-[10px] font-bold text-gray-400">التصنيف المعرفي</div>
                          {hmCols.map((colName) => (
                            <div key={colName} className="text-center text-[10px] font-bold text-gray-500 truncate" title={colName}>
                              {colName}
                            </div>
                          ))}
                        </div>

                        {/* Heatmap Grid Rows */}
                        <div className="space-y-2">
                          {hmRows.map((rowName) => (
                            <div key={rowName} className="grid grid-cols-5 gap-2 items-center">
                              <div className="text-right text-[11px] font-bold text-saudi-dark truncate" title={rowName}>
                                {rowName}
                              </div>
                              {hmCols.map((colName) => {
                                const key = `${rowName}-${colName}`;
                                const cell = hmCells[key];
                                const val = cell?.value || 0;
                                const isSelected = selectedHeatmapCell?.row === rowName && selectedHeatmapCell?.col === colName;
                                
                                // Determine gorgeous color levels based on interaction value
                                let bgClass = "bg-gray-100 text-gray-400";
                                let levelText = "ضعيف";
                                if (val >= 85) {
                                  bgClass = "bg-[#006C35] text-white hover:bg-[#005228] shadow-sm";
                                  levelText = "استثنائي";
                                } else if (val >= 70) {
                                  bgClass = "bg-[#006C35]/70 text-white hover:bg-[#006C35]/80 shadow-xs";
                                  levelText = "نشط جداً";
                                } else if (val >= 50) {
                                  bgClass = "bg-saudi-gold/65 text-saudi-dark hover:bg-saudi-gold/75";
                                  levelText = "متوسط";
                                } else {
                                  bgClass = "bg-saudi-gold/15 text-saudi-gold hover:bg-saudi-gold/25";
                                  levelText = "ضعيف";
                                }

                                return (
                                  <motion.button
                                    key={colName}
                                    whileHover={{ scale: 1.04, y: -1 }}
                                    onClick={() => setSelectedHeatmapCell({ row: rowName, col: colName })}
                                    className={cn(
                                      "h-12 rounded-xl flex flex-col items-center justify-center p-1 transition-all relative cursor-pointer outline-none border",
                                      isSelected 
                                        ? "ring-2 ring-saudi-dark ring-offset-1 border-saudi-dark z-10" 
                                        : "border-transparent",
                                      bgClass
                                    )}
                                  >
                                    <span className="text-xs font-black font-mono">{val}%</span>
                                    <span className="text-[7.5px] opacity-80 leading-none mt-1">{levelText}</span>
                                    {val >= 85 && (
                                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-saudi-gold rounded-full"></span>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          ))}
                        </div>

                        {/* Heatmap Legend */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-bold">مستويات التفاعل المعرفي:</span>
                            <div className="flex items-center gap-2.5 ml-2 flex-wrap">
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded bg-saudi-gold/15 border border-saudi-gold/20"></span>
                                <span>ضعيف (&lt;50%)</span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded bg-saudi-gold/65 border border-saudi-gold/10"></span>
                                <span>متوسط (50-69%)</span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded bg-[#006C35]/70"></span>
                                <span>نشط (70-84%)</span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded bg-[#006C35]"></span>
                                <span>استثنائي (85%+)</span>
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] text-saudi-gold bg-saudi-dark/15 px-2.5 py-1 rounded-md font-bold">
                            * اضغط على أي خلية في الجدول لعرض التفاصيل الميدانية وأسرار التفاعل المعرفي.
                          </span>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Active KPI Detailed Insights Panel OR Heatmap Insights depending on active Tab */}
              {analyticsViewMode === 'chart' ? (
                (() => {
                  const selectedKpiObj = currentKPIs.find(k => k.id === activeKPI);
                  if (!selectedKpiObj) return null;
                  return (
                    <div className="mt-4 p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="sm:col-span-1 border-l border-gray-200 pl-3">
                          <span className="text-[9px] font-bold text-gray-400 block uppercase">طريقة الاحتساب</span>
                          <span className="text-[10px] text-saudi-dark font-bold mt-1 block leading-normal">{selectedKpiObj.desc}</span>
                          <div className="mt-2 bg-white/80 border border-gray-100 p-1.5 rounded-lg">
                            <code className="text-[8px] text-gray-600 block leading-tight font-mono text-center" dir="ltr">{selectedKpiObj.formula}</code>
                          </div>
                        </div>
                        <div className="sm:col-span-1 border-l border-gray-200 pl-3 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-saudi-gold block uppercase flex items-center gap-1">
                              <Sparkles className="w-3 h-3 animate-pulse text-saudi-gold" />
                              التنبؤ بنهاية الربع القادم (Q3)
                            </span>
                            <div className="flex items-baseline gap-1 mt-1.5">
                              <span className="text-xl font-black text-saudi-dark font-sans">
                                {(() => {
                                  const { forecastValue } = getChartDataWithTrendline();
                                  if (activeKPI === 'monthlyGrowth') return `${forecastValue} أصل`;
                                  if (activeKPI === 'localization') return `${forecastValue}%`;
                                  if (activeKPI === 'transfer') return `${forecastValue}%`;
                                  return `${forecastValue} أيام`;
                                })()}
                              </span>
                              <span className="text-[8px] text-gray-400 font-bold">(متوقع)</span>
                            </div>
                            <p className="text-[9px] text-gray-400 mt-1 leading-normal font-sans">
                              تقدير ربع سنوي تم احتسابه عبر نموذج الانحدار الخطي المستند لاتجاه الأداء السابق.
                            </p>
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-saudi-green mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-saudi-gold fill-saudi-gold" />
                            <span>توصية استراتيجية ذكية للمشروع:</span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{selectedKpiObj.tips}</p>
                          <div className="mt-2 text-[9px] font-bold bg-[#004D26]/10 text-saudi-green px-2 py-0.5 rounded-md inline-block">
                            المسار المتوقع: {selectedKpiObj.trajectory}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : analyticsViewMode === 'compare' ? (
                (() => {
                  const getLessonsLearned = (projA: string, projB: string) => {
                    const lessons: Record<string, string> = {
                      'نيوم-البحر الأحمر': 'دمج بروتوكولات الميكروجريد الذكي عالي السعة من نيوم يساهم في تأمين استمرارية الطاقة المستدامة لمنتجعات البحر الأحمر بالجزر النائية بنسبة 100%. وفي المقابل، تساهم تجارب البحر الأحمر في حماية المرجان فائقة التكيف في تقديم رؤى بيئية حساسة لتقييمات الأثر البيئي للشواطئ والمحطات المائية في نيوم.',
                      'البحر الأحمر-نيوم': 'تساهم تجارب البحر الأحمر في حماية المرجان فائقة التكيف في تقديم رؤى بيئية حساسة لتقييمات الأثر البيئي للشواطئ والمحطات المائية في نيوم. وفي المقابل، دمج بروتوكولات الميكروجريد الذكي عالي السعة من نيوم يساهم في تأمين استمرارية الطاقة المستدامة لمنتجعات البحر الأحمر بالجزر النائية بنسبة 100%.',
                      'نيوم-أرامكو': 'تطبيق دمج البنية التحتية العميقة والأنفاق الذكية المتقدمة من نيوم يحسن سلاسل لوجستيات أرامكو بالمناطق الوعرة. وفي المقابل، تلتزم نيوم باعتماد بروتوكولات الأمن السيبراني السيادي فائقة الدقة المطبقة في أرامكو لحماية البنية التحتية لقطارات الهيدروجين والاتصال السحابي للقطاع اللوجستي.',
                      'أرامكو-نيوم': 'تلتزم نيوم باعتماد بروتوكولات الأمن السيبراني السيادي فائقة الدقة المطبقة في أرامكو لحماية البنية التحتية لقطارات الهيدروجين والاتصال السحابي للقطاع اللوجستي. وفي المقابل، تطبيق دمج البنية التحتية العميقة والأنفاق الذكية المتقدمة من نيوم يحسن سلاسل لوجستيات أرامكو بالمناطق الوعرة.',
                      'البحر الأحمر-أرامكو': 'استخدام الهياكل العائمة وأنظمة الإرساء التوتري لتقليل البصمة الكربونية من البحر الأحمر يدعم المنشآت والمنصات البحرية لأرامكو. وفي المقابل، تفيد أنظمة فرز الشحنات الذكية والذكاء الاصطناعي اللوجستي لأرامكو في تحسين إدارة التدفقات والعمليات الفندقية والموانئ الرقمية لمنتجعات البحر الأحمر.',
                      'أرامكو-البحر الأحمر': 'تفيد أنظمة فرز الشحنات الذكية والذكاء الاصطناعي اللوجستي لأرامكو في تحسين إدارة التدفقات والعمليات الفندقية والموانئ الرقمية لمنتجعات البحر الأحمر. وفي المقابل، استخدام الهياكل العائمة وأنظمة الإرساء التوتري لتقليل البصمة الكربونية من البحر الأحمر يدعم المنشآت والمنصات البحرية لأرامكو.'
                    };

                    const key = `${projA}-${projB}`;
                    return lessons[key] || `تبادل المعرفة الميدانية بين ${projA} و ${projB} يساهم في تلافي تكرار التحديات الهندسية واللوجستية. يوصى بعقد ورشة عمل مشتركة شهرياً لتوثيق الأصول الضمنية وتحويلها إلى معارف ملموسة مسجلة في "مورد".`;
                  };

                  const checklistItems = [
                    { id: 'workshop', label: `عقد ورشة عمل تقنية مخصصة لنقل المعرفة الضمنية في ${activeKPI === 'monthlyGrowth' ? 'النمو المعرفي' : activeKPI === 'localization' ? 'خطط التوطين والسيادة' : activeKPI === 'transfer' ? 'كفاءة انتقال الكفاءات' : 'زمن الاستجابة للفجوات'}.` },
                    { id: 'document', label: 'توثيق أصول الدروس المستفادة وتحميل التقارير الميدانية المشتركة رسمياً في نظام مورد.' },
                    { id: 'standards', label: 'مواءمة معايير السلامة البيئية والتحكم اللوجستي السيادي بين فريقي المشروعين.' }
                  ];

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-gradient-to-r from-saudi-dark to-[#0D2619] rounded-2xl border border-saudi-gold/20 text-white relative overflow-hidden shadow-md"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.08),transparent_60%)]"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-saudi-gold mb-2.5">
                          <Sparkles className="w-4 h-4 animate-pulse text-saudi-gold" />
                          <span className="text-xs font-black font-sans">تكامل الدروس المستفادة والتبادل المعرفي المتبادل</span>
                        </div>
                        
                        <p className="text-xs text-gray-100 font-medium leading-relaxed mb-4 pb-3 border-b border-white/10">
                          {getLessonsLearned(compareProjectA, compareProjectB)}
                        </p>

                        <div>
                          <span className="text-[10px] font-bold text-gray-300 block mb-2 font-sans">خطة العمل المشتركة لنقل الدروس وتوثيق المعرفة:</span>
                          <div className="space-y-2">
                            {checklistItems.map((item) => {
                              const uniqueId = `${compareProjectA}-${compareProjectB}-${item.id}`;
                              const isChecked = !!compareChecklist[uniqueId];
                              return (
                                <div 
                                  key={item.id} 
                                  onClick={() => setCompareChecklist(prev => ({ ...prev, [uniqueId]: !isChecked }))}
                                  className="flex items-start gap-2.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                                >
                                  <div className={cn(
                                    "w-3.5 h-3.5 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-all",
                                    isChecked ? "bg-saudi-gold border-saudi-gold text-saudi-dark" : "border-white/30 text-transparent"
                                  )}>
                                    <Check className="w-2.5 h-2.5 stroke-[4]" />
                                  </div>
                                  <span className={cn(
                                    "text-[10.5px] leading-snug transition-all select-none text-right flex-1",
                                    isChecked ? "text-gray-400 line-through font-medium" : "text-gray-200 font-semibold"
                                  )}>
                                    {item.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()
              ) : (
                /* Heatmap Selected Cell Detailed Analytics Card */
                (() => {
                  const { cells: hmCells } = getHeatmapData();
                  let activeCellRow = selectedHeatmapCell?.row;
                  let activeCellCol = selectedHeatmapCell?.col;
                  
                  if (!activeCellRow || !activeCellCol) {
                    // Pre-select highest value cell by default so it never looks blank
                    const { rows, columns } = getHeatmapData();
                    let maxVal = -1;
                    rows.forEach(r => {
                      columns.forEach(c => {
                        const val = hmCells[`${r}-${c}`]?.value || 0;
                        if (val > maxVal) {
                          maxVal = val;
                          activeCellRow = r;
                          activeCellCol = c;
                        }
                      });
                    });
                  }

                  if (!activeCellRow || !activeCellCol) return null;

                  const cellKey = `${activeCellRow}-${activeCellCol}`;
                  const cellDetail = hmCells[cellKey] || { value: 0, expert: 'غير متوفر', details: 'لا توجد تفاصيل تفاعل حالياً.' };

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={cellKey}
                      className="mt-4 p-4 bg-gradient-to-r from-saudi-dark to-[#0F2D1E] rounded-2xl border border-saudi-gold/20 text-white relative overflow-hidden shadow-md"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.08),transparent_60%)]"></div>
                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 text-right flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-saudi-gold bg-white/10 px-2.5 py-0.5 rounded-md">
                              {activeCellRow}
                            </span>
                            <span className="text-white/30 text-xs">•</span>
                            <span className="text-[10px] font-extrabold text-saudi-gold bg-white/10 px-2.5 py-0.5 rounded-md">
                              {activeCellCol}
                            </span>
                            <span className="text-white/30 text-xs">•</span>
                            <span className="text-[10px] font-bold text-green-400 bg-green-500/15 px-2 py-0.5 rounded-md">
                              تفاعل بنسبة {cellDetail.value}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-200 font-medium leading-relaxed mt-1">
                            {cellDetail.details}
                          </p>
                        </div>
                        
                        <div className="shrink-0 border-t sm:border-t-0 sm:border-r border-white/10 pt-3 sm:pt-0 sm:pr-4 flex flex-col justify-center text-right">
                          <span className="text-[9px] text-gray-400 block font-bold">الخبير المسؤول / الموجه المعرفي</span>
                          <span className="text-xs text-saudi-gold font-black mt-1 block">{cellDetail.expert}</span>
                          <span className="text-[8px] text-green-400 font-extrabold bg-green-500/10 px-1.5 py-0.5 rounded mt-2 self-start sm:self-auto text-center">
                            مؤشر نشط سيادياً
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()
              )}
            </div>

          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-6">توزيع المعرفة حسب القطاع</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentCategoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1A1A1A', fontWeight: 500 }} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {currentCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {currentCategoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-gray-500">{cat.name}</span>
                </div>
                <span className="font-bold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity and Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (takes 2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-lg">آخر المعارف المستخلصة</h3>
            <button className="text-saudi-green text-sm font-bold hover:underline">عرض الكل</button>
          </div>
          <div className="divide-y divide-gray-50 flex-1">
            {sortedActivities.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <BrainCircuit className="w-12 h-12 mx-auto mb-3 opacity-30 text-saudi-gold" />
                <p className="font-medium text-sm">لا توجد أصول معرفية مستخلصة في تصنيف "{activeSubCategory}" حالياً.</p>
              </div>
            ) : (
              sortedActivities.map((item, i) => {
                const sub = getSubcategoryName(item.category, item.title);
                const isSaved = !!savedAssets[item.title];
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    whileHover={{ 
                      x: -6, 
                      backgroundColor: 'rgba(249, 250, 251, 1)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
                    }}
                    onClick={() => setSelectedAssetForReading(getAssetDetailedContent(item.title, item.expert, item.category))}
                    className="p-6 flex items-center justify-between transition-shadow cursor-pointer group border-r-4 border-transparent hover:border-saudi-green"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
                        item.status === 'verified' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {item.status === 'verified' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-saudi-dark group-hover:text-saudi-green transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="font-medium text-gray-600">{item.expert}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{item.category}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            sub === 'إنشائي' && "bg-amber-50 text-amber-700 border border-amber-100",
                            sub === 'تقني' && "bg-purple-50 text-purple-700 border border-purple-100",
                            sub === 'إداري' && "bg-sky-50 text-sky-700 border border-sky-100",
                            sub === 'بيئي' && "bg-green-50 text-green-700 border border-green-100"
                          )}>
                            {sub}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Read Prompt */}
                      <div className="hidden sm:flex items-center gap-1 text-[11px] text-saudi-green font-bold bg-saudi-green/5 px-2.5 py-1 rounded-lg border border-saudi-green/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <BookOpen className="w-3.5 h-3.5 text-saudi-gold" />
                        <span>فتح لقراءة مريحة</span>
                      </div>

                      <button
                        onClick={(e) => toggleSaveAsset(item.title, e)}
                        className={cn(
                          "p-2.5 rounded-xl border transition-all duration-300 shrink-0",
                          isSaved
                            ? "bg-red-50 border-red-100 text-red-500 scale-110 shadow-sm"
                            : "bg-gray-50/50 border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50/30 hover:scale-105"
                        )}
                        title={isSaved ? "إلغاء الحفظ" : "حفظ الأصل المعرفي"}
                      >
                        <Heart className={cn("w-4 h-4 transition-transform duration-300", isSaved ? "fill-current scale-110" : "group-hover:scale-110")} />
                      </button>
                      <div className="text-left shrink-0 min-w-[70px]">
                        <p className="text-xs text-gray-400">{item.date}</p>
                        {item.status === 'pending' && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">قيد المراجعة</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* My Knowledge Tasks (takes 1 col on large screen) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-saudi-gold" />
              <h3 className="font-bold text-lg text-saudi-dark">مهامي المعرفية</h3>
            </div>
            <span className="bg-saudi-green/10 text-saudi-green px-2.5 py-0.5 rounded-full text-xs font-bold">
              {knowledgeTasks.filter(t => t.project === selectedProject && !t.isCompleted).length} معلقة
            </span>
          </div>

          <div className="p-4 bg-gray-50/50 border-b border-gray-100">
            <button 
              onClick={() => setShowAddTask(!showAddTask)}
              className="w-full py-2 bg-white hover:bg-gray-100 text-saudi-dark border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-saudi-gold" />
              إضافة مهمة معرفية سريعة
            </button>

            {/* Add Task Form */}
            <AnimatePresence>
              {showAddTask && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddTask}
                  className="mt-3 space-y-3 overflow-hidden bg-white p-4 rounded-xl border border-gray-100 shadow-inner"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">اسم المهمة</label>
                    <input 
                      type="text"
                      placeholder="مثال: مراجعة كود التشفير المتقدم..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-saudi-green focus:border-saudi-green outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">الأولوية</label>
                      <select
                        value={newTaskSeverity}
                        onChange={(e) => setNewTaskSeverity(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none"
                      >
                        <option value="حرجة">حرجة</option>
                        <option value="عالية">عالية</option>
                        <option value="متوسطة">متوسطة</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">النوع</label>
                      <select
                        value={newTaskType}
                        onChange={(e) => setNewTaskType(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none"
                      >
                        <option value="مراجعة هندسية">مراجعة هندسية</option>
                        <option value="اعتماد مواصفات">اعتماد مواصفات</option>
                        <option value="تقييم تقني">تقييم تقني</option>
                        <option value="تقييم عام">تقييم عام</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="px-3 py-1.5 text-[10px] font-bold text-gray-500 hover:bg-gray-50 rounded-lg"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-lg text-[10px] font-bold"
                    >
                      حفظ المهمة
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Tasks List */}
          <div className="divide-y divide-gray-50 flex-1 overflow-y-auto max-h-[420px] scrollbar-thin">
            {knowledgeTasks.filter(t => t.project === selectedProject).length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-xs">لا توجد مهام معرفية مسجلة لمشروع {selectedProject}.</p>
              </div>
            ) : knowledgeTasks.filter(t => t.project === selectedProject && !t.isCompleted).length === 0 ? (
              <div className="p-10 text-center text-gray-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-50 text-saudi-green flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-saudi-dark">أداء ممتاز!</p>
                  <p className="text-[11px] text-gray-500">تم إنجاز جميع مهامك المعرفية لـ {selectedProject}.</p>
                </div>
                <button
                  onClick={handleResetTasks}
                  className="mx-auto mt-2 flex items-center gap-1 px-3 py-1.5 border border-gray-100 hover:bg-gray-50 text-[10px] font-bold text-saudi-gold rounded-lg shadow-sm transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  إعادة تعيين للتجربة
                </button>
              </div>
            ) : (
              knowledgeTasks
                .filter(t => t.project === selectedProject && !t.isCompleted)
                .map((task, i) => {
                  const isExpanded = !!expandedTasks[task.id];
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      className={cn(
                        "p-4 transition-colors relative group border-r-4",
                        task.severity === 'حرجة' ? "border-red-500 hover:bg-red-50/5" :
                        task.severity === 'عالية' ? "border-amber-500 hover:bg-amber-50/5" :
                        "border-blue-500 hover:bg-blue-50/5"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 flex-1">
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="mt-0.5 w-5 h-5 rounded-md border-2 border-gray-300 hover:border-saudi-green flex items-center justify-center transition-colors group/check bg-white shrink-0"
                            title="إتمام المهمة"
                          >
                            <Check className="w-3.5 h-3.5 text-saudi-green opacity-0 group-hover/check:opacity-50 transition-opacity" />
                          </button>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-saudi-dark leading-tight group-hover:text-saudi-green transition-colors">
                              {task.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                              <span className={cn(
                                "font-bold px-1.5 py-0.5 rounded-md",
                                task.severity === 'حرجة' ? "bg-red-50 text-red-700" :
                                task.severity === 'عالية' ? "bg-amber-50 text-amber-700" :
                                "bg-blue-50 text-blue-700"
                              )}>
                                {task.severity}
                              </span>
                              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md">
                                {task.type}
                              </span>
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-2.5 h-2.5" />
                                {task.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Details Accordion */}
                      <div className="mt-2.5 pr-7 flex items-center justify-between">
                        <button
                          onClick={() => toggleExpandTask(task.id)}
                          className="text-[10px] text-saudi-gold hover:underline font-bold flex items-center gap-0.5"
                        >
                          {isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل والتعليمات'}
                          <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isExpanded && "rotate-180")} />
                        </button>

                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="px-3 py-1 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                        >
                          <Check className="w-3 h-3" />
                          إكمال المهمة
                        </button>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 10 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 border border-gray-100 pr-7"
                          >
                            <p className="font-semibold text-saudi-dark mb-1">تعليمات المراجعة:</p>
                            <p className="leading-relaxed">{task.notes}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Prestigious Weekly Report PDF Viewer Modal */}
      <AnimatePresence>
        {isReportOpen && report && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-saudi-dark/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[90vh] border border-saudi-green/10"
            >
              {/* Modal Header */}
              <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl saudi-gradient flex items-center justify-center text-white">
                    <FileText className="w-5 h-5 text-saudi-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-saudi-dark">التقرير الأسبوعي الآلي</h3>
                    <p className="text-xs text-gray-400">صياغة الذكاء الاصطناعي التنفيذية</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePrint}
                    className="px-4 py-2 bg-saudi-green text-white hover:bg-saudi-green/90 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-saudi-green/10"
                  >
                    <Printer className="w-4 h-4 text-saudi-gold" />
                    تصدير وطباعة PDF
                  </button>
                  <button 
                    onClick={() => setIsReportOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-xl transition-all text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Printable Report Area */}
              <div className="flex-1 overflow-y-auto p-12 bg-white" id="weekly-report-print-area">
                {/* PDF Template Wrapper */}
                <div className="max-w-3xl mx-auto space-y-10 text-saudi-dark">
                  {/* Executive Header Banner */}
                  <div className="border-b-4 border-saudi-gold pb-6 flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-saudi-green font-extrabold text-xl tracking-wide">
                        <Building className="w-6 h-6 text-saudi-gold" />
                        المملكة العربية السعودية | مورد
                      </div>
                      <h1 className="text-2xl font-bold text-saudi-dark leading-tight">{report.reportTitle}</h1>
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-saudi-gold" /> تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-saudi-gold" /> النطاق: مشروع {selectedProject} العملاق
                        </span>
                      </div>
                    </div>
                    {/* Coat of arms motif */}
                    <div className="text-left flex flex-col items-end">
                      <div className="w-16 h-16 rounded-2xl saudi-gradient flex items-center justify-center text-white border-2 border-saudi-gold/40 shadow-lg">
                        <Award className="w-10 h-10 text-saudi-gold" />
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-saudi-gold font-bold mt-2">مستند رسمي</span>
                    </div>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-4 gap-4 p-5 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">إجمالي الأصول</p>
                      <p className="text-lg font-black text-saudi-green mt-1">{projectStats.totalAssets}</p>
                    </div>
                    <div className="text-center border-r border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">الخبراء النشطون</p>
                      <p className="text-lg font-black text-saudi-green mt-1">{projectStats.activeExperts} خبيراً</p>
                    </div>
                    <div className="text-center border-r border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">جلسات التوأمة</p>
                      <p className="text-lg font-black text-saudi-green mt-1">{projectStats.twinningSessions} جلسة</p>
                    </div>
                    <div className="text-center border-r border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">معدل التوطين</p>
                      <p className="text-lg font-black text-saudi-gold mt-1">{projectStats.localizationRate}</p>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-saudi-green uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-saudi-gold" /> الملخص التنفيذي
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify bg-gray-50/50 p-6 rounded-2xl border border-gray-100/60 font-medium">
                      {report.executiveSummary}
                    </p>
                  </div>

                  {/* Key Achievements */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-saudi-green uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-saudi-gold" /> أبرز الإنجازات المعرفية للتوطين
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {report.achievements.map((ach, i) => (
                        <div key={i} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
                          <div className="absolute top-0 right-0 left-0 h-1.5 bg-saudi-green"></div>
                          <span className="text-[10px] font-bold text-saudi-gold uppercase tracking-wider">الإنجاز {i+1}</span>
                          <h4 className="font-bold text-xs text-saudi-dark">{ach.title}</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed">{ach.description}</p>
                          <div className="pt-2">
                            <span className="text-[10px] font-bold text-saudi-green block bg-saudi-green/5 py-1 px-2.5 rounded-lg text-center">الأثر: {ach.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Localized Progress */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-saudi-green uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-saudi-gold" /> تقدم انتقال المعارف الحساسة (السعودية)
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                      {report.skillsLocalized.map((skill, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-saudi-dark">{skill.skill}</span>
                            <span className="text-saudi-green">{skill.percentage}% مکتمل</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-saudi-green rounded-full transition-all duration-1000" 
                              style={{ width: `${skill.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-gray-400">الخبير المشرف: {skill.expertName}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Gaps & Mitigation Table */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-saudi-green uppercase tracking-wider flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-saudi-gold" /> الفجوات المعرفية الحرجة المكتشفة وتوصيات المعالجة
                    </h3>
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-right border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                            <th className="p-4">الفجوة المعرفية</th>
                            <th className="p-4">مستوى الخطورة</th>
                            <th className="p-4">الإجراء المقترح لتوطينها</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {report.criticalGaps.map((gap, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="p-4 font-bold text-saudi-dark">{gap.gapName}</td>
                              <td className="p-4">
                                <span className={cn(
                                  "inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                                  gap.severity.includes("حرجة") ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                                )}>
                                  {gap.severity}
                                </span>
                              </td>
                              <td className="p-4 text-gray-500">{gap.remediationAction}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Stamp & Signatures section */}
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                    <div className="text-center space-y-2">
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">توقيع مدير توطين المعرفة</p>
                      <p className="text-sm font-extrabold text-saudi-dark">م. أحمد القحطاني</p>
                      <div className="h-10 flex items-center justify-center">
                        {/* Decorative simulated signature path */}
                        <svg className="w-24 h-8 text-saudi-green opacity-70" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 20 C 30 5, 40 35, 60 15 C 80 5, 85 25, 95 10" />
                        </svg>
                      </div>
                      <p className="text-[10px] text-gray-400">التاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
                    </div>

                    <div className="text-center space-y-2 border-r border-gray-100 flex flex-col items-center">
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">الاعتماد الرسمي والختم</p>
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-saudi-gold/60 flex items-center justify-center text-saudi-gold relative">
                        <div className="text-[8px] font-black uppercase text-center rotate-12">
                          مورد <br /> مصادق عليه
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive AI Mitigation & Planning Modal */}
      <AnimatePresence>
        {isMitigationOpen && selectedAlert && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-saudi-dark/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-saudi-green/10 text-right"
              dir="rtl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg saudi-gradient flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5 text-saudi-gold fill-saudi-gold animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-saudi-dark">لوحة المعالجة الذكية بالذكاء الاصطناعي</h3>
                    <p className="text-[10px] text-gray-400">تحليل الأبعاد الاستراتيجية وسد الفجوات الضمنية</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMitigationOpen(false)}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-all text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Alert Info Summary */}
                <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700">{selectedAlert.department}</span>
                    <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">{selectedAlert.severity}</span>
                  </div>
                  <h4 className="font-bold text-sm text-saudi-dark">{selectedAlert.gapName}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{selectedAlert.description}</p>
                </div>

                {isAnalyzingGap ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-saudi-green animate-spin" />
                    <div className="space-y-1">
                      <p className="font-bold text-saudi-dark">جاري استدعاء مستشار الذكاء الاصطناعي وتجهيز خطة العمل...</p>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto">
                        نقوم الآن بمطابقة الفجوة المعرفية مع أفضل الممارسات في المشاريع العملاقة بالمملكة واقتراح خبراء عالميين.
                      </p>
                    </div>
                  </div>
                ) : mitigationPlan ? (
                  <div className="space-y-5 text-saudi-dark">
                    {/* Duration badge */}
                    <div className="flex items-center justify-between bg-saudi-green/5 p-3 rounded-xl border border-saudi-green/10 text-xs font-bold">
                      <span className="text-saudi-green font-bold">المدة التقديرية للتوطين الكامل:</span>
                      <span className="text-saudi-gold bg-saudi-dark px-3 py-1 rounded-lg">
                        {mitigationPlan.estimatedTimelineWeeks} أسابيع
                      </span>
                    </div>

                    {/* Recommended Experts */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-saudi-green flex items-center gap-1">
                        <Users className="w-4 h-4 text-saudi-gold" /> الخبراء العالميون المقترحون للمطابقة والتوأمة:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mitigationPlan.recommendedExperts?.map((exp: any, i: number) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                            <p className="font-bold text-xs text-saudi-dark">{exp.name}</p>
                            <p className="text-[10px] text-gray-500">{exp.role}</p>
                            <span className="inline-block text-[9px] bg-saudi-gold/10 text-saudi-gold font-bold px-2 py-0.5 rounded mt-1">
                              التركيز: {exp.focusArea}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Targeted Saudi Roles */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-saudi-green flex items-center gap-1">
                        <Award className="w-4 h-4 text-saudi-gold" /> الكفاءات والأدوار السعودية المستهدفة بنقل المعرفة:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {mitigationPlan.targetSaudiRoles?.map((role: string, i: number) => (
                          <span key={i} className="text-[10px] font-bold bg-saudi-dark text-saudi-gold px-2.5 py-1 rounded-lg">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Remediation steps */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-saudi-green flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-saudi-gold" /> خطوات خطة التوطين الفورية الموصى بها:
                      </h5>
                      <div className="space-y-2.5">
                        {mitigationPlan.remediationPlanSteps?.map((step: string, i: number) => (
                          <div key={i} className="flex gap-3 items-start">
                            <span className="w-5 h-5 rounded-full bg-saudi-gold text-saudi-dark flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-xs text-gray-700 leading-relaxed font-medium">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 text-xs">
                    فشل تحميل خطة المعالجة. يرجى المحاولة لاحقاً.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 shrink-0">
                <button
                  onClick={() => setIsMitigationOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                >
                  إلغاء
                </button>
                {mitigationPlan && !isAnalyzingGap && (
                  <button
                    onClick={handleLaunchPlan}
                    disabled={isLaunchingPlan}
                    className="px-5 py-2 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isLaunchingPlan ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        جاري إطلاق المخطط التوطيني...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-saudi-gold" />
                        اعتماد الخطة وإطلاق التوأمة الفورية
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Immersive Knowledge Asset Detail & Focus Reading Mode */}
      <AnimatePresence>
        {selectedAssetForReading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="focus-reading-viewport"
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto backdrop-blur-md transition-colors duration-500",
              isFocusReadingMode
                ? (readingTheme === 'sepia' && "bg-[#FAF6EE] text-[#433422]") ||
                  (readingTheme === 'dark' && "bg-[#0F172A] text-[#E2E8F0]") ||
                  (readingTheme === 'emerald' && "bg-[#F0FDF4] text-[#14532D]") ||
                  "bg-white text-gray-900"
                : "bg-saudi-dark/85"
            )}
          >
            {/* If in normal detail review modal mode */}
            {!isFocusReadingMode ? (
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-4xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden max-h-[85vh] text-saudi-dark"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-saudi-green text-white shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-saudi-dark/10 pointer-events-none"></div>
                  <div className="absolute -left-16 -top-16 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-saudi-gold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-saudi-gold tracking-wider">مراجعة أصل معرفي</span>
                      <h3 className="font-bold text-base line-clamp-1">{selectedAssetForReading.title}</h3>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedAssetForReading(null)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/80 hover:text-white relative z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                  {/* Quick Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/60">
                    <div>
                      <p className="text-[10px] text-gray-400">الخبير المستخلص منه</p>
                      <p className="font-bold text-xs text-saudi-dark">{selectedAssetForReading.expert}</p>
                      <p className="text-[9px] text-gray-500">{selectedAssetForReading.role}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">التصنيف المعرفي</p>
                      <p className="font-bold text-xs text-saudi-dark">{selectedAssetForReading.category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">زمن القراءة المقدر</p>
                      <p className="font-bold text-xs text-saudi-green flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-saudi-gold" />
                        {selectedAssetForReading.readTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">مستوى السرية والسيادة</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-md border border-red-100/60">
                        {selectedAssetForReading.classification}
                      </span>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-5 bg-saudi-green/5 border border-saudi-green/10 rounded-2xl space-y-2 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-saudi-gold"></div>
                    <h4 className="font-bold text-sm text-saudi-green flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-saudi-gold animate-pulse" /> ملخص استراتيجي للأصل المعرفي
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {selectedAssetForReading.summary}
                    </p>
                  </div>

                  {/* Call-to-action to enter Focus Mode */}
                  <div className="p-6 bg-gradient-to-r from-saudi-dark to-[#0F2D1E] rounded-2xl border border-saudi-green/20 text-white flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-md">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.1),transparent_60%)]"></div>
                    <div className="space-y-1 relative z-10 text-right sm:text-right">
                      <h4 className="font-bold text-sm text-saudi-gold flex items-center gap-1.5 justify-start">
                        <Maximize2 className="w-4 h-4 text-saudi-gold" /> هل ترغب في قراءة عميقة خالية من المشتتات؟
                      </h4>
                      <p className="text-xs text-gray-300">
                        افتح هذا الأصل المعرفي في وضع القراءة المركز لتكبير النص وتعديل الخلفيات والخطوط والتحكم بالتمرير التلقائي.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsFocusReadingMode(true)}
                      className="px-5 py-2.5 bg-saudi-green hover:bg-saudi-green/90 hover:scale-105 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-md relative z-10 border border-white/10"
                    >
                      <BookOpen className="w-4 h-4 text-saudi-gold" />
                      تفعيل وضع القراءة المريحة (Focus)
                    </button>
                  </div>

                  {/* Preview Sections */}
                  <div className="space-y-4 pt-2">
                    <h4 className="font-bold text-sm text-saudi-dark border-b border-gray-100 pb-2">فصول الدراسة الموثقة</h4>
                    <div className="space-y-4">
                      {selectedAssetForReading.sections?.map((sec: any, idx: number) => (
                        <div key={idx} className="space-y-1 bg-gray-50/40 hover:bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors">
                          <h5 className="font-bold text-xs text-saudi-green">{sec.heading}</h5>
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{sec.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/50 shrink-0">
                  <span className="text-[10px] text-gray-400">منصة مورد الوطنية لإدارة وتوطين المعرفة</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedAssetForReading(null)}
                      className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                    >
                      إلغاء المراجعة
                    </button>
                    <button
                      onClick={() => setIsFocusReadingMode(true)}
                      className="px-5 py-2 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      وضع القراءة
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* If in FULL IMMERSIVE FOCUS READING MODE */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-3xl flex flex-col h-full py-6 relative"
              >
                {/* Immersive Controls bar */}
                <div className={cn(
                  "sticky top-0 z-30 px-6 py-4 rounded-2xl shadow-lg border mb-8 flex flex-wrap items-center justify-between gap-4 transition-colors duration-300",
                  readingTheme === 'sepia' && "bg-[#FAF6EE]/95 border-[#E8DFC8] text-[#433422]" ||
                  readingTheme === 'dark' && "bg-[#1E293B]/95 border-[#334155] text-[#E2E8F0]" ||
                  readingTheme === 'emerald' && "bg-[#E8F5E9]/95 border-[#C8E6C9] text-[#14532D]" ||
                  "bg-white/95 border-gray-100 text-gray-800"
                )}>
                  {/* Left Controls (Back, font selectors) */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsFocusReadingMode(false)}
                      className="p-2 hover:bg-black/5 rounded-xl transition-all flex items-center gap-1 text-xs font-bold"
                      title="الرجوع للتفاصيل"
                    >
                      <Undo2 className="w-4 h-4" />
                      <span className="hidden sm:inline">رجوع</span>
                    </button>

                    <div className="h-6 w-px bg-current opacity-20"></div>

                    {/* Font Type Chooser */}
                    <div className="flex items-center gap-1">
                      <Type className="w-4 h-4 opacity-70" />
                      <select
                        value={readingFontFamily}
                        onChange={(e) => setReadingFontFamily(e.target.value as any)}
                        className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer p-1"
                      >
                        <option value="sans">خط عادي</option>
                        <option value="serif">خط كلاسيكي</option>
                        <option value="mono">خط برمجي</option>
                      </select>
                    </div>

                    <div className="h-6 w-px bg-current opacity-20"></div>

                    {/* Font Size Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setReadingFontSize(prev => Math.max(14, prev - 2))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-black/5 rounded-lg text-xs font-bold"
                        title="تصغير الخط"
                      >
                        أ-
                      </button>
                      <span className="text-[10px] font-mono w-5 text-center">{readingFontSize}</span>
                      <button
                        onClick={() => setNewTaskSeverity && setReadingFontSize(prev => Math.min(32, prev + 2))}
                        className="w-7 h-7 flex items-center justify-center hover:bg-black/5 rounded-lg text-xs font-bold"
                        title="تكبير الخط"
                      >
                        أ+
                      </button>
                    </div>
                  </div>

                  {/* Right Controls (Themes, AutoScroll, Close) */}
                  <div className="flex items-center gap-3">
                    {/* Theme Pickers */}
                    <div className="flex items-center gap-1.5 bg-black/5 p-1 rounded-xl">
                      <button
                        onClick={() => setReadingTheme('sepia')}
                        className={cn("w-6 h-6 rounded-lg transition-all", readingTheme === 'sepia' ? "ring-2 ring-[#C5A059] scale-110" : "opacity-60")}
                        style={{ backgroundColor: '#FAF6EE' }}
                        title="سمات دافئة (Sepia)"
                      ></button>
                      <button
                        onClick={() => setReadingTheme('emerald')}
                        className={cn("w-6 h-6 rounded-lg transition-all", readingTheme === 'emerald' ? "ring-2 ring-emerald-600 scale-110" : "opacity-60")}
                        style={{ backgroundColor: '#F0FDF4' }}
                        title="سمات طبيعية (Emerald)"
                      ></button>
                      <button
                        onClick={() => setReadingTheme('white')}
                        className={cn("w-6 h-6 rounded-lg border border-gray-200 transition-all", readingTheme === 'white' ? "ring-2 ring-gray-400 scale-110" : "opacity-60")}
                        style={{ backgroundColor: '#FFFFFF' }}
                        title="سمات ناصعة (White)"
                      ></button>
                      <button
                        onClick={() => setReadingTheme('dark')}
                        className={cn("w-6 h-6 rounded-lg transition-all", readingTheme === 'dark' ? "ring-2 ring-blue-500 scale-110" : "opacity-60")}
                        style={{ backgroundColor: '#0F172A' }}
                        title="سمات ليلية (Midnight)"
                      ></button>
                    </div>

                    <div className="h-6 w-px bg-current opacity-20"></div>

                    {/* Auto-Scroll Toggle */}
                    <div className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded-xl">
                      <button
                        onClick={() => setIsAutoscrolling(!isAutoscrolling)}
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1",
                          isAutoscrolling ? "bg-saudi-green text-white" : "hover:bg-black/10"
                        )}
                        title={isAutoscrolling ? "إيقاف التمرير التلقائي" : "تشغيل التمرير التلقائي"}
                      >
                        <span>تمرير</span>
                        {isAutoscrolling ? <span className="w-1.5 h-1.5 bg-saudi-gold rounded-full animate-ping"></span> : null}
                      </button>
                      {isAutoscrolling && (
                        <select
                          value={scrollSpeed}
                          onChange={(e) => setScrollSpeed(Number(e.target.value))}
                          className="bg-transparent text-[9px] font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="1">١x</option>
                          <option value="2">٢x</option>
                          <option value="3">٣x</option>
                          <option value="5">٥x</option>
                        </select>
                      )}
                    </div>

                    <div className="h-6 w-px bg-current opacity-20"></div>

                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setIsFocusReadingMode(false);
                        setSelectedAssetForReading(null);
                      }}
                      className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                      title="الخروج من وضع القراءة"
                    >
                      <Minimize2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Immersive Scroll Active Hook */}
                <ScrollHelper isEnabled={isAutoscrolling} speed={scrollSpeed} />

                {/* Reading Progress Indicator */}
                <ReadingProgressBar theme={readingTheme} />

                {/* Document Canvas */}
                <div
                  className={cn(
                    "flex-1 overflow-y-auto px-6 md:px-12 py-8 rounded-3xl shadow-sm border space-y-8 leading-relaxed",
                    readingTheme === 'sepia' && "bg-[#FDFBF7] border-[#F3ECE0]" ||
                    readingTheme === 'dark' && "bg-[#1E293B] border-[#334155]" ||
                    readingTheme === 'emerald' && "bg-[#F4FBF7] border-[#E2F5E9]" ||
                    "bg-white border-gray-100",
                    readingFontFamily === 'sans' && "font-sans",
                    readingFontFamily === 'serif' && "font-serif",
                    readingFontFamily === 'mono' && "font-mono"
                  )}
                  style={{ fontSize: `${readingFontSize}px` }}
                >
                  {/* Article Meta Header */}
                  <div className="border-b border-current/10 pb-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-saudi-gold/20 text-saudi-gold">
                        {selectedAssetForReading.category}
                      </span>
                      <span className="text-xs opacity-60">|</span>
                      <span className="text-xs opacity-75">{selectedAssetForReading.readTime} مراجعة</span>
                      <span className="text-xs opacity-60">|</span>
                      <span className="text-xs opacity-75 font-bold">الموثق الميداني: {selectedAssetForReading.expert}</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                      {selectedAssetForReading.title}
                    </h1>

                    <p className="text-xs opacity-50 font-medium">
                      المستوى الأمني السيادي: {selectedAssetForReading.classification}
                    </p>
                  </div>

                  {/* Summary Callout Immersive */}
                  <div className="p-6 rounded-2xl border bg-current/5 border-current/10 italic font-medium">
                    <p className="text-sm leading-relaxed opacity-95">
                      " {selectedAssetForReading.summary} "
                    </p>
                  </div>

                  {/* Main Text Sections */}
                  <div className="space-y-8">
                    {selectedAssetForReading.sections?.map((sec: any, idx: number) => (
                      <motion.section
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="space-y-3 text-right"
                      >
                        <h2 className="text-lg md:text-xl font-bold border-r-4 border-saudi-gold pr-3 text-saudi-gold">
                          {sec.heading}
                        </h2>
                        <p className="text-sm md:text-base leading-relaxed opacity-85 text-justify whitespace-pre-line">
                          {sec.text}
                        </p>
                      </motion.section>
                    ))}
                  </div>

                  {/* Bottom Verification Seal */}
                  <div className="border-t border-current/10 pt-8 mt-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-saudi-gold/10 text-saudi-gold flex items-center justify-center">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-saudi-gold">توطين معرفي معتمد</h4>
                      <p className="text-[10px] opacity-60 mt-0.5">تم التحقق ومطابقة هذا الأصل مع المعايير الفنية الوطنية للمملكة ٢٠٣٠</p>
                    </div>
                  </div>
                </div>

                {/* Floating Bottom Navigator for Quick Back */}
                <div className="mt-4 flex items-center justify-between text-xs opacity-60 px-2">
                  <span>المستند نشط في خوادم الإدارة المستدامة للسيادة الفكرية</span>
                  <button
                    onClick={() => setIsFocusReadingMode(false)}
                    className="hover:underline font-bold text-saudi-gold"
                  >
                    الخروج لوضع العرض العادي ↑
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Global CSS for Print Layout PDF Export */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #weekly-report-print-area, #weekly-report-print-area * {
            visibility: visible;
          }
          #weekly-report-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          /* Custom overrides to force colors and prevent cuts in print */
          .saudi-gradient {
            background: linear-gradient(135deg, #006C35 0%, #004D26 100%) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .text-saudi-green {
            color: #006C35 !important;
          }
          .text-saudi-gold {
            color: #C5A059 !important;
          }
          .bg-saudi-green {
            background-color: #006C35 !important;
          }
          .bg-saudi-gold {
            background-color: #C5A059 !important;
          }
          .bg-gray-50 {
            background-color: #F9FAFB !important;
          }
        }
      `}</style>
    </div>
  );
}


const ScrollHelper = ({ isEnabled, speed }: { isEnabled: boolean; speed: number }) => {
  useEffect(() => {
    if (!isEnabled) return;
    
    let interval: any;
    const scrollContainer = document.getElementById('focus-reading-viewport');
    
    if (scrollContainer) {
      interval = setInterval(() => {
        scrollContainer.scrollBy({
          top: speed,
          behavior: 'smooth'
        });
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEnabled, speed]);
  
  return null;
};


const ReadingProgressBar = ({ theme }: { theme: string }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('focus-reading-viewport');
      if (!container) return;
      const totalHeight = container.scrollHeight - container.clientHeight;
      if (totalHeight <= 0) {
        setScrollProgress(100);
        return;
      }
      const progress = (container.scrollTop / totalHeight) * 100;
      setScrollProgress(progress);
    };

    const container = document.getElementById('focus-reading-viewport');
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      // Initial trigger
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-black/5 pointer-events-none">
      <div 
        className={cn(
          "h-full transition-all duration-100 ease-out",
          theme === 'sepia' && "bg-[#C5A059]",
          theme === 'emerald' && "bg-emerald-600",
          theme === 'dark' && "bg-blue-500",
          "bg-saudi-green"
        )}
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  );
};


