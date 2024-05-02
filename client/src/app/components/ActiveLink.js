"use client";
import { usePathname } from "next/navigation";

export default function ActiveLink({ text, children }) {
  let path = usePathname();

  let segments = path.toLowerCase().split("/").filter(Boolean);

  let normalizedText = text.toLowerCase();

  const isActive = segments.some((segment) => segment.includes(normalizedText));

  let bgColor = isActive ? "bg-sky-100" : "";
  let textColor = isActive ? "text-sky-800" : "text-slate-400";

  if (path === "/" && normalizedText === "home") {
    bgColor = "bg-sky-100";
    textColor = "text-sky-800";
  }

  return (
    <div
      className={`flex flex-row items-center gap-2 rounded-md font-semibold p-2 ${bgColor} ${textColor}`}
    >
      {children}
      {text}
    </div>
  );
}
