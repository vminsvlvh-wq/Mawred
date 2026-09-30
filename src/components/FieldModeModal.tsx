import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Mic, 
  MicOff, 
  Camera, 
  Image as ImageIcon, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Wifi, 
  WifiOff, 
  X,
  FileText,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import VoiceInputButton from './VoiceInputButton';

export interface FieldDraft {
  id: string;
  note: string;
  voiceTranscript?: string;
  hasAudio?: boolean;
  photoUrl?: string;
  project: string;
  timestamp: string;
  synced: boolean;
}

export default function FieldModeModal({
  isOpen,
  onClose,
  selectedProject = 'نيوم'
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedProject?: string;
}) {
  const { t } = useLanguage();
  const [note, setNote] = useState('');
  const [project, setProject] = useState(selectedProject);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [drafts, setDrafts] = useState<FieldDraft[]>(() => {
    try {
      const saved = localStorage.getItem('mawred_field_drafts');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'draft-1',
        note: 'ملاحظة سرعة تدفق السائل المبرد في مجمع الهيدروجين عند ضغط ٢٨ بار',
        project: 'نيوم',
        timestamp: 'اليوم، ١٠:١٥ ص',
        synced: false
      }
    ];
  });

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mawred_field_drafts', JSON.stringify(drafts));
    } catch {
      // ignore
    }
  }, [drafts]);

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() && !selectedPhoto) return;

    const newDraft: FieldDraft = {
      id: 'draft-' + Date.now(),
      note: note.trim(),
      project: project,
      photoUrl: selectedPhoto || undefined,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      synced: false
    };

    setDrafts([newDraft, ...drafts]);
    setNote('');
    setSelectedPhoto(null);
    setSyncNotice('تم حفظ المسودة في الذاكرة المحلية للجهاز بنجاح (جاهزة للعمل بدون إنترنت).');
    setTimeout(() => setSyncNotice(null), 3500);
  };

  const handleSyncAll = () => {
    if (drafts.length === 0) return;
    setIsSyncing(true);

    setTimeout(() => {
      // Mark all as synced and push to mawred_extra_assets
      try {
        const extraSaved = localStorage.getItem('mawred_extra_assets');
        const existingList = extraSaved ? JSON.parse(extraSaved) : [];
        const newAssets = drafts.filter(d => !d.synced).map(d => ({
          id: 'asset-field-' + d.id,
          title: d.note.slice(0, 50) || 'ملاحظة ميدانية موثقة',
          content: d.note,
          category: 'ملاحظات حقلية',
          classification: 'فنية',
          subCategory: 'معدات',
          lifecycleStatus: 'مسودة',
          project: d.project,
          author: 'كادر ميداني',
          date: new Date().toLocaleDateString('ar-SA'),
          tags: ['ميداني', 'ملاحظة_حقلية', d.project],
          isDemoData: false
        }));

        localStorage.setItem('mawred_extra_assets', JSON.stringify([...newAssets, ...existingList]));
      } catch {
        // ignore
      }

      setDrafts(prev => prev.map(d => ({ ...d, synced: true })));
      setIsSyncing(false);
      setSyncNotice('تمت مزامنة جميع المسودات بنجاح وإدراجها كمسودات معرفية في المنصة!');
      setTimeout(() => setSyncNotice(null), 4000);
    }, 1200);
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const unsyncedCount = drafts.filter(d => !d.synced).length;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {t('field.title', 'الوضع الميداني للموبايل')}
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                  isOnline 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                )}>
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {isOnline ? 'متصل بالإنترنت' : 'وضع بدون إنترنت (محلي)'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                تسجيل سريع للملاحظات الميدانية والصور وحفظها محلياً
              </p>
            </div>
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

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {syncNotice && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{syncNotice}</span>
            </div>
          )}

          {/* Quick Capture Form */}
          <form onSubmit={handleSaveDraft} className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                تسجيل ملاحظة حقلية سريعة:
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px]"
              >
                <option value="نيوم">نيوم</option>
                <option value="البحر الأحمر">البحر الأحمر</option>
                <option value="أرامكو">أرامكو</option>
                <option value="ذا لاين">ذا لاين</option>
                <option value="أوكساجون">أوكساجون</option>
              </select>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="اكتب الملاحظة الفنية الميدانية أو استخدم الإدخال الصوتي..."
                className="w-full p-2.5 pe-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <div className="absolute end-2 bottom-2">
                <VoiceInputButton onTranscript={(txt) => setNote(prev => (prev ? prev + ' ' + txt : txt))} />
              </div>
            </div>

            {/* Photo attachment preview */}
            {selectedPhoto && (
              <div className="relative inline-block mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={selectedPhoto} alt="Field preview" className="w-24 h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-1 end-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer font-medium">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>إرفاق صورة / مخطط</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={!note.trim() && !selectedPhoto}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t('field.saveOfflineBtn', 'حفظ مسودة في الجهاز')}</span>
              </button>
            </div>
          </form>

          {/* Drafts List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {t('field.draftsCount', 'مسودات محفوظة محلياً:')} ({drafts.length})
              </span>

              {unsyncedCount > 0 && (
                <button
                  type="button"
                  onClick={handleSyncAll}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                >
                  <RefreshCw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
                  <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة المسودات مع المنصة'}</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {drafts.length === 0 ? (
                <div className="p-4 text-center text-slate-400">
                  لا توجد مسودات ميدانية محفوظة حالياً
                </div>
              ) : (
                drafts.map(d => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                          {d.note}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>{d.project}</span>
                          <span>·</span>
                          <span>{d.timestamp}</span>
                          <span>·</span>
                          <span className={cn(
                            "font-bold",
                            d.synced ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                          )}>
                            {d.synced ? 'تمت المزامنة' : 'مسودة محلية'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteDraft(d.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="حذف المسودة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
