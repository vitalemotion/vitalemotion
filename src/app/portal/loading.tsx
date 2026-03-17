function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-lg overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export default function PortalLoading() {
  return (
    <div>
      {/* Greeting */}
      <Skeleton className="h-8 w-56 mb-8" />

      {/* Two-column summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface rounded-2xl p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="bg-surface rounded-2xl p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-20 mb-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Quick links row */}
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl p-6">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
