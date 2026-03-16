import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminEditBar from "@/components/admin/AdminEditBar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { getWeddingData } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const { wedding } = await getWeddingData();
  return {
    title: wedding.meta.title,
    description: wedding.meta.description,
  };
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow min-h-screen flex flex-col bg-base text-text-primary">
        {children}
      </main>
      <Footer />
      <AdminEditBar />
    </>
  );
}
