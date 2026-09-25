import {
  Award,
  Briefcase,
  DollarSign,
  FileText,
  Github,
  Hammer,
  Lightbulb,
  Rocket,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export const ACADEMY_ICON_MAP: Record<string, LucideIcon> = {
  award: Award,
  briefcase: Briefcase,
  dollarsign: DollarSign,
  filetext: FileText,
  github: Github,
  hammer: Hammer,
  lightbulb: Lightbulb,
  rocket: Rocket,
  trophy: Trophy,
  users: Users,
};

/** Resolve a Directus icon name (e.g. "Rocket") to a Lucide component, with a fallback. */
export function getAcademyIcon(key: string | undefined, fallback: LucideIcon): LucideIcon {
  if (!key) return fallback;
  return ACADEMY_ICON_MAP[key.toLowerCase()] ?? fallback;
}
