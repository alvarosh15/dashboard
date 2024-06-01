"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ActiveLink from "@/app/_components/ActiveLink";

export default function SideNav() {
  const { data: session } = useSession();

  return (
    <div className="bg-slate-50 flex h-full flex-col gap-2 md:gap-0 px-3 py-3 md:px-2">
      <div className="flex justify-between items-center md:justify-center md:flex-col">
        <h1 className="w-32 ml-5 md:ml-0 flex justify-center items-center text-sky-800 font-extrabold text-3xl md:w-full md:h-24">
          Dashboard
        </h1>
        {session && (
          <button
            onClick={() => signOut()}
            className="text-sky-800 font-normal text-sm md:hidden"
          >
            Cerrar sesión
          </button>
        )}
      </div>
      <div className="flex grow flex-row justify-center md:justify-start space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <Link href="/">
          <ActiveLink text="Inicio">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-house-door-fill"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
            </svg>
          </ActiveLink>
        </Link>
        <Link href="/mapa">
          <ActiveLink text="Mapa">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-geo-alt-fill"
              viewBox="0 0 16 16"
            >
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
            </svg>
          </ActiveLink>
        </Link>
        <Link href="/datos/rutas">
          <ActiveLink text="Datos">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </ActiveLink>
        </Link>
        <Link href="/estadisticas/general">
          <ActiveLink text="Estadisticas">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-bar-chart-fill"
              viewBox="0 0 16 16"
            >
              <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
            </svg>
          </ActiveLink>
        </Link>
      </div>
      <div className="mt-auto hidden md:block">
        {session && (
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-center space-x-2">
              <Image
                height={24}
                width={24}
                alt="User profile picture"
                src={session.user.image}
                className="w-6 h-6 rounded-full"
              />
              <p className="text-sm text-sky-800 font-medium">
                {session.user.email}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sky-800 font-light text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
