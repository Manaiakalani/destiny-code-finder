export function CodeSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      {/* Emblem and code area */}
      <div className="flex items-start gap-4">
        {/* Emblem skeleton */}
        <div className="skeleton w-20 h-20 rounded-lg" />
        
        {/* Code and info skeleton */}
        <div className="flex-1 space-y-2">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-4 w-48" />
        </div>
      </div>
      
      {/* Meta row skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <div className="flex items-center gap-3">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-4 w-24" />
        </div>
        <div className="skeleton h-4 w-20" />
      </div>
      
      {/* Button skeleton */}
      <div className="skeleton h-9 w-full rounded-md" />
    </div>
  );
}

export function CodeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CodeSkeleton key={i} />
      ))}
    </div>
  );
}