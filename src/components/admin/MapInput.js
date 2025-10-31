"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import { Trash2, Save, RotateCcw } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Pongangan boundary coordinates (EXACT from OSM - 302 points)
// Pongangan boundary coordinates (EXACT from OSM)
// Total points: 302
const PONGANGAN_BOUNDARY = [
  [-7.0476196, 110.35987],
  [-7.0482884, 110.3598041],
  [-7.0485183, 110.3596613],
  [-7.0487261, 110.3594307],
  [-7.0490112, 110.3593531],
  [-7.049649, 110.3592895],
  [-7.0498708, 110.3593249],
  [-7.0500877, 110.3593688],
  [-7.0506059, 110.3593053],
  [-7.0508896, 110.3592358],
  [-7.0514261, 110.3589828],
  [-7.0521948, 110.3591019],
  [-7.0523217, 110.3589523],
  [-7.0524391, 110.3588713],
  [-7.0525902, 110.3586371],
  [-7.0528624, 110.3585432],
  [-7.0530447, 110.3584561],
  [-7.053195, 110.3586459],
  [-7.0534161, 110.3588835],
  [-7.0536334, 110.3592051],
  [-7.0537342, 110.35936],
  [-7.0539311, 110.3594056],
  [-7.0540445, 110.3593819],
  [-7.0543663, 110.3595722],
  [-7.0546562, 110.3596268],
  [-7.0551181, 110.3599458],
  [-7.055375, 110.3601307],
  [-7.0559524, 110.3601141],
  [-7.0558079, 110.3597506],
  [-7.055973, 110.3596219],
  [-7.0564508, 110.3592357],
  [-7.0569095, 110.359311],
  [-7.0571568, 110.3596444],
  [-7.0574793, 110.3598203],
  [-7.0576983, 110.3597715],
  [-7.0581897, 110.3596292],
  [-7.0585787, 110.3594662],
  [-7.0588131, 110.3594303],
  [-7.0588209, 110.3595199],
  [-7.0587384, 110.3597157],
  [-7.0584319, 110.3602633],
  [-7.0585461, 110.360636],
  [-7.058822, 110.3611822],
  [-7.059019, 110.3615174],
  [-7.0591441, 110.3617749],
  [-7.059208, 110.3620753],
  [-7.0592159, 110.3623221],
  [-7.0592931, 110.3624723],
  [-7.0593916, 110.3626171],
  [-7.0594236, 110.3628371],
  [-7.0593677, 110.3629551],
  [-7.0593171, 110.3629953],
  [-7.0594342, 110.3633145],
  [-7.0594739, 110.3633522],
  [-7.0599123, 110.3633496],
  [-7.0600711, 110.3633739],
  [-7.0602811, 110.3634061],
  [-7.0604354, 110.363634],
  [-7.0605464, 110.3638092],
  [-7.0605931, 110.3638725],
  [-7.0606522, 110.3639552],
  [-7.0607231, 110.3640508],
  [-7.0607838, 110.364134],
  [-7.0608575, 110.364236],
  [-7.0609024, 110.3643101],
  [-7.0609727, 110.3643925],
  [-7.0611313, 110.3646017],
  [-7.0612362, 110.3647357],
  [-7.061129, 110.3650473],
  [-7.0611223, 110.3650639],
  [-7.0620167, 110.3652645],
  [-7.0622035, 110.3654324],
  [-7.0622331, 110.3656059],
  [-7.0622773, 110.365808],
  [-7.0622519, 110.3658879],
  [-7.0623113, 110.3660948],
  [-7.0625112, 110.3664782],
  [-7.0628575, 110.3667319],
  [-7.0631136, 110.3669497],
  [-7.0632719, 110.3671768],
  [-7.0634263, 110.367349],
  [-7.0636129, 110.3674336],
  [-7.0637961, 110.3675219],
  [-7.0641096, 110.3675797],
  [-7.0637655, 110.3692099],
  [-7.0633399, 110.3692349],
  [-7.0631875, 110.3700951],
  [-7.0627456, 110.370299],
  [-7.0626711, 110.3709963],
  [-7.062506, 110.3712967],
  [-7.0626018, 110.371742],
  [-7.0625486, 110.3721872],
  [-7.062538, 110.3728256],
  [-7.0625418, 110.3731271],
  [-7.0619395, 110.3732002],
  [-7.0615377, 110.3731816],
  [-7.0609449, 110.3733451],
  [-7.0603715, 110.3736714],
  [-7.0599796, 110.3739018],
  [-7.0595538, 110.3738114],
  [-7.0592761, 110.3735149],
  [-7.0590652, 110.373161],
  [-7.0588067, 110.3730368],
  [-7.0583381, 110.3730566],
  [-7.0578507, 110.3733541],
  [-7.0573918, 110.3735653],
  [-7.0571859, 110.3733311],
  [-7.057147, 110.3729003],
  [-7.0568973, 110.3721538],
  [-7.0563501, 110.371683],
  [-7.0561665, 110.3716652],
  [-7.0555691, 110.3720783],
  [-7.0553916, 110.3719375],
  [-7.0548226, 110.3721834],
  [-7.0546408, 110.3723465],
  [-7.0543216, 110.3723866],
  [-7.0541386, 110.3724641],
  [-7.0539713, 110.3724924],
  [-7.0537501, 110.3725658],
  [-7.0536422, 110.372633],
  [-7.0535528, 110.3725927],
  [-7.0533545, 110.3726003],
  [-7.0532562, 110.3724629],
  [-7.0532409, 110.3721651],
  [-7.0532109, 110.3719715],
  [-7.05294, 110.3718523],
  [-7.05237, 110.3718013],
  [-7.0520861, 110.3717668],
  [-7.0519536, 110.3719657],
  [-7.0511058, 110.372235],
  [-7.0507637, 110.3723099],
  [-7.0504299, 110.3721674],
  [-7.0502162, 110.3718828],
  [-7.0498885, 110.3718434],
  [-7.0496359, 110.3718117],
  [-7.0492598, 110.3722885],
  [-7.0488156, 110.3726892],
  [-7.0486291, 110.3727801],
  [-7.0484806, 110.3729162],
  [-7.0481255, 110.3731514],
  [-7.0479901, 110.3732351],
  [-7.0479612, 110.3738849],
  [-7.0477829, 110.3741542],
  [-7.0475034, 110.3743068],
  [-7.0473092, 110.3744173],
  [-7.0471758, 110.3744541],
  [-7.0469256, 110.3744541],
  [-7.0467629, 110.3743802],
  [-7.0466228, 110.3743166],
  [-7.0461733, 110.3742289],
  [-7.0456012, 110.3742594],
  [-7.0451462, 110.3742802],
  [-7.0449824, 110.374379],
  [-7.0449936, 110.3745368],
  [-7.04507, 110.3750476],
  [-7.0451208, 110.3755055],
  [-7.0450656, 110.375793],
  [-7.0449128, 110.376241],
  [-7.0446686, 110.3763096],
  [-7.0444141, 110.3765444],
  [-7.0442078, 110.376535],
  [-7.0438357, 110.3764087],
  [-7.0434607, 110.3763288],
  [-7.0429228, 110.3763097],
  [-7.0425043, 110.3767965],
  [-7.0422073, 110.377199],
  [-7.0421482, 110.3775416],
  [-7.0422512, 110.3778766],
  [-7.042347, 110.3781931],
  [-7.0422109, 110.3783886],
  [-7.0418542, 110.3784594],
  [-7.0416057, 110.3782386],
  [-7.0413305, 110.3780044],
  [-7.040698, 110.377612],
  [-7.0401908, 110.3775494],
  [-7.0398005, 110.3777225],
  [-7.0396361, 110.3779391],
  [-7.0394242, 110.3784506],
  [-7.0392679, 110.3785844],
  [-7.0390847, 110.3787372],
  [-7.0388065, 110.3789665],
  [-7.0385404, 110.3790138],
  [-7.0382982, 110.3789044],
  [-7.038229, 110.3787221],
  [-7.0381589, 110.3787184],
  [-7.038091, 110.378666],
  [-7.0379749, 110.3786637],
  [-7.038029, 110.3783362],
  [-7.0380408, 110.3783362],
  [-7.0379144, 110.3780457],
  [-7.0377811, 110.3778712],
  [-7.0375365, 110.3777593],
  [-7.0380354, 110.377231],
  [-7.0383158, 110.3771371],
  [-7.0384038, 110.3771535],
  [-7.0386952, 110.3769934],
  [-7.0390475, 110.3771801],
  [-7.0391795, 110.3771304],
  [-7.0392948, 110.3770091],
  [-7.0392999, 110.3766622],
  [-7.0393933, 110.376585],
  [-7.0396542, 110.3766881],
  [-7.0399061, 110.3769673],
  [-7.0401792, 110.3770701],
  [-7.0402215, 110.3768124],
  [-7.0403586, 110.3765149],
  [-7.0404872, 110.376547],
  [-7.040687, 110.3763846],
  [-7.0407722, 110.3763409],
  [-7.0409266, 110.3764123],
  [-7.0410344, 110.3763759],
  [-7.0411386, 110.376274],
  [-7.0413343, 110.3759271],
  [-7.0413436, 110.3754668],
  [-7.0415997, 110.3748833],
  [-7.04165, 110.3748244],
  [-7.0416985, 110.3747125],
  [-7.0418741, 110.3746448],
  [-7.041974, 110.3745281],
  [-7.0419787, 110.3744478],
  [-7.042707, 110.3739705],
  [-7.0428767, 110.3733756],
  [-7.0430508, 110.3732736],
  [-7.0430932, 110.373132],
  [-7.0429421, 110.3728855],
  [-7.0429419, 110.3727533],
  [-7.0430242, 110.3726155],
  [-7.0434914, 110.3723286],
  [-7.0434968, 110.3722184],
  [-7.0433697, 110.3717781],
  [-7.0435237, 110.3717889],
  [-7.043766, 110.3719978],
  [-7.0438816, 110.3720417],
  [-7.0440026, 110.372014],
  [-7.0441618, 110.371733],
  [-7.0441282, 110.3713421],
  [-7.0443426, 110.3712427],
  [-7.0443369, 110.3710389],
  [-7.0444192, 110.3708791],
  [-7.0446789, 110.3708135],
  [-7.0446853, 110.3704025],
  [-7.044553, 110.3701989],
  [-7.0446406, 110.3698574],
  [-7.0448991, 110.3698075],
  [-7.0447947, 110.3695733],
  [-7.044585, 110.369428],
  [-7.0446453, 110.3692847],
  [-7.0449092, 110.3691687],
  [-7.0449545, 110.3690447],
  [-7.0449313, 110.3688884],
  [-7.0447384, 110.3689652],
  [-7.0446504, 110.3689543],
  [-7.0446338, 110.3688773],
  [-7.0446688, 110.3687924],
  [-7.0448866, 110.3686952],
  [-7.0449746, 110.3687171],
  [-7.0450185, 110.3686235],
  [-7.0449544, 110.3685373],
  [-7.0448887, 110.3683421],
  [-7.0447565, 110.3682437],
  [-7.0445957, 110.368369],
  [-7.0443419, 110.3683383],
  [-7.0439425, 110.3684426],
  [-7.0434395, 110.3681479],
  [-7.0432191, 110.3679556],
  [-7.0430531, 110.367802],
  [-7.0427913, 110.3676084],
  [-7.0426398, 110.3670184],
  [-7.0426149, 110.366906],
  [-7.0424799, 110.3665046],
  [-7.0425371, 110.3663106],
  [-7.0426631, 110.3658982],
  [-7.042886, 110.365156],
  [-7.0428213, 110.3645784],
  [-7.0427122, 110.3641233],
  [-7.0426444, 110.3638644],
  [-7.0425813, 110.3636555],
  [-7.0425544, 110.3633993],
  [-7.0425584, 110.363167],
  [-7.0424892, 110.3630314],
  [-7.0422163, 110.362742],
  [-7.042054, 110.3625491],
  [-7.0418469, 110.3622819],
  [-7.041664, 110.3620217],
  [-7.0415536, 110.3617143],
  [-7.0416575, 110.36136],
  [-7.0416054, 110.3609757],
  [-7.0414308, 110.3607719],
  [-7.041829, 110.3605304],
  [-7.0421641, 110.360439],
  [-7.0425924, 110.3605032],
  [-7.0429917, 110.3605703],
  [-7.0433312, 110.3605369],
  [-7.0439114, 110.3602804],
  [-7.0452784, 110.3603186],
  [-7.0454733, 110.360348],
  [-7.0460492, 110.3607229],
  [-7.0461807, 110.3607337],
  [-7.0463559, 110.3606896],
  [-7.046695, 110.3602504],
  [-7.0469577, 110.3600966],
  [-7.0476196, 110.35987],
];

