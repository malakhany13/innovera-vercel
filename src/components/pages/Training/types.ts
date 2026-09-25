import type { Course } from "@/src/api/types";

export interface TrainingProps {
  selectedTrack: string;
  setSelectedTrack: (track: string) => void;
  selectedVendor: string;
  setSelectedVendor: (vendor: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
}

export type { Course };
