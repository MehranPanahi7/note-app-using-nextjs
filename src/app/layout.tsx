"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "@/store/store";
// import Navbar from "@/_components/bars/navbar";
import dynamic from "next/dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Navbar = dynamic(() => import("@/_components/bars/navbar"), {
    ssr: false,
  });

  return (
    <Provider store={store}>
      <html lang="en">
        <body>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Navbar />
            <main
              style={{ flex: 1, padding: "1rem" }}
              className="flex flex-col"
            >
              {children}
            </main>
          </div>
        </body>
      </html>
    </Provider>
  );
}
