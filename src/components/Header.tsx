import React from 'react';
import { Menu, User, Calendar, PlusCircle } from 'lucide-react';

import { Link, useLocation } from "wouter";

const Header: React.FC = () => {
  const [, navigate] = useLocation();

  return (
    <header className="bg-bg-dark border-b border-border-color py-4 sticky top-0 z-[1000]">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none no-underline text-inherit hover:opacity-90 transition-opacity">
          <span className="text-2xl font-extrabold tracking-[2px]">AIWO</span>
          <span className="text-[0.7rem] font-medium text-primary-teal tracking-[3px]">HEALTH</span>
        </Link>

        <nav className="hidden lg:flex gap-6">
          <Link href="/" className="text-text-grey hover:text-text-white text-[0.9rem] font-medium transition-colors duration-200 no-underline">Home</Link>
        </nav>

        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <Link href="/login" className="text-text-grey hover:text-text-white text-[0.9rem] font-semibold no-underline transition-colors">Login</Link>
            <Link href="/register" className="text-text-grey hover:text-text-white text-[0.9rem] font-semibold no-underline transition-colors">Register</Link>
          </div>
          <button className="premium-gradient-btn" onClick={() => navigate('/book')}>
            <Calendar size={18} />
            Book Appointment
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
