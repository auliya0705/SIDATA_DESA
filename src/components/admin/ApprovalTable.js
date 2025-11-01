"use client";

import { useState } from "react";
import { MoreVertical, Eye, CheckCircle, XCircle } from "lucide-react";

export default function ApprovalTable({
  data = [],
  onApprove,
  onReject,
  onViewDetail,
  getModuleName,
  getActionName,
}) {
  const [showActionMenu, setShowActionMenu] = useState(null);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  // Extract relevant data from payload based on module
  const getDisplayData = (item) => {
    const payload = item.payload || {};

    switch (item.module) {
      case "warga":
        return {
          primaryId: payload.nik || "-",
          primaryName: payload.nama_lengkap || payload.nama || "-",
        };
      case "tanah":
        return {
          primaryId: payload.id_bidang || item.target_id || "-",
          primaryName: payload.pemilik || payload.lokasi || "-",
        };
      case "bidang":
        return {
          primaryId: payload.id_bidang || item.target_id || "-",
          primaryName: payload.nama_bidang || "-",
        };
      default:
        return {
          primaryId: item.target_id || "-",
          primaryName: "-",
        };
    }
  };

  // Format date to Indonesian format
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              #
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              ID Proposal
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Modul
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              ID/NIK
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Nama/Keterangan
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Jenis Perubahan
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Tanggal Pengajuan
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => {
            const displayData = getDisplayData(item);

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>

                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  #{item.id}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {getModuleName(item.module)}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                  {displayData.primaryId}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {displayData.primaryName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {getActionName(item.action)}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatDate(item.created_at)}
                </td>

                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      item.status
                    )}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700 relative">
                  <button
                    onClick={() =>
                      setShowActionMenu(
                        showActionMenu === item.id ? null : item.id
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Action Menu Dropdown */}
                  {showActionMenu === item.id && (
                    <>
                      {/* Backdrop to close menu when clicking outside */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowActionMenu(null)}
                      />

                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <button
                          onClick={() => {
                            onViewDetail && onViewDetail(item);
                            setShowActionMenu(null);
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-left rounded-t-lg"
                        >
                          <Eye size={16} />
                          <span>Lihat Detail</span>
                        </button>

                        {item.status === "pending" && (
                          <>
                            <div className="border-t border-gray-100" />
                            <button
                              onClick={() => {
                                onApprove && onApprove(item.id);
                                setShowActionMenu(null);
                              }}
                              className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-green-50 text-green-600 text-left"
                            >
                              <CheckCircle size={16} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => {
                                onReject && onReject(item.id);
                                setShowActionMenu(null);
                              }}
                              className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 text-left rounded-b-lg"
                            >
                              <XCircle size={16} />
                              <span>Tolak</span>
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Empty state handled in parent */}
    </div>
  );
}
