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

  // Cek apakah user sudah login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // localStorage.removeItem("user");
        // localStorage.removeItem("token");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  //   Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  //   Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  //   Handle file selection
  const handleFileSelect = (file) => {
    setError("");
    setSuccess("");

    // Cek apakah file adalah PDF
    if (file.type !== "application/pdf") {
      setError("Hanya file PDF yang diperbolehkan.");
      // setSelectedFile(null);
      return;
    }

    // Cek ukuran file (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB.");
      // setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  //   Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  //   Hapus file yang dipilih
  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    setSuccess("");
  };

  //   Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Silakan pilih file CV terlebih dahulu.");
      return;
    }

    if (!appliedJob) {
      setError("Silakan pilih pekerjaan yang dilamar.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("CV", selectedFile);
      formData.append("appliedJob", appliedJob);
      formData.append("userId", user.id);

      // simulasi memanggil API - gantikan ini dengan API sebenarnya
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess("CV berhasil diupload! Analisis sedang diproses...");

      //   reset form setelah upload
      setTimeout(() => {
        setSelectedFile(null);
        setAppliedJob("");
        setSuccess("");
        // kamu bisa redirect ke halaman result disini
        // navigate("/result");
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Gagal mengupload CV. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  //   Tampilkan loading
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
              Upload CV Anda untuk Dianalisis
            </h1>
            <p className="text-lg text-gray-600">
              Dapatkan analisis komprehensif dan rekomendasi untuk meningkatkan
              CV Anda.
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Applied Job Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi yang Dilamar
                </label>
                <input
                  type="text"
                  value={appliedJob}
                  onChange={(e) => setAppliedJob(e.target.value)}
                  placeholder="Contoh: Frontend Developer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={isUploading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Masukkan posisi yang Anda lamar
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CV (PDF)
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
                        Drag & drop CV Anda di sini
                      </p>
                      <p className="text-sm text-gray-500">atau</p>
                      <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                        <FaUpload className="mr-2" />
                        Pilih File
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
                      Format: PDF (maksimal 5MB)
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

              {/* Pesan Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg ">
                  {error}
                </div>
              )}
              {/* Pesan Sukses */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isUploading || !appliedJob.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Menganalisis CV...
                    </>
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      Analisis CV Sekarang
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
                Analisis Komprehensif
              </h3>
              <p className="text-sm text-gray-600">
                Dapatkan analisis mendalam tentang struktur, konten, dan
                kualitas CV Anda.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Skor & Rating
              </h3>
              <p className="text-sm text-gray-600">
                Terima skor objektif dan rating untuk berbagai aspek CV Anda.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FaBoltLightning className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rekomendasi</h3>
              <p className="text-sm text-gray-600">
                Dapatkan saran perbaikan dan rekomendasi pekerjaan yang sesuai
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
