export function MediaSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/3] bg-zinc-800" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-zinc-800 rounded-lg" />
              <div className="h-3 w-12 bg-zinc-800 rounded-lg" />
            </div>
            <div className="h-2 w-24 bg-zinc-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
