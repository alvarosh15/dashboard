"use client";
import { useSession, signIn } from "next-auth/react";
import LikedCharts from "@/app/components/charts/LikedCharts";
import SearchHistory from "@/app/components/history/SearchHistory";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col">
        <h2 className="font-semibold text-sky-800 text-2xl pt-2 pl-2">
          Bienvenido, {session.user.name}
        </h2>
        <SearchHistory />
        <LikedCharts />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-center items-center gap-2">
      <h2 className="font-semibold text-sky-800 text-2xl">Inicia sesión</h2>
      <h3 className="font-normal text-sky-800 text-base">
        Para poder ver tus gráficas favoritas y guardar tu historial de búsqueda
      </h3>
      <button
        onClick={() => signIn()}
        className="flex items-center justify-center px-4 py-2 border border-sky-800 rounded-md shadow-sm text-sm font-medium text-sky-800 bg-white hover:bg-sky-100"
      >
        Iniciar sesión con
        <span className="p-1">
          <span style={{ color: "#4285F4" }}>G</span>
          <span style={{ color: "#EA4335" }}>o</span>
          <span style={{ color: "#FBBC05" }}>o</span>
          <span style={{ color: "#4285F4" }}>g</span>
          <span style={{ color: "#34A853" }}>l</span>
          <span style={{ color: "#EA4335" }}>e</span>
        </span>
      </button>
    </div>
  );
}
