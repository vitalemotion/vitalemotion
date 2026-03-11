import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-primary hover:text-primary-dark transition-colors">
            Vital Emocion
          </Link>
        </div>
        <div className="bg-surface rounded-2xl p-8 shadow-xl shadow-black/5">
          {children}
        </div>
      </div>
    </div>
  );
}
