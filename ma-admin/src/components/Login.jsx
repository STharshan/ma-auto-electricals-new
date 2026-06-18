import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Zap, Shield } from "lucide-react";

export default function Login({ url }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        if (data.role !== "admin") {
          toast.error("Admin access required.");
          return;
        }
        toast.success("Login successful!");
        navigate("/list/product");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Green top bar */}
        <div className="h-1.5 bg-gradient-to-r from-green-600 to-green-400" />

        <div className="px-8 pt-8 pb-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-3 shadow-sm overflow-hidden">
              <img
                src="/logo.png"
                alt="MA Auto Electrics"
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  // fallback if logo.png not found
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div style={{ display: "none" }} className="w-full h-full items-center justify-center bg-green-700 rounded-2xl">
                <span className="text-white font-black text-2xl">MA</span>
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-800 tracking-tight">MA Auto Electrics</h1>

            {/* Admin Portal Badge */}
            <div className="mt-2 flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1">
              <Shield size={12} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Admin Portal</span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Secure Sign In</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@mautoElectrics.com"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none pr-11 transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg mt-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={16} />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Restricted to authorised personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
