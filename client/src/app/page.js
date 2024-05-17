"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import FavoritesCharts from "./components/charts/FavoritesCharts";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    console.log(session);
    return (
      <div className="flex flex-col bg-red-100">
        <p className="font-semibold text-sky-800">
          Bienvenido, {session.user.name}
        </p>
        <button onClick={() => signOut()}>Cerrar sesión</button>
        <FavoritesCharts />
      </div>
    );
  }

  return (
    <div>
      <p>No has iniciado sesión</p>
      <button onClick={() => signIn()}>Iniciar sesión</button>
    </div>
  );
}
