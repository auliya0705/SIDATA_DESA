"use client";
import { HiX } from "react-icons/hi";

export default function Modal({ show, onClose, title, children }) {
  if (!show) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 backdrop-contrast-50 z-50 flex justify-center items-center p-5">
      {/* Konten Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative overflow-hidden">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 sticky top-3.5 z-10">
            <h3 className="text-xl font-bold text-teal-800 text-center w-full">{title.toUpperCase()}</h3>
            <button
                onClick={onClose}
                className="right-4 text-gray-400 hover:text-gray-600 transition">
                <HiX size={24} />
            </button>
        </div>

        {/* Body Modal */}
        <div className="px-6 pb-6 pt-3 overflow-y-auto text-gray-700 space-y-2">
            {children}
        </div>
      </div>
    </div>
  );
}
