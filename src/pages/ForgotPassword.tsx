import React, { useState } from 'react';
import { Mail, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import FormInput from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [, setLocation] = useLocation();
    const { showToast } = useToast();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            // endpoint: /forgot-password/
            // payload: { "email": "..." }
            const res = await apiRequest("POST", "/forgot-password/", {
                email: data.email
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || "Request failed. Please try again.");
            }

            setIsSuccess(true);
            showToast("Password reset link sent to your email", "success");
        } catch (error: any) {
            console.error("Forgot password error:", error);
            setErrorMessage(error.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 lg:bg-slate-100">
            <div className="w-full lg:max-w-7xl flex flex-col lg:flex-row bg-white lg:rounded-[2.5rem] overflow-hidden lg:shadow-2xl min-h-screen lg:min-h-[85vh]">

                {/* --- LEFT PANEL --- */}
                <div className="lg:w-[50%] relative overflow-hidden flex flex-col justify-end lg:justify-between p-8 lg:p-16 min-h-[42vh] lg:min-h-[400px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200')`,
                            zIndex: 0
                        }}
                    />
                    <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-[#07A27D] to-[#1D548B] opacity-85" style={{ zIndex: 10 }} />
                    <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" style={{ zIndex: 10 }} />

                    <div className="relative" style={{ zIndex: 20 }}>
                        <div className="hidden lg:block">
                            <div className="flex items-center gap-3 mb-16">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                    <ShieldCheck className="text-white w-6 h-6" />
                                </div>
                                <span className="text-white text-2xl font-black tracking-tight">AIWO <span className="font-normal opacity-80">Health</span></span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 lg:max-w-md">
                                Regain access to your health dashboard.
                            </h1>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT PANEL --- */}
                <div className="flex-1 flex flex-col justify-center p-8 lg:p-20 bg-white relative -mt-12 lg:mt-0 rounded-t-[3.5rem] lg:rounded-none" style={{ zIndex: 30 }}>
                    <div className="max-w-[440px] mx-auto w-full">

                        <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1D548B] font-bold mb-8 transition-colors group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>

                        <div className="mb-12">
                            <h2 className="text-4xl font-black text-[#0f1115] mb-3 tracking-tight">Forgot Password?</h2>
                            <p className="text-slate-500 text-lg font-medium">Enter your email and we'll send you a link to reset your password.</p>
                        </div>

                        {!isSuccess ? (
                            <form className="space-y-6 lg:space-y-8" onSubmit={handleSubmit(onSubmit)}>
                                <FormInput
                                    variant="medical"
                                    label="Email Address"
                                    icon={Mail}
                                    placeholder="name@example.com"
                                    error={errors.email?.message as string}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />

                                {errorMessage && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-bold text-center">
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    disabled={isLoading}
                                    className="w-full bg-[#1D548B] hover:brightness-105 text-white py-5 rounded-[1.25rem] font-black text-xl lg:text-lg transition-all active:scale-95 shadow-2xl shadow-[#1D548B]/15 mt-4 flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Reset Password →"}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-green-50 border border-green-100 rounded-[2rem] p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Mail className="text-green-600 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-green-900 mb-2">Check your email</h3>
                                <p className="text-green-700 font-medium mb-8">
                                    We have sent a password reset link to your email address.
                                </p>
                                <button
                                    onClick={() => setLocation("/login")}
                                    className="text-[#1D548B] font-black hover:underline underline-offset-4"
                                >
                                    Return to Login
                                </button>
                            </div>
                        )}

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

export default ForgotPassword;
