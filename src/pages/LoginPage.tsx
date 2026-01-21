import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { setAuthData } from "@/hooks/use-auth";

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-medium text-slate-300 mb-1.5">{children}</label>
  );

  const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
    <div className="relative">
      <input
        ref={ref}
        {...props}
        className={`w-full bg-slate-950/50 text-white px-4 py-3 border rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-teal/50 transition-all ${props.className}`}
      />
    </div>
  ));

  return (
    <div className="flex justify-center items-center py-20 min-h-[80vh]">
      <div className="glass-card w-full max-w-[450px] text-center p-8">
        <h2 className="text-[2rem] font-bold mb-2 text-white">Welcome Back</h2>
        <p className="text-text-grey mb-8">Enter your credentials to access your portal</p>

        <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>Email, Username, or Phone</Label>
            <Input
              {...register("identifier", { required: "This field is required" })}
              type="text"
              placeholder="e.g. you@example.com or +91..."
              className={errors.identifier ? "border-red-500" : "border-slate-800"}
            />
            {errors.identifier && (
              <p className="text-sm text-red-400 mt-1">{errors.identifier.message as string}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="••••••••"
                className={errors.password ? "border-red-500" : "border-slate-800"}
              />
              <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 mt-1">{errors.password.message as string}</p>
            )}
          </div>

          {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}

          <button
            disabled={isLoading}
            className="premium-gradient-btn w-full justify-center py-[14px] mt-3 flex items-center gap-2 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            Sign In
          </button>
        </form>

        <p className="mt-6 text-text-grey text-[0.9rem]">
          Don't have an account? <Link href="/register" className="text-accent-teal no-underline font-semibold hover:brightness-110 transition-all">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
