// src/components/admin/BidangTable.js
"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

export default function BidangTable({
  data = [],
  onView,
  onEdit,
  onDelete,
  deletingId = null,
  showIdColumn = false,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  const rows = data.length
    ? data
    : [
        {
          id: "b1",
          luas_m2: 500,
          status_hak: "HM",
          penggunaan: "SAWAH",
          keterangan: "petak utara",
        },
        {
          id: "b2",
          luas_m2: 333,
          status_hak: "HGB",
          penggunaan: "PERUMAHAN",
          keterangan: "petak selatan",
        },
      ];

  const fmt = (n) =>
    typeof n === "number" ? `${n.toLocaleString("id-ID")} m²` : `${n} m²`;

  // Calculate menu position when opened
  useEffect(() => {
    if (openMenu !== null) {
      const buttonEl = buttonRefs.current[openMenu];
      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX - 160, // 160px = menu width offset
        });
      }
    }
  }, [openMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenu !== null) {
        const isClickInsideMenu = e.target.closest(".action-menu-dropdown");
        const isClickInsideButton = e.target.closest(".action-menu-button");
        if (!isClickInsideMenu && !isClickInsideButton) {
          setOpenMenu(null);
        }
      }
    };

    if (openMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenu]);

  const handleMenuToggle = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                #
              </th>

              {showIdColumn && (
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  ID
                </th>
              )}

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Luas (m²)
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Status Hak
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Penggunaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Keterangan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase w-16"></th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((r, i) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-700">{i + 1}</td>

                {showIdColumn && (
                  <td className="px-6 py-3 text-sm text-gray-700 break-all">
                    {r.id}
                  </td>
                )}

                <td className="px-6 py-3 text-sm text-gray-700">
                  {fmt(r.luas_m2)}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  {r.status_hak || "-"}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  {(r.penggunaan || "-").replaceAll("_", " ")}
                </td>
                <td className="px-6 py-3 text-sm text-gray-700">
                  {r.keterangan || "-"}
                </td>

                <td className="px-6 py-3 text-sm text-gray-700">
                  <button
                    ref={(el) => (buttonRefs.current[r.id] = el)}
                    onClick={() => handleMenuToggle(r.id)}
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
      {openMenu !== null && (
        <div
          className="action-menu-dropdown fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <button
            onClick={() => {
              onView && onView(rows.find((r) => r.id === openMenu));
              setOpenMenu(null);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-left rounded-t-lg"
          >
            <Eye size={16} />
            <span>Lihat</span>
          </button>

          <button
            onClick={() => {
              onEdit && onEdit(rows.find((r) => r.id === openMenu));
              setOpenMenu(null);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-left"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              onDelete && onDelete(rows.find((r) => r.id === openMenu));
              setOpenMenu(null);
            }}
            disabled={deletingId === openMenu}
            className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-left rounded-b-lg ${
              deletingId === openMenu
                ? "text-red-300 cursor-not-allowed"
                : "text-red-600"
            }`}
            title={
              deletingId === openMenu
                ? "Sedang mengajukan penghapusan…"
                : "Ajukan penghapusan bidang"
            }
          >
            <Trash2 size={16} />
            <span>{deletingId === openMenu ? "Menghapus…" : "Hapus"}</span>
          </button>
        </div>
      )}
    </>
  );
}
