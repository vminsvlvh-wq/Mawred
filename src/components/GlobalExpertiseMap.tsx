import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe2, 
  MapPin, 
  Layers, 
  Users, 
  Zap, 
  Sparkles, 
  ArrowUpRight, 
  Info, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Compass, 
  Search, 
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export interface ExpertNode {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  city: string;
  cityEn: string;
  country: string;
  countryEn: string;
  flag: string;
  coordinates: { x: number; y: number }; // SVG map percentage or viewbox coordinates
  primaryField: string;
  primaryFieldEn: string;
  availability: 'high' | 'medium' | 'partial';
  availabilityStatus: string;
  availabilityStatusEn: string;
  weeklyHours: number;
  rating: number;
  avatar: string;
  avatarColor: string;
  linkedProjects: string[]; // ['نيوم', 'البحر الأحمر', 'أرامكو']
}

export interface GigaProjectNode {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  regionEn: string;
  coordinates: { x: number; y: number };
  focusArea: string;
  focusAreaEn: string;
  color: string;
  badgeColor: string;
  activeExpertsCount: number;
  ongoingTwinningHours: number;
}

export const SAUDI_PROJECTS: GigaProjectNode[] = [
  {
    id: 'neom',
    name: 'نيوم وذا لاين',
    nameEn: 'NEOM & The Line',
    region: 'شمال غرب المملكة • تبوك',
    regionEn: 'NW Saudi Arabia • Tabuk',
    coordinates: { x: 535, y: 260 },
    focusArea: 'الهيدروجين الأخضر، الأنفاق العميقة، والمدن الإدراكية',
    focusAreaEn: 'Green Hydrogen, Deep Tunnels & Cognitive Cities',
    color: '#006C35',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    activeExpertsCount: 8,
    ongoingTwinningHours: 64
  },
  {
    id: 'redsea',
    name: 'البحر الأحمر وأمالا',
    nameEn: 'The Red Sea & Amaala',
    region: 'الساحل الغربي • البحر الأحمر',
    regionEn: 'Western Coast • Red Sea',
    coordinates: { x: 515, y: 310 },
    focusArea: 'الهندسة البحرية، الفلل العائمة، وحماية الشعاب المرجانية',
    focusAreaEn: 'Marine Engineering, Floating Villas & Coral Preservation',
    color: '#008F4C',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-300',
    activeExpertsCount: 6,
    ongoingTwinningHours: 48
  },
  {
    id: 'aramco',
    name: 'مشاريع أرامكو الوطنية',
    nameEn: 'Aramco Giga Projects',
    region: 'المنطقة الشرقية • الظهران',
    regionEn: 'Eastern Province • Dhahran',
    coordinates: { x: 585, y: 285 },
    focusArea: 'التصنيع النمطي المتقدم، الذكاء الاصطناعي، وسلاسل الإمداد الرشيقة',
    focusAreaEn: 'Advanced Modular Mfg, Industrial AI & Agile Supply Chains',
    color: '#C5A059',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    activeExpertsCount: 7,
    ongoingTwinningHours: 56
  }
];

