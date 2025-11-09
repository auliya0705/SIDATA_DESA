"use client";

import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

/**
 * AlertDialog Component
 *
 * Usage:
 * const [showAlert, setShowAlert] = useState(false);
 *
 * <AlertDialog
 *   isOpen={showAlert}
 *   onClose={() => setShowAlert(false)}
 *   title="Berhasil!"
 *   message="Data berhasil disimpan"
 *   type="success" // "success" | "error" | "warning" | "info"
 * />
 */
export default function AlertDialog({
  isOpen = false,
  onClose,
  title = "Informasi",
  message = "",
  type = "info", // "success" | "error" | "warning" | "info"
  buttonText = "OK",
}) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose && onClose();
  };

  // Icon & Color based on type
  const config = {
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      titleColor: "text-green-900",
      buttonBg: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
      titleColor: "text-red-900",
      buttonBg: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
      titleColor: "text-yellow-900",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      titleColor: "text-blue-900",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const currentConfig = config[type] || config.info;
  const Icon = currentConfig.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-contrast-50 z-50 animate-fadeIn"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 rounded-full ${currentConfig.iconBg} flex items-center justify-center`}
              >
                <Icon className={`${currentConfig.iconColor}`} size={32} />
              </div>
            </div>

            {/* Title */}
            <h3
              className={`text-xl font-bold text-center mb-3 ${currentConfig.titleColor}`}
            >
              {title}
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action */}
          <div className="px-6 pb-6">
            <button
              onClick={handleClose}
              className={`w-full py-3 rounded-lg ${currentConfig.buttonBg} text-white font-semibold transition-colors`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
}
