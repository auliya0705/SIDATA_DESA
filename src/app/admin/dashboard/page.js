"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";
import { isKepalaDesa } from "@/lib/auth";
import { Users, Layers, Ruler, Clock } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

// helper tampil angka
const nf = new Intl.NumberFormat("id-ID");
const fm2 = (n) => (n === "-" || n == null ? "-" : `${nf.format(n)} m²`);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const kepala = typeof window !== "undefined" ? isKepalaDesa() : false;

  // --- Breakpoint (lg) untuk mengatur posisi legend & label slice
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)"); // lg
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
    };
  }, []);
  const showSliceLabels = !isDesktop; // label slice hanya di mobile

  // --- Fetch dashboard
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiGet(API_ENDPOINTS.DASHBOARD); // GET /api/dashboard
        setData(res);
      } catch (err) {
        setError(err?.message || "Gagal memuat dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = useMemo(() => data?.cards ?? {}, [data]);
  const rincian = useMemo(() => data?.total_tanah?.rincian ?? {}, [data]);
  const activities = useMemo(() => data?.activity ?? [], [data]);

  // ===== Cards
  const cardItems = useMemo(() => {
    const base = [
      {
        key: "total_warga",
        title: "Total Warga",
        value: cards?.total_warga ?? "-",
        accent: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-600",
        Icon: Users,
      },
      {
        key: "total_tanah",
        title: "Total Tanah",
        value: cards?.total_tanah ?? "-",
        accent: "text-blue-600",
        badge: "bg-blue-50 text-blue-600",
        Icon: Layers,
      },
      {
        key: "total_luas_terpakai_m2",
        title: "Total Luas Terpakai",
        value: fm2(cards?.total_luas_terpakai_m2 ?? "-"),
        accent: "text-rose-600",
        badge: "bg-rose-50 text-rose-600",
        Icon: Ruler,
      },
    ];
    if (kepala) {
      base.push({
        key: "pending_approval",
        title: "Pending Approval",
        value: cards?.pending_approval ?? "-",
        accent: "text-amber-600",
        badge: "bg-amber-50 text-amber-600",
        Icon: Clock,
      });
    }
    return base;
  }, [cards, kepala]);

  // ===== Data Chart dari "rincian"
  // Status Hak: gabung bersertifikat + belum_bersertifikat
  const statusHakData = useMemo(() => {
    const bers = rincian?.status_hak?.bersertifikat ?? {};
    const belum = rincian?.status_hak?.belum_bersertifikat ?? {};
    const order = ["hm", "hgb", "hp", "hgu", "hpl", "ma", "vi", "tn"];
    const labelMap = {
      hm: "HM",
      hgb: "HGB",
      hp: "HP",
      hgu: "HGU",
      hpl: "HPL",
      ma: "MA",
      vi: "VI",
      tn: "TN",
    };
    return order
      .map((k) => ({ label: labelMap[k], value: (bers[k] ?? 0) + (belum[k] ?? 0) }))
      .filter((d) => d.value > 0);
  }, [rincian]);

  // Penggunaan Tanah: gabung non_pertanian + pertanian
  const penggunaanData = useMemo(() => {
    const np = rincian?.penggunaan?.non_pertanian ?? {};
    const pt = rincian?.penggunaan?.pertanian ?? {};
    const order = [
      "perumahan",
      "perdagangan_jasa",
      "perkantoran",
      "industri",
      "fasilitas_umum",
      "sawah",
      "tegalan",
      "perkebunan",
      "peternakan_perikanan",
      "hutan_belukar",
      "hutan_lindung",
      "mutasi_tanah",
      "tanah_kosong",
      "lain_lain",
    ];
    const labelMap = {
      perumahan: "PERUMAHAN",
      perdagangan_jasa: "PERDAGANGAN_JASA",
      perkantoran: "PERKANTORAN",
      industri: "INDUSTRI",
      fasilitas_umum: "FASILITAS_UMUM",
      sawah: "SAWAH",
      tegalan: "TEGALAN",
      perkebunan: "PERKEBUNAN",
      peternakan_perikanan: "PETERNAKAN_PERIKANAN",
      hutan_belukar: "HUTAN_BELUKAR",
      hutan_lindung: "HUTAN_LINDUNG",
      mutasi_tanah: "MUTASI_TANAH",
      tanah_kosong: "TANAH_KOSONG",
      lain_lain: "LAIN_LAIN",
    };
    return order
      .map((k) => ({ label: labelMap[k], value: (np[k] ?? 0) + (pt[k] ?? 0) }))
      .filter((d) => d.value > 0);
  }, [rincian]);

  const PIE_COLORS = [
    "#16a34a", "#2563eb", "#f43f5e", "#f59e0b", "#0ea5e9",
    "#a855f7", "#64748b", "#22c55e", "#3b82f6", "#ef4444",
    "#eab308", "#06b6d4", "#8b5cf6", "#94a3b8",
  ];

  const StatCard = ({ title, value, accent, badge, Icon }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-2">{title}</p>
        <div className={`text-5xl font-extrabold leading-none ${accent}`}>{value}</div>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${badge}`}>
        {Icon ? <Icon className="w-5 h-5" /> : null}
      </div>
    </div>
  );

  const gridColsLg = kepala ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Statistik Data</h2>
   
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          Memuat data dashboard…
        </div>
      )}
      {error && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 text-red-600">
          {error}
        </div>
      )}

      {/* Cards */}
      {!loading && !error && (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsLg} gap-6`}>
          {cardItems.map((it) => (
            <StatCard key={it.key} title={it.title} value={it.value} accent={it.accent} badge={it.badge} Icon={it.Icon} />
          ))}
        </div>
      )}

      {/* Charts */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* ==================== Pie: Status Hak ==================== */}
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Hak (m²)</h3>
  <div className="h-72 md:h-80 chart-nofocus">   {/* <- tambah class */}
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 12, right: 12, bottom: 8, left: 12 }}>
        <Pie
          data={statusHakData}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius="48%"
          outerRadius="70%"
          labelLine={false}
          label={false}
        >
          {statusHakData.map((_, i) => (
            <Cell key={`sh-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v, n) => [`${nf.format(v)} m²`, n]} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ marginTop: 12 }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

{/* ==================== Pie: Penggunaan Tanah ==================== */}
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Penggunaan Tanah (m²)</h3>
  <div className="h-72 md:h-80 chart-nofocus">  {/* <- tambah class */}
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 12, right: 12, bottom: 8, left: 12 }}>
        <Pie
          data={penggunaanData}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius="48%"
          outerRadius="70%"
          labelLine={false}
          label={false}
        >
          {penggunaanData.map((_, i) => (
            <Cell key={`pg-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v, n) => [`${nf.format(v)} m²`, n]} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ marginTop: 12 }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>


        </div>
      )}

      {/* Recent Activities */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Belum ada aktivitas terbaru</div>
          ) : (
            <ul className="divide-y">
              {activities.slice(0, 10).map((a) => (
                <li key={a.id} className="py-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      [{a.status?.toUpperCase()}] {a.jenis_perubahan} {a.module}
                      {a.target_id ? ` #${a.target_id}` : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.action} • diajukan {a.submitted_by?.name} •{" "}
                      {new Date(a.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    direview {a.reviewed_by?.name} •{" "}
                    {a.reviewed_at ? new Date(a.reviewed_at).toLocaleString() : "-"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
<style jsx global>{`
  /* Matikan fokus outline di semua elemen dalam chart */
  .chart-nofocus :focus,
  .chart-nofocus svg:focus,
  .chart-nofocus .recharts-surface:focus {
    outline: none !important;
  }
`}</style>
