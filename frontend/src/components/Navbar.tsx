"use client";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link href="/" className="text-xl font-bold tracking-wide">
        🇲🇬 Tanàna Connect
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/map" className="hover:underline">
          🗺️ Carte
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className="hover:underline">
              📋 Signalements
            </Link>
            <Link href="/signaler" className="hover:underline">
              ➕ Signaler
            </Link>
            {isAdmin && (
              <Link href="/admin" className="hover:underline">
                ⚙️ Admin
              </Link>
            )}
            <span className="opacity-75">| {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-green-700 px-3 py-1 rounded font-semibold hover:bg-green-100"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-white text-green-700 px-3 py-1 rounded font-semibold hover:bg-green-100"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}
