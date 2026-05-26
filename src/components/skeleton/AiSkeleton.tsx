export default function AiSkeleton() {
  return (
    <main className="bg-secondary rounded-xl p-6 md:p-8 border border-secondary/5 animate-pulse w-full space-y-6">
      {/* Skeleton Paragraf AI Saran */}
      <div className="flex-1 space-y-4 w-full">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          <div className="h-4 bg-primary/10 rounded w-48" />
        </div>
        <div className="space-y-3 pt-2">
          <div className="h-5 bg-primary/10 rounded w-full" />
          <div className="h-5 bg-primary/10 rounded w-11/12" />
          <div className="h-5 bg-primary/10 rounded w-4/5" />
        </div>
      </div>

      {/* Separator */}
      <div className="border border-primary/5"></div>

      {/* Skeleton Paragraf Goals Review */}
      <div className="flex-1 space-y-4 w-full">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          <div className="h-4 bg-primary/10 rounded w-56" />
        </div>
        <div className="space-y-3 pt-2">
          <div className="h-5 bg-primary/10 rounded w-full" />
          <div className="h-5 bg-primary/10 rounded w-11/12" />
        </div>
      </div>

      {/* Skeleton Kolom Kanan */}
      <div className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-primary/5 pt-6 lg:pt-0 lg:pl-6 space-y-5">
        <div>
          <div className="h-3 bg-primary/10 rounded w-20 mb-3" />
          <div className="h-6 bg-primary/10 rounded w-28 mb-3" />
          <div className="h-4 bg-primary/10 rounded w-full" />
        </div>
        <div className="border border-primary/5 my-2"></div>
        <div>
          <div className="h-3 bg-primary/10 rounded w-24 mb-3" />
          <div className="h-8 bg-primary/10 rounded w-36" />
        </div>
      </div>
    </main>
  );
}