export const INTERNATIONAL_EXPERTS: ExpertNode[] = [
  {
    id: 'exp-1',
    name: 'د. يورغن شتراوس',
    nameEn: 'Dr. Jürgen Strauss',
    title: 'كبير خبراء كيميائية الهيدروجين والتحليل الكهربائي',
    titleEn: 'Senior Green Hydrogen & Electrolysis Specialist',
    city: 'ميونخ / فرايبورغ',
    cityEn: 'Munich / Freiburg',
    country: 'ألمانيا',
    countryEn: 'Germany',
    flag: '🇩🇪',
    coordinates: { x: 440, y: 155 },
    primaryField: 'الهيدروجين الأخضر وتحويل الأمونيا',
    primaryFieldEn: 'Green Hydrogen & Ammonia Conversion',
    availability: 'high',
    availabilityStatus: 'متاح بالكامل (جاهزية مرتفعة)',
    availabilityStatusEn: 'Fully Available (High Readiness)',
    weeklyHours: 16,
    rating: 4.9,
    avatar: 'JS',
    avatarColor: 'from-blue-600 to-indigo-600',
    linkedProjects: ['نيوم']
  },
  {
    id: 'exp-2',
    name: 'د. ستيفن ووكر',
    nameEn: 'Dr. Stephen Walker',
    title: 'كبير مستشاري الهندسة المدنية ومخاطر السيول الجبلية',
    titleEn: 'Chief Civil & Mountain Hydrology Consultant',
    city: 'لندن',
    cityEn: 'London',
    country: 'المملكة المتحدة',
    countryEn: 'United Kingdom',
    flag: '🇬🇧',
    coordinates: { x: 395, y: 145 },
    primaryField: 'أنفاق الصخور العميقة وحماية السيول',
    primaryFieldEn: 'Deep Rock Tunnels & Flood Defense',
    availability: 'high',
    availabilityStatus: 'متاح بالكامل (جاهزية مرتفعة)',
    availabilityStatusEn: 'Fully Available (High Readiness)',
    weeklyHours: 16,
    rating: 4.9,
    avatar: 'SW',
    avatarColor: 'from-amber-600 to-yellow-600',
    linkedProjects: ['نيوم']
  },
  {
    id: 'exp-3',
    name: 'م. كينجي ساتو',
    nameEn: 'Eng. Kenji Sato',
    title: 'كبير استشاريي التصنيع النمطي وسلاسل الإمداد الرشيقة',
    titleEn: 'Lead Modular Manufacturing & Agile Logistics Advisor',
    city: 'طوكيو / ناغويا',
    cityEn: 'Tokyo / Nagoya',
    country: 'اليابان',
    countryEn: 'Japan',
    flag: '🇯🇵',
    coordinates: { x: 790, y: 195 },
    primaryField: 'التصنيع الإنشائي النمطي وسلاسل التوريد JIT',
    primaryFieldEn: 'Prefabricated Modular Mfg & JIT Logistics',
    availability: 'medium',
    availabilityStatus: 'مشغول جزئياً (جاهزية متوازنة)',
    availabilityStatusEn: 'Partially Busy (Balanced Readiness)',
    weeklyHours: 10,
    rating: 4.8,
    avatar: 'KS',
    avatarColor: 'from-orange-600 to-red-600',
    linkedProjects: ['أرامكو', 'نيوم']
  },
  {
    id: 'exp-4',
    name: 'م. سليم الصغير',
    nameEn: 'Eng. Salim Al-Saghir',
    title: 'استشاري القواعد الخرسانية البحرية والمنشآت العائمة',
    titleEn: 'Coastal Structures & Floating Foundations Expert',
    city: 'روتردام / مارسيليا',
    cityEn: 'Rotterdam / Marseille',
    country: 'هولندا وفرنسا',
    countryEn: 'Netherlands & France',
    flag: '🇳🇱',
    coordinates: { x: 420, y: 175 },
    primaryField: 'الخرسانة فائقة المقاومة للملوحة والفلل العائمة',
    primaryFieldEn: 'Chloride-Resistant Marine Concrete & Floating Villas',
    availability: 'high',
    availabilityStatus: 'متاح بالكامل (جاهزية مرتفعة)',
    availabilityStatusEn: 'Fully Available (High Readiness)',
    weeklyHours: 16,
    rating: 4.8,
    avatar: 'SS',
    avatarColor: 'from-cyan-600 to-blue-600',
    linkedProjects: ['البحر الأحمر']
  },
  {
    id: 'exp-5',
    name: 'د. ماركوس فانس ود. إيلينا',
    nameEn: 'Dr. Marcus Vance & Elena',
    title: 'خبراء التوأم الرقمي والحوسبة الصناعية للشبكات الذكية',
    titleEn: 'Industrial Digital Twin & High-Load Grid Architects',
    city: 'بوسطن / زيورخ',
    cityEn: 'Boston & Zurich',
    country: 'أمريكا وسويسرا',
    countryEn: 'USA & Switzerland',
    flag: '🇺🇸',
    coordinates: { x: 260, y: 180 },
    primaryField: 'التوأمة الرقمية وموازنة أحمال الشبكات بالذكاء الاصطناعي',
    primaryFieldEn: 'Digital Twins & AI Smart Grid Balancing',
    availability: 'high',
    availabilityStatus: 'متاح بالكامل (جاهزية مرتفعة)',
    availabilityStatusEn: 'Fully Available (High Readiness)',
    weeklyHours: 14,
    rating: 4.9,
    avatar: 'MV',
    avatarColor: 'from-purple-600 to-indigo-600',
    linkedProjects: ['أرامكو']
  }
];

