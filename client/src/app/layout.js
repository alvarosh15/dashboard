import { Inter } from "next/font/google";
import "@/app/globals.css";
import SideNav from "@/app/_components/Sidenav";
import ContextProvider from "@/app/_context/ContextProvider";
import { NextAuthProvider } from "@/app/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Amazon Last Mille Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <ContextProvider>
      <NextAuthProvider>
        <html lang="en">
          <body className={inter.className}>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
              <div className="w-full flex-none md:w-64">
                <SideNav />
              </div>
              <div className="flex-grow p-4 no-scrollbar md:overflow-y-auto md:p-8">
                {children}
              </div>
            </div>
          </body>
        </html>
      </NextAuthProvider>
    </ContextProvider>
  );
}
