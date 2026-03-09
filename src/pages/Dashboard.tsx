import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { dashboardService } from '../services/api';
import { motion } from 'motion/react';
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Activity, Target, Zap } from 'lucide-react';
import { cn, getScoreColor } from '../lib/utils';

export default function Dashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getDashboardData>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getDashboardData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh] flex-col gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-tech-cyan/20 border-t-tech-cyan animate-spin" />
      <span className="text-tech-cyan font-bold tracking-widest uppercase text-sm animate-pulse">Initializing Comm Link...</span>
    </div>
  );
  if (!data) return <div className="text-red-400 glass-panel p-8 text-center rounded-2xl">Error loading dashboard data. System Offline.</div>;

  const gaugeData = [
    { name: 'Score', value: data.career_readiness_score },
    { name: 'Remaining', value: 100 - data.career_readiness_score },
  ];

  const getHexColor = (score: number) => {
    if (score >= 80) return '#00E5FF'; // tech-cyan
    if (score >= 60) return '#FFC000'; // vaa-gold
    return '#FF3B30'; // red
  };

  const moduleChartData = [
    { name: 'Mod A', score: data.module_scores.A || 0 },
    { name: 'Mod B', score: data.module_scores.B || 0 },
    { name: 'Mod C', score: data.module_scores.C || 0 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-vaa-blue/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-transform duration-700 group-hover:scale-150" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-tech-cyan" />
              <h2 className="text-sm font-bold tracking-[0.2em] text-tech-cyan uppercase">Logistics Readiness Protocol</h2>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Global Supply Chain Assessment Active</h1>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
              Your performance across distinct supply chain crises forms your Career Readiness indicator. Engage with the simulation modules to train technical phrasing and operational response times under stress.
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-vaa-blue/20 border border-vaa-blue/50 rounded-lg shadow-[0_0_15px_rgba(0,51,160,0.5)]">
               <Activity className="text-tech-cyan w-4 h-4 animate-pulse" />
               <span className="text-xs font-bold font-mono tracking-wider text-tech-cyan">SYNC: OPTIMAL</span>
             </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Career Readiness Gauge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-[32px] flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0033A0]/10 pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-8">
            <Target className="w-4 h-4 text-tech-cyan" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Readiness Score</h3>
          </div>
          
          <div className="relative w-full aspect-square max-w-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="100%"
                  startAngle={210}
                  endAngle={-30}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={getHexColor(data.career_readiness_score)} style={{ filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.4))' }} />
                  <Cell fill="rgba(255,255,255,0.05)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-6xl font-bold tracking-tighter text-white text-glow" style={{ color: getHexColor(data.career_readiness_score) }}>
                {data.career_readiness_score}
              </span>
              <span className="text-xs font-bold tracking-widest text-gray-500 mt-2">PRCNT</span>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-400 max-w-[200px] leading-relaxed relative z-10">
            Current calculated proficiency level across all logistics operations.
          </p>
        </motion.div>

        {/* Module Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 glass-panel p-8 rounded-[32px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-tech-cyan" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Sector Performance</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded shadow-[0_0_8px_#00E5FF] bg-tech-cyan" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Idle</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0B0F19]/90 backdrop-blur-md border border-tech-cyan/30 text-white px-4 py-3 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                          <span className="text-tech-cyan mr-2">SYS_SCORE:</span>
                          {payload[0].value}%
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill="url(#colorCyan)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={45}
                />
                <defs>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#0033A0" stopOpacity={0.5}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Interventions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-[32px]"
        >
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <AlertCircle className="text-vaa-gold w-5 h-5 shadow-vaa-gold/50" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">System Directives</h3>
          </div>
          <div className="space-y-4">
            {data.interventions.map((task, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-vaa-gold/5 border border-vaa-gold/20 hover:bg-vaa-gold/10 transition-colors group">
                <div className="mt-1 w-2.5 h-2.5 rounded-sm bg-vaa-gold shrink-0 border border-vaa-gold/50 shadow-[0_0_8px_rgba(255,192,0,0.5)] group-hover:animate-pulse" />
                <p className="text-sm font-medium text-vaa-gold-light leading-relaxed">{task}</p>
              </div>
            ))}
            {data.interventions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="text-tech-cyan w-16 h-16 mb-4 opacity-50 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
                <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">No remedial operations pending.<br/>Systems optimal.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity / Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-8 rounded-[32px]"
        >
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <Clock className="text-tech-cyan w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Module Uplink Status</h3>
          </div>
          <div className="space-y-4">
            {[
              { id: 'A', title: 'Emergency Protocol', status: data.module_scores.A ? 'VERIFIED' : 'PENDING' },
              { id: 'B', title: 'Client Resolution', status: data.module_scores.B ? 'VERIFIED' : 'PENDING' },
              { id: 'C', title: 'Supply Chain Audit', status: data.module_scores.C ? 'VERIFIED' : 'PENDING' },
            ].map((mod) => (
              <div key={mod.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-tech-cyan/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border relative overflow-hidden",
                    mod.status === 'VERIFIED' ? "bg-tech-cyan/10 border-tech-cyan/50 text-tech-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]" : "bg-white/5 border-white/10 text-gray-500"
                  )}>
                    {mod.status === 'VERIFIED' && <div className="absolute inset-0 bg-tech-cyan opacity-20 animate-pulse" />}
                    <span className="relative z-10">{mod.id}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-200 tracking-wide group-hover:text-white transition-colors">{mod.title}</p>
                    <p className={cn(
                      "text-[10px] mt-1 uppercase font-bold tracking-[0.2em]",
                      mod.status === 'VERIFIED' ? "text-tech-cyan" : "text-gray-500"
                    )}>{mod.status}</p>
                  </div>
                </div>
                <div className={cn(
                  "p-2 rounded-full transition-colors",
                  mod.status === 'VERIFIED' ? "bg-tech-cyan/10" : "bg-white/5 group-hover:bg-white/10"
                )}>
                  <ArrowUpRight className={cn("w-4 h-4", mod.status === 'VERIFIED' ? "text-tech-cyan" : "text-gray-500 group-hover:text-gray-300")} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