export default function GlobalExpertiseMap({ 
  selectedProject = 'جميع المشاريع',
  onSelectExpert 
}: { 
  selectedProject?: string;
  onSelectExpert?: (expertId: string) => void;
}) {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedHub, setSelectedHub] = useState<ExpertNode | GigaProjectNode | null>(null);
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with prop if passed
  React.useEffect(() => {
    if (selectedProject && selectedProject !== 'جميع المشاريع') {
      if (selectedProject.includes('نيوم')) setActiveFilter('neom');
      else if (selectedProject.includes('البحر الأحمر')) setActiveFilter('redsea');
      else if (selectedProject.includes('أرامكو')) setActiveFilter('aramco');
    }
  }, [selectedProject]);

  // Filtered corridors and experts
  const filteredExperts = useMemo(() => {
    return INTERNATIONAL_EXPERTS.filter(expert => {
      // Project filter match
      const projectMatches = activeFilter === 'all' || 
        (activeFilter === 'neom' && expert.linkedProjects.some(p => p.includes('نيوم'))) ||
        (activeFilter === 'redsea' && expert.linkedProjects.some(p => p.includes('البحر الأحمر'))) ||
        (activeFilter === 'aramco' && expert.linkedProjects.some(p => p.includes('أرامكو')));

      // Search match
      const searchMatches = !searchQuery.trim() || 
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.primaryField.toLowerCase().includes(searchQuery.toLowerCase());

      return projectMatches && searchMatches;
    });
  }, [activeFilter, searchQuery]);

  // Get project node helper
  const getProjectNodeByName = (projName: string): GigaProjectNode | undefined => {
    if (projName.includes('نيوم')) return SAUDI_PROJECTS.find(p => p.id === 'neom');
    if (projName.includes('البحر الأحمر')) return SAUDI_PROJECTS.find(p => p.id === 'redsea');
    if (projName.includes('أرامكو')) return SAUDI_PROJECTS.find(p => p.id === 'aramco');
    return SAUDI_PROJECTS[0];
  };

  // Generate smooth SVG quadratic curve for corridors
  const createCurvedPath = (startX: number, startY: number, endX: number, endY: number) => {
    const midX = (startX + endX) / 2;
    const midY = Math.min(startY, endY) - 50; // curve upwards like flight arcs
    return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden font-sans space-y-0 transition-all">
      {/* Header & Controls Toolbar */}
      <div className="p-6 pb-4 border-b border-gray-100 bg-gradient-to-br from-saudi-dark/5 via-transparent to-saudi-gold/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-saudi-dark text-saudi-gold flex items-center justify-center shrink-0 shadow-sm">
            <Globe2 className="w-6 h-6 animate-[spin_18s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-saudi-dark">
                {t('map.title', 'خريطة التوزيع الجغرافي للخبرات الدولية ومشاريع المملكة')}
              </h2>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-saudi-green/10 text-saudi-green border border-saudi-green/20">
                {isEn ? 'Global Expertise Grid' : 'شبكة نقل وتوطين المعرفة العالمية'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              {t('map.subtitle', 'ربط تفاعلي مباشر بين مراكز الخبرة العالمية والمشاريع الوطنية الكبرى لنقل وتوطين المعرفة')}
            </p>
          </div>
        </div>

        {/* Global Key Metrics Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-saudi-green animate-ping"></span>
            <span className="text-[11px] font-bold text-gray-500">{isEn ? 'Active Hubs:' : 'المراكز النشطة:'}</span>
            <span className="text-xs font-black text-saudi-dark">6 {isEn ? 'Countries' : 'دول'}</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-saudi-gold fill-saudi-gold" />
            <span className="text-[11px] font-bold text-gray-500">{isEn ? 'Corridors:' : 'المسارات:'}</span>
            <span className="text-xs font-black text-saudi-green">8 {isEn ? 'Active' : 'مسارات نشطة'}</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-saudi-green" />
            <span className="text-[11px] font-bold text-gray-500">{isEn ? 'Available:' : 'متاح للتوأمة:'}</span>
            <span className="text-xs font-black text-saudi-dark">14 {isEn ? 'Experts' : 'خبيراً'}</span>
          </div>
        </div>
      </div>

      {/* Filter and View Toolbar */}
      <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Project Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-gray-400 font-bold ml-1 flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-saudi-green" />
            {isEn ? 'Filter by Project:' : 'تصفية حسب المشروع:'}
          </span>

          {[
            { id: 'all', label: isEn ? 'All Projects' : 'جميع المشاريع' },
            { id: 'neom', label: isEn ? 'NEOM & The Line' : 'نيوم وذا لاين' },
            { id: 'redsea', label: isEn ? 'The Red Sea' : 'البحر الأحمر وأمالا' },
            { id: 'aramco', label: isEn ? 'Aramco Projects' : 'مشاريع أرامكو' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setSelectedHub(null);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap border text-xs",
                  isSelected
                    ? "bg-saudi-dark text-saudi-gold border-saudi-dark shadow-xs"
                    : "bg-white text-gray-600 border-gray-200 hover:border-saudi-green/40 hover:bg-emerald-50/30"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search input & Map utilities */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search expert, city, country..." : "ابحث عن خبير، دولة، أو تخصص..."}
              className="w-full bg-white border border-gray-200 rounded-xl pr-8 pl-3 py-1 text-xs outline-none focus:border-saudi-green focus:ring-1 focus:ring-saudi-green/20"
            />
          </div>

          <button
            onClick={() => setIsAnimationActive(!isAnimationActive)}
            title={isAnimationActive ? (isEn ? "Pause Corridor Animation" : "إيقاف نبض المسارات") : (isEn ? "Play Animation" : "تشغيل حركة المسارات")}
            className={cn(
              "p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer",
              isAnimationActive ? "bg-emerald-50 text-saudi-green border-emerald-200" : "bg-white text-gray-400 border-gray-200"
            )}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{isAnimationActive ? (isEn ? 'Animated' : 'حركة المسارات') : (isEn ? 'Static' : 'ثابت')}</span>
          </button>

          <button
            onClick={() => {
              setActiveFilter('all');
              setSelectedHub(null);
              setSearchQuery('');
              setZoomLevel(1);
            }}
            title={isEn ? "Reset View" : "إعادة الضبط"}
            className="p-1.5 bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative w-full h-[460px] md:h-[500px] bg-[#0E1A16] overflow-hidden select-none">
        {/* Subtle Map Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#C5A059 1px, transparent 1px), radial-gradient(#006C35 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px'
          }}
        />

        {/* Ambient Map Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-saudi-green/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Top Floating Map Legend */}
        <div className="absolute top-4 right-4 z-20 bg-saudi-dark/90 backdrop-blur-md border border-white/10 px-3 py-2 rounded-2xl text-[11px] text-white shadow-xl space-y-1 hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-saudi-gold animate-pulse"></span>
            <span className="font-bold">{isEn ? 'Saudi Giga-Projects Hubs' : 'مراكز المشاريع السعودية الكبرى'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-gray-300">{isEn ? 'International Expert Origins' : 'مواقع الخبراء الدوليين المتاحين'}</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5 text-[10px] text-gray-400">
            <Info className="w-3 h-3 text-saudi-gold" />
            <span>{t('map.clickHint', 'انقر على أي نقطة لعرض التفاصيل')}</span>
          </div>
        </div>

        {/* SVG Drawing Layer for World Landmass Silhouette & Curved Knowledge Flight Arcs */}
        <svg 
          viewBox="0 0 960 480" 
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Gradient for Knowledge Corridors */}
            <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#48BB78" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ECC94B" stopOpacity="1" />
              <stop offset="100%" stopColor="#38A169" stopOpacity="0.9" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stylized World Continents Background Outlines */}
          <g fill="#182A23" stroke="#233E33" strokeWidth="1" opacity="0.85">
            {/* Europe & Scandinavia */}
            <path d="M 360,110 Q 400,90 440,110 Q 460,130 450,170 Q 410,190 380,180 Z" />
            <path d="M 390,70 Q 420,50 430,90 Q 410,120 390,100 Z" />
            {/* North America */}
            <path d="M 180,110 Q 260,80 290,140 Q 260,220 200,240 Q 150,180 180,110 Z" />
            {/* Africa */}
            <path d="M 400,200 Q 460,200 480,260 Q 460,380 430,390 Q 380,310 390,240 Z" />
            {/* Arabian Peninsula & Middle East */}
            <path d="M 490,230 Q 560,220 600,260 Q 580,350 510,340 Q 480,280 490,230 Z" fill="#20382E" stroke="#006C35" strokeWidth="1.5" />
            {/* Asia & East Asia */}
            <path d="M 520,120 Q 680,100 780,150 Q 820,240 760,280 Q 640,240 550,210 Z" />
            {/* Japan islands */}
            <path d="M 780,180 Q 805,170 800,210 Q 775,220 780,180 Z" />
            {/* Southeast Asia & Oceania hint */}
            <path d="M 680,280 Q 740,270 760,330 Q 710,360 680,310 Z" />
          </g>

          {/* Knowledge Corridors (Curved Connecting Arcs) */}
          <g>
            {filteredExperts.map((expert) => {
              return expert.linkedProjects.map((projName, pIdx) => {
                const projectNode = getProjectNodeByName(projName);
                if (!projectNode) return null;

                const pathString = createCurvedPath(
                  expert.coordinates.x,
                  expert.coordinates.y,
                  projectNode.coordinates.x,
                  projectNode.coordinates.y
                );

                const isHighlighted = selectedHub?.id === expert.id || selectedHub?.id === projectNode.id;

                return (
                  <g key={`${expert.id}-${projName}-${pIdx}`}>
                    {/* Shadow / Glow track */}
                    <path
                      d={pathString}
                      fill="none"
                      stroke={isHighlighted ? "#ECC94B" : "#006C35"}
                      strokeWidth={isHighlighted ? "3" : "1.8"}
                      strokeOpacity={isHighlighted ? "0.9" : "0.5"}
                      filter="url(#glow)"
                    />

                    {/* Animated moving particle dashes */}
                    <path
                      d={pathString}
                      fill="none"
                      stroke="url(#corridorGradient)"
                      strokeWidth={isHighlighted ? "2.5" : "1.8"}
                      strokeDasharray="6 12"
                      className={cn(isAnimationActive && "animate-[dash_2.5s_linear_infinite]")}
                    />

                    {/* Midpoint Pulse Dot */}
                    <circle
                      cx={(expert.coordinates.x + projectNode.coordinates.x) / 2}
                      cy={(expert.coordinates.y + projectNode.coordinates.y) / 2 - 25}
                      r="2.5"
                      fill="#C5A059"
                      className="animate-ping"
                      opacity="0.75"
                    />
                  </g>
                );
              });
            })}
          </g>

          {/* Render Saudi Giga Projects Nodes (Hubs) */}
          {SAUDI_PROJECTS.map((project) => {
            const isSelected = selectedHub?.id === project.id;
            const matchesActiveFilter = activeFilter === 'all' || activeFilter === project.id;

            return (
              <g 
                key={project.id} 
                className="cursor-pointer group"
                onClick={() => setSelectedHub(project)}
              >
                {/* Radar Rings */}
                <circle
                  cx={project.coordinates.x}
                  cy={project.coordinates.y}
                  r={isSelected ? "22" : "16"}
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  className={cn(isAnimationActive && "animate-ping opacity-60")}
                />
                
                <circle
                  cx={project.coordinates.x}
                  cy={project.coordinates.y}
                  r="12"
                  fill="#006C35"
                  stroke="#C5A059"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                <circle
                  cx={project.coordinates.x}
                  cy={project.coordinates.y}
                  r="5"
                  fill="#FFFFFF"
                />

                {/* Project Label Tag */}
                <g transform={`translate(${project.coordinates.x + 10}, ${project.coordinates.y - 12})`}>
                  <rect
                    x="0"
                    y="0"
                    width={isEn ? "110" : "90"}
                    height="20"
                    rx="6"
                    fill="#1A252C"
                    stroke="#C5A059"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x="6"
                    y="14"
                    fill="#FFFFFF"
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    ★ {isEn ? project.nameEn : project.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Render International Experts Nodes */}
          {filteredExperts.map((expert) => {
            const isSelected = selectedHub?.id === expert.id;

            return (
              <g 
                key={expert.id} 
                className="cursor-pointer group"
                onClick={() => setSelectedHub(expert)}
              >
                {/* Pulsing ring */}
                <circle
                  cx={expert.coordinates.x}
                  cy={expert.coordinates.y}
                  r={isSelected ? "18" : "12"}
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="1.2"
                  className={cn(isAnimationActive && "animate-pulse")}
                />

                {/* Node Core */}
                <circle
                  cx={expert.coordinates.x}
                  cy={expert.coordinates.y}
                  r="7.5"
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Flag & City Label */}
                <g transform={`translate(${expert.coordinates.x - 30}, ${expert.coordinates.y + 12})`}>
                  <rect
                    x="0"
                    y="0"
                    width="70"
                    height="18"
                    rx="5"
                    fill="#0E1A16"
                    stroke="#10B981"
                    strokeWidth="0.8"
                    opacity="0.95"
                  />
                  <text
                    x="35"
                    y="12"
                    fill="#FFFFFF"
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {expert.flag} {isEn ? expert.cityEn : expert.city.split('/')[0]}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Hub Interactive Detail Floating Drawer / Modal */}
        <AnimatePresence>
          {selectedHub && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-4 left-4 right-4 md:right-auto md:left-4 md:w-96 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-gray-200 z-30 space-y-3 text-right"
              dir={isEn ? "ltr" : "rtl"}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  {'flag' in selectedHub ? (
                    <span className="text-2xl">{selectedHub.flag}</span>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-saudi-green/10 text-saudi-green flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4 text-saudi-green" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm text-saudi-dark">
                      {isEn ? selectedHub.nameEn : selectedHub.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {'city' in selectedHub ? (
                        `${isEn ? selectedHub.cityEn : selectedHub.city} • ${isEn ? selectedHub.countryEn : selectedHub.country}`
                      ) : (
                        isEn ? selectedHub.regionEn : selectedHub.region
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHub(null)}
                  className="p-1 text-gray-400 hover:text-saudi-dark rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Body: Expert or Project Info */}
              {'primaryField' in selectedHub ? (
                // International Expert Card
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 block">{isEn ? 'Core Specialization:' : 'مجال التخصص والخبرة:'}</span>
                    <p className="font-bold text-saudi-dark text-[11px] leading-relaxed">
                      {isEn ? selectedHub.primaryFieldEn : selectedHub.primaryField}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg font-bold border border-emerald-200/60">
                      <span className="block text-gray-400 text-[9px] font-medium">{isEn ? 'Weekly Hours:' : 'ساعات التفرغ:'}</span>
                      <span className="font-extrabold text-xs">{selectedHub.weeklyHours} {isEn ? 'hrs/week' : 'ساعة/أسبوعياً'}</span>
                    </div>

                    <div className="p-2 bg-amber-50 text-amber-900 rounded-lg font-bold border border-amber-200/60">
                      <span className="block text-gray-400 text-[9px] font-medium">{isEn ? 'Rating:' : 'التقييم المهني:'}</span>
                      <span className="font-extrabold text-xs flex items-center gap-1">
                        ★ {selectedHub.rating} / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-gray-500 font-medium">{isEn ? 'Linked Giga Projects:' : 'المشاريع المرتبطة:'}</span>
                    <div className="flex gap-1">
                      {selectedHub.linkedProjects.map((p, idx) => (
                        <span key={idx} className="bg-saudi-dark text-saudi-gold font-bold px-2 py-0.5 rounded text-[10px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectExpert) onSelectExpert(selectedHub.id);
                    }}
                    className="w-full py-2 bg-saudi-green hover:bg-saudi-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-saudi-gold" />
                    <span>{isEn ? 'Initiate Cognitive Twinning' : 'طلب مطابقة وتوأمة معرفية'}</span>
                  </button>
                </div>
              ) : (
                // Saudi Project Card
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 block">{isEn ? 'National Priority Scope:' : 'نطاق الأولوية الوطنية:'}</span>
                    <p className="font-bold text-saudi-dark text-[11px] leading-relaxed">
                      {isEn ? selectedHub.focusAreaEn : selectedHub.focusArea}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg font-bold border border-emerald-200/60">
                      <span className="block text-gray-400 text-[9px] font-medium">{isEn ? 'Active Global Experts:' : 'الخبراء الدوليون:'}</span>
                      <span className="font-extrabold text-xs">{selectedHub.activeExpertsCount} {isEn ? 'Consultants' : 'مستشارين'}</span>
                    </div>

                    <div className="p-2 bg-purple-50 text-purple-900 rounded-lg font-bold border border-purple-200/60">
                      <span className="block text-gray-400 text-[9px] font-medium">{isEn ? 'Twinning Volume:' : 'ساعات التوأمة:'}</span>
                      <span className="font-extrabold text-xs">{selectedHub.ongoingTwinningHours} {isEn ? 'hrs logged' : 'ساعة معتمدة'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveFilter(selectedHub.id)}
                    className="w-full py-2 bg-saudi-dark hover:bg-black text-saudi-gold rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isEn ? `Filter Only ${selectedHub.nameEn}` : `تصفية مسارات ${selectedHub.name}`}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Corridor Summary List */}
      <div className="p-4 bg-white border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-saudi-dark flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-saudi-green" />
            {isEn ? 'Top Active Knowledge Pipelines:' : 'أبرز خطوط نقل وتوطين المعرفة الدولية:'}
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
            🇩🇪 {isEn ? 'Munich' : 'ميونخ'} ➔ {isEn ? 'NEOM (Hydrogen)' : 'نيوم (الهيدروجين)'}
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
            🇬🇧 {isEn ? 'London' : 'لندن'} ➔ {isEn ? 'The Line (Tunnels)' : 'ذا لاين (الأنفاق)'}
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
            🇳🇱 {isEn ? 'Rotterdam' : 'روتردام'} ➔ {isEn ? 'Red Sea (Marine)' : 'البحر الأحمر (البحرية)'}
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
            🇯🇵 {isEn ? 'Tokyo' : 'طوكيو'} ➔ {isEn ? 'Aramco (Modular)' : 'أرامكو (النمطية)'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
          <span className="flex items-center gap-1 text-saudi-green font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isEn ? 'Giga-Projects Sovereignty Protocol 2026' : 'بروتوكول سيادة المعرفة للمشاريع ٢٠٢٦'}
          </span>
        </div>
      </div>
    </div>
  );
}
