// src/components/admin/ApprovalDetailModal.js
"use client";

export default function ApprovalDetailModal({
  isOpen,
  selectedItem,
  onClose,
  onApprove,
  onReject,
  getModuleName,
  getActionName,
  parseMaybeJson,
  renderWargaDiff,
}) {
  if (!isOpen || !selectedItem) return null;

  const payload =
    parseMaybeJson(selectedItem.payload) ?? selectedItem.payload ?? {};
  const module = selectedItem.module;
  const action = selectedItem.action;

  return (
    <div className="fixed inset-0 backdrop-contrast-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Detail Pengajuan</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ID Proposal</p>
              <p className="font-medium text-gray-900">#{selectedItem.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Modul</p>
              <p className="font-medium text-gray-900">
                {getModuleName(selectedItem.module)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Jenis Perubahan</p>
              <p className="font-medium text-gray-900">
                {getActionName(selectedItem.action)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedItem.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : selectedItem.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedItem.status === "pending"
                  ? "Pending"
                  : selectedItem.status === "approved"
                  ? "Approved"
                  : "Ditolak"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
              <p className="font-medium text-gray-900">
                {new Date(selectedItem.created_at).toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Diajukan Oleh</p>
              <p className="font-medium text-gray-900">
                User ID: {selectedItem.submitted_by}
              </p>
            </div>
          </div>

          {/* Formatted Data Display */}
          {module === "bidang" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                📐 Data Bidang
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Luas:</span>
                  <span className="ml-2 font-medium">
                    {payload.luas_m2 || "-"} m²
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status Hak:</span>
                  <span className="ml-2 font-medium">
                    {payload.status_hak || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Penggunaan:</span>
                  <span className="ml-2 font-medium">
                    {payload.penggunaan?.replaceAll("_", " ") || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Keterangan:</span>
                  <span className="ml-2 font-medium">
                    {payload.keterangan || "-"}
                  </span>
                </div>
                {payload.preview_pemilik?.nama && (
                  <>
                    <div className="col-span-2 mt-2 pt-2 border-t border-blue-300">
                      <p className="text-xs text-gray-500 mb-2">
                        Informasi Pemilik:
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Nama Pemilik:</span>
                      <span className="ml-2 font-medium">
                        {payload.preview_pemilik.nama}
                      </span>
                    </div>
                    {payload.preview_pemilik.nik && (
                      <div>
                        <span className="text-gray-600">NIK:</span>
                        <span className="ml-2 font-medium font-mono">
                          {payload.preview_pemilik.nik}
                        </span>
                      </div>
                    )}
                    {payload.preview_pemilik.nomor_urut && (
                      <div>
                        <span className="text-gray-600">Nomor Urut Tanah:</span>
                        <span className="ml-2 font-medium">
                          {payload.preview_pemilik.nomor_urut}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {module === "tanah" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                🏞️ Data Tanah
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {payload.nomor_urut && (
                  <div>
                    <span className="text-gray-600">Nomor Urut:</span>
                    <span className="ml-2 font-medium">
                      {payload.nomor_urut}
                    </span>
                  </div>
                )}
                {payload.keterangan && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Keterangan:</span>
                    <span className="ml-2 font-medium">
                      {payload.keterangan}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {module === "warga" && action !== "update" && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                👤 Data Warga
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {(payload.snapshot || payload).nama_lengkap && (
                  <div>
                    <span className="text-gray-600">Nama:</span>
                    <span className="ml-2 font-medium">
                      {(payload.snapshot || payload).nama_lengkap}
                    </span>
                  </div>
                )}
                {(payload.snapshot || payload).nik && (
                  <div>
                    <span className="text-gray-600">NIK:</span>
                    <span className="ml-2 font-medium font-mono">
                      {(payload.snapshot || payload).nik}
                    </span>
                  </div>
                )}
                {(payload.snapshot || payload).jenis_kelamin && (
                  <div>
                    <span className="text-gray-600">Jenis Kelamin:</span>
                    <span className="ml-2 font-medium">
                      {(payload.snapshot || payload).jenis_kelamin}
                    </span>
                  </div>
                )}
                {(payload.snapshot || payload).tempat_lahir && (
                  <div>
                    <span className="text-gray-600">Tempat Lahir:</span>
                    <span className="ml-2 font-medium">
                      {(payload.snapshot || payload).tempat_lahir}
                    </span>
                  </div>
                )}
                {(payload.snapshot || payload).tanggal_lahir && (
                  <div>
                    <span className="text-gray-600">Tanggal Lahir:</span>
                    <span className="ml-2 font-medium">
                      {new Date(
                        (payload.snapshot || payload).tanggal_lahir
                      ).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                )}
                {(payload.snapshot || payload).agama && (
                  <div>
                    <span className="text-gray-600">Agama:</span>
                    <span className="ml-2 font-medium">
                      {(payload.snapshot || payload).agama}
                    </span>
                  </div>
                )}
                {(payload.snapshot || payload).pekerjaan && (
                  <div>
                    <span className="text-gray-600">Pekerjaan:</span>
                    <span className="ml-2 font-medium">
                      {(payload.snapshot || payload).pekerjaan}
                    </span>
                  </div>
                )}
                {(payload.snapshot || payload).alamat_lengkap && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Alamat:</span>
                    <span className="ml-2 font-medium">
                      {(payload.snapshot || payload).alamat_lengkap}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diff untuk warga update */}
          {renderWargaDiff && renderWargaDiff(selectedItem)}

          {/* Target ID */}
          {selectedItem.target_id && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">
                Target ID (Data yang diubah/dihapus)
              </p>
              <p className="font-medium text-gray-900 font-mono">
                {selectedItem.target_id}
              </p>
            </div>
          )}

          {/* Raw JSON (Collapsible) */}
          <details className="bg-gray-50 border border-gray-200 rounded-lg">
            <summary className="px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-t-lg font-medium text-sm text-gray-700">
              📄 Lihat Data Mentah (JSON)
            </summary>
            <div className="p-4 border-t border-gray-200">
              <pre className="text-xs overflow-auto whitespace-pre-wrap text-gray-600">
                {JSON.stringify(selectedItem.payload, null, 2)}
              </pre>
            </div>
          </details>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          {selectedItem.status === "pending" && (
            <>
              <button
                onClick={() => {
                  onReject(selectedItem);
                  onClose();
                }}
                className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Tolak
              </button>

              <button
                onClick={() => {
                  onApprove(selectedItem);
                  onClose();
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
