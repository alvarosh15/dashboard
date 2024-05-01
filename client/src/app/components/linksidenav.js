"use client";
import { usePathname } from "next/navigation";

export default function LinkSideNav({ text, children }) {
  let path = usePathname();

  path = path.toLowerCase().slice(1);
  const normalizedText = text.toLowerCase();

  let bgColor = path === normalizedText ? "bg-sky-100" : "";
  let textColor = path === normalizedText ? "text-sky-800" : "text-slate-400";

  if (path === "" && normalizedText === "home") {
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
