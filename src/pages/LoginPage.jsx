import { useState, useEffect } from "react";
import { HiEye, HiEyeOff, HiLockClosed, HiArrowLeft } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Cek apakah ada pesan sukses dari registrasi
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi");
      return;
    }

    setIsLoading(true);

    try {
      // Hapus atau komentari log data sensitif
      // console.log("Attempting login with:", { email: formData.email });

      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      // console.log("Response status:", response.status); // Boleh tetap ada

      if (!response.ok) {
        let errorMessage = "Login gagal";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing error JSON:", jsonError);
          errorMessage = `Server error (${response.status})`;
        }

        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
        // Hapus atau komentari log data sensitif
        // console.log("Login berhasil:", data);
      } catch (jsonError) {
        console.error("Error parsing success JSON:", jsonError);
        throw new Error("Invalid response from server");
      }

      // Simpan token
      if (data.data) {
        localStorage.setItem("token", data.data);
      }

      // Decode JWT untuk mendapatkan user info
      if (data.data) {
        try {
          // Decode JWT payload (base64)
          const tokenParts = data.data.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            // Hapus atau komentari log data sensitif
            // console.log("Decoded token payload:", payload);

            // Simpan user data dari token
            const userData = {
              email: payload.email,
              name: payload.name || payload.email.split("@")[0], // fallback jika tidak ada name
              id: payload.id || payload.userId,
            };

            localStorage.setItem("user", JSON.stringify(userData));
            // Hapus atau komentari log data sensitif
            // console.log("User data saved:", userData);
          }
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError); // Tetap penting untuk debugging
          // Fallback: simpan email saja jika ada masalah dengan token
          const fallbackUser = {
            email: formData.email,
            name: formData.email.split("@")[0],
          };
          localStorage.setItem("user", JSON.stringify(fallbackUser));
        }
      }

      // Trigger event untuk update navbar dan components lain
      window.dispatchEvent(new Event("userLoggedIn"));

      // Redirect ke halaman utama
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error); // Tetap penting untuk debugging error
      setError(
        error.message || "Terjadi kesalahan saat login, silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
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

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
              disabled={isLoading}
              required
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
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
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
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Masuk...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <button className="text-blue-600 hover:text-blue-700 text-sm">
            Lupa password?
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Belum punya akun?{" "}
            <button
              onClick={switchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={isLoading}
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
