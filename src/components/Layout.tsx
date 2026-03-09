import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, MessageSquare, Truck, ClipboardCheck, GraduationCap, Cpu, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
  { to: '/module-a', icon: ShieldAlert, label: 'Mod A: Emergency' },
  { to: '/module-b', icon: MessageSquare, label: 'Mod B: Interaction' },
  { to: '/module-c', icon: Truck, label: 'Mod C: Supply Chain' },
  { to: '/admin/review', icon: ClipboardCheck, label: 'Lecturer Review' },
];

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-tech-bg text-white font-sans scanline relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-vaa-blue/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[30%] h-[50%] rounded-full bg-tech-cyan/10 blur-[100px]" />
      </div>

      {/* Sidebar */}
      <aside className="w-72 glass-panel border-r border-white/5 flex flex-col z-10 relative">
        <div className="p-6 flex items-center gap-4 border-b border-white/10 mt-2">
          <div className="relative">
            <div className="absolute inset-0 bg-vaa-blue blur-md opacity-50 rounded-xl animate-pulse"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-[#0033A0] to-[#00E5FF] rounded-xl flex items-center justify-center shadow-lg border border-white/20">
              <GraduationCap className="text-white w-7 h-7" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">VAA Logi-Pro AI</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-tech-cyan font-bold mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tech-cyan animate-pulse"></span>
              Curriculum Core
            </p>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-col gap-2 border-b border-white/5">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium tracking-wider">
            <span>SYSTEM METRICS</span>
            <Activity className="w-3.5 h-3.5 text-tech-cyan" />
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-vaa-blue to-tech-cyan w-3/4 animate-pulse-glow"></div>
          </div>
          <p className="text-[10px] text-gray-500 text-right mt-1">CPU: 32% | MEM: 4.1GB</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 group",
                  isActive 
                    ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(0,229,255,0.15)]" 
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "p-2 rounded-lg transition-colors duration-300", 
                    isActive ? "bg-vaa-blue/30 text-tech-cyan" : "bg-white/5 text-gray-400 group-hover:text-tech-cyan group-hover:bg-white/10"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="tracking-wide"> {item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/5 group hover:border-tech-cyan/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Cadet Profile</p>
                <p className="text-sm font-bold text-white tracking-wide">Chu Hoang Minh Phuc</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 flex flex-col">
        <header className="h-20 glass-panel border-b border-white/10 border-r-0 border-l-0 border-t-0 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-vaa-blue/20 rounded-lg border border-vaa-blue/50">
               <Cpu className="w-5 h-5 text-tech-cyan" />
             </div>
             <div>
                <h2 className="font-bold text-xl tracking-tight">AI-Driven Logistics Curriculum</h2>
                <p className="text-xs text-gray-400 font-medium tracking-wide">English for Logistics • v2.4.1</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
               <div className="h-2 w-2 rounded-full bg-tech-cyan animate-pulse shadow-[0_0_8px_#00E5FF]" />
               <span className="text-xs font-bold tracking-wider text-tech-cyan uppercase">Terminal Active</span>
            </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto w-full flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
