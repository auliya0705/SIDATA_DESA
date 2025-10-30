import TanahForm from "@/components/admin/TanahForm";

export default function CreateTanahPage() {
  return (
    <div className="space-y-6">
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
