// src/components/admin/BidangTable.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

export default function BidangTable({
  data = [],
  onView,
  onEdit,
  onDelete,
  deletingId = null,
  showIdColumn = false,     // ⬅️ default: sembunyikan kolom ID
}) {
  const [openMenu, setOpenMenu] = useState(null);

  const rows = data.length
    ? data
    : [
        { id: "b1", luas_m2: 500, status_hak: "HM", penggunaan: "SAWAH", keterangan: "petak utara" },
        { id: "b2", luas_m2: 333, status_hak: "HGB", penggunaan: "PERUMAHAN", keterangan: "petak selatan" },
      ];

  const fmt = (n) =>
    typeof n === "number" ? `${n.toLocaleString("id-ID")} m²` : `${n} m²`;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">#</th>

            {showIdColumn && (
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">ID</th>
            )}

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Luas (m²)</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status Hak</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Penggunaan</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Keterangan</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase"></th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((r, i) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-6 py-3 text-sm text-gray-700">{i + 1}</td>

              {showIdColumn && (
                <td className="px-6 py-3 text-sm text-gray-700 break-all">{r.id}</td>
              )}

              <td className="px-6 py-3 text-sm text-gray-700">{fmt(r.luas_m2)}</td>
              <td className="px-6 py-3 text-sm text-gray-700">{r.status_hak || "-"}</td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {(r.penggunaan || "-").replaceAll("_", " ")}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">{r.keterangan || "-"}</td>

              <td className="px-6 py-3 text-sm text-gray-700 relative">
                <button
                  onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical size={18} />
                </button>

                {openMenu === r.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => {
                        onView && onView(r);
                        setOpenMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-left"
                    >
                      <Eye size={16} />
                      <span>Lihat</span>
                    </button>

                    <button
                      onClick={() => {
                        onEdit && onEdit(r);
                        setOpenMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-left"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Ajukan penghapusan bidang ini?")) {
                          onDelete && onDelete(r);
                        }
                        setOpenMenu(null);
                      }}
                      disabled={deletingId === r.id}
                      className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-left ${
                        deletingId === r.id
                          ? "text-red-300 cursor-not-allowed"
                          : "text-red-600"
                      }`}
                      title={
                        deletingId === r.id
                          ? "Sedang mengajukan penghapusan…"
                          : "Ajukan penghapusan bidang"
                      }
                    >
                      <Trash2 size={16} />
                      <span>{deletingId === r.id ? "Menghapus…" : "Hapus"}</span>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
