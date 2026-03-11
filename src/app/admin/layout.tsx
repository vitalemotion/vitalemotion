import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Vital Emocion",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
