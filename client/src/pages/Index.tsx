import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  Scan, 
  ShieldAlert, 
  ArrowRight, 
  UserCheck, 
  Target, 
  Users, 
  Twitter, 
  Instagram, 
  Linkedin,
  Building2
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { cn } from '@/lib/utils';

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 20;
    const rotateY = (x - centerX) / 20;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-200 ease-out", className)}
    >
      {children}
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-600 transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50 bg-[linear-gradient(rgba(226,232,240,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.5)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(51,65,85,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(51,65,85,0.15)_1px,transparent_1px)] bg-[size:50px_50px] bg-center" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold animate-fade-in-up [animation-delay:0.1s] shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI-POWERED VIBE MATCHING 2.0
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.05] animate-fade-in-up [animation-delay:0.2s]">
              Find your tribe. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">Book your space.</span>
            </h1>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed animate-fade-in-up [animation-delay:0.3s]">
              Beyond just a bed. We match students through psychographic profiles to ensure your housemates share your energy, habits, and ambition.
            </p>

            <div className="max-w-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl p-2.5 flex items-center gap-3 border border-white/50 dark:border-slate-800/50 shadow-2xl animate-fade-in-up [animation-delay:0.4s]">
              <div className="flex-1 flex items-center px-4 gap-4 text-slate-400">
                <Search className="w-6 h-6 text-indigo-500" />
                <input 
                  type="text" 
                  placeholder="Where are you moving to?" 
                  className="w-full py-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-lg font-medium"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <button 
                onClick={() => navigate('/search')}
                className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
              >
                Discover
              </button>
            </div>
            
            <div className="flex items-center gap-6 animate-fade-in-up [animation-delay:0.5s]">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i}`} 
                    className="w-12 h-12 rounded-full border-4 border-white shadow-md" 
                    alt="User" 
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-md">+2k</div>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Joined by <span className="text-slate-900 dark:text-white font-bold">12,000+</span> students this semester</span>
            </div>
          </div>

          <div className="relative hidden lg:block perspective-1000">
            <div className="relative animate-float-3d transform-gpu preserve-3d">
              {/* Main Card */}
              <div className="w-full aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/40 p-8 [transform:rotateY(-10deg)_rotateX(5deg)]">
                <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1555930112-0159bcdc3fe5?auto=format&w=800&q=80&fit=crop" className="w-full h-full object-cover" alt="Student Room" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                   <div className="absolute bottom-6 left-6 right-6">
                     <div className="flex justify-between items-end">
                       <div>
                         <h4 className="text-white text-2xl font-bold mb-1">Skyline Residences</h4>
                         <p className="text-white/80 text-sm flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Koramangala, Bangalore</p>
                       </div>
                       <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold border border-white/30">
                         ✨ CHILL VIBE
                       </div>
                     </div>
                   </div>
                </div>
              </div>

              {/* Match Card */}
              <div className="absolute top-2 -right-6 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 translate-z-100 hover:translate-z-120 transition-transform duration-500 z-10">
                 <div className="flex items-center gap-4 mb-4">
                   <img src="https://i.pravatar.cc/80?u=priya" className="w-12 h-12 rounded-full ring-2 ring-indigo-500/20" alt="Avatar" />
                   <div>
                     <div className="text-sm font-bold">Match found!</div>
                     <div className="text-[10px] text-slate-400 uppercase tracking-widest">Engineering @ BITS</div>
                   </div>
                 </div>
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Vibe Accuracy</span>
                   <span className="text-[10px] font-bold text-indigo-600">98.4%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[98%]" />
                 </div>
              </div>

              {/* Price Card */}
              <div className="absolute -bottom-10 -left-10 w-56 bg-indigo-600 rounded-2xl p-6 shadow-2xl shadow-indigo-300 translate-z-150 hover:translate-z-170 transition-transform duration-500 text-white">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
                   <span className="text-xs font-bold uppercase tracking-wider">Verified PG</span>
                 </div>
                 <div className="text-2xl font-extrabold">₹9,500<span className="text-xs font-medium opacity-70">/mo</span></div>
                 <div className="text-[10px] opacity-70 mt-1 italic">All inclusive • No hidden fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Showcase */}
      <section className="py-20 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-12 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            {['IIT BOMBAY', 'BITS PILANI', 'MAHE', 'SRM UNIV', 'CHRIST UNIV'].map((uni) => (
              <span key={uni} className="text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-100 italic">{uni}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="vibe-matching" className="py-40 bg-slate-50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 animate-fade-in-up">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-6">Capabilities</h2>
            <h3 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">The new standard of living.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <TiltCard className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-[32px] border border-white dark:border-slate-800/60 group shadow-sm hover:shadow-premium">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Cpu className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">AI Vibe Engine</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                We don't just list rooms. Our engine scans 100+ data points to match you with a community that fits your lifestyle perfectly.
              </p>
              <div className="mt-8 flex items-center gap-2 text-indigo-600 font-bold text-sm cursor-pointer group-hover:gap-4 transition-all">
                LEARN MORE <ArrowRight className="w-4 h-4" />
              </div>
            </TiltCard>

            <TiltCard className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-[32px] border border-white dark:border-slate-800/60 group shadow-sm hover:shadow-premium">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                <Scan className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">TrueCost™ X-Ray</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Stop worrying about hidden electricity slabs or WiFi maintenance. We provide a guaranteed all-in monthly cost.
              </p>
              <div className="mt-8 flex items-center gap-2 text-indigo-600 font-bold text-sm cursor-pointer group-hover:gap-4 transition-all">
                SCAN A LISTING <ArrowRight className="w-4 h-4" />
              </div>
            </TiltCard>

            <TiltCard className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-[32px] border border-white dark:border-slate-800/60 group shadow-sm hover:shadow-premium">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <ShieldAlert className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Verified Safety</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Every property on DormDen is physically verified by our team. Zero scams. Zero bad wardens. Total peace of mind.
              </p>
              <div className="mt-8 flex items-center gap-2 text-indigo-600 font-bold text-sm cursor-pointer group-hover:gap-4 transition-all">
                OUR VERIFICATION <ArrowRight className="w-4 h-4" />
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Roommate Section */}
      <section className="py-40 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px]" />
            <div className="relative z-10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl p-4">
              <div className="bg-slate-900 rounded-[32px] aspect-square flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white/50 rounded-full animate-ping" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-white/50 rounded-full animate-pulse" />
                </div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float-3d">
                    <UserCheck className="w-12 h-12 text-indigo-400" />
                  </div>
                  <h4 className="text-3xl font-extrabold mb-6 italic">98.4% Match found!</h4>
                  <p className="text-white/60 max-w-xs mx-auto leading-relaxed mb-10 text-sm font-medium">
                    Ankit and Vikram share your 'Academic' vibe score and morning routine.
                  </p>
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50">
                    View Profiles
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8 animate-fade-in-up">
            <h3 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              The "Wait, I love my roommates" moment.
            </h3>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              DormDen doesn't just find you a room; it finds you a support system. Our algorithm connects you with peers who match your focus level, social frequency, and hygiene standards.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-default group">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Psychographic Profiling</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Matching habits, not just budgets.</div>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-default group">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Community Moderation</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Warden AI helps resolve group conflicts early.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-[60px] p-20 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(79,70,229,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600" />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:50px_50px] grayscale invert" />
            
            <div className="relative z-10 text-center text-white space-y-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">Ready for a <br /> better semester?</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
                Stop scrolling Craigslist and sketchy PG groups. Join 12,000+ students in India's most verified housing community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                <button className="w-full sm:w-auto bg-white text-indigo-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-2xl relative overflow-hidden group">
                  <span className="relative z-10">FIND YOUR VIBE</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/30 to-transparent -translate-x-full group-hover:animate-shine" />
                </button>
                <button 
                  onClick={() => navigate('/admin')}
                  className="w-full sm:w-auto bg-indigo-700/50 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all"
                >
                  LIST A PROPERTY
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-2 space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">DormDen</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md font-medium">
                Building the infrastructure for modern student life. We're turning a broken real-estate market into a high-trust, tech-first experience.
              </p>
            </div>
            <div>
              <h5 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest mb-10">Network</h5>
              <ul className="space-y-6 text-slate-500 dark:text-slate-400 font-bold text-sm">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Bangalore Hub</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Mumbai Cluster</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Kota Excellence</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Delhi Campus</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest mb-10">Platform</h5>
              <ul className="space-y-6 text-slate-500 dark:text-slate-400 font-bold text-sm">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Algorithm Insight</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Verification Protocol</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Warden AI Bot</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Safety Standard</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-16 border-t border-slate-100 dark:border-slate-900">
            <div className="flex items-center gap-10">
               <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.4em] uppercase">© 2024 DORMDEN PRO</div>
               <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                 <a href="#" className="hover:text-indigo-600">Privacy</a>
                 <a href="#" className="hover:text-indigo-600">Terms</a>
                 <a href="#" className="hover:text-indigo-600">Compliance</a>
               </div>
            </div>
            <div className="flex gap-6">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl dark:hover:shadow-none transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl dark:hover:shadow-none transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl dark:hover:shadow-none transition-all"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
