"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, User, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWarga } from "@/hooks/useWarga";

export default function DetailWargaPage() {
  const params = useParams();
  const router = useRouter();
  const { loading: hookLoading, getWargaById, deleteWarga } = useWarga();

  const [wargaData, setWargaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWargaData();
  }, [params.id]);

  const loadWargaData = async () => {
    try {
      const data = await getWargaById(params.id);
      setWargaData(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load warga data:", err);
      alert("Gagal memuat data warga: " + err.message);
      router.push("/admin/management-warga");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus data warga ini?")) {
      return;
    }

    try {
      await deleteWarga(params.id);
      alert("Data warga berhasil dihapus!");
      router.push("/admin/management-warga");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus data: " + err.message);
    }
  };

  if (loading || hookLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  const DetailRow = ({ label, value }) => (
    <div className="grid grid-cols-3 py-3 border-b border-gray-100 last:border-0">
      <dt className="font-medium text-gray-700">{label}</dt>
      <dd className="col-span-2 text-gray-900">{value || "-"}</dd>
    </div>
  );

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper function to format jenis kelamin
  const formatGender = (gender) => {
    return gender === "L" ? "Laki-laki" : gender === "P" ? "Perempuan" : gender;
  };

  // Helper function to format status perkawinan
  const formatStatusPerkawinan = (status) => {
    const statusMap = {
      BELUM_KAWIN: "Belum Kawin",
      KAWIN: "Kawin",
      CERAI_HIDUP: "Cerai Hidup",
      CERAI_MATI: "Cerai Mati",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Data Warga
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Informasi lengkap data warga
          </p>
        </div>
        <Link
          href="/admin/management-warga"
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/admin/management-warga/edit/${params.id}`}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <Edit size={18} />
          <span>Edit Data</span>
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 size={18} />
          <span>Hapus Data</span>
        </button>
      </div>

      {/* Profile Card with Photo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-8">
          <div className="flex items-center space-x-6">
            {/* Photo */}
            <div className="flex-shrink-0">
              {wargaData.foto_ktp ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={`http://127.0.0.1:8000/${wargaData.foto_ktp}`}
                    alt={wargaData.nama_lengkap}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="text-white" size={48} />
                </div>
              )}
            </div>

            {/* Name & Basic Info */}
            <div className="flex-1 text-white">
              <h2 className="text-2xl font-bold mb-2">
                {wargaData.nama_lengkap}
              </h2>
              <div className="space-y-1 text-teal-100">
                <p className="text-sm">NIK: {wargaData.nik}</p>
                <p className="text-sm">
                  {formatGender(wargaData.jenis_kelamin)} •{" "}
                  {formatStatusPerkawinan(wargaData.status_perkawinan)}
                </p>
                {wargaData.tanah_count > 0 && (
                  <p className="text-sm">
                    Memiliki {wargaData.tanah_count} data tanah
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Identitas Pribadi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="mr-2" size={20} />
              Identitas Pribadi
            </h3>
          </div>
          <dl className="px-6 py-2">
            <DetailRow label="Nama Lengkap" value={wargaData.nama_lengkap} />
            <DetailRow label="NIK" value={wargaData.nik} />
            <DetailRow
              label="Jenis Kelamin"
              value={formatGender(wargaData.jenis_kelamin)}
            />
            <DetailRow label="Tempat Lahir" value={wargaData.tempat_lahir} />
            <DetailRow
              label="Tanggal Lahir"
              value={formatDate(wargaData.tanggal_lahir)}
            />
            <DetailRow label="Agama" value={wargaData.agama} />
            <DetailRow
              label="Status Perkawinan"
              value={formatStatusPerkawinan(wargaData.status_perkawinan)}
            />
          </dl>
        </div>

        {/* Data Tambahan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="mr-2" size={20} />
              Data Tambahan
            </h3>
          </div>
          <dl className="px-6 py-2">
            <DetailRow
              label="Pendidikan Terakhir"
              value={wargaData.pendidikan_terakhir}
            />
            <DetailRow label="Pekerjaan" value={wargaData.pekerjaan} />
            <DetailRow
              label="Kewarganegaraan"
              value={wargaData.kewarganegaraan}
            />
            <DetailRow
              label="Alamat Lengkap"
              value={
                <div className="whitespace-pre-wrap">
                  {wargaData.alamat_lengkap}
                </div>
              }
            />
          </dl>
        </div>
      </div>

      {/* Keterangan */}
      {wargaData.keterangan && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Keterangan</h3>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-900 whitespace-pre-wrap">
              {wargaData.keterangan}
            </p>
          </div>
        </div>
      )}

      {/* Data Tanah */}
      {wargaData.tanah && wargaData.tanah.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">
              Data Tanah ({wargaData.tanah.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {wargaData.tanah.map((tanah) => (
                <div
                  key={tanah.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        Tanah #{tanah.nomor_urut}
                      </p>
                      <p className="text-sm text-gray-600">
                        Luas: {tanah.jumlah_m2} m²
                      </p>
                      {tanah.bidang && tanah.bidang.length > 0 && (
                        <p className="text-sm text-gray-600">
                          {tanah.bidang.length} bidang
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/admin/management-tanah/detail/${tanah.id}`}
                      className="text-sm text-teal-700 hover:text-teal-800 font-medium"
                    >
                      Lihat Detail →
                    </Link>
                  </div>

                  {/* Bidang Details */}
                  {tanah.bidang && tanah.bidang.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Rincian Bidang:
                      </p>
                      <div className="space-y-1">
                        {tanah.bidang.map((bidang, idx) => (
                          <div
                            key={bidang.id}
                            className="text-xs text-gray-600"
                          >
                            Bidang {idx + 1}: {bidang.luas_m2} m² •{" "}
                            {bidang.status_hak} • {bidang.penggunaan}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Dibuat:</span>{" "}
            {formatDate(wargaData.created_at)}
          </div>
          <div>
            <span className="font-medium">Diperbarui:</span>{" "}
            {formatDate(wargaData.updated_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
