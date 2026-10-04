import Image from "next/image";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Shared dashboard background */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/images/dashboard-bg.png"
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Dark glass overlay */}
      <div className="fixed inset-0 -z-10 bg-slate-950/35" />

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-sky-950/20 via-transparent to-slate-950/35" />

      <DashboardSidebar />

      <main className="relative min-h-screen md:ml-[252px]">{children}</main>
    </div>
  );
}
