import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaUpload, FaHome, FaLightbulb } from "react-icons/fa";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const ResultPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch analysis result from API
  useEffect(() => {
    if (!user) return;

    const fetchAnalysisResult = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Coba ambil dari API dulu
        const response = await fetch(
          "https://be-dicoding-cv-o8hg.vercel.app/api/cvs/upload",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let data = null;

        if (response.ok) {
          // Jika API berhasil, gunakan data dari API
          data = await response.json();
          console.log("Data from API:", data);

          // Simpan data terbaru ke localStorage sebagai backup
          localStorage.setItem("cvAnalysisResult", JSON.stringify(data));
        } else {
          // Jika API gagal, fallback ke localStorage
          console.log("API failed, using localStorage fallback");
          const storedResult = localStorage.getItem("cvAnalysisResult");

          if (!storedResult) {
            setError(
              "No analysis result found. Please upload and analyze your CV first."
            );
            setLoading(false);
            return;
          }

          data = JSON.parse(storedResult);
          console.log("Data from localStorage:", data);
        }

        // Validate that we have the required data
        if (!data || typeof data !== "object") {
          setError(
            "Invalid analysis result data. Please try uploading your CV again."
          );
          setLoading(false);
          return;
        }

        // Transform the data to match component structure
        const transformedResult = {
          resumeScore: data.matchScore || 0,
          jobRecommendations: Array.isArray(data.jobRecommendation)
            ? data.jobRecommendation.map((job) => ({
                title: job.title || job.name || "Position not specified",
                description:
                  job.description || job.reason || "No description available",
              }))
            : [],
          tips: Array.isArray(data.fixCv)
            ? data.fixCv.map((tip, index) => ({
                icon: getTipIcon(index),
                title:
                  tip.title || tip.category || `Improvement Tip ${index + 1}`,
                description:
                  tip.description ||
                  tip.suggestion ||
                  "No description available",
                example: tip.example || tip.badExample || tip.goodExample || "",
              }))
            : [],
        };

        console.log("Transformed result:", transformedResult);
        setAnalysisResult(transformedResult);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analysis result:", error);

        // Fallback ke localStorage jika terjadi error
        try {
          const storedResult = localStorage.getItem("cvAnalysisResult");
          if (storedResult) {
            const data = JSON.parse(storedResult);
            const transformedResult = {
              resumeScore: data.matchScore || 0,
              jobRecommendations: Array.isArray(data.jobRecommendation)
                ? data.jobRecommendation.map((job) => ({
                    title: job.title || job.name || "Position not specified",
                    description:
                      job.description ||
                      job.reason ||
                      "No description available",
                  }))
                : [],
              tips: Array.isArray(data.fixCv)
                ? data.fixCv.map((tip, index) => ({
                    icon: getTipIcon(index),
                    title:
                      tip.title ||
                      tip.category ||
                      `Improvement Tip ${index + 1}`,
                    description:
                      tip.description ||
                      tip.suggestion ||
                      "No description available",
                    example:
                      tip.example || tip.badExample || tip.goodExample || "",
                  }))
                : [],
            };
            setAnalysisResult(transformedResult);
          } else {
            setError(
              "Failed to load analysis result. Please try uploading your CV again."
            );
          }
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          setError(
            "Failed to load analysis result. Please try uploading your CV again."
          );
        }

        setLoading(false);
      }
    };

    fetchAnalysisResult();
  }, [user]);

  // Helper function to get tip icons
  const getTipIcon = (index) => {
    const icons = ["💼", "🎯", "🏆", "📊", "✏️", "🎨", "🔤", "📈", "✅"];
    return icons[index % icons.length];
  };

  // Get score color and label
  const getScoreDetails = (score) => {
    if (score >= 80)
      return {
        color: "text-green-600",
        bgColor: "bg-green-600",
        label: "Very Good",
      };
    if (score >= 60)
      return { color: "text-blue-600", bgColor: "bg-blue-600", label: "Good" };
    if (score >= 40)
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-600",
        label: "Enough",
      };
    return { color: "text-red-600", bgColor: "bg-red-600", label: "Poor" };
  };

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your CV analysis...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !analysisResult) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="text-red-500 text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Analysis Results Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "Please upload and analyze your CV first to see the results."}
            </p>
            <div className="space-y-3">
              <Link
                to="/upload"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Upload & Analyze CV
              </Link>
              <Link
                to="/"
                className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const scoreDetails = getScoreDetails(analysisResult.resumeScore);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              CV Analysis Results
            </h1>
            <p className="text-lg text-gray-600">
              Here are the evaluation results of your CV based on our AI
              analysis.
            </p>
          </div>

          {/* CV Score */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-6">
                Resume Score
              </h2>
              <div className="mb-6">
                <div
                  className={`text-6xl font-bold ${scoreDetails.color} mb-2`}
                >
                  {analysisResult.resumeScore}
                </div>
                <div
                  className={`text-lg font-medium ${scoreDetails.color} mb-4`}
                >
                  {scoreDetails.label}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${scoreDetails.bgColor} transition-all duration-1000`}
                    style={{ width: `${analysisResult.resumeScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  Out of 100 maximum points
                </p>
              </div>
            </div>
          </div>

          {/* Job Recommendations */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <FaCheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Job Recommendations
              </h2>
            </div>
            {analysisResult.jobRecommendations.length > 0 ? (
              <div className="space-y-4">
                {analysisResult.jobRecommendations.map((job, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">{job.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No job recommendations available based on your CV analysis.
              </p>
            )}
          </div>

          {/* Tips to improve */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <FaLightbulb className="h-6 w-6 text-yellow-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Tips to Improve Your CV
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              AI-powered suggestions to enhance your CV and make it stand out.
            </p>

            {analysisResult.tips.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {analysisResult.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start mb-3">
                      <span className="text-2xl mr-3">{tip.icon}</span>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {tip.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {tip.description}
                    </p>
                    {tip.example && (
                      <p className="text-xs text-gray-500 italic">
                        {tip.example}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No improvement tips available based on your CV analysis.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaUpload className="mr-2" />
              Upload New CV
            </Link>
            <Link
              to="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaHome className="mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResultPage;
