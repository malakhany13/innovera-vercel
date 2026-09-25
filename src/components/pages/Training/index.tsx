"use client";

import type { Course } from "@/features/directus/types";
import TrainingCatalog from "./TrainingCatalog";

interface TrainingProps {
  initialCourses: Course[];
  fetchError?: boolean;
}

/** Academy / training page — modal-based course detail (legacy `/training` route). */
export default function Training({ initialCourses, fetchError }: TrainingProps) {
  return <TrainingCatalog initialCourses={initialCourses} fetchError={fetchError} />;
}
