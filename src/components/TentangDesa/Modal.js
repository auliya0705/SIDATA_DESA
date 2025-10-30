"use client";
import { HiX } from "react-icons/hi";

export default function Modal({ show, onClose, title, children }) {
  if (!show) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 backdrop-contrast-50 z-50 flex justify-center items-center p-5">
      {/* Konten Modal */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold text-teal-800">{title}</h3>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600">
                <HiX size={24} />
            </button>
        </div>

        {/* Body Modal */}
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
}
