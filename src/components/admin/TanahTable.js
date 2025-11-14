// src/components/admin/TanahTable.js
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Trash2, Eye, Plus } from "lucide-react";

export default function TanahTable({
  data = [],
  onDelete,
  deletingId = null,
  showIdColumn = false,
}) {
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  const tanahData = data;

  const fmtLuas = (n) =>
    typeof n === "number" ? `${n.toLocaleString("id-ID")} m²` : `${n} m²`;

  // Calculate menu position when opened
  useEffect(() => {
    if (showActionMenu !== null) {
      const buttonEl = buttonRefs.current[showActionMenu];
      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX - 200, // 200px = menu width offset
        });
      }
    }
  }, [showActionMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showActionMenu !== null) {
        const isClickInsideMenu = e.target.closest(".action-menu-dropdown");
        const isClickInsideButton = e.target.closest(".action-menu-button");
        if (!isClickInsideMenu && !isClickInsideButton) {
          setShowActionMenu(null);
        }
      }
    };

    if (showActionMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showActionMenu]);

  const handleDeleteClick = (id) => {
    setShowActionMenu(null);
    onDelete && onDelete(id);
  };

  const handleMenuToggle = (id) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                No
              </th>

              {showIdColumn && (
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  ID
                </th>
              )}

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Nama Pemilik
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Jumlah Luas (m²)
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Jumlah Bidang
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase w-16"></th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {tanahData.map((tanah, index) => (
              <tr key={tanah.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>

                {showIdColumn && (
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tanah.id}
                  </td>
                )}

                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  <Link
                    href={`/admin/management-tanah/detail/${tanah.id}`}
                    className="text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    {tanah.nama_pemilik}
                  </Link>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {fmtLuas(tanah.total_luas)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {tanah.jumlah_bidang} bidang
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    ref={(el) => (buttonRefs.current[tanah.id] = el)}
                    onClick={() => handleMenuToggle(tanah.id)}
                    className="action-menu-button p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Menu - OUTSIDE table, FIXED position */}
      {showActionMenu !== null && (
        <div
          className="action-menu-dropdown fixed w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <Link
            href={`/admin/management-tanah/detail/${showActionMenu}`}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-t-lg"
            onClick={() => setShowActionMenu(null)}
          >
            <Eye size={16} />
            <span>Lihat Detail</span>
          </Link>

          <Link
            href={`/admin/management-tanah/tambah-bidang/${showActionMenu}`}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
            onClick={() => setShowActionMenu(null)}
          >
            <Plus size={16} />
            <span>Tambah Bidang</span>
          </Link>

          <button
            onClick={() => handleDeleteClick(showActionMenu)}
            disabled={deletingId === showActionMenu}
            className={`w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 rounded-b-lg ${
              deletingId === showActionMenu
                ? "text-red-300 cursor-not-allowed"
                : "text-red-600"
            }`}
            title={
              deletingId === showActionMenu
                ? "Sedang mengajukan penghapusan…"
                : "Ajukan penghapusan tanah"
            }
          >
            <Trash2 size={16} />
            <span>
              {deletingId === showActionMenu ? "Menghapus…" : "Hapus Semua"}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
