import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";
import { readData } from "@/lib/data";
import type { Settings } from "@/lib/types";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await readData<Settings>("settings.json");

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappButton phone={settings.whatsapp} />
    </>
  );
}
