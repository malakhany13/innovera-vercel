/** Shared pulse block for page skeletons. */
export default function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded-xl ${className}`} aria-hidden />;
}
