"use client";

import { useState } from "react";
import { X, MessageSquare } from "lucide-react";

/**
 * PromptDialog Component
 *
 * Usage:
 * const [showPrompt, setShowPrompt] = useState(false);
 *
 * <PromptDialog
 *   isOpen={showPrompt}
 *   onClose={() => setShowPrompt(false)}
 *   onSubmit={(value) => handleReject(value)}
 *   title="Alasan Penolakan"
 *   message="Masukkan alasan penolakan proposal"
 *   placeholder="Tulis alasan di sini..."
 *   required={true}
 *   inputType="textarea" // "text" | "textarea"
 * />
 */
export default function PromptDialog({
  isOpen = false,
  onClose,
  onSubmit,
  title = "Input Required",
  message = "Masukkan informasi yang diperlukan",
  placeholder = "Tulis di sini...",
  defaultValue = "",
  required = false,
  inputType = "text", // "text" | "textarea"
  confirmText = "Submit",
  cancelText = "Batal",
}) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validation
    if (required && !value.trim()) {
      setError("Field ini wajib diisi!");
      return;
    }

    onSubmit && onSubmit(value);
    handleClose();
  };

  const handleClose = () => {
    setValue(defaultValue);
    setError("");
    onClose && onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && inputType === "text") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <MessageSquare className="text-teal-600" size={20} />
              </div>

              {/* Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {message && (
                  <p className="text-sm text-gray-600 mt-1">{message}</p>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Input */}
          <div className="p-6">
            {inputType === "textarea" ? (
              <textarea
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                placeholder={placeholder}
                rows={4}
                className={`
                  w-full px-4 py-3 border rounded-lg 
                  focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  transition-all resize-none
                  ${error ? "border-red-500" : "border-gray-300"}
                `}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`
                  w-full px-4 py-3 border rounded-lg 
                  focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  transition-all
                  ${error ? "border-red-500" : "border-gray-300"}
                `}
                autoFocus
              />
            )}

            {/* Error Message */}
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{error}</span>
              </p>
            )}

            {/* Helper Text */}
            {required && !error && (
              <p className="mt-2 text-xs text-gray-500">* Wajib diisi</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-xl">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors font-medium"
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
