"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

type ReportStatus = "EN_ATTENTE" | "EN_COURS" | "RESOLU";

interface Report {
  id: number;
  title: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  user?: {
    name: string;
  };
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/");
      return;
    }

    axios
      .get<Report[]>(`${apiUrl}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setReports(r.data))
      .finally(() => setLoading(false));
  }, [apiUrl, user, token, router]);

  const handleStatusChange = async (id: number, newStatus: ReportStatus) => {
    try {
      await axios.patch(`${apiUrl}/reports/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    } catch {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-green-700 text-lg animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-red-600">Accès refusé - Admin uniquement</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-6">⚙️ Tableau de bord Admin</h1>

      {reports.length === 0 ? (
        <div className="text-center text-gray-500 py-20">Aucun signalement.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Titre</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Auteur</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">#{r.id}</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{r.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{r.user?.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        handleStatusChange(r.id, e.target.value as ReportStatus)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="EN_ATTENTE">⏳ En attente</option>
                      <option value="EN_COURS">🔧 En cours</option>
                      <option value="RESOLU">✅ Résolu</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <a
                      href={`/map?id=${r.id}`}
                      target="_blank"
                      className="text-green-700 hover:underline text-sm font-medium"
                    >
                      Voir sur la carte
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
