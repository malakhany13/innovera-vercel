import SkeletonBlock from "@/components/ui/skeletons/SkeletonBlock";

export default function PaymentPageSkeleton() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8 space-y-3">
          <SkeletonBlock className="h-8 w-48 mx-auto" />
          <SkeletonBlock className="h-8 w-56 mx-auto" />
          <SkeletonBlock className="h-4 w-40 mx-auto" />
        </div>

        <div className="space-y-6">
          <SkeletonBlock className="h-32 w-full rounded-md" />
          <SkeletonBlock className="h-20 w-full rounded-md" />
          <SkeletonBlock className="h-28 w-full rounded-lg" />
          <SkeletonBlock className="h-20 w-full rounded-lg" />
          <SkeletonBlock className="h-20 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
