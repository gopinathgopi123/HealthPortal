import React, { useState } from 'react';
import { Activity, Shield, Zap, Heart, Search, Home, Calendar, User } from 'lucide-react';

import { Link, useLocation } from "wouter";
import { useLabTests } from '@/services/labs.service';

const HomePage: React.FC = () => {
  const { data: tests, isLoading, error } = useLabTests();
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState('All Tests');

  const getTestImage = (name: string, isDesktop: boolean = false) => {
    const lowerName = name.toLowerCase();
    const size = isDesktop ? '800' : '400';
    if (lowerName.includes('vitamin')) return `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=${size}`;
    if (lowerName.includes('heart') || lowerName.includes('cardiac')) return `https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=${size}`;
    if (lowerName.includes('thyroid')) return `https://images.unsplash.com/photo-1579152276506-dd459633e65c?auto=format&fit=crop&q=80&w=${size}`;
    if (lowerName.includes('diabetes') || lowerName.includes('sugar') || lowerName.includes('glucose')) return `https://images.unsplash.com/photo-1511174511562-5f7f18b85462?auto=format&fit=crop&q=80&w=${size}`;
    if (lowerName.includes('full body') || lowerName.includes('comprehensive')) return `https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=${size}`;
    if (lowerName.includes('men')) return `https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&q=80&w=${size}`;
    if (lowerName.includes('woman') || lowerName.includes('female')) return `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=${size}`;
    return `https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=${size}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] pb-24 lg:pb-0">
      {/* --- MOBILE SEARCH HEADER (Visible only on mobile/tablet < lg) --- */}
      <section className="lg:hidden px-5 pt-8 pb-10 bg-[#e3f2fd]/40 rounded-b-[2.5rem]">
        <div className="max-w-[600px] mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#0f1115] leading-tight tracking-tight">
              Take Control of <br />
              <span className="bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent">Your Health</span>
            </h1>
            <p className="text-[#2962FF] font-medium text-base leading-relaxed">
              Book world-class health checkups today.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#2962FF]" />
            </div>
            <input
              type="text"
              placeholder="Find tests (e.g., Vitamin D)"
              className="w-full pl-14 pr-6 py-4 bg-white border-transparent rounded-2xl shadow-xl shadow-blue-500/5 text-[#0f1115] text-base font-medium outline-none focus:ring-2 focus:ring-[#2962FF]/20 transition-all placeholder-slate-400"
            />
          </div>
        </div>
      </section>

      {/* --- DESKTOP HERO SECTION (Visible only on lg and above) --- */}
      <section className="hidden lg:flex relative h-[550px] overflow-hidden bg-white items-center mb-10 w-full">
        <div className="flex-1 px-16 z-10 max-w-[700px]">
          <h1 className="text-[3.5rem] font-black text-[#0f1115] leading-[0.95] tracking-tight mb-8">
            Start Your Health <br />
            <span className="bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent">Journey Today</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed max-w-[500px]">
            Discover comprehensive wellness tests tailored for you.
            Track your biomarkers, schedule expert-reviewed tests.
          </p>

          <div className="relative max-w-[450px]">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm h-14 group focus-within:border-[#2962FF]/40 transition-all overflow-hidden">
              <div className="pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Find your health test, biomarkers..."
                className="w-full px-4 text-[#0f1115] text-base font-medium outline-none placeholder-slate-400 bg-transparent"
              />
              <button className="bg-gradient-to-r from-[#07A27D] to-[#1D548B] hover:opacity-90 text-white h-full px-8 font-bold text-base transition-all active:scale-[0.97]">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Image with Slant */}
        <div className="absolute top-0 right-0 w-[55%] h-full z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200')`,
              clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* --- CATEGORY CHIPS (Visible on both, but styled slightly differently) --- */}
      <section className="mt-8 lg:mt-0 lg:px-16 lg:max-w-[1400px] lg:mx-auto lg:w-full">
        <div className="flex overflow-x-auto gap-3 px-5 lg:px-0 no-scrollbar pb-2">
          {['All Tests', 'Men', 'Women', 'Senior', 'Diabetes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 ${activeCategory === cat
                ? 'bg-gradient-to-r from-[#07A27D] to-[#1D548B] text-white shadow-[#07A27D]/20'
                : 'bg-white text-slate-500 shadow-slate-200/40 hover:bg-[#e3f2fd] hover:text-[#07A27D]'
                }`}
            >
              {cat === 'All Tests' && <Zap className="w-4 h-4 inline-block mr-2 -mt-0.5" />}
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- POPULAR PACKAGES / TEST CARDS --- */}
      <section className="mt-12 px-5 lg:px-16 max-w-[1400px] mx-auto w-full mb-32">
        <div className="flex items-center justify-between mb-8 lg:mb-16">
          <div className="flex flex-col gap-2">
            <span className="lg:hidden bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent font-black uppercase tracking-[0.3em] text-[0.7rem] hidden">Selected for you</span>
            <h2 className="text-2xl lg:text-4xl font-black text-[#0f1115] tracking-tight">
              Popular <span className="bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent">Packages</span>
            </h2>
          </div>
          <Link href="/tests" className="bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent font-black text-[0.95rem] lg:text-lg hover:opacity-80 transition-all">
            View All {window.innerWidth >= 1024 ? 'tests →' : ''}
          </Link>
        </div>

        {/* --- GRID (Desktop) vs LIST (Mobile) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2962FF]"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10 text-red-400 font-bold">Failed to load tests.</div>
          ) : (
            tests?.slice(0, 6).map((test, index) => {
              const imageMobile = getTestImage(test.name, false);
              const imageDesktop = getTestImage(test.name, true);
              const isPremium = test.name.includes('777');
              const isDark = index === 2; // Keep the dark variant for the 3rd card on desktop

              return (
                <div key={test.id}>
                  {/* --- MOBILE CARD DESIGN (lg:hidden) --- */}
                  <div
                    className={`lg:hidden relative flex gap-4 bg-white p-1.5 rounded-2xl border transition-all active:scale-[0.98] ${isPremium ? 'border-[#07A27D]/20 bg-gradient-to-br from-white to-[#07A27D]/5 shadow-xl' : 'border-[#e3f2fd]/50 shadow-lg shadow-slate-200/200'
                      }`}
                  >
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl shadow-lg bg-slate-200">
                      <img
                        src={imageMobile}
                        alt={test.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-black text-[#0f1115] tracking-tight leading-tight line-clamp-1">{test.name}</h4>
                          {index < 3 && (
                            <span className={`px-2 py-0.5 rounded-lg text-[0.55rem] font-black uppercase tracking-widest ${isPremium ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                              {isPremium ? 'PREMIUM' : 'POPULAR'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                          {test.description || 'Comprehensive general checkup covering multiple vital parameters.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-black bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent">₹{test.price || '10,000'}</span>
                        <Link
                          href={`/book?id=${test.id}`}
                          className="bg-gradient-to-r from-[#07A27D] to-[#1D548B] text-white  py-2 rounded-xl text-xs font-black tracking-tight hover:opacity-90 transition-all shadow-sm active:scale-95 p-2"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* --- DESKTOP CARD DESIGN (hidden lg:flex) --- */}
                  <div
                    className={`hidden lg:flex group relative flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:-translate-y-3 h-full ${isDark ? 'bg-[#0f172a] border-slate-800 text-white shadow-2xl shadow-blue-900/40' : 'bg-white border-slate-100 text-[#0f1115] hover:border-slate-200 shadow-xl shadow-slate-200/20'
                      }`}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={imageDesktop}
                        alt={test.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      <div className="absolute top-5 left-5">
                        <span className="bg-white/90 backdrop-blur-sm text-[#0f1115] px-4 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider shadow-sm">
                          Best Seller
                        </span>
                      </div>
                    </div>

                    <div className="p-7 flex-1 flex flex-col gap-5">
                      <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                          <Zap className={`w-4 h-4 ${isDark ? 'text-[#FFB300]' : 'text-[#2962FF]'}`} />
                          <h3 className="text-xl font-black tracking-tight leading-tight">{test.name}</h3>
                        </div>
                        <p className={`text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {test.description || 'Comprehensive biomarkers profiling covering metabolic health and vitals.'}
                        </p>
                      </div>

                      <div className="flex gap-5">
                        <div className="flex items-center gap-1.5 opacity-60">
                          <div className={`w-1 rounded-full aspect-square ${isDark ? 'bg-[#FFB300]' : 'bg-[#2962FF]'}`} />
                          <span className="text-[0.65rem] font-black uppercase tracking-widest">30 mins</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-60">
                          <div className={`w-1 rounded-full aspect-square ${isDark ? 'bg-[#FFB300]' : 'bg-[#2962FF]'}`} />
                          <span className="text-[0.65rem] font-black uppercase tracking-widest">Fasting</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100/30 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Price</span>
                          <span className="text-2xl font-black text-[#0f1115]">₹{test.price || '10,000'}</span>
                        </div>
                        <Link
                          href={`/book?id=${test.id}`}
                          className={`px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${isDark ? 'bg-white text-[#0f172a] hover:bg-slate-100' : 'bg-gradient-to-r from-[#07A27D] to-[#1D548B] text-white hover:opacity-90'
                            }`}
                        >
                          Book
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* --- MOBILE BOTTOM NAVIGATION (lg:hidden) --- */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-slate-100 px-8 py-4 flex justify-between items-center z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <Link href="/">
          <a className={`flex flex-col items-center gap-1 transition-all ${location === '/' ? 'text-[#07A27D]' : 'text-slate-400'}`}>
            <Home className="w-6 h-6" />
            <span className="text-[0.7rem] font-black uppercase tracking-widest">Home</span>
          </a>
        </Link>
        <Link href="/book">
          <a className={`flex flex-col items-center gap-1 transition-all ${location === '/book' ? 'text-[#07A27D]' : 'text-slate-400'}`}>
            <Calendar className="w-6 h-6" />
            <span className="text-[0.7rem] font-black uppercase tracking-widest">Booking</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center gap-1 transition-all ${location === '/profile' ? 'text-[#07A27D]' : 'text-slate-400'}`}>
            <User className="w-6 h-6" />
            <span className="text-[0.7rem] font-black uppercase tracking-widest">Profile</span>
          </a>
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;

