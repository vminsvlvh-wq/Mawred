import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Camera, 
  Mic, 
  MicOff, 
  Wifi, 
  WifiOff, 
  Check, 
  Trash2, 
  RefreshCw, 
  X, 
  Upload, 
  MapPin, 
  Sparkles, 
  Image, 
  Clock,
  Layers,
  Send,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import VoiceInputButton from './VoiceInputButton';

interface FieldDraft {
  id: string;
  note: string;
  project: string;
  location: string;
  photoUrl?: string;
  photoTitle?: string;
  audioDuration?: string;
  timestamp: string;
  synced: boolean;
}

const FIELD_SAMPLE_PHOTOS = [
  {
    title: 'فحص صمامات التبريد الهيدروجيني',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'قواعد الخرسانة البحرية المقاومة للملوحة',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861563?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'مجسات الضغط الصخري في بطانة النفق',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'مستعمرة مرجانية بمشتل شبيبارة الغاطس',
    url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=400&q=80'
  }
];

interface MobileFieldModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProject?: string;
  onSyncDraftsToAssets?: (drafts: FieldDraft[]) => void;
}

export default function MobileFieldModeModal({
  isOpen,
  onClose,
  defaultProject = 'نيوم',
  onSyncDraftsToAssets
}: MobileFieldModeModalProps) {
  // Offline simulation toggle
  const [isOffline, setIsOffline] = useState(false);
  const [drafts, setDrafts] = useState<FieldDraft[]>([]);
  
  // Field form states
  const [noteText, setNoteText] = useState('');
  const [selectedProject, setSelectedProject] = useState(defaultProject);
  const [siteLocation, setSiteLocation] = useState('القطاع الإنشائي الرابع • المحطة H2-4');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof FIELD_SAMPLE_PHOTOS[0] | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);

  // Syncing status
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Load drafts from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mawred_field_drafts');
      if (saved) {
        setDrafts(JSON.parse(saved));
      } else {
        // Initial sample field draft
        const initialDrafts: FieldDraft[] = [
          {
            id: 'fd-1',
            note: 'ملاحظة ميدانية: تم رصد زيادة طفيفة في حرارة محبس التبريد رقم 3 عند زيادة ضغط المضخة إلى 250 بار. يلزم معايرة الحساس وتوثيق إجراء التبريد الاستباقي.',
            project: 'نيوم',
            location: 'محطة الهيدروجين الأخضر • قطاع أوكساجون',
            photoUrl: FIELD_SAMPLE_PHOTOS[0].url,
            photoTitle: FIELD_SAMPLE_PHOTOS[0].title,
            audioDuration: '00:42',
            timestamp: 'اليوم، 09:40 ص',
            synced: false
          }
        ];
        setDrafts(initialDrafts);
        localStorage.setItem('mawred_field_drafts', JSON.stringify(initialDrafts));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveDraftsToStorage = (updated: FieldDraft[]) => {
    setDrafts(updated);
    try {
      localStorage.setItem('mawred_field_drafts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  // Handle saving new field note
  const handleSaveFieldDraft = () => {
    if (!noteText.trim()) return;

    const newDraft: FieldDraft = {
      id: `fd-${Date.now()}`,
      note: noteText.trim(),
      project: selectedProject,
      location: siteLocation,
      photoUrl: selectedPhoto?.url,
      photoTitle: selectedPhoto?.title,
      audioDuration: audioRecorded ? '00:35' : undefined,
      timestamp: isOffline ? 'حفظ محلي (غير متصل)' : new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      synced: !isOffline // if online, mark as synced immediately
    };

    const updated = [newDraft, ...drafts];
    saveDraftsToStorage(updated);

    // Reset form
    setNoteText('');
    setSelectedPhoto(null);
    setAudioRecorded(false);
    setIsRecordingAudio(false);

    setSyncSuccessMessage(isOffline ? 'تم حفظ المسودة في ذاكرة جهازك المحلية بدون إنترنت بنجاح!' : 'تم حفظ وإرسال الملاحظة الميدانية إلى المنصة بنجاح!');
    setTimeout(() => setSyncSuccessMessage(null), 3000);
  };

  // Sync all unsynced drafts
  const handleSyncAll = () => {
    if (isOffline) {
      alert('الجهاز حالياً في وضع عدم الاتصال، يرجى تفعيل الاتصال بالإنترنت أولاً للمزامنة.');
      return;
    }

    setIsSyncing(true);
    setTimeout(() => {
      const updated = drafts.map(d => ({ ...d, synced: true }));
      saveDraftsToStorage(updated);
      setIsSyncing(false);
      setSyncSuccessMessage('تمت مزامنة جميع المسودات الميدانية مع قاعدة المعرفة الوطنية بنجاح!');
      if (onSyncDraftsToAssets) {
        onSyncDraftsToAssets(drafts);
      }
      setTimeout(() => setSyncSuccessMessage(null), 3500);
    }, 1500);
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter(d => d.id !== id);
    saveDraftsToStorage(updated);
  };

  const unsyncedCount = drafts.filter(d => !d.synced).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6" dir="rtl">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-saudi-dark/80 backdrop-blur-md"
      />

      {/* Smartphone-styled Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[38px] shadow-2xl w-full max-w-lg border-8 border-gray-800 z-50 overflow-hidden flex flex-col relative text-right max-h-[92vh]"
      >
        {/* Phone Notch & Status Bar */}
        <div className="bg-gray-900 px-6 py-2.5 text-white flex items-center justify-between text-[11px] font-mono border-b border-gray-800 select-none">
          <div className="flex items-center gap-1.5 font-bold">
            <span>{new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Notch Pill */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto" />

          {/* Connection status indicator toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer",
                isOffline ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              )}
              title="انقر لتجربة وضع عدم الاتصال الحقلِي"
            >
              {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              <span>{isOffline ? 'بدون إنترنت' : 'متصل 5G'}</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="p-4 bg-gradient-to-r from-saudi-dark to-emerald-950 text-white flex items-center justify-between border-b border-saudi-gold/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-saudi-gold/20 text-saudi-gold flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                الوضع الميداني السريع (Field Mode)
              </h3>
              <p className="text-[10px] text-gray-300">
                تسجيل لحظي: ملاحظة + صورة + صوت + حفظ بدون اتصال
              </p>
            </div>
          </div>

          {unsyncedCount > 0 && (
            <button
              onClick={handleSyncAll}
              disabled={isSyncing || isOffline}
              className={cn(
                "px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md cursor-pointer",
                isOffline ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-saudi-gold text-saudi-dark hover:bg-saudi-gold/90"
              )}
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
              <span>مزامنة ({unsyncedCount})</span>
            </button>
          )}
        </div>

        {/* Sync Success Banner */}
        <AnimatePresence>
          {syncSuccessMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-saudi-green text-white p-2.5 text-center text-xs font-bold"
            >
              {syncSuccessMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Mobile Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Quick Location & Project Selector */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">المشروع الوطني:</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-bold text-saudi-dark outline-none focus:ring-1 focus:ring-saudi-green"
              >
                <option value="نيوم">نيوم</option>
                <option value="البحر الأحمر">البحر الأحمر</option>
                <option value="ذا لاين">ذا لاين</option>
                <option value="أوكساجون">أوكساجون</option>
                <option value="القدية">القدية</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">الموقع الميداني:</label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                placeholder="المحطة أو القطاع"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-saudi-green truncate"
              />
            </div>
          </div>

          {/* Step 1: Note Text Input with Embedded Voice Dictation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-saudi-dark flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-saudi-green text-white text-[10px] font-bold flex items-center justify-center">1</span>
                الملاحظة الميدانية السريعة:
              </label>

              {/* Instant Voice Input Button */}
              <div className="flex items-center gap-1.5">
                <VoiceInputButton 
                  onTranscript={(transcript) => {
                    setNoteText(prev => prev ? `${prev} ${transcript}` : transcript);
                    setAudioRecorded(true);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsRecordingAudio(!isRecordingAudio);
                    if (!isRecordingAudio) {
                      setTimeout(() => {
                        setNoteText(prev => prev ? `${prev} فحص درجات حرارة المحابس بعد تشغيل توربينات الهواء.` : 'فحص درجات حرارة المحابس بعد تشغيل توربينات الهواء.');
                        setAudioRecorded(true);
                        setIsRecordingAudio(false);
                      }, 2500);
                    }
                  }}
                  className={cn(
                    "p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer",
                    isRecordingAudio 
                      ? "bg-red-500 text-white animate-pulse" 
                      : audioRecorded 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                  title="تسجيل صوتي وتفريغ فوري"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecordingAudio ? 'جاري التسجيل...' : audioRecorded ? 'صوت مسجل ✓' : 'تسجيل صوتي'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="اكتب أو أملِ صوتياً ما شاهدته في الموقع الميداني: عطل، ملاحظة سلامة، مقترح تعديل..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-saudi-green/20 leading-relaxed"
            />
          </div>

          {/* Step 2: Photo Attachment (Camera Simulator / Real Field Photos) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-saudi-dark flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-saudi-green text-white text-[10px] font-bold flex items-center justify-center">2</span>
              إرفاق صورة ميدانية من الكاميرا:
            </label>

            {selectedPhoto ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-between p-3 text-white">
                  <span className="text-xs font-bold">{selectedPhoto.title}</span>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1.5 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {FIELD_SAMPLE_PHOTOS.slice(0, 2).map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhoto(photo)}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-right flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-10 h-10 rounded-lg object-cover shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-gray-800 truncate">{photo.title}</p>
                      <p className="text-[9px] text-gray-400">التقاط كاميرا الموقع</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save / Log Button */}
          <button
            onClick={handleSaveFieldDraft}
            disabled={!noteText.trim()}
            className={cn(
              "w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer",
              !noteText.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isOffline
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-saudi-green hover:bg-saudi-green/90 text-white"
            )}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            <span>{isOffline ? 'حفظ محلي كمسودة بدون إنترنت' : 'إرسال الملاحظة الميدانية للمنصة'}</span>
          </button>

          {/* Pending / Saved Offline Drafts List */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-saudi-dark flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-saudi-gold" />
                المسودات الميدانية المحفوظة ({drafts.length})
              </h4>
              <span className="text-[10px] text-gray-400">
                {unsyncedCount} غير متزامنة
              </span>
            </div>

            <div className="space-y-2">
              {drafts.map(d => (
                <div
                  key={d.id}
                  className={cn(
                    "p-3 rounded-2xl border text-right space-y-1.5 transition-all",
                    d.synced 
                      ? "bg-gray-50 border-gray-200" 
                      : "bg-amber-50/70 border-amber-200"
                  )}
                >
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-saudi-dark">{d.project}</span>
                      <span className="text-gray-400">• {d.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "font-bold px-2 py-0.5 rounded-full text-[9px]",
                        d.synced ? "bg-emerald-100 text-emerald-800" : "bg-amber-200 text-amber-900"
                      )}>
                        {d.synced ? 'متزامن ✓' : 'مسودة محلية'}
                      </span>
                      <button
                        onClick={() => handleDeleteDraft(d.id)}
                        className="text-gray-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-800 font-medium leading-relaxed">
                    {d.note}
                  </p>

                  {d.photoUrl && (
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-gray-500">
                      <Image className="w-3 h-3 text-saudi-green" />
                      <span>صورة مرفقة: {d.photoTitle}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phone Bottom Home Bar */}
        <div className="bg-gray-100 p-2 flex justify-center border-t border-gray-200">
          <div className="w-32 h-1 bg-gray-400 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
