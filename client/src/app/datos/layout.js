import Link from "next/link";
import LinkSideNav from "../components/ActiveLink";

export default function DatosLayout({ children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <Link href="/datos/rutas">
          <LinkSideNav text="Rutas"></LinkSideNav>
        </Link>
        <Link href="/datos/paradas">
          <LinkSideNav text="Paradas"></LinkSideNav>
        </Link>
        <Link href="/datos/paquetes">
          <LinkSideNav text="Paquetes"></LinkSideNav>
        </Link>
      </div>
      {children}
    </div>
  );
}
