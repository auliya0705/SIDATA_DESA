"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon } from "lucide-react";

function sanitizeInitial(data) {
  if (!data) {
    return {
      nama_lengkap: "",
      jenis_kelamin: "",
      nik: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      agama: "",
      status_perkawinan: "",
      pendidikan_terakhir: "",
      pekerjaan: "",
      kewarganegaraan: "WNI",
      alamat_lengkap: "",
      keterangan: "",
      foto_ktp: null,
      foto_ktp_existing: null,
    };
  }
  return {
    nama_lengkap: data.nama_lengkap ?? "",
    jenis_kelamin: data.jenis_kelamin ?? "",
    nik: data.nik ?? "",
    tempat_lahir: data.tempat_lahir ?? "",
    tanggal_lahir: data.tanggal_lahir ?? "",
    agama: data.agama ?? "",
    status_perkawinan: data.status_perkawinan ?? "",
    pendidikan_terakhir: data.pendidikan_terakhir ?? "",
    pekerjaan: data.pekerjaan ?? "",
    kewarganegaraan: data.kewarganegaraan ?? "WNI",
    alamat_lengkap: data.alamat_lengkap ?? "",
    keterangan: data.keterangan ?? "",
    foto_ktp: null,
    foto_ktp_existing: data.foto_ktp_existing ?? null,
  };
}

export default function WargaForm({
  initialData = null,
  mode = "create",
  onSubmit,
  loading = false,
}) {
  const router = useRouter();

  const [formData, setFormData] = useState(sanitizeInitial(initialData));

  const [previewImage, setPreviewImage] = useState(
    initialData?.foto_ktp_existing
      ? `http://127.0.0.1:8000/storage/${initialData.foto_ktp_existing}`
      : null
  );

  // Saat initialData berubah (halaman edit), set formData & preview ulang
  useEffect(() => {
    const sanitized = sanitizeInitial(initialData);
    setFormData(sanitized);
    setPreviewImage(
      sanitized.foto_ktp_existing
        ? `http://127.0.0.1:8000/storage/${sanitized.foto_ktp_existing}`
        : null
    );
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar!");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB!");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        foto_ktp: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      foto_ktp: null,
    }));
    setPreviewImage(
      formData.foto_ktp_existing
        ? `http://127.0.0.1:8000/storage/${formData.foto_ktp_existing}`
        : null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{16}$/.test(formData.nik ?? "")) {
      alert("NIK harus 16 digit angka!");
      return;
    }

    if (onSubmit) {
      await onSubmit(formData);
    }
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
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* NIK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIK (16 digit) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nik"
              value={formData.nik ?? ""}
              onChange={handleChange}
              maxLength={16}
              pattern="\d{16}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
              placeholder="3201123456781221"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Masukkan 16 digit angka NIK sesuai KTP
            </p>
          </div>

          {/* Jenis Kelamin & Status Perkawinan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">-- Pilih --</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Perkawinan <span className="text-red-500">*</span>
              </label>
              <select
                name="status_perkawinan"
                value={formData.status_perkawinan ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">-- Pilih --</option>
                {/* Sesuai enum di DB */}
                <option value="BELUM KAWIN">Belum Kawin</option>
                <option value="KAWIN">Kawin</option>
                <option value="CERAI HIDUP">Cerai Hidup</option>
                <option value="CERAI MATI">Cerai Mati</option>
              </select>
            </div>
          </div>

          {/* Tempat Lahir & Tanggal Lahir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tempat_lahir"
                value={formData.tempat_lahir ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Contoh: Semarang"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Agama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agama <span className="text-red-500">*</span>
            </label>
            <select
              name="agama"
              value={formData.agama ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              <option value="">-- Pilih --</option>
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Pendidikan & Pekerjaan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Pendidikan & Pekerjaan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pendidikan Terakhir */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pendidikan Terakhir
            </label>
            <select
              name="pendidikan_terakhir"
              value={formData.pendidikan_terakhir ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">-- Pilih --</option>
              <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
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
              value={formData.pekerjaan ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Contoh: PNS, Petani, Wiraswasta"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Alamat & Kewarganegaraan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Alamat & Kewarganegaraan
        </h3>

        <div className="space-y-4">
          {/* Kewarganegaraan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kewarganegaraan <span className="text-red-500">*</span>
            </label>
            <select
              name="kewarganegaraan"
              value={formData.kewarganegaraan ?? "WNI"}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              <option value="WNI">WNI (Warga Negara Indonesia)</option>
              <option value="WNA">WNA (Warga Negara Asing)</option>
            </select>
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              name="alamat_lengkap"
              value={formData.alamat_lengkap ?? ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Dusun/RT/RW, Desa, Kecamatan, Kabupaten"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Foto KTP */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Foto KTP (Opsional)
        </h3>

        <div className="space-y-4">
          {/* Preview Image */}
          {previewImage && (
            <div className="relative w-full max-w-md">
              <img
                src={previewImage}
                alt="Preview KTP"
                className="w-full h-auto rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Upload Button */}
          <div>
            <label className="block">
              <div className="flex items-center justify-center w-full max-w-md px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                <div className="flex flex-col items-center space-y-2 text-center">
                  {previewImage ? (
                    <>
                      <ImageIcon className="text-teal-600" size={24} />
                      <span className="text-sm text-gray-600">
                        Klik untuk ganti foto
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-400" size={24} />
                      <span className="text-sm text-gray-600">
                        Upload foto KTP (maks. 2MB)
                      </span>
                      <span className="text-xs text-gray-500">
                        JPG, PNG, WebP
                      </span>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Section 5: Keterangan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-4 border-b border-teal-200 pb-2">
          Keterangan Tambahan
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keterangan (opsional)
          </label>
          <textarea
            name="keterangan"
            value={formData.keterangan ?? ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Tambahkan keterangan jika diperlukan..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Simpan Proposal</span>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Catatan:</strong> Data yang Anda submit akan menjadi
          proposal yang perlu disetujui oleh Kepala Desa terlebih dahulu sebelum
          masuk ke sistem.
        </p>
      </div>
    </form>
  );
}
