function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-lg overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export default function TiendaLoading() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary py-16 px-6 pt-32 text-center">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </section>

      {/* Filters + product grid */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        {/* Filter bar placeholder */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* 3-column product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <Skeleton className="h-52 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
