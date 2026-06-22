import { Search, Building2, LogIn, UserPlus, Home, Compass } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const location = useLocation();

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-16 md:h-18 flex items-center justify-between bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border border-slate-200/40 dark:border-slate-800/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200/40 dark:shadow-none group-hover:rotate-12 group-hover:scale-105 transition-all duration-500">
            <Building2 className="text-white w-5.5 h-5.5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dorm<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Den</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 text-sm font-semibold">
          <Link 
            to="/" 
            className={cn(
              "relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 transform active:scale-95 group/link",
              location.pathname === '/' 
                ? "bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
            )}
          >
            <Home className="w-4 h-4 transition-transform group-hover/link:-translate-y-0.5" />
            Home
            {location.pathname === '/' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </Link>
          <Link 
            to="/search" 
            className={cn(
              "relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 transform active:scale-95 group/link",
              location.pathname === '/search' 
                ? "bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
            )}
          >
            <Compass className="w-4 h-4 transition-transform group-hover/link:rotate-12" />
            Browse
            {location.pathname === '/search' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </Link>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 md:gap-5">
          <ThemeToggle size="sm" />
          
          <button className="hidden sm:flex text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all items-center gap-2 px-3.5 py-2.5 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-900/60 active:scale-95">
            <LogIn className="w-4 h-4" />
            Log In
          </button>
          
          <Link to="/search" className="sm:hidden p-2 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl">
            <Search className="w-5 h-5" />
          </Link>
          
          <button className="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition-all shadow-md shadow-indigo-200/40 dark:shadow-none overflow-hidden group">
            <span className="relative z-10 flex items-center gap-2">
              <UserPlus className="w-4.5 h-4.5 hidden md:inline" />
              Join Now
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine animate-duration-1000" />
          </button>
        </div>
      </nav>
    </div>
  );
};
