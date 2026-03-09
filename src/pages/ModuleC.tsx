import { useState, useEffect } from 'react';
import { Truck, Play, Pause, FileText, CheckCircle2, Headphones, Activity, ActivitySquare, Map, Briefcase, Database } from 'lucide-react';
import { moduleCService } from '../services/api';
import { AssessmentResult, ModuleBriefing } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn, getScoreColor } from '../lib/utils';

export default function ModuleC() {
  const [briefings, setBriefings] = useState<ModuleBriefing[]>([]);
  const [selectedBriefing, setSelectedBriefing] = useState<ModuleBriefing | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    moduleCService.getBriefings()
      .then(setBriefings)
      .catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!selectedBriefing || !notes.trim() || loading) return;
    setLoading(true);
    try {
      const res = await moduleCService.submit(selectedBriefing.briefing_id, notes);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="glass-panel p-6 rounded-3xl flex items-center justify-between border-l-4 border-l-tech-cyan relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-cyan/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-tech-cyan/20 border border-tech-cyan/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <Truck className="text-tech-cyan w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              Supply Chain Flow <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">AUDIT MODE</span>
            </h1>
            <p className="text-gray-400 font-medium tracking-wide text-sm mt-1">Listening Comprehension & Procedural Documentation</p>
          </div>
        </div>
      </header>

      {!result ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Briefings List */}
          <div className="xl:col-span-1 space-y-4">
            <div className="glass-panel p-5 rounded-[32px] border border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                <Database className="w-4 h-4 text-tech-cyan" /> Data Streams
              </h3>
              <div className="space-y-3">
                {briefings.map((b) => (
                  <button
                    key={b.briefing_id}
                    onClick={() => setSelectedBriefing(b)}
                    className={cn(
                      "w-full p-5 rounded-2xl text-left transition-all border relative overflow-hidden group",
                      selectedBriefing?.briefing_id === b.briefing_id 
                        ? "bg-tech-cyan/10 border-tech-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]" 
                        : "bg-white/5 border-white/10 hover:border-tech-cyan/50 hover:bg-white/10"
                    )}
                  >
                    {selectedBriefing?.briefing_id === b.briefing_id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-tech-cyan shadow-[0_0_10px_rgba(0,229,255,1)]" />
                    )}
                    <p className={cn(
                      "text-sm font-bold mb-1 line-clamp-2",
                      selectedBriefing?.briefing_id === b.briefing_id ? "text-tech-cyan" : "text-gray-300 group-hover:text-white"
                    )}>{b.title}</p>
                    <p className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5 mt-2">
                      <Headphones className="w-3 h-3" /> Audio Recon
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-black/40">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 flex items-center gap-2"><ActivitySquare className="w-3 h-3" /> System Status</h4>
               <div className="space-y-2">
                 <div className="flex items-center justify-between text-xs font-mono">
                   <span className="text-gray-400">Audio Decoder</span>
                   <span className="text-emerald-500 font-bold">ONLINE</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-mono">
                   <span className="text-gray-400">NLP Processor</span>
                   <span className="text-emerald-500 font-bold">READY</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-mono">
                   <span className="text-gray-400">Documentation</span>
                   <span className="text-amber-500 font-bold flex items-center gap-1">WAITING <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /></span>
                 </div>
               </div>
            </div>
          </div>

          {/* Player & Editor */}
          <div className="xl:col-span-3">
            {selectedBriefing ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel p-8 rounded-[32px] border border-white/10 space-y-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tech-cyan via-vaa-blue to-transparent opacity-50" />
                
                {/* Audio Player */}
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-black/60 border border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-tech-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 hover:bg-white hover:text-black transition-all relative z-10"
                  >
                    {isPlaying ? <Pause className="text-black w-7 h-7" /> : <Play className="text-black w-7 h-7 ml-1" />}
                  </button>
                  <div className="flex-1 space-y-3 relative z-10">
                    <p className="text-white font-bold tracking-wide">{selectedBriefing.title}</p>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden shrink-0 relative">
                       {/* Simulate waveform with glowing line */}
                      <motion.div 
                        className="h-full bg-tech-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                        initial={{ width: '0%' }}
                        animate={{ width: isPlaying ? '100%' : '0%' }}
                        transition={{ duration: 30, ease: 'linear' }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                      <span>0:00</span>
                      <span className={cn("px-2 rounded", isPlaying ? "bg-tech-cyan/20 text-tech-cyan" : "bg-white/5")}>{isPlaying ? "DECODING..." : "STANDBY"}</span>
                      <span>2:45</span>
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="space-y-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-vaa-blue/20 border border-vaa-blue/50 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-tech-cyan" />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Logistics Audit Log</h4>
                    </div>
                    <div className="text-[10px] font-mono text-gray-500">
                      CHAR COUNT: <span className="text-tech-cyan">{notes.length}</span>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-tech-cyan/30 to-vaa-blue/30 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Input procedural findings here. Detail the supply chain flow, key milestones, and identify potential bottlenecks based on the audio stream..."
                      className="relative w-full h-[350px] p-8 rounded-3xl bg-black/80 border border-white/10 text-white font-mono text-sm leading-relaxed focus:ring-1 focus:ring-tech-cyan focus:border-tech-cyan resize-none shadow-inner placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={!notes.trim() || loading}
                      className="w-full py-5 bg-tech-cyan/10 border border-tech-cyan text-tech-cyan rounded-2xl font-bold tracking-[0.2em] uppercase hover:bg-tech-cyan hover:text-black hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <><Activity className="w-5 h-5 animate-spin" /> Cross-Referencing Terminology...</>
                      ) : (
                        <><Briefcase className="w-5 h-5" /> Submit Audit to AI Assessor</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] glass-panel rounded-[32px] border border-dashed border-tech-cyan/30 flex flex-col items-center justify-center text-center p-12 bg-black/20">
                <div className="w-24 h-24 rounded-full bg-tech-cyan/5 flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 rounded-full border border-tech-cyan/30 animate-ping opacity-50" />
                   <Map className="w-10 h-10 text-tech-cyan/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Awaiting Input Stream</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto font-mono">
                  Select a data stream from the panel to initialize audio decoding and begin documentation.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-[32px] border border-white/10 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-tech-cyan to-transparent shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          
          <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02]">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="text-emerald-400 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-1">Audit Evaluated</h3>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Proficiency Band:</p>
                  <span className="text-xs font-mono font-bold bg-vaa-blue px-2 py-0.5 rounded border border-emerald-500/50 text-emerald-400">{result.proficiency_level}</span>
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

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* Feedback Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-[32px] bg-black/40 border border-white/5 relative overflow-hidden">
                <div className="absolute -left-2 top-8 w-1 h-12 bg-tech-cyan rounded-r-md" />
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <Database className="w-4 h-4 text-tech-cyan" /> NLP Analysis Feedback
                </h4>
                <div className="prose prose-sm prose-invert max-w-none text-gray-300 font-mono text-sm leading-relaxed">
                  <ReactMarkdown>{result.feedback}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Metrics & Interventions */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                  <ActivitySquare className="w-3 h-3 text-tech-cyan" /> Core Analytics
                </h4>
                <div className="space-y-6">
                  {[
                    { label: 'Terminology Match', value: result.features.terminology_accuracy },
                    { label: 'Flow Coherence', value: result.features.response_coherence },
                    { label: 'Concept Coverage', value: result.features.vocabulary_coverage },
                  ].map((m) => (
                    <div key={m.label} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-300 transition-colors">{m.label}</span>
                        <span className="text-sm font-mono font-bold text-white">{(m.value * 100).toFixed(0)}<span className="text-[10px] text-gray-500">%</span></span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 bg-tech-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)]" style={{ width: `${m.value * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.interventions.length > 0 && (
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] -mr-16 -mt-16" />
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 mb-4 flex items-center gap-2 relative z-10">
                    Remedial Directives
                  </h4>
                  <ul className="space-y-3 relative z-10">
                    {result.interventions.map((item, i) => (
                      <li key={i} className="text-xs font-mono font-medium text-amber-200/90 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                        <span className="text-amber-500 mr-2">&gt;</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
