import React, { useState } from 'react';
import { Mail, Lock, User, Users, Phone, Loader2 } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Link } from 'wouter';
import { registerSchema, RegisterSchema } from '@/schemas/validation';

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);
    console.log("Register data:", data);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex justify-center items-center py-20">
      <div className="glass-card w-full max-w-[450px] text-center p-8">
        <h2 className="text-[2rem] font-bold mb-2 text-white">Create Account</h2>
        <p className="text-text-grey mb-8">Start your personalized health journey today</p>

        <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-field">
            <label className="text-white mb-2 block font-medium">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                {...register("full_name")}
                type="text"
                placeholder="John Doe"
                className={`w-full bg-slate-950/50 text-white pl-12 pr-4 py-3 border rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-teal/50 transition-all ${errors.full_name ? 'border-red-500' : 'border-slate-800'}`}
              />
            </div>
            {errors.full_name && <p className="text-red-400 text-sm mt-1">{errors.full_name.message}</p>}
          </div>

          <div className="input-field">
            <label className="text-white mb-2 block font-medium">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-slate-950/50 text-white pl-12 pr-4 py-3 border rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-teal/50 transition-all ${errors.email ? 'border-red-500' : 'border-slate-800'}`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="input-field">
            <label className="text-white mb-2 block font-medium">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                {...register("phone_number")}
                type="tel"
                placeholder="+91 9876543210"
                className={`w-full bg-slate-950/50 text-white pl-12 pr-4 py-3 border rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-teal/50 transition-all ${errors.phone_number ? 'border-red-500' : 'border-slate-800'}`}
              />
            </div>
            {errors.phone_number && <p className="text-red-400 text-sm mt-1">{errors.phone_number.message}</p>}
          </div>

          <div className="input-field">
            <label className="text-white mb-2 block font-medium">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={`w-full bg-slate-950/50 text-white pl-12 pr-4 py-3 border rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-teal/50 transition-all ${errors.password ? 'border-red-500' : 'border-slate-800'}`}
              />
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="input-field">
            <label className="text-white mb-2 block font-medium">Gender</label>
            <div className="relative">
              <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                {...register("gender")}
                className={`w-full bg-slate-950/50 text-white pl-12 pr-4 py-3 border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary-teal/50 transition-all ${errors.gender ? 'border-red-500' : 'border-slate-800'}`}
              >
                <option value="" className="text-slate-500">Select Gender</option>
                <option value="Male" className="text-slate-900 bg-white">Male</option>
                <option value="Female" className="text-slate-900 bg-white">Female</option>
                <option value="Other" className="text-slate-900 bg-white">Other</option>
              </select>
            </div>
            {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender.message}</p>}
          </div>

          <button disabled={isLoading} className="premium-gradient-btn w-full justify-center py-[14px] mt-3 flex items-center gap-2">
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-text-grey text-[0.9rem]">
          Already have an account? <Link href="/login" className="text-accent-teal no-underline font-semibold hover:brightness-110 transition-all">Login</Link>
        </p>
      </div >
    </div >
  );
};

export default RegisterPage;
