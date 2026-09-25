import Link from "next/link";

export default function CourseNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 pt-24">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-3">Course not found</h1>
        <p className="text-slate-500 mb-8">
          This course may have been removed or the link is incorrect.
        </p>
        <Link
          href="/courses"
          className="inline-flex px-6 py-3 bg-brand-cyan text-white font-bold rounded-full hover:bg-cyan-500 transition-colors"
        >
          View all courses
        </Link>
      </div>
    </div>
  );
}
