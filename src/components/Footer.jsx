export const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-12" id="kontak">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 text-center md:text-left">
          {/* Brand Section */}
          <div className="flex-1 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4 flex items-center justify-center md:justify-start">
              <div className="h-6 w-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-2 text-xs">
                AI
              </div>
              Smart Recruiter
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              AI-based CV analysis solution to improve your career opportunities
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex-1 max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="text-gray-300">
                <span className="text-gray-400">Email:</span>
                info@smartrecruiter.com
              </div>
              <div className="text-gray-300">
                <span className="text-gray-400">Telephone:</span>
                +62 123 456
              </div>
              <div className="text-gray-300">
                <span className="text-gray-400">Address:</span>
                Jl. Teknologi No. 123, Jakarta
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-600 mt-10 pt-6">
          <p className="text-gray-400 text-sm text-center">
            &copy; 2025 AI Smart Recruiter. All rights reserved.{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};
