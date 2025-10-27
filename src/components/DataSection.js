"use client";
import { useState } from "react";
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

export default function DataSection({ title, dataTabs }) {
  const [activeTab1, setActiveTab1] = useState("Sudah Bersertifikat");
  const [activeTab2, setActiveTab2] = useState("Non Pertanian");
  const [activeIndex, setActiveIndex] = useState(0);

  // Data Status Hak Tanah Desa
  const pieData = [
    { name: "Sudah Bersertifikat", value: 1700 },
    { name: "Belum Bersertifikat", value: 800 },
  ];

  const dataSudah = [
    { name: "HM", value: 1450 },
    { name: "HGB", value: 1700 },
    { name: "HP", value: 25 },
    { name: "HGU", value: 50 },
    { name: "HPL", value: 5 },
  ];

  const dataBelum = [
    { name: "MA", value: 400 },
    { name: "VI", value: 300 },
    { name: "TN", value: 100 },
  ];

  // Data Penggunaan Tanah Desa
  const penggunaanData = [
  { name: "Pertanian", value: 1700 },
  { name: "Non Pertanian", value: 800 },
];

  const dataNonPertanian = [
    { name: "PRM", value: 1550 },
    { name: "PDJ", value: 200 },
    { name: "PKO", value: 400 },
    { name: "IND", value: 150 },
    { name: "FUM", value: 700 },
  ];

  const dataPertanian = [
    { name: "SWH", value: 1200 },
    { name: "TGL", value: 900 },
    { name: "PKB", value: 400 },
    { name: "PTR", value: 250 },
    { name: "HBL", value: 150 },
    { name: "HLL", value: 100 },
    { name: "MTD", value: 70 },
    { name: "TKS", value: 50 },
  ];

  // Hitung total dinamis
  const totalTanah = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <section className="w-full px-10 py-16 bg-white">
      {/* BAGIAN 1 */}
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
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
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
                activeTab1 === "Sudah Bersertifikat" ? dataSudah : dataBelum
              }
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                tickFormatter={(val) => `${val}`}
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

      {/* BAGIAN 2 */}
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
                {penggunaanData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
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
                tickFormatter={(val) => `${val}`}
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
