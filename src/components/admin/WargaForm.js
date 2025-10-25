"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WargaForm({ initialData = null, mode = "create" }) {
  const router = useRouter();
  const [formData, setFormData] = useState(
    initialData || {
      nama_lengkap: "",
      jenis_kelamin: "",
      status_perkawinan: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      agama: "",
      pendidikan_terakhir: "",
      pekerjaan: "",
      kewarganegaraan: "",
      kedudukan_keluarga: "",
      alamat_lengkap: "",
      nomor_ktp: "",
      catatan: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Implement API call
    console.log("Form Data:", formData);

    // Simulate API call
    alert(
      mode === "create"
        ? "Data berhasil ditambahkan!"
        : "Data berhasil diupdate!"
    );

    // Redirect back to list
    router.push("/admin/management-warga");
  };

  const handleCancel = () => {
    router.push("/admin/management-warga");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Identitas Dasar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Identitas Dasar
        </h3>

        <div className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Jenis Kelamin & Status Perkawinan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">-- pilih --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Perkawinan
              </label>
              <select
                name="status_perkawinan"
                value={formData.status_perkawinan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">-- pilih --</option>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>
          </div>

          {/* Tempat Lahir & Tanggal Lahir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Agama • Pendidikan • Pekerjaan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Agama • Pendidikan • Pekerjaan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Agama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agama
            </label>
            <select
              name="agama"
              value={formData.agama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              <option value="">-- pilih --</option>
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
          </div>

          {/* Pendidikan Terakhir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pendidikan Terakhir
            </label>
            <select
              name="pendidikan_terakhir"
              value={formData.pendidikan_terakhir}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              <option value="">-- pilih --</option>
              <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          {/* Pekerjaan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pekerjaan
            </label>
            <input
              type="text"
              name="pekerjaan"
              value={formData.pekerjaan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="contoh: PNS, Guru, Petani"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 3: Kependudukan dan Alamat */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Kependudukan dan Alamat
        </h3>

        <div className="space-y-4">
          {/* Kewarganegaraan & Kedudukan dalam Keluarga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kewarganegaraan
              </label>
              <select
                name="kewarganegaraan"
                value={formData.kewarganegaraan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">-- pilih --</option>
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kedudukan dalam Keluarga
              </label>
              <select
                name="kedudukan_keluarga"
                value={formData.kedudukan_keluarga}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">-- pilih --</option>
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              name="alamat_lengkap"
              value={formData.alamat_lengkap}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Dusun/RT/RW, Desa, Kec., Kab/Kota"
              required
            />
          </div>

          {/* Nomor KTP (NIK) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor KTP (NIK)
            </label>
            <input
              type="text"
              name="nomor_ktp"
              value={formData.nomor_ktp}
              onChange={handleChange}
              maxLength={16}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
              placeholder="16 digit"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 4: Catatan Lain */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Catatan Lain
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan lain (opsional)
          </label>
          <textarea
            name="catatan"
            value={formData.catatan}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Tambahkan catatan jika diperlukan..."
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
