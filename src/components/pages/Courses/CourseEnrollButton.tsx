"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface CourseEnrollButtonProps {
  courseId: number;
  className?: string;
  children?: ReactNode;
}

export default function CourseEnrollButton({
  courseId,
  className,
  children = "Enroll Now",
}: CourseEnrollButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/courses/enroll/${courseId}`)}
      className={
        className ??
        "px-8 py-3 text-sm font-bold text-white bg-brand-cyan hover:bg-cyan-500 shadow-lg shadow-brand-cyan/20 rounded-full transition-all hover:-translate-y-0.5"
      }
    >
      {children}
    </button>
  );
}
