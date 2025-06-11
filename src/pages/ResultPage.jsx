import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaUpload,
  FaHome,
  FaLightbulb,
  FaUser,
  FaCode,
  FaDatabase,
  FaCog,
} from "react-icons/fa";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);

  //   Check auth
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

  //   Mock fetch analysis result - replace with actual API call later
  useEffect(() => {
    const fetchAnalysisResult = async () => {
      if (!user) return;
      setLoading(true);

      //   Simulate API call delay
      setTimeout(() => {
        // Mock data - replace with actual API call
        const mockResult = {
          id: id,
          resumeScore: 40,
          scoreLabel: "Enough",
          jobRecommendations: [
            {
              title: "Web Developer",
              description:
                "Suitable for backgrounds with web programming and JavaScript, HTML, CSS.",
            },
            {
              title: "Frontend Developer",
              description:
                "Suitable for experience in user interface development and modern frameworks.",
            },
            {
              title: "Full Stack Developer",
              description:
                "Ideal for candidates with backend and frontend development experience.",
            },
            {
              title: "Software Engineer",
              description:
                "Suitable for technical backgrounds with an understanding of algorithms and data structures.",
            },
          ],
          tips: [
            {
              icon: "💼",
              title: "Use Professional and Relevant Language",
              description:
                "Avoid overly general phrases like 'computer literate' or 'communicative fluency'. Give specific examples and outcomes of your work or action.",
              example:
                "Bad Example: 'Developed automation scripts using Python with libraries such as Pandas and Flask.'",
            },
            {
              icon: "🎯",
              title: "Incorporate Keywords from Job Descriptions",
              description:
                "Research keywords and skills that are frequently used in the job postings you're applying for. Naturally integrate these keywords into your experience, skills, and summary sections.",
              example: "",
            },
            {
              icon: "🏆",
              title: "Focus on Achievements, Not Just Duties",
              description:
                "Transform a simple list of tasks into quantifiable results and accomplishments that show impact.",
              example:
                "Bad Example: 'Entered data daily'. Good Example: 'Input and verified 500+ daily transaction data with 99% accuracy.'",
            },
            {
              icon: "📊",
              title: "Make Your Resume Specific and Measurable",
              description:
                "Avoid generic statements. Express your accomplishments with concrete details, including specific tools, timelines, or percentages.",
              example:
                "Example: 'Managed a 5-person project team and completed an information system within 3 months, resulting in a 40% efficiency increase.'",
            },
            {
              icon: "✏️",
              title: "Tailor Your Resume for Each Application",
              description:
                "A single resume doesn't fit all applications. Customize your resume based on the specific job ad, targeting highlighting only the most relevant experience and skills.",
              example: "",
            },
            {
              icon: "🎨",
              title: "Optimize Your Structure for ATS Readability",
              description:
                "Adhere to a standard resume structure format. • Header: Your Name, Contact Information • Summary: A concise overview of your qualifications • Work Experience: Listed in reverse chronological order (most recent first) • Education • Skills: Focus on specific and technical proficiencies",
              example:
                "Avoid complex tables, intricate graphics, and excessive design elements, as these can hinder ATS from accurately parsing your resume.",
            },
            {
              icon: "🔤",
              title: "Utilize Synonyms & Variations",
              description:
                "If job descriptions mention 'Project Management,' consider 'Project Coordination.' Include variations of these terms to broaden your keyword reach and ensure your resume is caught by different ATS algorithms.",
              example: "",
            },
            {
              icon: "📈",
              title: "Quantify Every Achievement",
              description:
                "Whenever possible, add numbers, percentages, timeframes, or budgets to your achievements. This significantly evaluates the credibility and impressiveness of your resume.",
              example: "",
            },
            {
              icon: "✅",
              title: "Ensure Readability",
              description:
                "• Use bullet points to break up text • Read long paragraphs • Proofread meticulously to eliminate typos, grammatical errors, and formatting inconsistencies",
            },
          ],
        };

        setAnalysisResult(mockResult);
        setLoading(false);
      }, 1500);
    };

    fetchAnalysisResult();
  }, [id, user]);

  //   Get score color and label
  const getScoreDetails = (score) => {
    if (score >= 80)
      return {
        color: "text-green-600",
        bgColor: "bg-green-600",
        label: "Very Good",
      };
    if (score >= 60)
      return { color: "text-blue-600", bgColor: "bg-green-600", label: "Good" };
    if (score >= 40)
      return {
        color: "text-yellow-600",
        bgColor: "bg-green-600",
        label: "Enough",
      };
    return { color: "text-red-600", bgColor: "bg-red-600", label: "Bad" };
  };

  //   Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your CV...</p>
        </div>
      </div>
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
              Here are the evaluation result of your CV based on our AI
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
              General guide and ATS strategies to make your CV stand out.
            </p>

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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaUpload className="mr-2" />
              Upload New
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
