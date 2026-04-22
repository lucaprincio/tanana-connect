"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

type ReportStatus = "EN_ATTENTE" | "EN_COURS" | "RESOLU";

interface ReportUser {
  name: string;
}

interface Report {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  createdAt: string;
  user?: ReportUser;
}

const statusColors: Record<ReportStatus, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-800",
  EN_COURS: "bg-blue-100 text-blue-800",
  RESOLU: "bg-green-100 text-green-800",
};

const statusLabels: Record<ReportStatus, string> = {
  EN_ATTENTE: "⏳ En attente",
  EN_COURS: "🔧 En cours",
  RESOLU: "✅ Résolu",
};

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios
      .get<Report[]>(`${apiUrl}/reports`)
      .then((r) => setReports(r.data))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-green-700 text-lg animate-pulse">
          Chargement...
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-700">📋 Signalements</h1>
        <Link
          href="/signaler"
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition"
        >
          ➕ Nouveau
        </Link>
      </div>
      {reports.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          Aucun signalement pour le moment.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow p-5 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {r.title}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[r.status]}`}
                >
                  {statusLabels[r.status]}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{r.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                <span>👤 {r.user?.name}</span>
                <span>
                  📍 {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                </span>
                <span>
                  🕐 {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {r.imageUrl && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${r.imageUrl}`}
                  alt="photo"
                  width={1200}
                  height={630}
                  unoptimized
                  className="rounded-lg mt-2 max-h-48 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
