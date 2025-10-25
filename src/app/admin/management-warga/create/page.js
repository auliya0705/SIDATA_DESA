import WargaForm from "@/components/admin/WargaForm";

export default function CreateWargaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Management Warga</h1>
        <p className="text-sm text-gray-500">
          Dashboard / Management Warga / Tambah Penduduk
        </p>
      </div>

      {/* Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">Tambah Penduduk</h2>
      </div>

      {/* Form */}
      <WargaForm mode="create" />
    </div>
  );
}
