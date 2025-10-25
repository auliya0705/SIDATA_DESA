export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Selamat Datang di Dashboard Admin
        </h2>
        <p className="text-gray-600">
          Kelola data desa dengan mudah dan efisien melalui sistem SIDATA DESA
        </p>
      </div>

      {/* Stats Cards - Coming Soon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Warga", value: "-", color: "bg-blue-500" },
          { title: "Total Tanah", value: "-", color: "bg-green-500" },
          { title: "Sertifikat Aktif", value: "-", color: "bg-yellow-500" },
          { title: "Pending Approval", value: "-", color: "bg-red-500" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg opacity-20`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section - Coming Soon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Statistik Penggunaan Tanah
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will be displayed here
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Status Sertifikat Tanah
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will be displayed here
          </div>
        </div>
      </div>

      {/* Recent Activities - Coming Soon */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Aktivitas Terbaru
        </h3>
        <div className="text-center py-8 text-gray-400">
          Belum ada aktivitas terbaru
        </div>
      </div>
    </div>
  );
}
