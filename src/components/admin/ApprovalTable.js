"use client";

import { useState } from "react";
import { MoreVertical, Eye, CheckCircle, XCircle } from "lucide-react";

export default function ApprovalTable({
  data = [],
  dataType = "tanah",
  onApprove,
  onReject,
  onViewDetail,
}) {
  const [showActionMenu, setShowActionMenu] = useState(null);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            {dataType === "tanah" ? (
              <>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  ID Bidang Tanah
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Jenis Perubahan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Pengaju
                </th>
              </>
            ) : (
              <>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  NIK
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Jenis Perubahan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Pengaju
                </th>
              </>
            )}
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Tanggal Pengajuan
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Jenis Perubahan
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>

              {dataType === "tanah" ? (
                <>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {item.id_bidang}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.jenis_perubahan}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.pengaju}
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                    {item.nik}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {item.nama}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.jenis_perubahan}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.pengaju}
                  </td>
                </>
              )}

              <td className="px-6 py-4 text-sm text-gray-700">
                {item.tanggal_pengajuan}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                    item.status
                  )}`}
                >
                  {item.status}
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => {
                        onViewDetail && onViewDetail(item);
                        setShowActionMenu(null);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <Eye size={16} />
                      <span>Lihat Detail</span>
                    </button>

                    {item.status === "Pending" && (
                      <>
                        <button
                          onClick={() => {
                            onApprove && onApprove(item.id);
                            setShowActionMenu(null);
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-green-50 text-green-600"
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            onReject && onReject(item.id);
                            setShowActionMenu(null);
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600"
                        >
                          <XCircle size={16} />
                          <span>Tolak</span>
                        </button>
                      </>
                    )}
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
