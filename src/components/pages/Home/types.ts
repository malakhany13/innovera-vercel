export interface HomeCourse {
  id: number;
  title: string;
  track: string;
  level: string;
  hours: number;
  format: string;
  image: string | null;
  whatYouWillCover: string | null;
  prerequisites: string | null;
  handsOn: boolean | null;
}

export interface HomeVendor {
  name: string;
  logo: string;
  vendorKey: string;
  href: string;
}

export type { FeaturedCard } from "@/src/types/content";

export interface AcademyFallbackTrack {
  image: string;
  color: string;
  title: string;
  desc: string;
  partner: string;
  vendorKeys?: string[];
  icon: "brain" | "shield" | "code" | "users";
}

export interface HomePageProps {
  setSelectedVendor?: (vendor: string) => void;
  setSelectedTrack?: (track: string) => void;
}
