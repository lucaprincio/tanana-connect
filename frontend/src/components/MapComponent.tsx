"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Fix icônes Leaflet avec Next.js
const icons: Record<string, L.Icon> = {
  EN_ATTENTE: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  EN_COURS: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  RESOLU: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

type ReportStatus = "EN_ATTENTE" | "EN_COURS" | "RESOLU";

interface ReportUser {
  name: string;
}

interface Report {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  user?: ReportUser;
}

const statusLabels: Record<ReportStatus, string> = {
  EN_ATTENTE: "⏳ En attente",
  EN_COURS: "🔧 En cours",
  RESOLU: "✅ Résolu",
};

export default function MapComponent() {
  const [reports, setReports] = useState<Report[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get<Report[]>(`${apiUrl}/reports`).then((r) => setReports(r.data));
  }, [apiUrl]);

  return (
    <MapContainer
      center={[-18.9149, 47.5361]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((r) => (
        <Marker
          key={r.id}
          position={[r.latitude, r.longitude]}
          icon={icons[r.status] || icons["EN_ATTENTE"]}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{r.title}</p>
              <p className="text-gray-600">{r.description}</p>
              <p className="mt-1">{statusLabels[r.status]}</p>
              <p className="text-gray-400 text-xs">👤 {r.user?.name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
