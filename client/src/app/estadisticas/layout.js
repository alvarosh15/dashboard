import Link from "next/link";
import LinkSideNav from "@/app/_components/ActiveLink";

export default function EstadisticasLayout({ children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <Link href="/estadisticas/general">
          <LinkSideNav text="General"></LinkSideNav>
        </Link>
        <Link href="/estadisticas/austin">
          <LinkSideNav text="Austin"></LinkSideNav>
        </Link>
        <Link href="/estadisticas/losangeles">
          <LinkSideNav text="Los Angeles"></LinkSideNav>
        </Link>
        <Link href="/estadisticas/boston">
          <LinkSideNav text="Boston"></LinkSideNav>
        </Link>
        <Link href="/estadisticas/seattle">
          <LinkSideNav text="Seattle"></LinkSideNav>
        </Link>
        <Link href="/estadisticas/chicago">
          <LinkSideNav text="Chicago"></LinkSideNav>
        </Link>
      </div>
      {children}
    </div>
  );
}
