"use client";

import { useMemo } from "react";
import { Eye, Check, X } from "lucide-react";

function safeParseJSON(v) {
  if (typeof v !== "string") return v || null;
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}

function extractNamaNik(row) {
  const payload = safeParseJSON(row.payload) ?? row.payload ?? {};
  const snap = payload?.snapshot ?? null;
  const after = payload?.after ?? null;
  const before = payload?.before ?? null;

  // pakai nilai yang mungkin sudah dinormalisasi di page.js terlebih dulu
  const nik =
    row.display_nik ??
    row.nik ??
    snap?.nik ??
    after?.nik ??
    before?.nik ??
    payload?.nik ??
    "-";

  const nama =
    row.display_nama ??
    row.nama_lengkap ??
    snap?.nama_lengkap ??
    after?.nama_lengkap ??
    before?.nama_lengkap ??
    payload?.nama_lengkap ??
    "-";

  return { nik, nama };
}

export default function ApprovalTable({
  data = [],
  onApprove,
  onReject,
  onViewDetail,
  getModuleName = (m) => m,
  getActionName = (a) => a,
}) {
  const rows = useMemo(() => data || [], [data]);

  if (!rows.length) {
    return null;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID PROPOSAL</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">MODUL</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID/NIK</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">NAMA/KETERANGAN</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">JENIS PERUBAHAN</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">TANGGAL PENGAJUAN</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">STATUS</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">AKSI</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, idx) => {
            const { nik, nama } = extractNamaNik(row);

            return (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>

                <td className="px-4 py-3 text-sm text-teal-700 font-medium">#{row.id}</td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {getModuleName(row.module)}
                </td>

                <td className="px-4 py-3 text-sm font-mono text-gray-800 whitespace-nowrap">
                  {nik}
                </td>

                <td className="px-4 py-3 text-sm text-gray-800">
                  {nama}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {getActionName(row.action)}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {new Date(row.created_at).toLocaleString("id-ID")}
                </td>

                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      row.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : row.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {row.status === "pending"
                      ? "Pending"
                      : row.status === "approved"
                      ? "Approved"
                      : "Ditolak"}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetail && onViewDetail(row)}
                      className="px-2 py-1 border rounded hover:bg-gray-50"
                      title="Detail"
                    >
                      <Eye size={16} />
                    </button>
                    {row.status === "pending" && (
                      <>
                        <button
                          onClick={() => onApprove && onApprove(row.id)}
                          className="px-2 py-1 border rounded text-green-700 hover:bg-green-50"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => onReject && onReject(row.id)}
                          className="px-2 py-1 border rounded text-red-700 hover:bg-red-50"
                          title="Tolak"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Debug minimal: tampilkan payload item pertama (opsional, bisa hapus) */}
      {/* <pre className="p-3 text-xs bg-gray-50 border-t overflow-auto">
        {JSON.stringify(rows[0], null, 2)}
      </pre> */}
    </div>
  );
}
