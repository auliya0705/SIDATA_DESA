"use client";
import { useState } from "react";

export default function FilterPopup({
  kategori,
  setKategori,
  filter,
  setFilter,
  setAppliedFilter,
}) {
  const [selected, setSelected] = useState({ status: "", bidang: "" });

  const sertif = ["HM", "HGB", "HP", "HGU", "HPL"];
  const nonSertif = ["MA", "VI", "TN"];
  const pertanian = ["SWH", "TGL", "PKB", "PTR", "HBL", "HLL", "MTD", "TKS"];
  const nonPertanian = ["PRM", "PDJ", "PKO", "IND", "FUM"];

  const handleTerapkan = () => {
    setAppliedFilter({
      kategori,
      bidang: selected.bidang,
    });
  };

  return (
    <div className="w-125 bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
      {/* Tabs */}
      <div className="flex mb-4 bg-gray-100 rounded-lg">
        <button
          onClick={() => {
            setKategori("status");
            setSelected({ bidang: "" });
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
            kategori === "status"
              ? "bg-emerald-700 text-white"
              : "text-gray-500"
          }`}
        >
          STATUS HAK TANAH (m²)
        </button>
        <button
          onClick={() => {
            setKategori("penggunaan");
            setSelected({ bidang: "" });
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
            kategori === "penggunaan"
              ? "bg-emerald-700 text-white"
              : "text-gray-500"
          }`}
        >
          PENGGUNAAN TANAH (m²)
        </button>
      </div>

      {/* Detail Section */}
      <div>
        <h3 className="text-gray-700 text-sm font-semibold mb-2">Detail</h3>

        {/* Jika kategori = status */}
        {kategori === "status" && (
          <div className="space-y-3">
            {/* Sudah Bersertifikat */}
            <div>
              <div className="text-sm font-medium border border-emerald-200 rounded-lg p-2 mb-2">
                Sudah Bersertifikat
              </div>
              <div className="flex flex-wrap gap-2">
                {sertif.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelected({ bidang: s })}
                    className={`px-3 py-1 text-sm rounded-md border transition ${
                      selected.bidang === s
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Belum Bersertifikat */}
            <div>
              <div className="text-sm font-medium bg-gray-100 rounded-lg p-2 mb-2">
                Belum Bersertifikat
              </div>
              <div className="flex flex-wrap gap-2">
                {nonSertif.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelected({ bidang: s })}
                    className={`px-3 py-1 text-sm rounded-md border transition ${
                      selected.bidang === s
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Jika kategori = penggunaan */}
        {kategori === "penggunaan" && (
          <div className="space-y-3">
            {/* Pertanian */}
            <div>
              <div className="text-sm font-medium border border-emerald-200 rounded-lg p-2 mb-2">
                Pertanian
              </div>
              <div className="flex flex-wrap gap-2">
                {pertanian.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelected({ bidang: p })}
                    className={`px-3 py-1 text-sm rounded-md border transition ${
                      selected.bidang === p
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Non Pertanian */}
            <div>
              <div className="text-sm font-medium bg-gray-100 rounded-lg p-2 mb-2">
                Non Pertanian
              </div>
              <div className="flex flex-wrap gap-2">
                {nonPertanian.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelected({ bidang: p })}
                    className={`px-3 py-1 text-sm rounded-md border transition ${
                      selected.bidang === p
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tombol Terapkan */}
      <button
        onClick={handleTerapkan}
        className="w-full mt-4 bg-emerald-700 text-white font-semibold py-2 rounded-lg hover:bg-emerald-800 transition"
      >
        Terapkan
      </button>
    </div>
  );
}
