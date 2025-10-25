import TanahForm from "@/components/admin/TanahForm";

export default function CreateTanahPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Management Tanah</h1>
        <p className="text-sm text-gray-500">
          Dashboard / Management Tanah / Input Data Tanah
        </p>
      </div>

      {/* Title */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Input Data Tanah
        </h2>
      </div>

      {/* Form */}
      <TanahForm mode="create" />
    </div>
  );
}
