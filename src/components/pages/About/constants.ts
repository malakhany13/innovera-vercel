import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  Eye,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Shield,
  Target,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import type {
  AboutCoreValue,
  AboutEcosystemCard,
  AboutHero,
  AboutMissionVision,
  AboutOffice,
  AboutSectionHeader,
  AboutSocialLink,
  AboutWhyFeature,
} from "@/src/api/types";

export const ABOUT_ICON_MAP: Record<string, LucideIcon> = {
  target: Target,
  eye: Eye,
  shield: Shield,
  zap: Zap,
  briefcase: Briefcase,
  award: Award,
  users: Users,
  globe: Globe,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
};

export function getAboutIcon(key: string | undefined, fallback: LucideIcon): LucideIcon {
  if (!key) return fallback;
  return ABOUT_ICON_MAP[key.toLowerCase()] ?? fallback;
}

export const FALLBACK_HERO: AboutHero = {
  title: "Empowering Talent.",
  subtitle: "Shaping the Future.",
  description: "Leading regional innovation in AI, cybersecurity, and digital transformation.",
  content: "Innovera delivers AI-powered solutions, transformative training, and workforce services to drive measurable impact.",
  excerpt: "Pan-Arab innovator empowering organizations and individuals.",
  paragraphs: [
    "Innovera is a Pan-Arab innovator headquartered in Egypt, with a growing regional presence through offices in the Kingdom of Saudi Arabia and the Sultanate of Oman. We specialize in advanced digital solutions, artificial intelligence applications, transformative training, and intelligent outsourcing. Through strategic collaborations, including partnerships with NVIDIA, Palo Alto Networks Academy, and H3C, we deliver AI-powered, cybersecurity-ready, and future-proof solutions that drive measurable impact.",
    "We work closely with governments and institutions to foster technological transformation, address emerging trends, build capacities, empower youth, and support policymaking processes. Beyond technology, we help organizations accelerate digital transformation with speed, sustainability, and precision.",
    "From concept to execution, we transform visions into scalable realities and challenges into growth opportunities, equipping individuals and organizations with the skills to excel in a technology-driven world.",
  ],
  primary_image:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
  secondary_image:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
};

export const FALLBACK_MISSION: AboutMissionVision = {
  title: "Our Mission",
  description:
    "Delivering innovative AI-driven digital solutions, world-class cybersecurity training, and strategic workforce services that empower individuals and organizations to excel, adapt, and grow in a rapidly evolving market.",
  image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
  icon: "target",
};

export const FALLBACK_VISION: AboutMissionVision = {
  title: "Our Vision",
  description:
    "To be the smartest regional platform enabling organizations to lead digital transformation, AI adoption, and cybersecurity readiness confidently and sustainably, and a global catalyst for skills transformation and workforce evolution.",
  image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000",
  icon: "eye",
};

export const FALLBACK_SECTION_HEADERS: Record<string, AboutSectionHeader> = {
  core_values: {
    badge: "What Drives Us",
    title: "Our Core Values",
    description: "",
  },
  why_innovera: {
    badge: "Our Differentiator",
    title: "Why Choose Innovera?",
    description: "",
  },
  ecosystem: {
    badge: "Strategic Integration",
    title: "Our Ecosystem",
    description:
      "Innovera combines integrated digital solutions, transformative learning, and innovation-driven investment to accelerate secure growth across Egypt and the MENA region.",
  },
  global_presence: {
    badge: "",
    title: "Our Global Presence",
    description:
      "Find us in key locations across the Middle East. We are always ready to connect and collaborate.",
  },
};

export const FALLBACK_CORE_VALUES: AboutCoreValue[] = [
  { id: 1, sort: 1, title: "Integrity", description: "Building trust through transparency and accountability", icon: "shield" },
  { id: 2, sort: 2, title: "Innovation", description: "Turning emerging technologies into measurable impact", icon: "zap" },
  { id: 3, sort: 3, title: "Collaboration", description: "Building lasting partnerships for shared success", icon: "briefcase" },
  { id: 4, sort: 4, title: "Excellence", description: "Delivering with agility, precision, and exceptional quality", icon: "award" },
];

export const FALLBACK_WHY_FEATURES: AboutWhyFeature[] = [
  {
    id: 1,
    sort: 1,
    title: "Integrated Tech Leadership",
    description:
      "Unmatched expertise in AI, cybersecurity, and digital transformation to navigate today's complex tech landscape.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    sort: 2,
    title: "Global Strategic Alliances",
    description:
      "Strong partnerships with industry giants like NVIDIA and Palo Alto Networks, bringing world-class innovation to your doorstep.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    sort: 3,
    title: "Security-First Innovation",
    description:
      "A future-ready approach that places cybersecurity at the core of every digital solution we build.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    sort: 4,
    title: "Result-Oriented Partnership",
    description:
      "We act as your dedicated growth partner, turning visionary ideas into scalable solutions with measurable business impact.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
  },
];

export const FALLBACK_ECOSYSTEM_CARDS: AboutEcosystemCard[] = [
  {
    id: 1,
    sort: 1,
    title: "Innovera Company",
    description:
      "We position Innovera as a regional leader in AI, cybersecurity, and integrated digital solutions, backed by strategic partnerships and a strong focus on measurable transformation.",
    icon: "target",
    variant: "default",
  },
  {
    id: 2,
    sort: 2,
    title: "Innovera Academy",
    description:
      "We build future-ready talent through structured AI, software, and cybersecurity training, capacity-building programs, and digital learning solutions for individuals, institutions, and workforces.",
    icon: "users",
    variant: "highlight",
  },
  {
    id: 3,
    sort: 3,
    title: "Innovera Investment",
    description:
      "Our venture and innovation arm supports high-potential startups in AI, cybersecurity, analytics, automation, cloud, and digital transformation through early-stage funding, technical guidance, and market access.",
    icon: "globe",
    variant: "default",
  },
];

export const FALLBACK_OFFICES: AboutOffice[] = [
  {
    id: 1,
    sort: 1,
    country: "Egypt",
    city: "Cairo",
    type: "Headquarters",
    address: "Administrative building no. 5 Zizinia compound, fifth settlement, New Cairo, Cairo",
    phone: "+",
    email: "info@innoveracorp.com",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    sort: 2,
    country: "Saudi Arabia",
    city: "Geddah",
    type: "Regional Office",
    address: "King Fahd Road, Olaya District, Geddah",
    phone: "+20 103 1119 000",
    email: "info@innoveracorp.com",
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    sort: 3,
    country: "Oman",
    city: "Muscat",
    type: "Regional Office",
    address: "Sultan Qaboos Street, Muscat",
    phone: "+20 103 1117 000",
    email: "info@innoveracorp.com",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
  },
];

export const FALLBACK_SOCIAL_LINKS: AboutSocialLink[] = [
  { id: 1, sort: 1, label: "LinkedIn", href: "https://linkedin.com/company/innovera", icon: "linkedin" },
  { id: 2, sort: 2, label: "Twitter", href: "https://twitter.com/innovera", icon: "twitter" },
  { id: 3, sort: 3, label: "Facebook", href: "https://facebook.com/innovera", icon: "facebook" },
  { id: 4, sort: 4, label: "Instagram", href: "https://instagram.com/innovera", icon: "instagram" },
];
