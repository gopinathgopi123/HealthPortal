import React from 'react';
import { Mail, Lock, User, Users } from 'lucide-react';

const RegisterPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="glass-card w-full max-w-[450px] text-center">
        <h2 className="text-[2rem] font-bold mb-2">Create Account</h2>
        <p className="text-text-grey mb-8">Start your personalized health journey today</p>

        <form className="flex flex-col gap-5 text-left">
          <div className="input-field">
            <label>Full Name</label>
            <div className="icon-input">
              <User size={18} className="input-icon" />
              <input type="text" placeholder="John Doe" />
            </div>
          </div>

          <div className="input-field">
            <label>Email Address</label>
            <div className="icon-input">
              <Mail size={18} className="input-icon" />
              <input type="email" placeholder="name@example.com" />
            </div>
          </div>

          <div className="input-field">
            <label>Password</label>
            <div className="icon-input">
              <Lock size={18} className="input-icon" />
              <input type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="input-field">
            <label>Gender</label>
            <div className="icon-input">
              <Users size={18} className="input-icon" />
              <select>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button className="premium-gradient-btn w-full justify-center py-[14px] mt-3">Sign Up</button>
        </form>

        <p className="mt-6 text-text-grey text-[0.9rem]">
          Already have an account? <a href="/login" className="text-accent-blue no-underline font-semibold hover:brightness-110 transition-all">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
