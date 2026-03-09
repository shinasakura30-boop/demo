import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send, ShieldAlert, CheckCircle2, AlertTriangle, BarChart3, Radio, Activity } from 'lucide-react';
import { moduleAService } from '../services/api';
import { AssessmentResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export default function ModuleA() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const transcriptTimerRef = useRef<number | null>(null);

  const FAKE_TRANSCRIPT = "EMERGENCY NOTIFICATION... SECTOR B OPERATIONS... WE HAVE A MAJOR CHEMICAL SPILL ON THE MAIN FLOOR... A WORKER HAS SUSTAINED A SEVERE LEG INJURY... DEPLOY FIRST AID KIT AND DISPATCH EMERGENCY SERVICES IMMEDIATELY.";

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => setTime((t) => t + 1), 1000);
      setLiveTranscript('');
      let index = 0;
      transcriptTimerRef.current = window.setInterval(() => {
        if (index < FAKE_TRANSCRIPT.length) {
          setLiveTranscript(prev => prev + FAKE_TRANSCRIPT.charAt(index));
          index++;
        }
      }, 120);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setTime(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Microphone recording is only supported on HTTPS or localhost (127.0.0.1). Please check your browser URL.');
      } else {
        alert('Microphone access denied or not available. Please allow microphone permissions in your browser settings.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = async (type: 'audio' | 'text') => {
    setLoading(true);
    try {
      let res;
      if (type === 'audio' && audioBlob) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');
        res = await moduleAService.submitAudio(formData);
      } else {
        res = await moduleAService.submitText(textInput);
      }
      setResult(res);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="glass-panel p-6 rounded-3xl flex items-center justify-between border-l-4 border-l-red-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] relative">
            <ShieldAlert className="text-red-500 w-7 h-7 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border border-red-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              Emergency Response <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">PRIORITY ALPHA</span>
            </h1>
            <p className="text-gray-400 font-medium tracking-wide text-sm mt-1">Spoken English Assessment • Critical Logistics Scenarios</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
           <Radio className="w-5 h-5 text-red-400 animate-pulse" />
           <span className="text-xs font-mono text-red-400 tracking-widest">AWAITING COMM TRANCEIVER</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scenario Card */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-[32px] space-y-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Current Incident</h3>
            </div>
            
            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]">
              <p className="text-lg font-semibold leading-relaxed text-gray-200">
                <span className="text-red-400 font-bold">WARNING:</span> Warehouse Accident detected. Large chemical spill in Sector B. Worker sustained severe leg injury.
              </p>
              <p className="mt-4 text-tech-cyan text-sm font-bold tracking-wide">
                DIRECTIVE: Call emergency services and describe the situation clearly. Time is critical.
              </p>
            </div>
          </div>

          <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-3 relative z-10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-tech-cyan flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-tech-cyan shadow-[0_0_8px_#00E5FF]" /> Performance Metrics Criteria
            </h4>
            <ul className="text-sm font-medium space-y-2 text-gray-400">
              <li className="flex items-start gap-2"><span className="text-tech-cyan mt-1 shrink-0">▹</span> <span>State location clearly (Sector B)</span></li>
              <li className="flex items-start gap-2"><span className="text-tech-cyan mt-1 shrink-0">▹</span> <span className="leading-relaxed">Target vocabulary: <span className="font-mono text-gray-300 bg-white/5 px-1.5 py-0.5 rounded inline-block">first aid</span>, <span className="font-mono text-gray-300 bg-white/5 px-1.5 py-0.5 rounded inline-block">spill</span>, <span className="font-mono text-gray-300 bg-white/5 px-1.5 py-0.5 rounded inline-block">emergency</span>, <span className="font-mono text-gray-300 bg-white/5 px-1.5 py-0.5 rounded inline-block">injury</span></span></li>
              <li className="flex items-start gap-2"><span className="text-tech-cyan mt-1 shrink-0">▹</span> <span>Time-to-response measurement</span></li>
              <li className="flex items-start gap-2"><span className="text-tech-cyan mt-1 shrink-0">▹</span> <span>Maintain professional urgency</span></li>
            </ul>
          </div>
        </div>

        {/* Interaction Card */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-[32px] flex flex-col justify-between items-center text-center space-y-8 relative">
          
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
             <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Communications Terminal</h3>
             <div className="text-xl font-mono text-tech-cyan tracking-wider">{formatTime(time)}</div>
          </div>
          
          <div className="flex flex-col items-center gap-8 w-full max-w-sm relative z-10 flex-1 justify-center">
            
            {/* Visualizer effect when recording */}
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                 <div className="w-48 h-48 rounded-full border-2 border-red-500/30 animate-[ping_1.5s_linear_infinite]" />
                 <div className="absolute w-64 h-64 rounded-full border border-red-500/20 animate-[ping_2s_linear_infinite]" />
              </div>
            )}

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative z-10",
                isRecording 
                  ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse scale-105" 
                  : "bg-gradient-to-br from-gray-800 to-black border border-white/20 hover:border-tech-cyan/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]"
              )}
            >
              {isRecording ? (
                <Square className="text-white w-10 h-10 fill-white" />
              ) : (
                <Mic className={cn("w-12 h-12", audioBlob ? "text-tech-cyan" : "text-gray-400")} />
              )}
            </button>
            
            <div className="text-center h-12">
              <p className={cn("text-sm font-bold tracking-wide uppercase", isRecording ? "text-red-400" : audioBlob ? "text-tech-cyan" : "text-gray-400")}>
                {isRecording ? "Transmitting Audio..." : audioBlob ? "Audio Data Captured" : "Initialize Transmission"}
              </p>
              <p className="text-xs text-gray-500 mt-2 font-mono">
                {isRecording ? "[REC: ACTIVE]" : audioBlob ? `DURATION: ${formatTime(time)}` : "STANDBY"}
              </p>
            </div>

            {isRecording && (
              <div className="w-full p-4 bg-black/60 border border-tech-cyan/30 rounded-xl relative overflow-hidden text-left h-24 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-tech-cyan to-transparent opacity-50 animate-pulse" />
                <p className="text-[10px] uppercase font-mono text-tech-cyan mb-2 flex items-center gap-2">
                  <Activity className="w-3 h-3 animate-pulse" /> Real-time ASR Decoder
                </p>
                <p className="text-xs font-mono text-gray-300 leading-relaxed">
                  {liveTranscript}<span className="inline-block w-1.5 h-3 bg-tech-cyan ml-1 animate-pulse" />
                </p>
              </div>
            )}

            {audioBlob && !isRecording && (
              <button
                onClick={() => handleSubmit('audio')}
                disabled={loading}
                className="w-full py-4 bg-tech-cyan/20 border border-tech-cyan/50 text-tech-cyan rounded-2xl font-bold tracking-widest uppercase hover:bg-tech-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5 animate-spin" /> Analyzing NLP...
                  </span>
                ) : (
                  "Upload Transmission"
                )}
                {loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />}
              </button>
            )}
          </div>

          <div className="w-full pt-6 border-t border-white/10 relative z-10">
            <div className="relative">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or input text transmission..."
                className="w-full h-24 p-5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-gray-600 focus:border-tech-cyan/50 focus:ring-1 focus:ring-tech-cyan/50 resize-none font-mono text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all"
              />
              <div className="absolute right-3 bottom-3 flex gap-2">
                <button
                  onClick={() => handleSubmit('text')}
                  disabled={loading || !textInput}
                  className="p-3 bg-white/10 hover:bg-tech-cyan/20 text-gray-400 hover:text-tech-cyan rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-tech-cyan/30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel rounded-[32px] overflow-hidden border-t-2 border-t-tech-cyan relative"
          >
            {/* Background glow for result */}
            <div className="absolute inset-0 bg-gradient-to-b from-tech-cyan/5 to-transparent pointer-events-none" />

            <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-tech-cyan/20 border border-tech-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  <CheckCircle2 className="text-tech-cyan w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-1">Analysis Complete</h3>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Proficiency Band:</p>
                    <span className="text-xs font-mono font-bold bg-vaa-blue px-2 py-0.5 rounded border border-tech-cyan/50 text-tech-cyan">{result.proficiency_level}</span>
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right bg-black/40 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-[0.2em] mb-1">AI SYS_SCORE</p>
                <div className="flex items-baseline md:justify-end gap-1">
                  <span className="text-5xl font-bold tracking-tighter text-glow" style={{ color: result.ai_score >= 80 ? '#00E5FF' : result.ai_score >= 60 ? '#FFC000' : '#FF3B30' }}>
                    {result.ai_score}
                  </span>
                  <span className="text-xl text-gray-500 font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-tech-cyan" /> Linguistic Feedback
                  </h4>
                  <div className="prose prose-sm prose-invert max-w-none text-gray-300 p-6 rounded-2xl bg-black/30 border border-white/5 font-mono text-sm leading-relaxed">
                    <ReactMarkdown>{result.feedback}</ReactMarkdown>
                  </div>
                </div>

                <div>
                   <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Feature Extraction Analysis</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {Object.entries(result.features).map(([key, value]) => (
                       <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/5">
                         <div className="flex justify-between items-center mb-2">
                           <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                             {key.replace(/_/g, ' ')}
                           </p>
                           <span className="text-xs font-mono font-bold text-tech-cyan">{(value as number * 100).toFixed(0)}%</span>
                         </div>
                         <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                           <div 
                             className="h-full bg-gradient-to-r from-vaa-blue to-tech-cyan transition-all duration-1000 relative" 
                             style={{ width: `${(value as number) * 100}%` }} 
                           >
                             <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-vaa-gold/5 border border-vaa-gold/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center gap-3 mb-5 border-b border-vaa-gold/10 pb-3">
                    <AlertTriangle className="text-vaa-gold w-5 h-5" />
                    <h4 className="text-[10px] font-bold uppercase text-vaa-gold-light tracking-[0.2em]">Guided Remediation</h4>
                  </div>
                  <ul className="space-y-4">
                    {result.interventions.map((item, i) => (
                      <li key={i} className="text-xs font-medium text-gray-300 flex items-start gap-3 leading-relaxed">
                        <span className="shrink-0 text-vaa-gold bg-vaa-gold/10 p-1 rounded font-mono text-[10px]">{(i+1).toString().padStart(2, '0')}</span>
                        <span className="mt-0.5">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-3xl bg-black border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-tech-cyan/10 rounded-full blur-[40px] -mr-10 -mt-10" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <BarChart3 className="text-gray-500 w-5 h-5" />
                    <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-[0.2em]">Evaluation State</h4>
                  </div>
                  <p className="text-sm font-medium text-white relative z-10">
                    {result.requires_human_review 
                      ? <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-vaa-gold animate-pulse"/>Flagged for Human Mod (30% Component)</span>
                      : <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-tech-cyan animate-pulse shadow-[0_0_8px_#00E5FF]"/>Authorized & Finalized by Core Engine</span>}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
