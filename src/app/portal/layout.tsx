import PortalSidebar from "@/components/portal/PortalSidebar";

export const metadata = {
  title: "Mi Portal | Vital Emocion",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <PortalSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
