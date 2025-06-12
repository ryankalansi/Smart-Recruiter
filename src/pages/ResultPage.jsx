import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaUpload, FaHome } from "react-icons/fa";
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

  // Load analysis result from localStorage
  useEffect(() => {
    if (!user) return;

    try {
      const storedResult = localStorage.getItem("cvAnalysisResult");

      if (!storedResult) {
        setError(
          "No analysis result found. Please upload and analyze your CV first."
        );
        setLoading(false);
        return;
      }

      const data = JSON.parse(storedResult);
      console.log("Analysis Result Data:", data);

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
        resumeScore: `${Math.round((data.matchScore || 0) * 100)}%`,
        jobRecommendations: Array.isArray(data.jobRecommendation)
          ? data.jobRecommendation.map((job) => ({
              title: job.role || job.role || "Position not specified",
              description: job.matchScore
                ? `${Math.round(job.matchScore * 100)}%`
                : "No description available",
            }))
          : [],
      };

      setAnalysisResult(transformedResult);
      setLoading(false);
    } catch (error) {
      console.error("Error loading analysis result:", error);
      setError(
        "Failed to load analysis result. Please try uploading your CV again."
      );
      setLoading(false);
    }
  }, [user]);

  // Get score color and label
  const getScoreDetails = (score) => {
    // Parse the percentage string to number (remove % and convert to number)
    const numericScore =
      typeof score === "string" ? parseInt(score.replace("%", "")) : score;

    if (numericScore >= 80)
      return {
        color: "text-green-600",
        bgColor: "bg-green-600",
        label: "Very Good",
      };
    if (numericScore >= 60)
      return { color: "text-blue-600", bgColor: "bg-blue-600", label: "Good" };
    if (numericScore >= 40)
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-600",
        label: "Enough",
      };
    return { color: "text-red-600", bgColor: "bg-red-600", label: "Poor" };
  };

  // Helper function to get numeric score for progress bar
  const getNumericScore = (score) => {
    if (typeof score === "string") {
      return parseInt(score.replace("%", ""));
    }
    return score;
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
                    style={{ width: `${getNumericScore.resumeScore}%` }}
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
