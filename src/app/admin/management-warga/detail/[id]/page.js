"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import MapView to avoid SSR issues
const MapView = dynamic(() => import("@/components/admin/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function DetailTanahPage() {
  const params = useParams();
  const router = useRouter();
  const [bidangData, setBidangData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch data from API based on params.id
    // Simulate API call
    setTimeout(() => {
      setBidangData({
        id: params.id,
        nama_pemilik: "Muhammad Vendra Hastagiyan",
        nomor_urut: "001",
        jumlah_luas: "250",
        status_hak_tanah: "HM",
        penggunaan_tanah: ["perumahan", "sawah"],
        keterangan: "Tanah produktif dengan akses jalan utama",
        // Sample GeoJSON - Replace with actual data from API
        geojson: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [110.4, -7.05],
                    [110.41, -7.05],
                    [110.41, -7.06],
                    [110.4, -7.06],
                    [110.4, -7.05],
                  ],
                ],
              },
              properties: {},
            },
          ],
        },
      });
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleDelete = () => {
    if (confirm("Yakin ingin menghapus data tanah ini?")) {
      // TODO: Implement delete API call
      alert("Data tanah berhasil dihapus!");
      router.push("/admin/management-tanah");
    }
  };

  if (loading) {
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
    <div className="grid grid-cols-3 py-3 border-b border-gray-100">
      <dt className="font-medium text-gray-700">{label}</dt>
      <dd className="col-span-2 text-gray-900">{value || "-"}</dd>
    </div>
  );

  // Helper function to format penggunaan tanah labels
  const formatPenggunaanTanah = (penggunaan) => {
    const labelMap = {
      perumahan: "Perumahan",
      perdagangan_jasa: "Perdagangan & Jasa",
      perkantoran: "Perkantoran",
      industri: "Industri",
      fasilitas_umum: "Fasilitas Umum",
      sawah: "Sawah",
      tegalan: "Tegalan",
      perkebunan: "Perkebunan",
      peternakan_perikanan: "Peternakan/Perikanan",
      hutan_belukar: "Hutan Belukar",
      hutan_lindung: "Hutan Lindung",
      tanah_kosong: "Tanah Kosong",
      mutasi_tanah: "Mutasi Tanah di Desa",
      lain_lain: "Lain-lain",
    };

    return penggunaan.map((item) => labelMap[item] || item).join(", ");
  };

  // Helper function to format status hak tanah
  const formatStatusHak = (status) => {
    const statusMap = {
      HM: "Hak Milik (HM)",
      HGB: "Hak Guna Bangunan (HGB)",
      HP: "Hak Pakai (HP)",
      HGU: "Hak Guna Usaha (HGU)",
      HPL: "Hak Pengelolaan (HPL)",
      MA: "Milik Adat (MA)",
      VI: "Verponding Indonesia (VI)",
      TN: "Tanah Negara (TN)",
    };

    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Data Tanah
          </h1>
        </div>
        <Link
          href="/admin/management-tanah"
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/admin/management-tanah/edit/${params.id}`}
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

      {/* Detail Card - Identitas Dasar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-teal-700 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Identitas Dasar</h3>
        </div>
        <dl className="px-6">
          <DetailRow label="Nama Pemilik" value={bidangData.nama_pemilik} />
          <DetailRow label="Nomor Urut" value={bidangData.nomor_urut} />
          <DetailRow
            label="Jumlah Luas"
            value={`${bidangData.jumlah_luas} m²`}
          />
        </dl>
      </div>

      {/* Detail Card - Status & Penggunaan Tanah */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-teal-700 text-white px-6 py-4">
          <h3 className="text-lg font-semibold">Status & Penggunaan Tanah</h3>
        </div>
        <dl className="px-6">
          <DetailRow
            label="Status Hak Tanah"
            value={formatStatusHak(bidangData.status_hak_tanah)}
          />
          <DetailRow
            label="Penggunaan Tanah"
            value={formatPenggunaanTanah(bidangData.penggunaan_tanah)}
          />
        </dl>
      </div>

      {/* Map Section - Only show if geojson exists */}
      {bidangData.geojson && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Lokasi Tanah</h3>
          </div>
          <div className="p-6">
            <MapView
              geoJson={bidangData.geojson}
              properties={{
                nama: bidangData.nama_pemilik,
                luas_m2: bidangData.jumlah_luas,
                status_hak: formatStatusHak(bidangData.status_hak_tanah),
                penggunaan: formatPenggunaanTanah(bidangData.penggunaan_tanah),
              }}
              height="400px"
            />
          </div>
        </div>
      )}

      {/* Detail Card - Keterangan */}
      {bidangData.keterangan && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-teal-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold">Keterangan</h3>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-900 whitespace-pre-wrap">
              {bidangData.keterangan}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
