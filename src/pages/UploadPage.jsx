import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaFilePdf,
  FaTimes,
  FaFile,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FaBoltLightning } from "react-icons/fa6";

const UploadPage = () => {
  // const [user, setUser] = useState(null); // REMOVED - This state was not being used.
  const [selectedFile, setSelectedFile] = useState(null);
  const [appliedJob, setAppliedJob] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser || storedUser === "undefined") {
      // If token or user data doesn't exist, redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    // We don't need to set the user state if it's not used in the component.
    // The check above is sufficient to protect the route.
  }, [navigate]);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    setError("");
    setSuccess("");
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Maximum file size is 5MB.");
      return;
    }
    setSelectedFile(file);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Delete selected file
  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    setSuccess("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select your CV file first.");
      return;
    }
    if (!appliedJob.trim()) {
      setError("Please enter the position you are applying for.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must login first.");
      navigate("/login");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("cv", selectedFile);
      formData.append("appliedJob", appliedJob);

      const response = await fetch(
        "https://be-dicoding-cv-o8hg.vercel.app/api/cvs/upload",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Server error (${response.status})`
        );
      }

      const result = await response.json();

      // KEY CHANGE: Handle the complete response directly
      if (result.success && result.data) {
        // Store the entire analysis result object in localStorage
        localStorage.setItem("analysisResult", JSON.stringify(result.data));

        setSuccess(
          "Analysis successful! You will be redirected to the results page."
        );

        // Redirect to the result page after a short delay
        setTimeout(() => {
          navigate("/result");
        }, 2000);
      } else {
        throw new Error(
          result.message || "Analysis failed to return valid data."
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload CV. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Upload your CV for analysis
            </h1>
            <p className="text-lg text-gray-600">
              Get comprehensive analysis and recommendations to improve your CV.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Applied For *
                </label>
                <input
                  type="text"
                  value={appliedJob}
                  onChange={(e) => setAppliedJob(e.target.value)}
                  placeholder="Example: Frontend Developer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={isUploading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CV (PDF) *
                </label>
                {!selectedFile ? (
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDrop={handleDrop}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                  >
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                      <FaUpload className="mr-2" />
                      Select File
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-4">
                      Format: PDF (max. 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FaFilePdf className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        disabled={isUploading}
                      >
                        <FaTimes className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <FaTimes className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <FaCheck className="h-4 w-4 mr-2" />
                    {success}
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile || !appliedJob.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center min-w-[200px] justify-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Uploading & Analyzing...
                    </>
                  ) : (
                    <>
                      <FaBoltLightning className="mr-2" />
                      Analyze CV Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UploadPage;
