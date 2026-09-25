import { newsItems } from "@/src/pages/News/constants";
import { VENDORS } from "@/constants";
import type { AcademyFallbackTrack, FeaturedCard, HomeVendor } from "./types";

const FEATURED_NEWS_IDS = [2, 1, 14];

export const FEATURED_NEWS: FeaturedCard[] = FEATURED_NEWS_IDS.map((id) => {
  const item = newsItems.find((article) => article.id === id)!;
  return {
    id: item.id,
    title: item.title,
    date: item.date,
    category: item.category,
    image: item.image,
  };
});

export const HOME_VENDORS: HomeVendor[] = [
  {
    name: "AICERTs",
    logo: VENDORS.AICERTS.logo,
    vendorKey: "AICERTs",
    href: "https://www.aicerts.ai/",
  },
  {
    name: "Fortinet",
    logo: VENDORS.FORTINET.logo,
    vendorKey: "Fortinet",
    href: "https://www.fortinet.com/",
  },
  {
    name: "Palo Alto Networks",
    logo: VENDORS.PALO_ALTO.logo,
    vendorKey: "Palo Alto Networks",
    href: "https://www.paloaltonetworks.com/",
  },
  {
    name: "Hanwha",
    logo: VENDORS.HANWHA.logo,
    vendorKey: "Hanwha",
    href: "https://www.hanwha.com/",
  },
  {
    name: "H3C",
    logo: VENDORS.H3C.logo,
    vendorKey: "H3C",
    href: "https://www.h3c.com/en/",
  },
];

export const FEATURED_EVENTS: FeaturedCard[] = [
  {
    id: 1,
    title: "Cairo ICT 2026",
    date: "Nov 2026",
    category: "Exhibition",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    title: "LEAP 2026",
    date: "Aug 31 - Sep 3",
    category: "Global Tech Event",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "GITEX Global 2026",
    date: "Dec 7-11",
    category: "Conference",
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=600",
  },
];

export const ACADEMY_FALLBACK_TRACKS: AcademyFallbackTrack[] = [
  {
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    color: "brand-cyan",
    title: "AI & Machine Learning",
    desc: "Industry-aligned learning tracks combining practical knowledge with high-tech applications.",
    partner: "AI CERTsTM & Innovera",
    vendorKeys: ["AICERTs", "Innovera Academy"],
    icon: "brain",
  },
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    color: "brand-navy",
    title: "Cybersecurity",
    desc: "Comprehensive tracks with a strong focus on practical defense and cloud security.",
    partner: "Palo Alto Networks & Fortinet",
    vendorKeys: ["Palo Alto Networks", "Fortinet"],
    icon: "shield",
  },
  {
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800",
    color: "brand-cyan",
    title: "Software Development",
    desc: "Hands-on coding, app design, and modern software delivery for real environments.",
    partner: "Innovera Labs",
    vendorKeys: ["Innovera Academy"],
    icon: "code",
  },
  {
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    color: "brand-navy",
    title: "Professional Skills",
    desc: "Enhance communication, leadership, and startup essentials in dynamic workspaces.",
    partner: "Innovera Academy",
    vendorKeys: ["Innovera Academy"],
    icon: "users",
  },
];

export const CONTACT_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800", alt: "Team", className: "h-48" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", alt: "Meeting", className: "h-64" },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800", alt: "Office", className: "h-64" },
  { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", alt: "Work", className: "h-48" },
] as const;
