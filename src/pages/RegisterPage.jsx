import { useState } from "react";
import { HiEye, HiEyeOff, HiUser, HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear specific error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap harus diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    return newErrors;
  };

  const handleRegister = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Hapus atau komentari log data sensitif
      // console.log("Sending data:", {
      //   name: formData.fullName,
      //   email: formData.email,
      //   password: formData.password, // TIDAK PERNAH log password!
      // });

      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      // console.log("Response status:", response.status); // Ini bisa tetap ada jika tidak terlalu verbose

      if (!response.ok) {
        let errorMessage = "Registrasi gagal";

        try {
          const result = await response.json();
          errorMessage = result.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          errorMessage = `Server error (${response.status})`;
        }

        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
        // Hapus atau komentari log data sensitif
        // console.log("Response body:", result);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Invalid response from server");
      }

      // Hapus atau komentari log data sensitif
      // console.log("Registrasi berhasil:", result);

      // Simpan token jika ada
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      // Redirect ke login dengan pesan sukses
      navigate("/login", {
        state: {
          message: "Registrasi berhasil! Silakan login dengan akun anda.",
        },
      });
    } catch (error) {
      console.error("Registration error:", error); // Tetap penting untuk debugging error
      setErrors({
        general:
          error.message ||
          "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    navigate("/login");
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <button
        onClick={goToHome}
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <HiArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Beranda
      </button>

      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-300 rounded-full opacity-15"></div>
      <div className="absolute top-1/3 right-10 w-4 h-4 bg-blue-400 rounded-full"></div>
      <div className="absolute bottom-1/3 left-20 w-6 h-6 bg-blue-400 rounded-full opacity-40"></div>

      <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <HiUser className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Buat Akun Baru
          </h1>
          <p className="text-gray-600 text-sm">
            Bergabung dan analisis CV dengan AI
          </p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {errors.general}
          </div>
        )}

        {/* Register Form */}
        <div className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap Anda"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.fullName ? "border-red-300" : "border-gray-200"
              }`}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

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
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.email ? "border-red-300" : "border-gray-200"
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
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
                placeholder="Minimal 8 karakter"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 ${
                  errors.password ? "border-red-300" : "border-gray-200"
                }`}
                disabled={isLoading}
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Ulangi password Anda"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-200"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-6 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Mendaftar...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Sudah punya akun?{" "}
            <button
              onClick={switchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
              disabled={isLoading}
            >
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
