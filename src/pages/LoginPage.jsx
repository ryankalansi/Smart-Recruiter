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

  // Check if there is a successfull message from registration
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
      setError("Email and password must be filed in");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://smart-recruiter-five.vercel.app/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Login failed";

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
      } catch (jsonError) {
        console.error("Error parsing success JSON:", jsonError);
        throw new Error("Invalid response from server");
      }

      // Save token
      if (data.data) {
        localStorage.setItem("token", data.data);
      }

      // Decode JWT to get user info
      if (data.data) {
        try {
          // Decode JWT payload (base64)
          const tokenParts = data.data.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));

            // Save user info from token
            const userData = {
              email: payload.email,
              name: payload.name || payload.email.split("@")[0], // fallback if there is no name
              id: payload.id || payload.userId,
            };

            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError); // Important for debugging
          // Fallback: just save the email if there is a problem with the token
          const fallbackUser = {
            email: formData.email,
            name: formData.email.split("@")[0],
          };
          localStorage.setItem("user", JSON.stringify(fallbackUser));
        }
      }

      // Trigger event for update navbar and other components
      window.dispatchEvent(new Event("userLoggedIn"));

      // Redirect to main page
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error); // Important for debugging
      setError(
        error.message || "An error occurred during login. Please try again."
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
      {/* Back to home */}
      <button
        onClick={goToHome}
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
      >
        <HiArrowLeft className="w-5 h-5 mr-2 " />
        Back to Home
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
            Login to Smart Recruiter
          </h1>
          <p className="text-gray-600 text-sm">
            CV analysis with the power of AI
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
              placeholder="Enter your email address"
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
                placeholder="Enter your password"
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
                  <HiEyeOff className="w-5 h-5 cursor-pointer" />
                ) : (
                  <HiEye className="w-5 h-5 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Login...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200 ">
          <p className="text-gray-600 text-sm">
            Don't have an account yet?{" "}
            <button
              onClick={switchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              disabled={isLoading}
            >
              Register now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
