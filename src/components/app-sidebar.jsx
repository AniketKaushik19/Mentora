"use client";

import React, { useState } from "react";
import { 
  Menu, 
  X,
  ChevronRight,
  Globe,
  ToolCase,
  UserCircle2Icon,
  Compass,
  Book,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/ai-powered-learning' },
  { title: 'My Learning', icon: Book, path: '/ai-powered-learning/my-courses' },
  { title: 'Explore Courses', icon: Compass, path: '/ai-powered-learning/explore' },
  { title: 'Profile', icon: UserCircle2Icon, path: '/profile' },
  { title: 'Community', icon: Globe, path: '/community' },
  { title: 'AI Tools', icon: ToolCase, path: '/ai-tools' },
];
export function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOP HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#030712] border-b border-white/10 z-[50] px-6 flex items-center justify-between">
        <Link href="/">
          <h2 className="text-xl font-bold text-white tracking-tight">Mentora</h2>
        </Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-white hover:bg-white/5 transition-all"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-[#030712] border-r border-white/10 flex-col z-40">
        {/* Brand Header */}
        <div className="p-6 h-16 flex items-center border-b border-white/10">
          <Link href="/">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Mentora
            </h2>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.title} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                  isActive 
                  ? "bg-white text-black font-medium" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm">{item.title}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
             <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                M
             </div>
             <div className="flex flex-col">
                <span className="text-xs text-white font-medium">Mentora Interface</span>
                <span className="text-[10px] text-slate-500">v2.0.4 stable</span>
             </div>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-72 bg-[#030712] z-[70] flex flex-col lg:hidden shadow-2xl"
            >
              <div className="p-6 h-16 flex items-center justify-between border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Mentora</h2>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 p-1">
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link 
                      key={item.title} 
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-md text-sm transition-all ${
                        isActive 
                        ? "bg-white text-black font-semibold" 
                        : "text-slate-400 bg-white/0"
                      }`}
                    >
                      <item.icon size={20} />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}