import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Building, 
  Layers, 
  Globe, 
  Award, 
  Sparkles, 
  BookOpen, 
  Tag, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Bookmark,
  ShieldCheck,
  ChevronLeft,
  Filter,
  MapPin,
  Users,
  Copy,
  Check,
  Download,
  FileCode,
  Briefcase,
  HelpCircle,
  LayoutGrid,
  ListFilter
} from 'lucide-react';
import { saudiCompanies } from '../data/saudiCompanies';
import { saudiFilteredCompanies } from '../data/saudiFilteredCompanies';
import { SaudiCompany, SaudiFilteredCompany } from '../types';
import { cn } from '../lib/utils';

export default function SaudiPartners() {
  const [activeSubTab, setActiveSubTab] = useState<'interactive-filters' | 'knowledge-twinning'>('interactive-filters');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tab 1: Filters State
  const [selectedSector, setSelectedSector] = useState<string>('الكل');
  const [selectedRegion, setSelectedRegion] = useState<string>('الكل');
  const [selectedSize, setSelectedSize] = useState<string>('الكل');
  const [selectedTech, setSelectedTech] = useState<string>('الكل');
  
  // Active company state for Tab 1
  const [activeFilteredCompany, setActiveFilteredCompany] = useState<SaudiFilteredCompany | null>(saudiFilteredCompanies[0] || null);

  // Tab 2: AI Simulation States for Gap Matching
  const [matchInput, setMatchInput] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchedResults, setMatchedResults] = useState<any[] | null>(null);
  const [activeCompany, setActiveCompany] = useState<SaudiCompany | null>(saudiCompanies[0] || null);

  // Copy Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedCSV, setCopiedCSV] = useState<boolean>(false);

  // Filter Unique Options for Filterable Companies
  const filterOptions = useMemo(() => {
    const sectors = ['الكل', ...Array.from(new Set(saudiFilteredCompanies.map(c => c.sector)))];
    const regions = ['الكل', ...Array.from(new Set(saudiFilteredCompanies.map(c => c.region)))];
    const sizes = ['الكل', ...Array.from(new Set(saudiFilteredCompanies.map(c => c.companySize)))];
    
    // Abstracted simplified Tech Levels for easier filtering
    const techLevels = [
      'الكل',
      'متقدم جداً (تقنيات الثورة الصناعية الرابعة)',
      'متقدم (منصات سحابية وحلول برمجية SaaS)',
      'متقدم (أنظمة سحابية وإنترنت الأشياء)',
      'مستقبلي خارق (الذكاء الاصطناعي الكامل والتشغيل المستدام)',
      'متقدم (خوارزميات التقييم الائتماني والذكاء الاصطناعي المالي)'
    ];

    return { sectors, regions, sizes, techLevels };
  }, []);

  // Filtered companies based on search & all 4 filter axes
  const processedFilteredCompanies = useMemo(() => {
    return saudiFilteredCompanies.filter(company => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSector = selectedSector === 'الكل' || company.sector === selectedSector;
      const matchesRegion = selectedRegion === 'الكل' || company.region === selectedRegion;
      const matchesSize = selectedSize === 'الكل' || company.companySize === selectedSize;
      
      // Flexible match for tech level
      const matchesTech = selectedTech === 'الكل' || company.techLevel.includes(selectedTech) || selectedTech.includes(company.techLevel);
      
      return matchesSearch && matchesSector && matchesRegion && matchesSize && matchesTech;
    });
  }, [searchTerm, selectedSector, selectedRegion, selectedSize, selectedTech]);

  // Extract unique sectors for Tab 2
  const tab2Sectors = useMemo(() => {
    const allSectors = saudiCompanies.map(c => c.sectorAr);
    return ['الكل', ...Array.from(new Set(allSectors))];
  }, []);

  // Filter companies for Tab 2
  const tab2FilteredCompanies = useMemo(() => {
    return saudiCompanies.filter(company => {
      const matchesSearch = 
        company.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.descriptionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.keyTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSector = selectedSector === 'الكل' || company.sectorAr === selectedSector;
      
      return matchesSearch && matchesSector;
    });
  }, [searchTerm, selectedSector]);

  // Handle Copy Single JSON
  const handleCopySingleJSON = (company: SaudiFilteredCompany) => {
    const jsonStr = JSON.stringify({
      name: company.name,
      sector: company.sector,
      description: company.description,
      logo: company.logo,
      location: company.region,
      tags: company.tags,
      companySize: company.companySize,
      serviceType: company.serviceType,
      techLevel: company.techLevel
    }, null, 2);

    navigator.clipboard.writeText(jsonStr);
    setCopiedId(company.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Copy Entire Database as JSON
  const handleCopyEntireJSON = () => {
    const exportable = processedFilteredCompanies.map(company => ({
      name: company.name,
      sector: company.sector,
      description: company.description,
      logo: company.logo,
      location: company.region,
      tags: company.tags,
      companySize: company.companySize,
      serviceType: company.serviceType,
      techLevel: company.techLevel
    }));

    navigator.clipboard.writeText(JSON.stringify(exportable, null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Handle Export to CSV
  const handleExportCSV = () => {
    const headers = ['الاسم', 'القطاع', 'المنطقة', 'حجم الشركة', 'نوع الخدمات', 'مستوى التقنية', 'الوصف', 'الوسوم'];
    const rows = processedFilteredCompanies.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.sector.replace(/"/g, '""')}"`,
      `"${c.region.replace(/"/g, '""')}"`,
      `"${c.companySize.replace(/"/g, '""')}"`,
      `"${c.serviceType.replace(/"/g, '""')}"`,
      `"${c.techLevel.replace(/"/g, '""')}"`,
      `"${c.description.replace(/"/g, '""')}"`,
      `"${c.tags.join(', ')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `saudi_companies_database_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedCSV(true);
    setTimeout(() => setCopiedCSV(false), 2000);
  };

  // AI-powered Gap Matching & Classification engine (Local Simulation with AI Logic styling)
  const handleAIMatch = () => {
    if (!matchInput.trim()) return;
    setIsMatching(true);
    
    setTimeout(() => {
      const input = matchInput.toLowerCase();
      
      const scored = saudiCompanies.map(company => {
        let score = 0;
        
        company.keyTags.forEach(tag => {
          if (input.includes(tag.toLowerCase()) || tag.toLowerCase().includes(input)) {
            score += 30;
          }
        });

        company.focusAreas.forEach(area => {
          if (input.includes(area.toLowerCase()) || area.toLowerCase().includes(input)) {
            score += 25;
          }
        });

        company.knowledgeGapsAddressed.forEach(gap => {
          if (input.includes(gap.toLowerCase()) || gap.toLowerCase().includes(input)) {
            score += 35;
          }
        });

        if (input.includes(company.sectorAr.toLowerCase()) || input.includes(company.sectorEn.toLowerCase())) {
          score += 20;
        }

        score = Math.min(98, score > 0 ? score + Math.floor(Math.random() * 8) : Math.floor(Math.random() * 12));

        return {
          company,
          score,
          relevanceLevel: score > 75 ? 'عالية جداً' : score > 45 ? 'متوسطة' : 'عامة'
        };
      });

      const results = scored.sort((a, b) => b.score - a.score).slice(0, 3);
      setMatchedResults(results);
      setIsMatching(false);
    }, 1200);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedSector('الكل');
    setSelectedRegion('الكل');
    setSelectedSize('الكل');
    setSelectedTech('الكل');
    setSearchTerm('');
  };

  return (
    <div className="space-y-8 font-sans pb-12" dir="rtl">
      
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-[#004D26]/12 via-transparent to-transparent p-8 rounded-3xl border border-saudi-green/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-saudi-gold/15 text-saudi-gold text-xs font-bold rounded-full border border-saudi-gold/20">
            <Sparkles className="w-3.5 h-3.5 text-saudi-gold animate-pulse" />
            <span>قواعد البيانات الوطنية التفاعلية</span>
          </div>
          <h1 className="text-3xl font-black text-saudi-dark tracking-tight">منصة المنشآت والشركاء الوطنيين</h1>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            مستودع معرفي رقمي متطور للجهات السيادية، الشركات الكبرى، والمنشآت الناشئة الواعدة بالمملكة. مصممة بترميز JSON/CSV متكامل لتسهيل الفلترة الرقمية والاستخلاص الذكي لمتخذي القرار.
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-xs shrink-0 self-start md:self-auto">
          <div className="w-12 h-12 rounded-xl bg-saudi-green/10 flex items-center justify-center text-saudi-green">
            <Building className="w-6 h-6 text-saudi-green" />
          </div>
          <div>
            <div className="text-2xl font-black text-saudi-green">{saudiFilteredCompanies.length} جهة</div>
            <div className="text-[10px] text-gray-400 font-bold">مصنفة بالكامل ومتنوعة النطاق</div>
          </div>
        </div>
      </div>

      {/* Sub-navigation Controls for Saudi Partners Tab */}
      <div className="flex border-b border-gray-100 pb-px">
        <button
          onClick={() => {
            setActiveSubTab('interactive-filters');
            handleResetFilters();
          }}
          className={cn(
            "pb-3 px-6 font-bold text-sm transition-all relative cursor-pointer",
            activeSubTab === 'interactive-filters' 
              ? "text-saudi-green font-extrabold border-b-2 border-saudi-green" 
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span className="flex items-center gap-2">
            <ListFilter className="w-4 h-4" />
            دليل الفلترة الرقمي (تنوع وطني كبرى وناشئة)
          </span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab('knowledge-twinning');
            handleResetFilters();
          }}
          className={cn(
            "pb-3 px-6 font-bold text-sm transition-all relative cursor-pointer",
            activeSubTab === 'knowledge-twinning' 
              ? "text-saudi-green font-extrabold border-b-2 border-saudi-green" 
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            التوطين المعرفي ومطابقة الفجوات
          </span>
        </button>
      </div>

      {activeSubTab === 'interactive-filters' ? (
        /* INTERACTIVE FILTERS SUBTAB (THE MAIN REQUIREMENT) */
        <div className="space-y-6">
          
          {/* Controls & Export Block */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
            
            {/* Header with quick Export Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4">
              <div>
                <h3 className="font-extrabold text-saudi-dark text-base flex items-center gap-2">
                  <Filter className="w-4 h-4 text-saudi-green" />
                  أدوات الفلترة وتصدير الهيكل البرمجي
                </h3>
                <p className="text-xs text-gray-400">حدد الفلاتر أدناه لتصفية القائمة واستخراج البيانات فوراً بصيغ برمجية جاهزة للوحتك الرقمية.</p>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyEntireJSON}
                  className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg transition-all border border-gray-200/60 flex items-center gap-1.5 cursor-pointer"
                  title="نسخ قاعدة البيانات المفلترة بالكامل كصيغة JSON"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-saudi-green" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'تم النسخ!' : 'نسخ كـ JSON'}</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-saudi-green/10 hover:bg-saudi-green/15 text-saudi-green font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  title="تحميل قاعدة البيانات بصيغة جدول Excel / CSV"
                >
                  {copiedCSV ? <Check className="w-3.5 h-3.5 text-saudi-green" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{copiedCSV ? 'تم التصدير!' : 'تصدير CSV'}</span>
                </button>
              </div>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث بالنص الحر (اسم الجهة، وسم تصنيفي، الخدمات التقنية، الوصف)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-saudi-green/20 transition-all text-saudi-dark font-medium placeholder:text-gray-400"
              />
            </div>

            {/* 4-Column Grid for Filtering Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              
              {/* Sector Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 block uppercase tracking-wider">تصفية بالقطاع</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-saudi-dark focus:ring-1 focus:ring-saudi-green/20 cursor-pointer"
                >
                  {filterOptions.sectors.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 block uppercase tracking-wider">تصفية بالمنطقة</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-saudi-dark focus:ring-1 focus:ring-saudi-green/20 cursor-pointer"
                >
                  {filterOptions.regions.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              {/* Company Size Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 block uppercase tracking-wider">حجم المنشأة</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-saudi-dark focus:ring-1 focus:ring-saudi-green/20 cursor-pointer"
                >
                  {filterOptions.sizes.map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              {/* Tech Level Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 block uppercase tracking-wider">مستوى التقنية والـ R&D</label>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-saudi-dark focus:ring-1 focus:ring-saudi-green/20 cursor-pointer"
                >
                  {filterOptions.techLevels.map(tl => (
                    <option key={tl} value={tl}>{tl === 'الكل' ? 'الكل' : tl.split(' ')[0] + ' ' + (tl.split(' ')[1] || '')}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Selected Active Filters Summary */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
              <div className="flex flex-wrap items-center gap-2">
                <span>تم العثور على: <strong className="text-saudi-green">{processedFilteredCompanies.length} منشأة</strong></span>
                {(selectedSector !== 'الكل' || selectedRegion !== 'الكل' || selectedSize !== 'الكل' || selectedTech !== 'الكل' || searchTerm) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-saudi-gold hover:underline font-bold text-[11px] cursor-pointer"
                  >
                    تصفير كافة الفلاتر
                  </button>
                )}
              </div>
              <span className="text-[10px] bg-saudi-green/5 text-saudi-green px-2 py-0.5 rounded font-mono font-bold">
                قاعدة البيانات جاهزة للإدراج البرمجي
              </span>
            </div>

          </div>

          {/* Main Content Grid for Filtered View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List of Companies */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {processedFilteredCompanies.map((company) => (
                    <motion.div
                      layout
                      key={company.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setActiveFilteredCompany(company)}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-right relative overflow-hidden group bg-white",
                        activeFilteredCompany?.id === company.id
                          ? "border-saudi-green shadow-md shadow-saudi-green/5 ring-1 ring-saudi-green/10"
                          : "border-gray-100 hover:border-saudi-green/40 shadow-sm"
                      )}
                    >
                      {activeFilteredCompany?.id === company.id && (
                        <div className="absolute top-0 right-0 left-0 h-1 bg-saudi-green" />
                      )}

                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-50 flex items-center justify-center shrink-0">
                              <img 
                                src={company.logo} 
                                alt={company.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-saudi-dark text-sm flex items-center gap-1.5">
                                {company.name}
                              </h4>
                              <p className="text-[11px] text-gray-400 font-bold">{company.sector}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "text-[9px] font-black px-2 py-0.5 rounded-full uppercase",
                            company.companySize.includes('ناشئة') ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-saudi-green/5 text-saudi-green border border-saudi-green/10"
                          )}>
                            {company.companySize.includes('ناشئة') ? 'ناشئة واعدة' : 'جهة كبرى'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {company.description}
                        </p>

                        <div className="text-[11px] text-gray-400 flex items-center gap-1 bg-gray-50/50 p-2 rounded-lg border border-gray-100/40">
                          <MapPin className="w-3 h-3 text-saudi-green shrink-0" />
                          <span className="truncate">{company.region}</span>
                        </div>
                      </div>

                      {/* Footer with copy block */}
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 font-mono text-[9px]">#{company.id}</span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopySingleJSON(company);
                            }}
                            className="p-1 px-2 hover:bg-gray-50 text-gray-400 hover:text-saudi-dark rounded border border-gray-100 transition-all flex items-center gap-1 cursor-pointer"
                            title="نسخ بيانات هذه الشركة كـ JSON"
                          >
                            {copiedId === company.id ? <Check className="w-3 h-3 text-saudi-green" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === company.id ? 'تم!' : 'نسخ JSON'}</span>
                          </button>
                          
                          <span className="text-saudi-gold font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            البيانات
                            <ChevronLeft className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {processedFilteredCompanies.length === 0 && (
                    <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm space-y-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                        <Building className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-saudi-dark">لم يتم العثور على نتائج للفلترة الحالية</h3>
                      <p className="text-xs text-gray-400 max-w-md mx-auto">جرب تخفيف الفلاتر أو إعادة كتابة الكلمات الدليليلة لتطابق المنشآت الوطنية.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-4 py-2 bg-saudi-green text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-saudi-green/90"
                      >
                        إعادة تعيين الكل
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Detailed Metadata view on the right */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {activeFilteredCompany && (
                  <motion.div
                    key={activeFilteredCompany.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Header Details */}
                    <div className="p-6 bg-gradient-to-br from-[#004D26]/15 via-[#004D26]/5 to-transparent border-b border-gray-50 flex flex-col gap-3 relative">
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-bold px-2 py-1 bg-white border border-gray-100 text-gray-400 rounded-lg shadow-xs font-mono">
                          {activeFilteredCompany.id}
                        </span>
                      </div>

                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-xs">
                        <img 
                          src={activeFilteredCompany.logo} 
                          alt={activeFilteredCompany.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="space-y-1 pt-1">
                        <h2 className="text-xl font-black text-saudi-dark">{activeFilteredCompany.name}</h2>
                        <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 bg-saudi-gold/15 text-saudi-gold rounded-full border border-saudi-gold/10">
                          {activeFilteredCompany.companySize}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      
                      {/* Grid Properties */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100/60 text-right">
                          <span className="text-[10px] text-gray-400 font-bold block mb-1">القطاع</span>
                          <span className="text-xs font-bold text-saudi-dark">{activeFilteredCompany.sector}</span>
                        </div>
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100/60 text-right">
                          <span className="text-[10px] text-gray-400 font-bold block mb-1">المنطقة والمقر الرئيسي</span>
                          <span className="text-xs font-bold text-saudi-green">{activeFilteredCompany.region}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">نبذة تفصيلية</h4>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                          {activeFilteredCompany.description}
                        </p>
                      </div>

                      {/* Service Type */}
                      <div className="space-y-2 bg-saudi-green/5 p-4 rounded-xl border border-saudi-green/10">
                        <h4 className="text-xs font-bold text-saudi-green uppercase tracking-wider flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          نوع الخدمات والحلول المقدمة
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                          {activeFilteredCompany.serviceType}
                        </p>
                      </div>

                      {/* Tech Level details */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-saudi-gold" />
                          مستوى التكنولوجيا والابتكار العلمي
                        </h4>
                        <p className="text-xs text-saudi-dark font-medium leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100/40">
                          {activeFilteredCompany.techLevel}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-saudi-green" />
                          الوسوم لغايات البحث الرقمي (Tags)
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {activeFilteredCompany.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-100">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Live JSON preview for copy pasting */}
                      <div className="space-y-2 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <FileCode className="w-3.5 h-3.5" />
                            كود الـ JSON التفاعلي للجهة
                          </h4>
                          <button
                            onClick={() => handleCopySingleJSON(activeFilteredCompany)}
                            className="text-[10px] text-saudi-green hover:underline flex items-center gap-1 cursor-pointer font-bold"
                          >
                            {copiedId === activeFilteredCompany.id ? 'تم النسخ!' : 'نسخ الكود'}
                          </button>
                        </div>
                        <pre className="p-3 bg-gray-900 rounded-lg text-[10px] text-emerald-400 font-mono overflow-x-auto text-left" dir="ltr">
{`{
  "name": "${activeFilteredCompany.name}",
  "sector": "${activeFilteredCompany.sector}",
  "description": "${activeFilteredCompany.description}",
  "logo": "${activeFilteredCompany.logo.substring(0, 45)}...",
  "location": "${activeFilteredCompany.region}",
  "tags": ${JSON.stringify(activeFilteredCompany.tags)}
}`}
                        </pre>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      ) : (
        /* ORIGINAL KNOWLEDGE TWINNING / GAP MATCHING ENGINE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Search, Filter, and Interactive List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search and Sector Filter */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن شركة، مشروع، وسم تصنيفي أو فجوة معرفية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-saudi-green/20 transition-all text-saudi-dark"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 overflow-x-auto pb-1">
                {tab2Sectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                      selectedSector === sector
                        ? "bg-saudi-green text-white shadow-sm"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-saudi-dark"
                    )}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>

            {/* Companies List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {tab2FilteredCompanies.map((company) => (
                  <motion.div
                    layout
                    key={company.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setActiveCompany(company)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-right relative overflow-hidden group bg-white",
                      activeCompany?.id === company.id
                        ? "border-saudi-green shadow-md shadow-saudi-green/5"
                        : "border-gray-100 hover:border-saudi-green/40 shadow-sm"
                    )}
                  >
                    {activeCompany?.id === company.id && (
                      <div className="absolute top-0 right-0 left-0 h-1.5 bg-saudi-green" />
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-saudi-dark text-base flex items-center gap-1.5">
                            {company.nameAr}
                            <span className="text-[10px] text-gray-400 font-mono tracking-wider font-medium">({company.nameEn})</span>
                          </h3>
                          <p className="text-xs text-saudi-green font-bold">{company.subsectorAr}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 whitespace-nowrap">
                          {company.sectorAr.split(' ')[0]}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {company.descriptionAr}
                      </p>
                    </div>

                    {/* Focus Areas Count & tags */}
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                      <div className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-saudi-gold" />
                        <span>{company.focusAreas.length} مجالات تركيز</span>
                      </div>
                      <span className="text-saudi-gold font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        تفاصيل الجهة
                        <ChevronLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                ))}

                {tab2FilteredCompanies.length === 0 && (
                  <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                      <Building className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-saudi-dark">لم يتم العثور على نتائج</h3>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">جرب البحث بكلمة أخرى مثل "نيوم" أو "طاقة" أو "لوجستيات" لرصد الجهات الشريكة.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Playground: dynamic classification simulator */}
            <div className="bg-gradient-to-br from-[#004D26]/90 to-saudi-dark text-white p-6 rounded-3xl border border-white/5 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-saudi-green/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-saudi-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-saudi-gold shrink-0">
                  <Cpu className="w-5 h-5 text-saudi-gold" />
                </div>
                <div>
                  <h2 className="font-black text-base text-saudi-gold flex items-center gap-2">
                    محاكي تصنيف ومطابقة الكفاءات بالذكاء الاصطناعي
                    <span className="text-[9px] bg-saudi-gold/20 text-saudi-gold px-2 py-0.5 rounded-full border border-saudi-gold/30">Google AI Studio</span>
                  </h2>
                  <p className="text-xs text-gray-300">أدخل أي مهارة أو موضوع معرفي ليقوم نموذج الذكاء الاصطناعي بتصنيفه ومطابقته بالمنشأة الوطنية الأنسب لتبنيه.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                <input
                  type="text"
                  placeholder="مثال: هندسة الهيدروجين، الطب الدقيق، تصاميم البحر الأحمر، التشفير وحوكمة البيانات..."
                  value={matchInput}
                  onChange={(e) => setMatchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAIMatch()}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-xs placeholder:text-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-saudi-gold/30 transition-all text-right"
                />
                <button
                  onClick={handleAIMatch}
                  disabled={isMatching || !matchInput.trim()}
                  className="px-6 py-3 bg-saudi-gold text-saudi-dark hover:bg-saudi-gold/90 font-bold text-xs rounded-xl transition-all shadow-md shadow-saudi-gold/10 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isMatching ? 'جاري المطابقة...' : 'مطابقة ذكية'}
                </button>
              </div>

              {/* AI Results */}
              <AnimatePresence>
                {matchedResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3 relative z-10"
                  >
                    <div className="text-[11px] text-saudi-gold font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-saudi-gold" />
                      نتائج التوصية والتصنيف المقترحة من النموذج:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {matchedResults.map((res, i) => (
                        <div key={i} className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-white">{res.company.nameAr}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-saudi-green/30 text-saudi-green rounded font-mono font-bold">{res.score}%</span>
                          </div>
                          <p className="text-[10px] text-gray-300 leading-relaxed line-clamp-2">{res.company.descriptionAr}</p>
                          <div className="text-[9px] text-saudi-gold font-bold border-t border-white/5 pt-1.5 flex items-center justify-between">
                            <span>الملاءمة: {res.relevanceLevel}</span>
                            <span className="text-gray-400 font-mono">#{res.company.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right Column: Detailed View of Active Company */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeCompany && (
                <motion.div
                  key={activeCompany.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Visual Header Banner */}
                  <div className="p-6 bg-gradient-to-br from-[#004D26]/20 via-[#004D26]/5 to-transparent border-b border-gray-50 flex flex-col gap-3 relative">
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold px-2 py-1 bg-white border border-gray-100 text-gray-400 rounded-lg shadow-xs font-mono">
                        {activeCompany.id}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-saudi-green text-white flex items-center justify-center shrink-0 shadow-md shadow-saudi-green/10">
                      <Building className="w-6 h-6 text-saudi-gold" />
                    </div>
                    
                    <div className="space-y-1 pt-2">
                      <h2 className="text-xl font-extrabold text-saudi-dark">{activeCompany.nameAr}</h2>
                      <p className="text-xs text-gray-400 font-bold font-mono uppercase tracking-wider">{activeCompany.nameEn}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Sector info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100/60 text-right">
                        <span className="text-[10px] text-gray-400 font-bold block mb-1">القطاع الرئيسي</span>
                        <span className="text-xs font-bold text-saudi-dark">{activeCompany.sectorAr}</span>
                      </div>
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100/60 text-right">
                        <span className="text-[10px] text-gray-400 font-bold block mb-1">التخصص الدقيق</span>
                        <span className="text-xs font-bold text-saudi-green">{activeCompany.subsectorAr}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">نبذة عن الجهة</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {activeCompany.descriptionAr}
                      </p>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-mono italic">
                        {activeCompany.descriptionEn}
                      </p>
                    </div>

                    {/* Key focus areas */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-saudi-green" />
                        مجالات التركيز والأبحاث
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCompany.focusAreas.map((area, i) => (
                          <span key={i} className="text-[11px] font-bold px-2.5 py-1 bg-saudi-green/5 text-saudi-green rounded-lg border border-saudi-green/10">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Tags */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-saudi-gold" />
                        الوسوم الدلالية للذكاء الاصطناعي
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeCompany.keyTags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-100">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Knowledge Gaps addressed */}
                    <div className="space-y-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/60">
                      <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                        الفجوات المعرفية التي تعالجها وتوطنها الجهة:
                      </h4>
                      <ul className="space-y-2">
                        {activeCompany.knowledgeGapsAddressed.map((gap, i) => (
                          <li key={i} className="text-xs text-amber-900 font-medium flex items-start gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-saudi-green shrink-0 mt-0.5" />
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Strategic Importance */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-saudi-green" />
                        الأثر الاستراتيجي المعرفي
                      </h4>
                      <p className="text-xs text-saudi-dark font-medium leading-relaxed bg-saudi-gold/5 p-3 rounded-xl border border-saudi-gold/10">
                        {activeCompany.strategicImportance}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}
      
    </div>
  );
}
