import { useState } from "react";
import { HiEye, HiEyeOff, HiLockClosed, HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Reset
  };

  const handleLogin = async () => {
    try {
      // Di sini akan memanggil API login
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulasi pengecekan user terdaftar
      const isUserRegistered = false; // Ganti dengan response dari API

      if (!isUserRegistered) {
        setError("Akun belum terdaftar. Silakan daftar terlebih dahulu.");
        return;
      }

      // Jika login berhasil, redirect ke dashboard atau halaman utama
      console.log("Login berhasil:", formData);
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  };

  const switchToRegister = () => {
    navigate("/register");
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* kembali ke halaman utama */}
      <button
        onClick={goToHome}
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <HiArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Beranda
      </button>

      {/* Background */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-300 rounded-full opacity-15"></div>
      <div className="absolute top-1/3 right-10 w-4 h-4 bg-blue-400 rounded-full"></div>
      <div className="absolute bottom-1/3 left-20 w-6 h-6 bg-blue-400 rounded-full opacity-40"></div>

      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <HiLockClosed className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Masuk ke Smart Recruiter
          </h1>
          <p className="text-gray-600 text-sm">
            Analisis CV dengan kekuatan AI
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Login */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password Anda"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <button className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer">
            Lupa password?
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Belum punya akun?{" "}
            <button
              onClick={switchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
