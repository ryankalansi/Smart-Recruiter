import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const [user, setUser] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //  Cek jika user login
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Login events
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser && updatedUser !== "undefined") {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (error) {
          console.error("Error parsing updated user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("userLoggedIn", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCTAClick = () => {
    if (!user) {
      setShowLoginAlert(true);

      // Auto hide alert setelah 3 detik
      setTimeout(() => {
        setShowLoginAlert(false);
      }, 3000);

      // Redirect ke login setelah muncul alert
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      // jika user sudah login, arahkan ke upload page
      navigate("/upload");
    }
  };

  return (
    <section className="bg-blue-600 py-12 md:py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Siap Meningkatkan CV anda?
        </h2>
        <p className="text-blue-100 mb-8">
          Biarkan AI kami membantu Anda mendapatkan pekerjaan impian dengan CV
          yang optimal
        </p>

        {/* Login Alert */}
        {showLoginAlert && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg inline-block">
            <p className="text-sm font-medium">
              Silakan login terlebih dahulu untuk menggunakan layanan kami
            </p>
          </div>
        )}

        <button
          onClick={handleCTAClick}
          className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-md cursor-pointer transition-colors"
        >
          Mulai Sekarang - Gratis!
        </button>
      </div>
    </section>
  );
};
