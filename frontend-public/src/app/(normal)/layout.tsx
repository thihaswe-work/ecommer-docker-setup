import Footer from "@/components/footer";
import Header from "@/components/header";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "A simple e-commerce store built with Next.js",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex min-h-screen flex-col ">
        <Header />
        <main className="flex-1">
          <div className="mx-auto container">{children}</div>
        </main>
        <Footer />
      </div>
    </>
  );
}
