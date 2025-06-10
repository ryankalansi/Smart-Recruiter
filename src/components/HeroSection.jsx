import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import womanSmiling from "../assets/woman-smiling.jpg";

export const HeroSection = () => {
  const [user, setUser] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
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

      // Auto hide alert after 3 seconds
      setTimeout(() => {
        setShowLoginAlert(false);
      }, 3000);

      // Redirect to login after showing alert
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      // If the user is already logged in, redirect  to the upload page.
      navigate("/upload");
    }
  };

  return (
    <section className="bg-blue-50 pt-32 pb-12 md:pt-40 md:pb-16" id="home">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Based Automatic CV Evaluation System
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Boost your career prospects with AI-based CV analysis. Get a score,
            improvement recommendations, and find jobs that match your
            qualifications.
          </p>

          {/* Login Alert */}
          {showLoginAlert && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">
                Please log in first to upload your CV.
              </p>
            </div>
          )}

          <Link
            to={user ? "/upload" : "/login"}
            onClick={handleUploadClick}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md text-sm transition-colors"
          >
            Upload CV now
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
