import React, { useState } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { setAuthData } from "@/hooks/use-auth";
import FormInput from '@/components/ui/form-input';

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const res = await apiRequest("POST", "/login/", {
        username: data.identifier,
        password: data.password
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const result = await res.json();

      if (result.success && result.data && result.data.tokens) {
        const userGroups = result.data.user.groups || [];
        if (!userGroups.includes('customer')) {
          throw new Error("Access denied. Only customers can access this portal.");
        }

        setAuthData({
          user: result.data.user,
          token: result.data.tokens.access,
          refreshToken: result.data.tokens.refresh
        });
        setLocation("/home");
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 lg:bg-slate-100">

      {/* 
        --- ADAPTIVE CONTAINER ---
        Switches between split-screen (lg) and hero-card (mobile)
      */}
      <div className="w-full lg:max-w-7xl flex flex-col lg:flex-row bg-white lg:rounded-[2.5rem] overflow-hidden lg:shadow-2xl min-h-screen lg:min-h-[85vh]">

        {/* --- HERO SECTION / LEFT PANEL --- */}
        <div className="lg:w-[50%] relative overflow-hidden flex flex-col justify-end lg:justify-between p-8 lg:p-16 min-h-[42vh] lg:min-h-[400px]">

          {/* 
            Global Unified Background Image
          */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200')`,
              zIndex: 0
            }}
          />

          {/* Gradient Overlays (z-10) */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-[#07A27D] to-[#1D548B] opacity-85" style={{ zIndex: 10 }} />
          <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" style={{ zIndex: 10 }} />

          {/* Content Layer (z-20) */}
          <div className="relative" style={{ zIndex: 20 }}>
            {/* Desktop Branding */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <span className="text-white text-2xl font-black tracking-tight">AIWO <span className="font-normal opacity-80">Health</span></span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 lg:max-w-md">
                Your health journey starts with understanding your body.
              </h1>
              <p className="text-white/80 text-lg font-medium lg:max-w-sm">
                Join thousands of users who are taking control of their wellness with AIWO's comprehensive biomarker analysis.
              </p>
            </div>

            {/* Mobile Branding */}
            <div className="lg:hidden pb-12">
              <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-2">AIWO</h1>
              <p className="text-white/90 font-bold text-lg mb-12 tracking-wide">Smart Health Testing</p>
              <h2 className="text-4xl font-extrabold text-white leading-tight max-w-[300px]">
                Your health journey <br /> starts here.
              </h2>
            </div>
          </div>

          {/* Desktop Stats (z-20) */}
          <div className="relative hidden lg:grid grid-cols-2 gap-8 pt-12 border-t border-white/20 lg:max-w-md" style={{ zIndex: 20 }}>
            <div className="space-y-1">
              <span className="text-3xl font-black text-white block">100+</span>
              <span className="text-white/60 text-sm font-bold uppercase tracking-wider">Health Parameters</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-white block">50k+</span>
              <span className="text-white/60 text-sm font-bold uppercase tracking-wider">Users Trusted</span>
            </div>
          </div>
        </div>

        {/* --- FORM SECTION / RIGHT PANEL --- */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-20 bg-white relative -mt-12 lg:mt-0 rounded-t-[3.5rem] lg:rounded-none" style={{ zIndex: 30 }}>
          <div className="max-w-[440px] mx-auto w-full">

            {/* 
                UNIFIED PROJECT COLOR: Tabs & Buttons 
                Now using Navy Blue (#1D548B) for both Mobile and Desktop
            */}
            <div className="lg:hidden bg-slate-50 p-1.5 rounded-2xl flex items-center mb-12 border border-slate-100">
              <Link href="/login" className="flex-1">
                <span className="block w-full text-center py-4 rounded-xl text-base font-black bg-[#1D548B] text-white shadow-xl shadow-[#1D548B]/30 transition-all">
                  Sign In
                </span>
              </Link>
              <Link href="/register" className="flex-1">
                <span className="block w-full text-center py-4 rounded-xl text-base font-black text-slate-400">
                  Register
                </span>
              </Link>
            </div>

            {/* Desktop Heading */}
            <div className="hidden lg:block mb-12">
              <h2 className="text-4xl font-black text-[#0f1115] mb-3 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 text-lg font-medium">Please enter your details to sign in.</p>
            </div>

            <form className="space-y-6 lg:space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                variant="medical"
                label="Email Address"
                icon={Mail}
                placeholder="name@example.com"
                error={errors.identifier?.message as string}
                {...register("identifier", { required: "Email or username is required" })}
              />

              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1 px-1">
                  <label className="text-[0.95rem] font-bold text-slate-700">Password</label>
                  <Link href="/forgot-password">
                    <a className="text-sm font-bold text-[#1D548B] hover:underline">Forgot?</a>
                  </Link>
                </div>
                <div className="relative">
                  <FormInput
                    variant="medical"
                    // type={showPassword ? "text" : "password"}
                    icon={Lock}
                    placeholder="••••••••"
                    error={errors.password?.message as string}
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1D548B] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-bold text-center">
                  {loginError}
                </div>
              )}

              {/* UNIFIED ACTION BUTTON (Navy Blue #1D548B) */}
              <button
                disabled={isLoading}
                className="w-full bg-[#1D548B] hover:brightness-105 text-white py-5 rounded-[1.25rem] font-black text-xl lg:text-lg transition-all active:scale-95 shadow-2xl shadow-[#1D548B]/15 mt-4 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Sign In →"}
              </button>
            </form>

            <div className="mt-16 text-center">
              <p className="text-slate-500 font-medium">
                Don't have an account? <Link href="/register" className="text-[#1D548B] font-black hover:underline underline-offset-4 pl-1">Register now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
