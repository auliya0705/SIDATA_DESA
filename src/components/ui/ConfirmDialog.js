"use client";

import { X, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

/**
 * ConfirmDialog Component
 *
 * Usage:
 * const [showConfirm, setShowConfirm] = useState(false);
 *
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={() => handleDelete()}
 *   title="Konfirmasi Hapus"
 *   message="Yakin ingin menghapus data ini?"
 *   confirmText="Ya, Hapus"
 *   cancelText="Batal"
 *   type="danger" // "danger" | "warning" | "info" | "success"
 * />
 */
export default function ConfirmDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya",
  cancelText = "Batal",
  type = "warning", // "danger" | "warning" | "info" | "success"
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm && onConfirm();
    onClose && onClose();
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  // Icon & Color based on type
  const config = {
    danger: {
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
      buttonText: "text-white",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
      buttonText: "text-white",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      buttonText: "text-white",
    },
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonBg: "bg-green-600 hover:bg-green-700",
      buttonText: "text-white",
    },
  };

  const currentConfig = config[type] || config.warning;
  const Icon = currentConfig.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-contrast-50 z-50 animate-fadeIn"
        onClick={handleCancel}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full ${currentConfig.iconBg} flex items-center justify-center`}
              >
                <Icon className={`${currentConfig.iconColor}`} size={24} />
              </div>

              {/* Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Message */}
          <div className="px-6 pb-6">
            <p className="text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 rounded-lg ${currentConfig.buttonBg} ${currentConfig.buttonText} transition-colors font-medium`}
            >
              {confirmText}
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
