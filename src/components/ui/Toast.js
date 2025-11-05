"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Toast Component
 *
 * Usage:
 * const [showToast, setShowToast] = useState(false);
 *
 * <Toast
 *   isOpen={showToast}
 *   onClose={() => setShowToast(false)}
 *   message="Data berhasil disimpan"
 *   type="success" // "success" | "error" | "warning" | "info"
 *   duration={3000} // Auto-hide after 3 seconds
 * />
 */
export default function Toast({
  isOpen = false,
  onClose,
  message = "",
  type = "info", // "success" | "error" | "warning" | "info"
  duration = 3000,
  position = "top-right", // "top-right" | "top-center" | "bottom-right" | "bottom-center"
}) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  // Icon & Color based on type
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
  };

  const currentConfig = config[type] || config.info;
  const Icon = currentConfig.icon;

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={`
        fixed z-50 ${positionClasses[position]}
        max-w-md w-full px-4
        animate-slideIn
      `}
    >
      <div
        className={`
          ${currentConfig.bgColor} ${currentConfig.borderColor}
          border rounded-lg shadow-lg p-4
          flex items-start space-x-3
        `}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className={currentConfig.iconColor} size={20} />
        </div>

        {/* Message */}
        <div
          className={`flex-1 ${currentConfig.textColor} text-sm font-medium`}
        >
          {message}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onClose && onClose()}
          className={`flex-shrink-0 ${currentConfig.iconColor} hover:opacity-70 transition-opacity`}
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar (if duration > 0) */}
      {duration > 0 && (
        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              type === "success"
                ? "bg-green-600"
                : type === "error"
                ? "bg-red-600"
                : type === "warning"
                ? "bg-yellow-600"
                : "bg-blue-600"
            } animate-progress`}
            style={{ animationDuration: `${duration}ms` }}
          ></div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-progress {
          animation: progress linear;
        }
      `}</style>
    </div>
  );
}
