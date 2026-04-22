"use client";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignalerPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getLocation = () => {
    if (!navigator.geolocation) return alert("Géolocalisation non supportée");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
      },
      () => alert("Impossible de récupérer la position"),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return router.push("/login");
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("latitude", form.latitude);
      formData.append("longitude", form.longitude);
      if (image) formData.append("image", image);
      await axios.post(`${apiUrl}/reports`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message || "Erreur lors du signalement");
      } else {
        setError("Erreur lors du signalement");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        ➕ Nouveau signalement
      </h1>
      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded mb-4 font-semibold">
          ✅ Signalement envoyé ! Redirection...
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Titre du problème"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <textarea
          placeholder="Description détaillée"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Latitude"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            placeholder="Longitude"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button
          type="button"
          onClick={getLocation}
          className="border border-green-700 text-green-700 py-2 rounded-lg hover:bg-green-50 transition text-sm"
        >
          📍 Utiliser ma position actuelle
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="text-sm text-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
        >
          {loading ? "Envoi..." : "📢 Envoyer le signalement"}
        </button>
      </form>
    </div>
  );
}