// Component untuk handle click events
function MapClickHandler({ isDrawing, onAddPoint }) {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        onAddPoint([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

export default function MapInput({
  initialCoordinates = null,
  onSave,
  height = "500px",
}) {
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saved, setSaved] = useState(false);
  const mapRef = useRef();

  // Load initial coordinates if provided
  useEffect(() => {
    if (
      initialCoordinates &&
      Array.isArray(initialCoordinates) &&
      initialCoordinates.length > 0
    ) {
      // Assume initialCoordinates is [[lat, lng], ...]
      setPoints(initialCoordinates);
      setSaved(true);
    }
  }, [initialCoordinates]);

  const handleAddPoint = (point) => {
    setPoints((prev) => [...prev, point]);
    setSaved(false);
  };

  const handleStartDrawing = () => {
    if (points.length > 0) {
      if (
        !confirm("Menggambar polygon baru akan menghapus yang lama. Lanjutkan?")
      ) {
        return;
      }
    }
    setPoints([]);
    setIsDrawing(true);
    setSaved(false);
  };

  const handleFinishDrawing = () => {
    if (points.length < 3) {
      alert("Polygon harus memiliki minimal 3 titik!");
      return;
    }
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (points.length < 3) {
      alert("Polygon harus memiliki minimal 3 titik!");
      return;
    }

    // Convert to GeoJSON format: [[[lng, lat], ...]]
    // Leaflet uses [lat, lng], but GeoJSON uses [lng, lat]
    const geoJsonCoordinates = points.map(([lat, lng]) => [lng, lat]);

    // Close the ring (first point === last point)
    if (
      geoJsonCoordinates[0][0] !==
        geoJsonCoordinates[geoJsonCoordinates.length - 1][0] ||
      geoJsonCoordinates[0][1] !==
        geoJsonCoordinates[geoJsonCoordinates.length - 1][1]
    ) {
      geoJsonCoordinates.push(geoJsonCoordinates[0]);
    }

    const geoJson = {
      type: "Polygon",
      coordinates: [geoJsonCoordinates],
    };

    onSave && onSave(geoJson);
    setSaved(true);
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (confirm("Yakin ingin menghapus polygon?")) {
      setPoints([]);
      setIsDrawing(false);
      setSaved(false);
    }
  };

  const handleReset = () => {
    if (confirm("Yakin ingin reset ke koordinat awal?")) {
      if (initialCoordinates) {
        setPoints(initialCoordinates);
        setSaved(true);
      } else {
        setPoints([]);
        setSaved(false);
      }
      setIsDrawing(false);
    }
  };

  // Default center (Desa Pongangan, Gunungpati, Semarang)
  const defaultCenter = [-7.04932, 110.369085];

  return (
    <div className="space-y-3">
      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2">
        {!isDrawing ? (
          <button
            type="button"
            onClick={handleStartDrawing}
            className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors text-sm font-medium"
          >
            {points.length > 0 ? "Gambar Ulang Polygon" : "Mulai Menggambar"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinishDrawing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Selesai Menggambar ({points.length} titik)
          </button>
        )}

        {points.length > 0 && !isDrawing && (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saved}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium
                ${
                  saved
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              <Save size={16} />
              <span>{saved ? "Tersimpan" : "Simpan Koordinat"}</span>
            </button>

            {initialCoordinates && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              <span>Hapus</span>
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        {isDrawing ? (
          <p>
            <strong>Mode Menggambar:</strong> Klik pada peta untuk menambah
            titik polygon. Minimal 3 titik. Klik "Selesai Menggambar" jika
            sudah.
          </p>
        ) : points.length > 0 ? (
          <p>
            <strong>Polygon Tergambar:</strong> {points.length} titik.
            {saved
              ? " ✓ Koordinat sudah tersimpan."
              : " Klik 'Simpan Koordinat' untuk menyimpan."}
          </p>
        ) : (
          <p>
            <strong>Petunjuk:</strong> Klik tombol "Mulai Menggambar" lalu klik
            pada peta untuk membuat polygon lokasi tanah.
          </p>
        )}
      </div>

      {/* Map */}
      <div
        className="border border-gray-300 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <MapContainer
          center={points.length > 0 ? points[0] : defaultCenter}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler isDrawing={isDrawing} onAddPoint={handleAddPoint} />

          {/* Boundary Desa Pongangan (Background - RED EXACT) */}
          <Polygon
            positions={PONGANGAN_BOUNDARY}
            pathOptions={{
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.05,
              weight: 3,
              dashArray: "8, 8",
            }}
          />

          {/* Draw Polygon */}
          {points.length > 2 && (
            <Polygon
              positions={points}
              pathOptions={{
                color: saved ? "#10b981" : "#f59e0b",
                fillColor: saved ? "#10b981" : "#f59e0b",
                fillOpacity: 0.3,
                weight: 2,
              }}
            />
          )}

          {/* Draw Points */}
          {points.length > 0 &&
            points.map((point, idx) => (
              <CircleMarker
                key={idx}
                center={point}
                radius={5}
                pathOptions={{
                  color: "darkred",
                  fillColor: "red",
                  fillOpacity: 0.8,
                  weight: 2,
                }}
              />
            ))}
        </MapContainer>
      </div>

      {/* Coordinate Summary */}
      {points.length > 0 && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
          <p className="font-semibold text-gray-700 mb-1">
            Koordinat Polygon ({points.length} titik):
          </p>
          <div className="max-h-32 overflow-y-auto text-gray-600 font-mono">
            {points.map((p, i) => (
              <div key={i}>
                {i + 1}. [{p[0].toFixed(6)}, {p[1].toFixed(6)}]
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
