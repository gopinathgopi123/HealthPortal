import React from 'react';
import { PlusCircle, LogOut, ChevronDown, Home, TestTube, Info, Phone, LogIn } from 'lucide-react';
import { Link, useLocation } from "wouter";
import { useAuth } from '@/hooks/use-auth';

const Header: React.FC = () => {
  const [location, navigate] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isBarOpen, setIsBarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setIsBarOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsBarOpen(false);
  };

  return (
    <header className="bg-white py-4 lg:py-6 border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-5 lg:px-8 flex items-center justify-between lg:max-w-7xl">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 no-underline" onClick={() => setIsBarOpen(false)}>
          <div className="lg:hidden w-9 h-9 bg-gradient-to-br from-[#07A27D] to-[#1D548B] rounded-xl flex items-center justify-center shadow-lg shadow-[#07A27D]/20">
            <PlusCircle className="text-white w-5 h-5" />
          </div>
          <img src="/logo.png" alt="AIWO Logo" className="hidden lg:block h-10 lg:h-12 w-auto" />
          <span className="lg:hidden text-lg font-black tracking-tight text-[#0f1115]">AIWO</span>
        </Link>

        {/* --- DESKTOP NAVIGATION (Links in center) --- */}
        <nav className="hidden lg:flex gap-10 items-center">
          <Link href="/">
            <a className={`text-[0.95rem] font-bold transition-colors no-underline ${location === '/' ? 'bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent' : 'text-slate-600 hover:text-[#07A27D]'}`}>
              Home
            </a>
          </Link>
          <Link href="/tests">
            <a className={`text-[0.95rem] font-bold transition-colors no-underline ${location === '/tests' ? 'bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent' : 'text-slate-600 hover:text-[#07A27D]'}`}>
              Tests
            </a>
          </Link>
          <Link href="/about">
            <a className={`text-[0.95rem] font-bold transition-colors no-underline ${location === '/about' ? 'bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent' : 'text-slate-600 hover:text-[#07A27D]'}`}>
              About
            </a>
          </Link>
          <Link href="/contact">
            <a className={`text-[0.95rem] font-bold transition-colors no-underline ${location === '/contact' ? 'bg-gradient-to-r from-[#07A27D] to-[#1D548B] bg-clip-text text-transparent' : 'text-slate-600 hover:text-[#07A27D]'}`}>
              Contact
            </a>
          </Link>
        </nav>

        {/* Action Hub */}
        <div className="relative">

          {/* --- DESKTOP ACTION BUTTONS (Separate from nav) --- */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => handleNavigate('/login')}
              className="bg-gradient-to-r from-[#07A27D] to-[#1D548B] text-white px-8 py-3 rounded-xl font-bold text-[0.95rem] transition-all shadow-lg shadow-[#07A27D]/20 active:scale-95 hover:opacity-90"
            >
              Login / Sign Up
            </button>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-[0.95rem] transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
              >
                <LogOut size={18} className="text-red-500" />
                Logout
              </button>
            )}
          </div>

          {/* --- MOBILE UNIFIED BAR (Only on Mobile) --- */}
          <button
            onClick={() => setIsBarOpen(!isBarOpen)}
            className="lg:hidden flex items-center bg-[#1D548B]/5 border border-[#1D548B]/10 pl-5 pr-4 py-3 rounded-2xl gap-3 active:scale-95 transition-all text-[#1D548B] font-black text-[0.95rem] shadow-sm"
          >
            Explore & Actions
            <ChevronDown size={20} className={`transition-transform duration-300 ${isBarOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Dropdown (Contains everything) */}
          {isBarOpen && (
            <>
              <div className="fixed inset-0 z-[90] lg:hidden" onClick={() => setIsBarOpen(false)} />
              <div className="lg:hidden absolute top-full right-0 mt-4 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl p-3 flex flex-col gap-1 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <button onClick={() => handleNavigate('/')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[0.95rem] transition-all flex items-center gap-3 ${location === '/' ? 'bg-slate-50 text-[#1D548B]' : 'text-slate-600 hover:bg-slate-50/50'}`}>
                  <Home size={18} className="text-slate-400" /> Home
                </button>
                <button onClick={() => handleNavigate('/tests')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[0.95rem] transition-all flex items-center gap-3 ${location === '/tests' ? 'bg-slate-50 text-[#1D548B]' : 'text-slate-600 hover:bg-slate-50/50'}`}>
                  <TestTube size={18} className="text-slate-400" /> Health Tests
                </button>
                <button onClick={() => handleNavigate('/about')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[0.95rem] transition-all flex items-center gap-3 ${location === '/about' ? 'bg-slate-50 text-[#1D548B]' : 'text-slate-600 hover:bg-slate-50/50'}`}>
                  <Info size={18} className="text-slate-400" /> About AIWO
                </button>
                <button onClick={() => handleNavigate('/contact')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[0.95rem] transition-all flex items-center gap-3 ${location === '/contact' ? 'bg-slate-50 text-[#1D548B]' : 'text-slate-600 hover:bg-slate-50/50'}`}>
                  <Phone size={18} className="text-slate-400" /> Contact Us
                </button>

                <div className="h-px bg-slate-100 my-2 mx-4" />

                <button onClick={() => handleNavigate('/login')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-[0.95rem] transition-all flex items-center gap-3 ${location === '/login' ? 'bg-slate-50 text-[#1D548B]' : 'text-slate-600 hover:bg-slate-50/50'}`}>
                  <LogIn size={18} className="text-[#07A27D]" /> Login / Register
                </button>

                {isAuthenticated && (
                  <button onClick={handleLogout} className="w-full text-left px-5 py-4 rounded-2xl font-bold text-[0.95rem] transition-all text-red-500 hover:bg-red-50/50 flex items-center gap-3">
                    <LogOut size={18} /> Log Out
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
