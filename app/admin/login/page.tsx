"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useAdminLang } from "@/context/AdminLangContext";
import { Coffee, Eye, EyeOff } from "lucide-react";

type LoginForm = { email: string; password: string };

function LoginPage() {
  const { user, signIn } = useAuth();
  const { lang, setLang, t } = useAdminLang();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (user) router.replace("/admin");
  }, [user, router]);

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      router.replace("/admin");
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === "en" ? "th" : "en")}
        className="fixed top-4 right-4 text-xs px-3 py-1.5 rounded border border-[#3a3a3a] text-[#888] hover:text-[#f0ece4] hover:border-[#d4a853] transition-colors"
      >
        {lang === "en" ? "TH" : "EN"}
      </button>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 flex items-center justify-center mb-4">
            <Coffee size={26} className="text-[#d4a853]" />
          </div>
          <h1 className="text-xl font-semibold text-[#f0ece4]">{t("adminLogin")}</h1>
          <p className="text-sm text-[#666] mt-1">{t("managementSubtitle")}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 space-y-4"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#888]">{t("email")}</label>
            <input
              type="email"
              autoComplete="email"
              {...register("email", { required: true })}
              className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded-lg px-3.5 py-2.5 text-sm text-[#f0ece4] placeholder-[#555] focus:outline-none focus:border-[#d4a853] transition-colors"
              placeholder="admin@jiknaam.com"
            />
            {errors.email && <p className="text-xs text-red-400">{t("emailRequired")}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#888]">{t("password")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password", { required: true })}
                className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded-lg px-3.5 py-2.5 pr-10 text-sm text-[#f0ece4] placeholder-[#555] focus:outline-none focus:border-[#d4a853] transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{t("passwordRequired")}</p>}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#d4a853] hover:bg-[#c49a3c] disabled:opacity-50 text-[#0d0d0d] font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            {isLoading ? t("signingIn") : t("signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <LoginPage />;
}
