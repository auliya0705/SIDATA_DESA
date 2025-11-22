"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { getApiUrl, API_ENDPOINTS } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // ✅ FIXED: Menggunakan getApiUrl + API_ENDPOINTS
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUTH.LOGIN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({
          general:
            result.message || "Login gagal. Periksa email dan password Anda.",
        });
        setLoading(false);
        return;
      }

      if (result.status === "success" && result.data) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        console.log("✅ Login berhasil:", result.data.user);
        router.push("/admin/dashboard");
      } else {
        setErrors({ general: "Format response tidak valid" });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setErrors({
        general: "Tidak dapat terhubung ke server. Pastikan backend berjalan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {/* Background Image - FULLSCREEN */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg2.jpeg"
          alt="Desa Background"
          fill
          className="object-cover"
          priority
        />

        {/* GRADIENT OVERLAY - SOLID LEFT → TRANSPARENT RIGHT */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700 via-teal-700/80 to-transparent"></div>
      </div>

      {/* Form Container - LEFT */}
      <div className="relative z-10 w-full flex">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 lg:px-20 py-12">
          {/* Logo & Title - LEFT TOP */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-14 h-14 bg-white rounded-full p-2.5 flex-shrink-0">
              <Image
                src="/images/logo2.png"
                alt="Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SIDATA DESA</h1>
            </div>
          </div>

          {/* Login Title - BIG & LEFT */}
          <h2 className="text-6xl font-bold text-white mb-10">Login</h2>

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          {/* Form - LEFT aligned, WIDE */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            {/* Email */}
            <div>
              <label className="flex items-center text-white text-sm font-medium mb-3">
                <Mail size={18} className="mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admindesaku@gmail.com"
                className={`
                  w-full px-5 py-3.5 rounded-xl bg-white/90 text-gray-800
                  placeholder:text-gray-500
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  ${errors.email ? "border-2 border-red-400" : "border-0"}
                `}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-200">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center text-white text-sm font-medium mb-3">
                <Lock size={18} className="mr-2" />
                Kata sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••••"
                  className={`
                    w-full px-5 py-3.5 pr-12 rounded-xl bg-white/90 text-gray-800
                    placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-white/50
                    ${errors.password ? "border-2 border-red-400" : "border-0"}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-200">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 mr-2 rounded border-white/50 text-teal-700 focus:ring-white/50"
                />
                Ingat saya?
              </label>
              <a href="#" className="text-white hover:underline">
                Lupa kata sandi?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 px-4 rounded-xl font-semibold text-base
                bg-teal-800/70 hover:bg-teal-900/80 text-white
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2
                mt-8
              "
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - Empty (background shows through gradient) */}
        <div className="hidden lg:block lg:w-1/2"></div>
      </div>
    </div>
  );
}
