import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaFilePdf, FaTimes, FaFile, FaCheck } from "react-icons/fa";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FaBoltLightning } from "react-icons/fa6";

const UploadPage = () => {
  const [user, setUser] = useState(null);
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

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    // Check file size (maximum 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Maximum file size is 5MB.");
      return;
    }

    setSelectedFile(file);
    console.log("File selected:", file.name, file.size, file.type);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Delet selected file
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

    try {
      const formData = new FormData();
      formData.append("cv", selectedFile);
      formData.append("appliedJob", appliedJob);

      // if backend neet userId
      if (user?.id) {
        formData.append("userId", user.id);
      }

      // console.log("Uploading to API...");
      // console.log("Applied Job:", appliedJob);
      // console.log("File:", selectedFile.name);

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

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Gagal mengupload CV";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("Error response:", errorData);
        } catch (jsonError) {
          console.error("Error parsing error JSON:", jsonError);
          errorMessage = `Server error (${response.status})`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      setSuccess("Your CV has been successfully uploaded and analyzed!");

      // Reset form after a few seconds
      setTimeout(() => {
        setSelectedFile(null);
        setAppliedJob("");
        setSuccess("");

        // Redirect to result page after 2 seconds
        if (result.analysisId || result.id) {
          navigate(`/result/${result.analysisId || result.id}`);
        }
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload CV. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Display loading if user has not been loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Upload your CV for analysis
            </h1>
            <p className="text-lg text-gray-600">
              Get comprehensive analysis and recommendations to improve your CV.
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Applied Job Input */}
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
                <p className="text-sm text-gray-500 mt-1">
                  Enter the position you are applying for a more accurate
                  analysis
                </p>
              </div>

              {/* File Upload */}
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
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-600">
                        Drag & drop CV your CV here
                      </p>
                      <p className="text-sm text-gray-500">or</p>
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
                    </div>
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

              {/* error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <FaTimes className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                </div>
              )}

              {/* success message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <FaCheck className="h-4 w-4 mr-2" />
                    {success}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile || !appliedJob.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center min-w-[200px] justify-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing CV...
                    </>
                  ) : (
                    <>
                      <FaBoltLightning className="mr-2 cursor-pointer" />
                      Analyze CV Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Section Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaFile className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Comprehensive Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Get an in-depth analysis of the structure, content, and quality
                of your CV.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Score & Rating
              </h3>
              <p className="text-sm text-gray-600">
                Receive objective scores and ratings for various aspects of your
                CV.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaBoltLightning className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Recommendation
              </h3>
              <p className="text-sm text-gray-600">
                Get repair advice and job recommendations that fit your needs
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UploadPage;
