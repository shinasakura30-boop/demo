import { useState, useEffect } from 'react';
import { ClipboardCheck, Search, Filter, ArrowRight, CheckCircle2, AlertCircle, Activity, ShieldCheck } from 'lucide-react';
import { dashboardService } from '../services/api';
import { ReviewQueueItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function AdminReview() {
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReviewQueueItem | null>(null);
  const [score, setScore] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getReviewQueue();
      setQueue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedItem || submitting) return;
    setSubmitting(true);
    try {
      await dashboardService.submitReview(selectedItem.assessment_id, { score, notes });
      setSelectedItem(null);
      setScore(0);
      setNotes('');
      fetchQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="glass-panel p-6 rounded-3xl flex items-center justify-between border-l-4 border-l-vaa-gold relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-vaa-gold/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-vaa-gold/20 border border-vaa-gold/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,192,0,0.3)]">
            <ShieldCheck className="text-vaa-gold w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              Lecturer Verification Portal <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-vaa-gold/20 text-vaa-gold border border-vaa-gold/30">AUTHORIZATION REQ.</span>
            </h1>
            <p className="text-gray-400 font-medium tracking-wide text-sm mt-1">30% Human Component Verification Queue</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl flex items-center gap-3 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-vaa-gold animate-pulse shadow-[0_0_8px_#FFC000]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              {queue.length} Pending
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Queue List */}
        <div className="xl:col-span-5 space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-tech-cyan/20 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Query student records..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/60 border border-white/10 text-white placeholder:text-gray-600 focus:border-tech-cyan/50 focus:ring-1 focus:ring-tech-cyan/30 text-sm font-mono transition-all shadow-inner outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-12 text-center text-tech-cyan font-mono font-bold uppercase text-xs tracking-[0.2em] animate-pulse">
                Fetching Queue Data...
              </div>
            ) : queue.length === 0 ? (
              <div className="glass-panel p-12 rounded-[32px] border border-dashed border-white/10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                </div>
                <p className="text-sm font-mono font-bold text-gray-500 tracking-wider">QUEUE CLEAR</p>
              </div>
            ) : (
              queue.map((item) => (
                <button
                  key={item.assessment_id}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    "w-full p-5 rounded-2xl text-left transition-all border relative overflow-hidden group flex items-center justify-between",
                    selectedItem?.assessment_id === item.assessment_id
                      ? "bg-vaa-gold/10 border-vaa-gold/50 shadow-[0_0_20px_rgba(255,192,0,0.15)]"
                      : "bg-black/40 border-white/5 hover:border-vaa-gold/30 hover:bg-white/5"
                  )}
                >
                  {selectedItem?.assessment_id === item.assessment_id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-vaa-gold shadow-[0_0_10px_#FFC000]" />
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-sm font-bold tracking-wide",
                        selectedItem?.assessment_id === item.assessment_id ? "text-vaa-gold" : "text-gray-200 group-hover:text-white"
                      )}>{item.student_name}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase",
                        selectedItem?.assessment_id === item.assessment_id ? "bg-vaa-gold/20 text-vaa-gold border border-vaa-gold/30" : "bg-white/5 text-gray-400 border border-white/10"
                      )}>
                        MOD-{item.module}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-500 flex items-center gap-2">
                       <span className="text-tech-cyan">SYS_SCORE: {item.ai_score}%</span>
                       <span>•</span>
                       <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <ArrowRight className={cn(
                    "w-5 h-5 transition-transform group-hover:translate-x-1",
                    selectedItem?.assessment_id === item.assessment_id ? "text-vaa-gold" : "text-gray-600"
                  )} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Review Form */}
        <div className="xl:col-span-7">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.assessment_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel p-8 rounded-[40px] border border-white/10 space-y-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vaa-gold via-tech-cyan to-transparent opacity-50" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.student_name}</h3>
                    <p className="text-xs font-mono font-bold uppercase text-gray-500 tracking-[0.2em]">ID: <span className="text-tech-cyan">#{selectedItem.assessment_id}</span></p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-left md:text-right">
                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-[0.2em] mb-1">AI Baseline Score</p>
                    <div className="flex items-baseline md:justify-end gap-1">
                       <span className="text-4xl font-bold tracking-tighter text-tech-cyan">{selectedItem.ai_score}</span>
                       <span className="text-lg font-bold text-gray-500">%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                     <ClipboardCheck className="w-4 h-4 text-vaa-gold" /> Raw Submission Data
                  </h4>
                  <div className="p-6 rounded-3xl bg-black/60 border border-white/5 text-sm leading-relaxed font-mono text-gray-300 shadow-inner relative">
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-white/10 rounded-r-md" />
                    "{selectedItem.input_text}"
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                       <Activity className="w-4 h-4 text-tech-cyan" /> Final Grade Adj.
                    </h4>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-6 bg-black/40 p-5 rounded-3xl border border-white/5">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={score}
                          onChange={(e) => setScore(parseInt(e.target.value))}
                          className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-tech-cyan"
                        />
                        <span className="text-3xl font-mono font-bold text-white w-14 text-right">
                          {score}<span className="text-sm text-gray-500">%</span>
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center">Slide to finalize grade</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-vaa-gold" /> Instructor Notes
                    </h4>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Input official feedback notation..."
                      className="w-full h-[120px] p-5 rounded-3xl bg-black/40 border border-white/10 text-sm focus:ring-1 focus:ring-vaa-gold focus:border-vaa-gold resize-none font-mono text-gray-300 placeholder:text-gray-600 outline-none shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 mt-4">
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="w-full sm:flex-1 py-4 bg-vaa-gold/20 border border-vaa-gold/50 text-vaa-gold rounded-2xl font-bold text-xs tracking-[0.2em] uppercase hover:bg-vaa-gold hover:text-black transition-all disabled:opacity-30 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,192,0,0.15)] hover:shadow-[0_0_30px_rgba(255,192,0,0.4)] relative"
                  >
                    {submitting ? (
                      <><Activity className="w-4 h-4 animate-spin" /> Authorizing...</>
                    ) : (
                      "Sign & Authorize Grade"
                    )}
                  </button>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-2xl font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    Abort
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[600px] glass-panel rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 bg-black/20">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_4s_linear_infinite]" />
                  <AlertCircle className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-3 tracking-wide">Awaiting Selection</h3>
                <p className="text-sm text-gray-500 max-w-sm font-mono leading-relaxed">
                  Select a pending assessment module from the queue to initiate human verification override.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
