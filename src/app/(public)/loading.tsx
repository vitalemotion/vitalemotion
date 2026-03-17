function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-lg overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export default function PublicLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero placeholder */}
      <div className="bg-secondary py-20 px-6 pt-32">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-12 w-40 mx-auto rounded-xl" />
        </div>
      </div>

      {/* 3-column card grid placeholder */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <Skeleton className="h-8 w-48 mx-auto mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer placeholder */}
      <div className="bg-surface py-12 px-6 mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
