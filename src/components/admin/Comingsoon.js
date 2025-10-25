import { Clock } from "lucide-react";

export default function ComingSoon({ title, description }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
            <Clock size={48} className="text-teal-700" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          {title || "Coming Soon"}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {description ||
            "Fitur ini sedang dalam tahap pengembangan dan akan segera tersedia."}
        </p>
        <div className="mt-8">
          <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg">
            <span className="font-medium">Status:</span>
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
              In Development
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
