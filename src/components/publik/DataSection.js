"use client";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/fetcher";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
const COLORS = ["#005f56", "#b46a1f"];

const API_URL = "http://127.0.0.1:8000/api/public/infografis/summary";

// singkatan + keterangan untuk tooltip
const labelMap = {
  HM: "Hak Milik",
  HGB: "Hak Guna Bangunan",
  HP: "Hak Pakai",
  HGU: "Hak Guna Usaha",
  HPL: "Hak Pengelolaan",

  MA: "Hak Milik Adat",
  VI: "Hak Verponding Indonesia (milik pribumi)",
  TN: "Tanah Negara",

  PRM: "Perumahan",
  PDJ: "Perdagangan & Jasa",
  PKO: "Perkantoran",
  IND: "Industri",
  FUM: "Fasilitas Umum",

  SWH: "Sawah",
  TGL: "Tegalan",
  PKB: "Perkebunan",
  PTR: "Peternakan/Perikanan",
  HBL: "Hutan Belukar",
  HLL: "Hutan Lebat/Lindung",
  MTD: "Mutasi Tanah Desa",
  TKS: "Tanah Kosong",
};

// Custom Active Shape
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${value} bidang`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey + 18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

export default function DataSection() {
  const [dataAPI, setDataAPI] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab1, setActiveTab1] = useState("Sudah Bersertifikat");
  const [activeTab2, setActiveTab2] = useState("Non Pertanian");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      console.log("🚀 Fetching:", API_URL);
      try {
        const data = await fetcher(API_URL);
        console.log("✅ Data diterima:", data);
        setDataAPI(data);
      } catch (err) {
        console.error("❌ Fetch gagal:", err);
        setError(err.message);
      }
    };
    getData();
  }, []);

  if (error) return <p className="text-center text-red-600 py-10">Gagal memuat data: {error}</p>;
  if (!dataAPI) return <p className="text-center py-10">Memuat data...</p>;

  const pieData = [
    { name: "Sudah Bersertifikat", value: dataAPI.ringkasan.bersertifikat_m2 },
    { name: "Belum Bersertifikat", value: dataAPI.ringkasan.belum_sertifikat_m2 },
  ];

  const dataSudah = Object.entries(dataAPI.rincian.status_hak.bersertifikat)
    .map(([key, value]) => ({ name: key.toUpperCase(), value }));

  const dataBelum = Object.entries(dataAPI.rincian.status_hak.belum_bersertifikat)
    .map(([key, value]) => ({ name: key.toUpperCase(), value }));

  const penggunaanData = [
    { name: "Non Pertanian", value: dataAPI.ringkasan.non_pertanian_m2 },
    { name: "Pertanian", value: dataAPI.ringkasan.pertanian_m2 },
  ];

  const dataNonPertanian = Object.entries(dataAPI.rincian.penggunaan.non_pertanian)
    .map(([key, value]) => ({ name: key.slice(0, 3).toUpperCase(), value }));

  const dataPertanian = Object.entries(dataAPI.rincian.penggunaan.pertanian)
    .map(([key, value]) => ({ name: key.slice(0, 3).toUpperCase(), value }));

  const totalTanah = pieData.reduce((sum, d) => sum + d.value, 0) || 0;
  // const [activeTab1, setActiveTab1] = useState("Sudah Bersertifikat");
  // const [activeTab2, setActiveTab2] = useState("Non Pertanian");
  // const [activeIndex, setActiveIndex] = useState(0);
  // const [dataAPI, setDataAPI] = useState(null);

  // // Ambil data dari backend
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const result = await fetchDataSection();
  //       setDataAPI(result);
  //     } catch (error) {
  //       console.error("Gagal memuat data:", error);
  //     }
  //   };
  //   loadData();
  // }, []);

  // // Tampilkan loading state
  // if (!dataAPI) return <p className="text-center py-10">Memuat data...</p>;

  // // 🔹 Format data dari API agar cocok dengan chart
  // const pieData = [
  //   {
  //     name: "Sudah Bersertifikat",
  //     value: dataAPI.ringkasan.bersertifikat_m2,
  //   },
  //   {
  //     name: "Belum Bersertifikat",
  //     value: dataAPI.ringkasan.belum_sertifikat_m2,
  //   },
  // ];

  // const dataSudah = Object.entries(
  //   dataAPI.rincian.status_hak.bersertifikat
  // ).map(([key, value]) => ({ name: key.toUpperCase(), value }));

  // const dataBelum = Object.entries(
  //   dataAPI.rincian.status_hak.belum_bersertifikat
  // ).map(([key, value]) => ({ name: key.toUpperCase(), value }));

  // const penggunaanData = [
  //   {
  //     name: "Non Pertanian",
  //     value: dataAPI.ringkasan.non_pertanian_m2,
  //   },
  //   {
  //     name: "Pertanian",
  //     value: dataAPI.ringkasan.pertanian_m2,
  //   },
  // ];

  // const dataNonPertanian = Object.entries(
  //   dataAPI.rincian.penggunaan.non_pertanian
  // ).map(([key, value]) => ({
  //   name: key.slice(0, 3).toUpperCase(),
  //   value,
  // }));

  // const dataPertanian = Object.entries(
  //   dataAPI.rincian.penggunaan.pertanian
  // ).map(([key, value]) => ({
  //   name: key.slice(0, 3).toUpperCase(),
  //   value,
  // }));

  // const totalTanah =
  //   pieData.reduce((sum, d) => sum + d.value, 0) || 0;

  return (
    <section className="w-full px-10 py-16 bg-white">
      {/* ===== BAGIAN 1 ===== */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-center text-2xl font-bold text-teal-900 mb-8">
          Desa Status Hak Tanah Desa
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Donut Chart */}
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Total {totalTanah} bidang tanah
          </p>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-2xl p-6 transition-all duration-500">
          <div className="flex border-b mb-4">
            {["Sudah Bersertifikat", "Belum Bersertifikat"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab1(tab)}
                className={`flex-1 py-2 font-semibold transition ${
                  activeTab1 === tab
                    ? "border-b-4 border-teal-700 text-teal-800"
                    : "text-gray-500 hover:text-teal-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={
                activeTab1 === "Sudah Bersertifikat"
                  ? dataSudah
                  : dataBelum
              }
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value}`,
                  labelMap[props.payload.name],
                ]}
              />
              <Bar dataKey="value" fill="#066E63" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== BAGIAN 2 ===== */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-center text-2xl font-bold text-teal-900 mb-8">
          Desa Penggunaan Tanah Desa
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Donut Chart */}
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={penggunaanData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {penggunaanData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Total {totalTanah} bidang tanah
          </p>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-2xl p-6 transition-all duration-500">
          <div className="flex border-b mb-4">
            {["Non Pertanian", "Pertanian"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab2(tab)}
                className={`flex-1 py-2 font-semibold transition ${
                  activeTab2 === tab
                    ? "border-b-4 border-teal-700 text-teal-800"
                    : "text-gray-500 hover:text-teal-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={
                activeTab2 === "Non Pertanian"
                  ? dataNonPertanian
                  : dataPertanian
              }
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value}`,
                  labelMap[props.payload.name],
                ]}
              />
              <Bar dataKey="value" fill="#066E63" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}