"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TanahForm({
  initialData = null,
  mode = "create",
  isIdentitasReadOnly = false,
}) {
  const router = useRouter();

  const defaultFormData = {
    nama_pemilik: "",
    nomor_urut: "",
    jumlah_luas: "",
    status_hak_tanah: "",
    penggunaan_tanah: [],
    keterangan: "",
  };

  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...initialData,
    // Pastikan penggunaan_tanah selalu array
    penggunaan_tanah: initialData?.penggunaan_tanah || [],
  });

  const statusHakOptions = [
    { value: "HM", label: "HM" },
    { value: "HGB", label: "HGB" },
    { value: "HP", label: "HP" },
    { value: "HGU", label: "HGU" },
    { value: "HPL", label: "HPL" },
    { value: "MA", label: "MA" },
    { value: "VI", label: "VI" },
    { value: "TN", label: "TN" },
  ];

  const penggunaanTanahOptions = [
    { value: "perumahan", label: "Perumahan" },
    { value: "perdagangan_jasa", label: "Perdagangan & Jasa" },
    { value: "perkantoran", label: "Perkantoran" },
    { value: "industri", label: "Industri" },
    { value: "fasilitas_umum", label: "Fasilitas Umum" },
    { value: "sawah", label: "Sawah" },
    { value: "tegalan", label: "Tegalan" },
    { value: "perkebunan", label: "Perkebunan" },
    { value: "peternakan_perikanan", label: "Peternakan/Perikanan" },
    { value: "hutan_belukar", label: "Hutan Belukar" },
    { value: "hutan_lindung", label: "Hutan Lindung" },
    { value: "tanah_kosong", label: "Tanah Kosong" },
    { value: "mutasi_tanah", label: "Mutasi Tanah di Desa" },
    { value: "lain_lain", label: "Lain-lain" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusHakChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status_hak_tanah: value,
    }));
  };

  const handlePenggunaanChange = (value) => {
    setFormData((prev) => {
      const currentPenggunaan = prev.penggunaan_tanah || [];
      const newPenggunaan = currentPenggunaan.includes(value)
        ? currentPenggunaan.filter((item) => item !== value)
        : [...currentPenggunaan, value];

      return {
        ...prev,
        penggunaan_tanah: newPenggunaan,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.status_hak_tanah) {
      alert("Pilih Status Hak Tanah!");
      return;
    }

    if (formData.penggunaan_tanah.length === 0) {
      alert("Pilih minimal 1 Penggunaan Tanah!");
      return;
    }

    // TODO: Implement API call
    console.log("Form Data:", formData);

    alert(
      mode === "create"
        ? "Data tanah berhasil ditambahkan!"
        : "Data tanah berhasil diupdate!"
    );
    router.push("/admin/management-tanah");
  };

  const handleCancel = () => {
    router.push("/admin/management-tanah");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Identitas Dasar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Identitas Dasar
        </h3>

        <div className="space-y-4">
          {/* Nama Lengkap - READ ONLY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama_pemilik"
              value={formData.nama_pemilik}
              onChange={handleChange}
              readOnly={isIdentitasReadOnly}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                isIdentitasReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              required
            />
          </div>

          {/* Nomor Urut & Jumlah Luas - READ ONLY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Urut
              </label>
              <input
                type="number"
                name="nomor_urut"
                value={formData.nomor_urut}
                onChange={handleChange}
                readOnly={isIdentitasReadOnly}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  isIdentitasReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Luas (m²)
              </label>
              <input
                type="number"
                name="jumlah_luas"
                value={formData.jumlah_luas}
                onChange={handleChange}
                readOnly={isIdentitasReadOnly}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  isIdentitasReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="contoh: 120"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Status Hak Tanah */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Status Hak Tanah
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusHakOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="status_hak_tanah"
                value={option.value}
                checked={formData.status_hak_tanah === option.value}
                onChange={() => handleStatusHakChange(option.value)}
                className="w-4 h-4 text-teal-700 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section 3: Penggunaan Tanah */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Penggunaan Tanah
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {penggunaanTanahOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={option.value}
                checked={(formData.penggunaan_tanah || []).includes(
                  option.value
                )}
                onChange={() => handlePenggunaanChange(option.value)}
                className="w-4 h-4 text-teal-700 focus:ring-teal-500 rounded"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section 4: Keterangan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Keterangan:
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan lain (opsional)
          </label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Catatan lain (opsional)"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}
