import React, { useState } from 'react';
import { Mail, Lock, User, Users, Phone, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation } from 'wouter';
import { registerSchema, RegisterSchema } from '@/schemas/validation';
import FormInput from '@/components/ui/form-input';
import PhoneInput from '@/components/ui/PhoneInput';

import { apiRequest } from '@/lib/queryClient';

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setRegisterError] = useState("");
  const [, setLocation] = useLocation();

  const { register, handleSubmit, control, formState: { errors } } = useForm<any>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setRegisterError("");

    try {
      // Split full name into first and last
      const nameParts = data.full_name.trim().split(/\s+/);
      const firstName = nameParts[0] || "Public";
      const lastName = nameParts.slice(1).join(" ") || "User";

      const payload = {
        username: data.username || data.email.split('@')[0], // Fallback if username missing
        email: data.email,
        password: data.password,
        password2: data.password,
        first_name: firstName,
        last_name: lastName,
        phone_number: data.phone_number,
      };

      const res = await apiRequest("POST", "/public/register/", payload);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Registration failed. Please try again.");
      }

      // Success
      setLocation("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegisterError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 lg:bg-slate-100">

      {/* --- ADAPTIVE CONTAINER --- */}
      <div className="w-full lg:max-w-7xl flex flex-col lg:flex-row bg-white lg:rounded-[2.5rem] overflow-hidden lg:shadow-2xl min-h-screen lg:min-h-[85vh]">

        {/* --- HERO SECTION / LEFT PANEL --- */}
        <div className="lg:w-[45%] relative overflow-hidden flex flex-col justify-end lg:justify-between p-8 lg:p-16 min-h-[42vh] lg:min-h-[400px]">

          {/* Robust Unified Background Image (z-0) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200')`,
              zIndex: 0
            }}
          />

          {/* Overlays (z-10) */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-[#1D548B] to-[#07A27D] opacity-85" style={{ zIndex: 10 }} />
          <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" style={{ zIndex: 10 }} />

          {/* Content (z-20) */}
          <div className="relative" style={{ zIndex: 20 }}>
            {/* Desktop Branding Content */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <span className="text-white text-2xl font-black tracking-tight">AIWO <span className="font-normal opacity-80">Health</span></span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 lg:max-w-md">
                Expert healthcare at your fingertips.
              </h1>
              <p className="text-white/80 text-lg font-medium lg:max-w-sm">
                Create your AIWO account today to track biomarkers, schedule tests, and get expert reviews on your health data.
              </p>
            </div>

            {/* Mobile Branding Content */}
            <div className="lg:hidden pb-12">
              <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-2">AIWO</h1>
              <p className="text-white/90 font-bold text-lg mb-12 tracking-wide">Smart Health Testing</p>
              <h2 className="text-4xl font-extrabold text-white leading-tight max-w-[300px]">
                Your health journey <br /> starts here.
              </h2>
            </div>
          </div>

          {/* Desktop Footer (z-20) */}
          <div className="relative hidden lg:grid grid-cols-2 gap-8 pt-12 border-t border-white/20 lg:max-w-sm" style={{ zIndex: 20 }}>
            <div className="space-y-1">
              <span className="text-3xl font-black text-white block">24/7</span>
              <span className="text-white/60 text-sm font-bold uppercase tracking-wider">Lab Support</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-white block">Fast</span>
              <span className="text-white/60 text-sm font-bold uppercase tracking-wider">Report Delivery</span>
            </div>
          </div>
        </div>

        {/* --- FORM SECTION / RIGHT PANEL --- */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 bg-white relative -mt-12 lg:mt-0 rounded-t-[3.5rem] lg:rounded-none overflow-y-auto" style={{ zIndex: 30 }}>
          <div className="max-w-[480px] mx-auto w-full py-10 lg:py-0">

            {/* 
                UNIFIED PROJECT COLOR: Tabs & Buttons 
                Now using Navy Blue (#1D548B) for both Mobile and Desktop
            */}
            <div className="lg:hidden bg-slate-50 p-1.5 rounded-2xl flex items-center mb-12 border border-slate-100">
              <Link href="/login" className="flex-1">
                <span className="block w-full text-center py-4 rounded-xl text-base font-black text-slate-400">
                  Sign In
                </span>
              </Link>
              <Link href="/register" className="flex-1">
                <span className="block w-full text-center py-4 rounded-xl text-base font-black bg-[#1D548B] text-white shadow-xl shadow-[#1D548B]/30 transition-all">
                  Register
                </span>
              </Link>
            </div>

            {/* Desktop Heading */}
            <div className="hidden lg:block mb-10 text-left">
              <h2 className="text-4xl font-black text-[#0f1115] mb-3 tracking-tight">Create Account</h2>
              <p className="text-slate-500 text-lg font-medium">Join us for a smarter health journey.</p>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-bold text-center">
                {formError}
              </div>
            )}

            <form className="space-y-6 lg:space-y-7" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-5">
                <FormInput
                  variant="medical"
                  label="Username"
                  icon={User}
                  placeholder="johndoe123"
                  error={errors.username?.message as string}
                  {...register("username", { required: "Username is required" })}
                />
                <FormInput
                  variant="medical"
                  label="Full Name"
                  icon={User}
                  placeholder="John Doe"
                  error={errors.full_name?.message as string}
                  {...register("full_name")}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-5">
                <FormInput
                  variant="medical"
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  placeholder="name@example.com"
                  error={errors.email?.message as string}
                  {...register("email")}
                />
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      variant="medical"
                      label="Phone Number"
                      style={{ height: "55px", marginTop: "5px" }}
                      value={field.value}
                      error={errors.phone_number?.message as string}
                      onChange={(fullNumber) => {
                        field.onChange(fullNumber);
                      }}
                    />
                  )}
                />
              </div>

              <div className="relative space-y-2">
                <label className="text-[0.95rem] font-bold text-slate-700 px-1">Password</label>
                <div className="relative">
                  <FormInput
                    variant="medical"
                    // type={showPassword ? "text" : "password"}
                    icon={Lock}
                    placeholder="Create a password"
                    error={errors.password?.message as string}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <FormInput
                variant="medical"
                label="Gender"
                isSelect
                icon={Users}
                placeholder="Select Gender"
                error={errors.gender?.message as string}
                options={[
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                  { label: 'Other', value: 'Other' }
                ]}
                {...register("gender")}
              />

              <p className="text-center text-sm lg:text-xs text-slate-400 leading-relaxed px-4 pt-4">
                By creating an account, you agree to our <a href="#" className="text-[#1D548B] font-black hover:underline underline-offset-4">Privacy Policy</a> and <a href="#" className="text-[#1D548B] font-black hover:underline underline-offset-4">Terms</a>.
              </p>

              {/* UNIFIED ACTION BUTTON (Navy Blue #1D548B) */}
              <button
                disabled={isLoading}
                className="w-full bg-[#1D548B] hover:brightness-105 text-white py-5 rounded-[1.25rem] font-black text-xl lg:text-lg transition-all active:scale-95 shadow-2xl shadow-[#1D548B]/15 mt-4 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                  <span className="text-xl font-black">Get Started →</span>
                )}
              </button>
            </form>

            <div className="mt-14 text-center">
              <p className="text-slate-500 font-medium text-[1.05rem]">
                Already have an account? <Link href="/login" className="text-[#1D548B] font-black hover:underline underline-offset-4 pl-1">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
