import { FaSearch, FaCheckCircle, FaChartBar } from "react-icons/fa";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <FaSearch className="h-6 w-6 text-blue-600" />,
      title: "CV Scoring",
      description:
        "Get a comprehensive score based on the structure, content, and suitability of your CV to industry standards.",
    },
    {
      icon: <FaCheckCircle className="h-6 w-6 text-blue-600" />,
      title: "Job Recommendations",
      description:
        "Our AI will suggest job positions that best match your skills and experience.",
    },
    {
      icon: <FaChartBar className="h-6 w-6 text-blue-600" />,
      title: "Compatibility Analysis",
      description:
        "Measure how well your CV matches a specific job with the given percentage value.",
    },
  ];

  return (
    <section className="py-12 md:py-16" id="fitur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className=" text-lg font-medium text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
