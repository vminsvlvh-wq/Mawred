import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Building2, 
  Award, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
  Target,
  Sparkles
} from 'lucide-react';
import { ExpertProfile, LinkedProject, getExpertTwinningReadiness } from '../data/expertsData';
import TwinningReadinessBadge from './TwinningReadinessBadge';

interface ExpertProjectsModalProps {
  expert: ExpertProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForTwinning: (expert: ExpertProfile, project?: LinkedProject) => void;
}

export default function ExpertProjectsModal({
  expert,
  isOpen,
  onClose,
  onSelectForTwinning
}: ExpertProjectsModalProps) {
  if (!isOpen || !expert) return null;

  const readiness = getExpertTwinningReadiness(expert);

  const averageLocalization = Math.round(
    expert.currentProjects.reduce((acc, curr) => acc + curr.localizationRate, 0) /
    (expert.currentProjects.length || 1)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-8"
          dir="rtl"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-l from-saudi-dark via-emerald-950 to-saudi-green p-6 sm:p-8 text-white overflow-hidden">
            {/* National Pattern Accents */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-saudi-gold/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute left-6 top-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-10"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${expert.avatarColor} text-white flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/20 shrink-0`}>
                  {expert.image}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-saudi-gold/20 text-saudi-gold border border-saudi-gold/30">
                      ملف المشاريع الوطنية الحالية
                    </span>
                    <span className="text-[10px] font-medium text-gray-300">
                      خبرة {expert.experienceYears} عاماً
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {expert.availability}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-black text-white">{expert.name}</h2>
                    <TwinningReadinessBadge 
                      readiness={readiness} 
                      expertName={expert.name} 
                    />
                  </div>
                  <p className="text-xs text-gray-200 font-medium">{expert.title}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-saudi-gold" />
                    <span>{expert.organization}</span>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onSelectForTwinning(expert);
                  onClose();
                }}
                className="px-5 py-3 bg-saudi-gold hover:bg-saudi-gold/90 text-saudi-dark font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Users className="w-4 h-4" />
                <span>بدء توأمة معرفية مع الخبير</span>
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-gray-300 block mb-0.5">جاهزية التوأمة</span>
                <span className="text-xl font-black text-emerald-400">%{readiness.score}</span>
                <span className="text-[9px] text-gray-300 block mt-0.5">{readiness.statusText}</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-gray-300 block mb-0.5">المشاريع الوطنية النشطة</span>
                <span className="text-xl font-black text-saudi-gold">{expert.currentProjects.length} مشاريع</span>
                <span className="text-[9px] text-gray-300 block mt-0.5">{readiness.availableHoursPerWeek} س/أسبوع تفرغ</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-gray-300 block mb-0.5">متوسط توطين المعرفة</span>
                <span className="text-xl font-black text-emerald-400">%{averageLocalization}</span>
                <span className="text-[9px] text-gray-300 block mt-0.5">في المشاريع المرتبطة</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-gray-300 block mb-0.5">الكوادر السعودية الملازمة</span>
                <span className="text-xl font-black text-white">{expert.activeNationalTrainees} مهندساً</span>
                <span className="text-[9px] text-gray-300 block mt-0.5">مستفيدون ميدانياً</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-gray-300 block mb-0.5">الأصول المعرفية الموطنة</span>
                <span className="text-xl font-black text-saudi-gold">{expert.totalLocalizedAssets} أصلاً</span>
                <span className="text-[9px] text-gray-300 block mt-0.5">وثائق معتمدة</span>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-8 max-h-[65vh] overflow-y-auto">
            {/* Bio & Focus */}
            <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
              <h4 className="text-xs font-bold text-saudi-dark mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-saudi-gold" />
                <span>النبذة المهنية ونطاق التخصص الميداني</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">{expert.bio}</p>
              
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200/50">
                <span className="text-[11px] font-bold text-gray-500 self-center">المهارات المعتمدة:</span>
                {expert.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-bold text-saudi-dark border border-gray-200 shadow-2xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Current National Projects Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-saudi-green/10 flex items-center justify-center text-saudi-green">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-saudi-dark">
                      المشاريع الوطنية الكبرى المرتبطة بالخبير حالياً ({expert.currentProjects.length})
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      قائمة المشاريع الحالية وتفاصيل المهام الميدانية والكوادر السعودية المرافقة في كل مشروع.
                    </p>
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 gap-4">
                {expert.currentProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-saudi-green/40 hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-saudi-green ring-4 ring-saudi-green/10" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-saudi-dark">{project.projectName}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saudi-green/10 text-saudi-green border border-saudi-green/20">
                              {project.status}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-saudi-green mt-0.5 block">
                            {project.role}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            onSelectForTwinning(expert, project);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 bg-emerald-50 hover:bg-saudi-green text-saudi-green hover:text-white rounded-xl text-xs font-bold transition-all border border-saudi-green/20 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Target className="w-3.5 h-3.5" />
                          <span>مطابقة كادر في هذا المشروع</span>
                        </button>
                      </div>
                    </div>

                    {/* Scope */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">نطاق العمل ونقل المعرفة الميداني:</span>
                      <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        {project.scope}
                      </p>
                    </div>

                    {/* Partner and Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/50">
                        <span className="text-[10px] text-gray-500 block mb-1">الجهة الوطنية الشريكة</span>
                        <span className="font-bold text-saudi-dark text-[11px] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-saudi-green shrink-0" />
                          {project.partnerEntity}
                        </span>
                      </div>

                      <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100/50">
                        <span className="text-[10px] text-gray-500 block mb-1">الكوادر السعودية الملازمة</span>
                        <span className="font-bold text-saudi-dark text-[11px] flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-600 shrink-0" />
                          {project.allocatedCadresCount} كفاءات وطنية حالياً
                        </span>
                      </div>

                      <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-100/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-gray-500">نسبة التوطين بالمشروع</span>
                          <span className="text-[11px] font-black text-amber-700">%{project.localizationRate}</span>
                        </div>
                        <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-saudi-gold to-emerald-600 rounded-full"
                            style={{ width: `${project.localizationRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-gray-400 font-bold">محاور المعرفة:</span>
                      {project.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-saudi-green" />
              <span>نظام التوأمة المعرفية المعتمد • مواءمة معايير المحتوى المحلي ورؤية المملكة 2030</span>
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-gray-100 text-saudi-dark rounded-xl text-xs font-bold transition-all border border-gray-200 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
