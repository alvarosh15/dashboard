import Link from "next/link";
import LinkSideNav from "./linksidenav";

export default function SideNav() {
  return (
    <div className="bg-sky-100 flex h-full flex-col px-3 py-3 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center rounded-md bg-sky-600 p-4 md:h-20"
        href="/"
      >
        <div className="w-32 text-white text-xl md:w-40">Dashboard</div>
      </Link>
      <div className="flex grow flex-row justify-start space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <Link href="/map">
          <LinkSideNav>Mapa</LinkSideNav>
        </Link>
        <Link href="/search">
          <LinkSideNav>Buscar</LinkSideNav>
        </Link>
      </div>
    </div>
  );
}
