function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-lg overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export default function BlogLoading() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary py-20 px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </section>

      {/* 3x2 blog card grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-32 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
