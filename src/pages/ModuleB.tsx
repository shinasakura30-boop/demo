import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User, Bot, CheckCircle2, ChevronRight, Activity, Terminal } from 'lucide-react';
import { moduleBService } from '../services/api';
import { AssessmentResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn, getScoreColor } from '../lib/utils';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function ModuleB() {
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startScenario = async () => {
    setLoading(true);
    try {
      const { session_id, customer_complaint } = await moduleBService.startScenario();
      setScenarioId(session_id);
      setMessages([{ role: 'ai', content: customer_complaint }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !scenarioId || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const { ai_reply } = await moduleBService.respond(scenarioId, userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: ai_reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const finalize = async () => {
    if (!scenarioId || loading) return;
    setLoading(true);
    try {
      const userText = messages.filter(m => m.role === 'user').map(m => m.content).join('\n');
      const res = await moduleBService.submit(scenarioId, userText);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="glass-panel p-6 rounded-3xl flex items-center justify-between border-l-4 border-l-vaa-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-vaa-blue/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-vaa-blue/20 border border-vaa-blue/50 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,51,160,0.4)]">
            <MessageSquare className="text-tech-cyan w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              Customer Interaction <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">CLIENT-FACING</span>
            </h1>
            <p className="text-gray-400 font-medium tracking-wide text-sm mt-1">Written Nuance & Client Dispute Resolution</p>
          </div>
        </div>
      </header>

      {!scenarioId && !result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 rounded-[40px] text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-vaa-blue/5 to-transparent pointer-events-none" />
          
          <div className="w-24 h-24 bg-tech-cyan/10 border border-tech-cyan/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,229,255,0.2)] relative z-10">
            <Bot className="text-tech-cyan w-10 h-10" />
            <div className="absolute inset-0 rounded-full border border-tech-cyan animate-ping opacity-50" />
          </div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">Establish Secure Client Comms?</h2>
            <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
              Connect to a simulated client persona. Implement precise logistics phrasing and maintain absolute professionalism to resolve the dispute optimally.
            </p>
          </div>
          <button
            onClick={startScenario}
            disabled={loading}
            className="px-8 py-4 bg-tech-cyan/20 border border-tech-cyan text-tech-cyan rounded-2xl font-bold tracking-widest uppercase hover:bg-tech-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 flex items-center gap-3 mx-auto relative z-10"
          >
            {loading ? (
              <><Activity className="w-5 h-5 animate-spin" /> Handshaking...</>
            ) : (
              <><Terminal className="w-5 h-5" /> Initialize Chat <ChevronRight className="w-4 h-4 ml-1" /></>
            )}
          </button>
        </motion.div>
      )}

      {scenarioId && !result && (
        <div className="glass-panel rounded-[32px] flex flex-col h-[650px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-tech-cyan blur-[10px] opacity-40 animate-pulse rounded-full" />
                <div className="relative w-10 h-10 rounded-full bg-black border border-tech-cyan/50 flex items-center justify-center">
                  <Bot className="text-tech-cyan w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-200 tracking-wide">AI Client Entity</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-tech-cyan animate-pulse" />
                  <p className="text-[10px] text-tech-cyan font-mono font-bold uppercase tracking-wider">Session Active</p>
                </div>
              </div>
            </div>
            <button
              onClick={finalize}
              disabled={messages.length < 3 || loading}
              className="px-5 py-2.5 bg-vaa-blue hover:bg-vaa-blue-dark border border-white/10 text-white rounded-xl text-xs font-bold tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Conclude & Analyze
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20 scroll-smooth">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full shrink-0 flex items-center justify-center shadow-md border",
                  msg.role === 'user' ? "bg-tech-bg border-tech-cyan/30" : "bg-black border-white/10"
                )}>
                  {msg.role === 'user' 
                    ? <User className="text-tech-cyan w-5 h-5" /> 
                    : <Bot className="text-gray-400 w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-5 rounded-2xl text-sm leading-relaxed shadow-lg relative",
                  msg.role === 'user' 
                    ? "bg-tech-cyan/10 border border-tech-cyan/30 text-white rounded-tr-sm" 
                    : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm backdrop-blur-md"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center">
                  <Bot className="text-gray-400 w-5 h-5" />
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm flex gap-2 items-center">
                  <div className="w-2 h-2 bg-tech-cyan/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-tech-cyan/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-tech-cyan/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Draft professional response..."
                className="w-full py-4 pl-6 pr-16 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 font-mono text-sm focus:border-tech-cyan/50 focus:ring-1 focus:ring-tech-cyan/50 shadow-inner transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-2 bottom-2 px-4 bg-tech-cyan hover:bg-tech-cyan/80 text-black rounded-xl disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-500 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] disabled:shadow-none"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[32px] overflow-hidden border-t-2 border-t-tech-cyan relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-tech-cyan/5 to-transparent pointer-events-none" />

            <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-tech-cyan/20 border border-tech-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  <CheckCircle2 className="text-tech-cyan w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-1">Interaction Analyzed</h3>
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

            <div className="p-8 space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Tone Analytics', value: result.features.tone_score },
                  { label: 'Struct Coherence', value: result.features.response_coherence },
                  { label: 'Terminology Acc', value: result.features.terminology_accuracy },
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-3xl bg-black/40 border border-white/5 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-tech-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">{stat.label}</p>
                    <p className="text-3xl font-mono font-bold text-white relative z-10">{(stat.value * 100).toFixed(0)}<span className="text-lg text-tech-cyan">%</span></p>
                  </div>
                ))}
              </div>

              <div className="p-8 rounded-[32px] bg-black/30 border border-white/10 relative">
                <div className="absolute -left-2 top-8 w-1 h-12 bg-tech-cyan rounded-r-md" />
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-tech-cyan" /> Sentiment & Content Report
                </h4>
                <div className="prose prose-sm prose-invert max-w-none text-gray-300 font-mono text-sm leading-relaxed">
                  <ReactMarkdown>{result.feedback}</ReactMarkdown>
                </div>
              </div>

              {result.interventions.length > 0 && (
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-vaa-gold mb-3 ml-2">Recommended Corrections</h4>
                   <div className="flex flex-wrap gap-3">
                     {result.interventions.map((item, i) => (
                       <span key={i} className="px-4 py-2 bg-vaa-gold/10 text-vaa-gold-light border border-vaa-gold/30 text-xs font-bold rounded-xl shadow-[0_0_10px_rgba(255,192,0,0.1)]">
                         {item}
                       </span>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
