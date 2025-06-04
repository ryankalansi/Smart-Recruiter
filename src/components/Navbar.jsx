import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek apakah user sudah login
    const storedUser = localStorage.getItem("user");
    // Hapus atau komentari log data sensitif
    // console.log("Stored user from localStorage:", storedUser);

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Hapus atau komentari log data sensitif
        // console.log("Parsed user data:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error); // Tetap penting untuk debugging
        // Bersihkan localStorage jika data rusak
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    // Listen untuk perubahan localStorage (untuk real-time update)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser && updatedUser !== "undefined") {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (error) {
          console.error("Error parsing updated user data:", error); // Tetap penting
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Listen untuk custom event yang kita trigger setelah login
    window.addEventListener("userLoggedIn", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function untuk handle navigation yang berbeda tergantung current page
  const handleNavClick = (section) => {
    setIsOpen(false); // Tutup menu mobile setelah klik

    // Jika sedang di landing page, scroll ke section
    if (location.pathname === "/") {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Jika sedang di page lain, navigate ke landing page dengan hash
      navigate(`/#${section}`);

      // Setelah navigate, tunggu sebentar lalu scroll ke section
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  // Function untuk handle Home navigation
  const handleHomeClick = () => {
    setIsOpen(false);

    // Jika sudah di landing page, scroll ke home section
    if (location.pathname === "/") {
      const element = document.getElementById("home");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Jika di page lain, navigate ke landing page
      navigate("/");
    }
  };

  // Redirect ke landing page saat logo diklik
  const handleLogoClick = () => {
    setIsOpen(false);

    // Jika sudah di landing page, scroll ke home section
    if (location.pathname === "/") {
      const element = document.getElementById("home");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Jika di page lain, navigate ke landing page
      navigate("/");
    }
  };

  // Redirect ke halaman login saat tombol login diklik
  const handleLoginClick = () => {
    navigate("/login");
    setIsOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsOpen(false);
    // Refresh halaman untuk memastikan state ter-reset
    window.location.reload();
  };

  // Function untuk mendapatkan nama yang akan ditampilkan
  const getDisplayName = () => {
    if (!user) return "";

    if (user.name && user.name.trim()) {
      return user.name;
    }

    if (user.email) {
      // Ambil bagian sebelum @ dari email sebagai fallback
      return user.email.split("@")[0];
    }

    return "User";
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
        isScrolled
          ? "bg-white bg-opacity-20 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer"
            >
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-2">
                  AI
                </div>
                <span className="font-semibold text-lg text-gray-900">
                  Smart Recruiter
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-4 items-center">
            <button
              onClick={handleHomeClick}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("fitur")}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer"
            >
              Fitur
            </button>
            <button
              onClick={() => handleNavClick("kontak")}
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium cursor-pointer"
            >
              Kontak
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 px-3 py-2 text-sm font-medium">
                  Hi, {getDisplayName()}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm cursor-pointer"
              >
                Login
              </button>
            )}
          </nav>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2">
          <button
            onClick={handleHomeClick}
            className="block text-gray-700 hover:text-gray-900 py-2 text-sm font-medium cursor-pointer w-full text-left"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("fitur")}
            className="block text-gray-700 hover:text-gray-900 py-2 text-sm font-medium cursor-pointer w-full text-left"
          >
            Fitur
          </button>
          <button
            onClick={() => handleNavClick("kontak")}
            className="block text-gray-700 hover:text-gray-900 py-2 text-sm font-medium cursor-pointer w-full text-left"
          >
            Kontak
          </button>

          {user ? (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-gray-700 py-2 text-sm font-medium">
                Hi, {getDisplayName()}!
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md text-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};
