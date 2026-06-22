import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
      </div>

      <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-premium p-12 rounded-[32px] max-w-md w-full mx-4 text-center relative z-10 animate-scale-in">
        <h1 className="mb-4 text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">404</h1>
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Lost in the Den?</h2>
        <p className="mb-8 text-slate-500 dark:text-gray-400">Oops! We couldn't find the page you were looking for.</p>
        <a 
          href="/" 
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
