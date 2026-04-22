"use client";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/src/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-green-700 animate-pulse">
      Chargement de la carte...
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="px-6 py-3 bg-white shadow-sm flex items-center gap-4 text-sm">
        <span>🔴 En attente</span>
        <span>🟠 En cours</span>
        <span>🟢 Résolu</span>
      </div>
      <div className="flex-1">
        <MapComponent />
      </div>
    </div>
  );
}
