export default function Skeleton({ className = '', circle }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${circle ? 'rounded-full' : 'rounded-xl'} ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}
