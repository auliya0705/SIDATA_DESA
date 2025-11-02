// src/components/admin/ApprovalTable.js
"use client";

import { useMemo } from "react";
import { Eye, Check, X } from "lucide-react";

function safeParseJSON(v) {
  if (typeof v !== "string") return v || null;
  try { return JSON.parse(v); } catch { return null; }
}

function extractNamaNik(row) {
  const payload = safeParseJSON(row.payload) ?? row.payload ?? {};
  const snap = payload?.snapshot ?? null;
  const after = payload?.after ?? null;
  const before = payload?.before ?? null;

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

function normalizeRowStatus(row) {
  const raw =
    row?.status ??
    row?.status_approval ??
    row?.approval_status ??
    row?.state ??
    row?.current_status ??
    null;
  if (!raw) return "PENDING";
  const up = String(raw).trim().toUpperCase();
  if (["APPROVED", "DISETUJUI"].includes(up)) return "APPROVED";
  if (["REJECTED", "DITOLAK"].includes(up)) return "REJECTED";
  if (["PENDING", "MENUNGGU", "DRAFT"].includes(up)) return "PENDING";
  return up;
}

function getApprovalId(row) {
  return (
    row?.approval_id ??
    row?.request_id ??
    row?.proposal_id ??
    row?.id
  );
}

function getSubmittedAt(row) {
  return row?.created_at ?? row?.submitted_at ?? row?.updated_at ?? null;
}

export default function ApprovalTable({
  data = [],
  onApprove,
  onReject,
  onViewDetail,
  getModuleName = (m) => m,
  getActionName = (a) => a,
  showId = true,                 // <-- NEW: bisa matikan kolom ID
}) {
  const rows = useMemo(() => data || [], [data]);

  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
            {showId && (
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID PROPOSAL</th>
            )}
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
            const status = normalizeRowStatus(row);
            const isPending = status === "PENDING";
            const approvalId = getApprovalId(row);
            const submittedAt = getSubmittedAt(row);

            return (
              <tr key={`${approvalId ?? "noid"}-${idx}`} className="hover:bg-gray-50 transition-colors">
                {/* nomor urut: pakai _rownum kalau disediakan dari page.js */}
                <td className="px-4 py-3 text-sm text-gray-700">
                  {row._rownum ?? idx + 1}
                </td>

                {showId && (
                  <td className="px-4 py-3 text-sm text-teal-700 font-medium">
                    #{approvalId ?? "?"}
                  </td>
                )}

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
                  {submittedAt ? new Date(submittedAt).toLocaleString("id-ID") : "-"}
                </td>

                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {status === "PENDING" ? "Pending" : status === "APPROVED" ? "Approved" : "Ditolak"}
                  </span>
                  {row.apply_error && (
                    <button
                      onClick={() =>
                        alert(
                          `Alasan gagal apply:\n\n${
                            typeof row.apply_error === "string"
                              ? row.apply_error
                              : JSON.stringify(row.apply_error, null, 2)
                          }`
                        )
                      }
                      className="ml-2 text-xs underline text-red-700"
                      title="Lihat alasan gagal apply dari backend"
                    >
                      detail error
                    </button>
                  )}
                </td>

                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetail?.({ ...row, approval_id: approvalId })}
                      className="px-2 py-1 border rounded hover:bg-gray-50"
                      title="Detail"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => isPending && onApprove?.({ ...row, approval_id: approvalId })}
                      className={`px-2 py-1 border rounded text-green-700 ${
                        isPending ? "hover:bg-green-50" : "opacity-50 cursor-not-allowed"
                      }`}
                      title={isPending ? "Approve" : "Hanya bisa approve saat status Pending"}
                      disabled={!isPending || !approvalId}
                    >
                      <Check size={16} />
                    </button>

                    <button
                      onClick={() => isPending && onReject?.({ ...row, approval_id: approvalId })}
                      className={`px-2 py-1 border rounded text-red-700 ${
                        isPending ? "hover:bg-red-50" : "opacity-50 cursor-not-allowed"
                      }`}
                      title={isPending ? "Tolak" : "Hanya bisa menolak saat status Pending"}
                      disabled={!isPending || !approvalId}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {!approvalId && (
                    <div className="mt-2 text-[11px] text-amber-700">
                      ⚠️ Tidak menemukan approval_id pada baris ini — tombol dinonaktifkan.
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
