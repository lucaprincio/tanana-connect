import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        🇲🇬 Tanàna Connect
      </h1>
      <p className="text-gray-600 text-lg max-w-xl mb-8">
        Signalez les problèmes de votre quartier — routes, eau, électricité — et
        suivez leur résolution en temps réel.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signaler"
          className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
        >
          ➕ Faire un signalement
        </Link>
        <Link
          href="/map"
          className="border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
        >
          🗺️ Voir la carte
        </Link>
      </div>
    </div>
  );
}
