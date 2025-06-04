import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import womanSmiling from "../assets/woman-smiling.jpg";

export const HeroSection = () => {
  const [user, setUser] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek jika user login
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
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

  const handleUploadClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginAlert(true);

      // Auto hide alert setelah 3 detik
      setTimeout(() => {
        setShowLoginAlert(false);
      }, 3000);

      // Redirect ke login setelah menampilkan alert
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      // jika user sudah login, arahkan ke upload page
      navigate("/upload");
    }
  };

  return (
    <section className="bg-blue-50 pt-32 pb-12 md:pt-40 md:pb-16" id="home">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sistem Evaluasi CV Otomatis Berbasis AI
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Tingkatkan peluang karir Anda dengan analisis CV berbasis AI.
            Dapatkan skor, rekomendasi perbaikan, dan temukan pekerjaan yang
            cocok untuk kualifikasi Anda.
          </p>

          {/* Login Alert */}
          {showLoginAlert && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">
                Silakan login terlebih dahulu untuk mengupload CV Anda
              </p>
            </div>
          )}

          <Link
            to={user ? "/upload" : "/login"}
            onClick={handleUploadClick}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md text-sm transition-colors"
          >
            Upload CV sekarang
            <FaUpload className="ml-2 w-4 h-4" />
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="w-full max-w-md relative">
            <img
              src={womanSmiling}
              alt="woman smiling"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
