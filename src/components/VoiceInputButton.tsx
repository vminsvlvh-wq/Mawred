import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Square, 
  Radio, 
  AlertCircle, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface VoiceInputButtonProps {
  onTranscript: (newText: string, isAppend?: boolean) => void;
  isRecording?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function VoiceInputButton({
  onTranscript,
  className,
  disabled = false
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimText, setInterimText] = useState('');
  const [showSimulatedBanner, setShowSimulatedBanner] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const simIntervalRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  // Timer effect for recording duration
  useEffect(() => {
    if (isListening) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  const startListening = () => {
    setErrorMessage(null);
    setInterimText('');

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Browser doesn't support Web Speech API, run simulated voice input
      runSimulatedVoiceInput();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA'; // Arabic Saudi Arabia

      recognition.onstart = () => {
        setIsListening(true);
        setShowSimulatedBanner(false);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTrans += item[0].transcript;
          } else {
            interimTrans += item[0].transcript;
          }
        }

        if (interimTrans) {
          setInterimText(interimTrans);
        }

        if (finalTrans) {
          setInterimText('');
          onTranscript(finalTrans.trim(), true);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('إذن الميكروفون غير متاح في المتصفح. يمكنك استخدام المحاكاة الصوتية للتجربة.');
          setShowSimulatedBanner(true);
        } else if (event.error === 'no-speech') {
          // just no speech detected, keep waiting
          return;
        } else {
          setErrorMessage(`تنبيه الصوت: ${event.error || 'خطأ في التعرف'}`);
        }
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      // Fallback to simulation if microphone fails in iframe
      runSimulatedVoiceInput();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
    }
    setIsListening(false);
  };

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Simulated Voice Input for environments where Web Speech API is blocked or restricted
  const runSimulatedVoiceInput = () => {
    setIsListening(true);
    setShowSimulatedBanner(true);
    setErrorMessage(null);

    const sampleIdeas = [
      "خلال جولة اليوم في محطة تحلية المياه بالطاقة الشمسية في نيوم، رصدنا ضرورة تحسين معدل تنظيف أغشية التناضح العكسي بنظام الموجات فوق الصوتية لتفادي ترسب الأملاح.",
      "اقترحنا اعتماد صمامات التدفق الذاتية ذات التحكم اللاسلكي لمواجهة تقلبات الضغط الهيدروليكي في خطوط تبريد الهيدروجين الأخضر بذا لاين.",
      "لاحظنا في موقع الإنشاءات أن خلطات الخرسانة البحرية في جزر البحر الأحمر تحقق صلابة مضاعفة عند إضافة السيليكا النانوية مع رطوبة معتدلة."
    ];

    const chosenSample = sampleIdeas[Math.floor(Math.random() * sampleIdeas.length)];
    const words = chosenSample.split(' ');
    let currentIdx = 0;
    let accumulated = '';

    simIntervalRef.current = setInterval(() => {
      if (currentIdx < words.length) {
        accumulated += (currentIdx === 0 ? '' : ' ') + words[currentIdx];
        setInterimText(accumulated);
        currentIdx++;
      } else {
        clearInterval(simIntervalRef.current);
        onTranscript(accumulated, true);
        setInterimText('');
        setIsListening(false);
      }
    }, 280);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      {/* Microphone Toggle Button */}
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled}
        className={cn(
          "relative group px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
          isListening 
            ? "bg-red-500 hover:bg-red-600 text-white border-red-400 shadow-md shadow-red-500/25 ring-2 ring-red-400/40 animate-pulse" 
            : "bg-white hover:bg-emerald-50 text-gray-700 hover:text-saudi-green border-gray-200 hover:border-saudi-green/40"
        )}
        title={isListening ? "إيقاف التسجيل الصوتي" : "تسجيل الفكرة صوتياً"}
      >
        {isListening ? (
          <>
            {/* Visual Pulsing Recording Beacon */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <Square className="w-3 h-3 fill-white" />
            <span className="text-[11px] font-black">إيقاف ({formatTime(recordingSeconds)})</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-saudi-green group-hover:scale-110 transition-transform" />
            <span className="text-[11px]">تسجيل صوتي</span>
          </>
        )}
      </button>

      {/* Floating Active Recording Live Indicator Panel */}
      {isListening && (
        <div 
          className="absolute -top-12 left-0 right-auto sm:right-0 sm:left-auto z-30 flex items-center gap-2 bg-saudi-dark/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl border border-red-500/40 text-[10px] font-bold whitespace-nowrap animate-in fade-in slide-in-from-bottom-2"
          dir="rtl"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-red-400 font-black">جاري الاستماع...</span>
          </div>

          {/* Equalizer Waveform Animation */}
          <div className="flex items-end gap-0.5 h-3.5 px-1">
            <span className="w-1 bg-red-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-2"></span>
            <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.1s] h-3.5"></span>
            <span className="w-1 bg-saudi-gold rounded-full animate-[bounce_0.7s_ease-in-out_infinite_0.2s] h-2.5"></span>
            <span className="w-1 bg-red-400 rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.3s] h-3"></span>
          </div>

          <span className="text-gray-300 font-mono text-[9px]">{formatTime(recordingSeconds)}</span>
          <span className="text-gray-400 text-[9px]">تحدث باللغة العربية</span>
        </div>
      )}

      {/* Live Interim Transcript or Simulation Notice */}
      {isListening && interimText && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-saudi-green/40 shadow-2xl z-50 text-right space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-saudi-dark">
            <span className="flex items-center gap-1.5 text-saudi-green font-black">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
              النص الصوتي المباشر:
            </span>
            <span className="text-[10px] text-gray-400 font-mono">{formatTime(recordingSeconds)}</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-150">
            "{interimText}"
          </p>
        </div>
      )}

      {/* Notification if speech simulation mode was triggered */}
      {showSimulatedBanner && !isListening && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl text-[10px] z-20 shadow-md flex items-start gap-1.5 text-right">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">تم تفعيل نمط التحويل الصوتي الذكي</span>
            <span className="text-gray-600 block">يقوم بتحويل الكلمات المنطوقة مباشرة إلى الحقل، ومحاكاة الأفكار في حال حظر الميكروفون في المتصفح.</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && !isListening && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-red-50 border border-red-200 text-red-800 p-2 rounded-xl text-[10px] z-20 shadow-md flex items-start gap-1.5 text-right">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
