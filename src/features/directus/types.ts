import type {
  ComparisonRow,
  CohortPoint,
  FaqItem,
  FlywheelPhase,
  GapStat,
  OutcomeSlice,
  Partner,
  Pathway,
  Testimonial,
  WalkAwayItem,
} from "@/data/academy";

export interface CourseVendor {
  key: string;
  name: string;
  logo: string | null;
}

export interface DirectusCourse {
  id: number;
  /** Laravel / enrollment course id (Directus field `Course_ID`). */
  Course_ID?: string | number | null;
  track: string;
  title: string;
  level: string;
  hours: number;
  format: string;
  image: string | null;
  /** Directus file UUID for course outline PDF (field `pdf`). */
  pdf?: string | { id?: string | null } | null;
  /** Legacy alias — prefer `pdf`. */
  Attachment?: string | { id?: string | null } | null;
  whatYouWillCover?: string | string[] | null;
  prerequisites?: string | string[] | null;
  handsOn?: boolean | string[] | null;
  vendor_name?: string | null;
  vendor_logo?: string | null;
  vendor_key?: string | null;
}

export interface Course {
  id: number;
  /**
   * Laravel course id (same as `id` when sourced from the backend API).
   * Use this for slots / enroll API calls.
   */
  courseId: string | null;
  track: string;
  title: string;
  level: string;
  hours: number;
  format: string;
  image: string | null;
  /** Course outline PDF link (`syllabus_url`) or Directus id (`attachment`), when present. */
  attachment: string | null;
  whatYouWillCover: string[];
  prerequisites: string[];
  handsOn: string[];
  handsOnFlag: boolean;
  vendor?: CourseVendor;
  description?: string | null;
  price?: number | null;
  assessmentCost?: number | null;
  icon?: string | null;
  features?: string[];
  syllabusPdf?: string | null;
  isActive?: boolean;
  isNew?: boolean;
  showEnrollButton?: boolean;
  sortOrder?: number;
}

export interface DirectusListResponse<T> {
  data: T[];
}

export interface DirectusSingleResponse<T> {
  data: T;
}

export interface DirectusLesson {
  id: number;
  course_id: number;
  title: string;
  description?: string | null;
  sort?: number | null;
  duration_minutes?: number | null;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description: string;
  sort: number;
  durationMinutes: number | null;
}

export type CreateCoursePayload = Omit<DirectusCourse, "id">;

export interface CourseWithLessonsResponse {
  course: Course;
  lessons: Lesson[];
  /** Laravel active slots when merged by the courses BFF / host API. */
  active_slots?: Array<{
    id: number;
    format?: string | null;
    date_from?: string | null;
    date_to?: string | null;
    sessions_per_week?: number | null;
    session_length_minutes?: number | null;
    max_enrollments?: number | null;
    current_enrollments?: number | null;
    is_active?: boolean | null;
  }>;
}

export interface EnrollCoursePayload {
  full_name: string;
  mobile_number: string;
  email: string;
  /** Selected active slot id from GET /api/courses/{courseId} `active_slots` — not the course id. */
  course_slot_id: number | string;
  academic_year: string;
  college: string;
  role_in_tech: string;
  terms_consent: "1" | "0";
  note?: string;
}

/** RTK enroll mutation: course id is URL-only; slot id stays in the body. */
export type EnrollCourseMutationArg = EnrollCoursePayload & {
  courseId: number | string;
};

export interface EnrollCourseResponse {
  success: boolean;
  payment_token?: string;
  enrollment_id?: number;
  course_payment_token?: string;
  assessment_payment_token?: string;
  payment_show_url?: string;
  generated_mobile?: string;
  generated_email?: string;
  message?: string;
  [key: string]: unknown;
}

export type HomePageItemType =
  | "hero_slide"
  | "section_image"
  | "vendor"
  | "partner"
  | "featured_news"
  | "featured_event"
  | "contact_photo"
  | "academy_fallback";

export interface DirectusHomePageItem {
  id: number;
  type: HomePageItemType;
  sort: number | null;
  name: string | null;
  title: string | null;
  description: string | null;
  date: string | null;
  category: string | null;
  vendor_key: string | null;
  section_key: string | null;
  color: string | null;
  Image: string | null;
}

export interface HeroSlide {
  id: number;
  sort: number;
  title: string;
  image: string | null;
}

export interface SectionImage {
  id: number;
  sort: number;
  title: string;
  sectionKey: string;
  image: string | null;
}

export interface HomePageVendor {
  id: number;
  sort: number;
  name: string;
  vendorKey: string;
  image: string | null;
}

export interface HomePagePartner {
  id: number;
  sort: number;
  name: string;
  image: string | null;
}

export interface HomePageContactPhoto {
  id: number;
  sort: number;
  title: string;
  image: string | null;
}

export interface HomePageFeaturedNews {
  id: number;
  sort: number;
  title: string;
  date: string;
  category: string;
  image: string | null;
}

export interface HomePageContent {
  heroSlides: HeroSlide[];
  sectionImages: SectionImage[];
  vendors: HomePageVendor[];
  partners: HomePagePartner[];
  contactPhotos: HomePageContactPhoto[];
  featuredNews: HomePageFeaturedNews[];
}







export type NewsPageItemType = "grid_header" | "article";

export interface DirectusNewsPageItem {
  id: number;
  type: NewsPageItemType;
  sort: number | null;
  external_id: number | null;
  title: string | null;
  date: string | null;
  category: string | null;
  excerpt: string | null;
  content: string | null;
  featured: boolean | null;
  image_url: string | null;
  Image: string | null;
}

export interface NewsPageArticle {
  id: number;
  externalId: number | null;
  sort: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  /** Full article body when available (Laravel). */
  content?: string;
  image: string | null;
  featured: boolean;
  slug?: string;
}

export interface NewsPageGridHeader {
  id: number;
  sort: number;
  title: string;
  image: string | null;
}

export interface NewsPageContent {
  gridHeader: NewsPageGridHeader | null;
  articles: NewsPageArticle[];
}

export type EventsPageItemType = "hero" | "grid_header" | "event";

export interface DirectusEventsPageItem {
  id: number;
  type: EventsPageItemType;
  sort: number | null;
  external_id: number | null;
  badge: string | null;
  title: string | null;
  description: string | null;
  date: string | null;
  location: string | null;
  category: string | null;
  link: string | null;
  content: string | null;
  image_url: string | null;
  Image: string | null;
}

export interface EventsPageEvent {
  id: number;
  externalId: number | null;
  sort: number;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  /** Full event body when available (Laravel). */
  content?: string;
  link?: string;
  badge?: string | null;
  image: string | null;
}

export interface EventsPageHero {
  badge: string;
  title: string;
  description: string;
}

export interface EventsPageGridHeader {
  title: string;
}

export interface EventsPageContent {
  hero: EventsPageHero | null;
  gridHeader: EventsPageGridHeader | null;
  events: EventsPageEvent[];
}

export type AboutPageItemType =
  | "hero"
  | "hero_image"
  | "mission"
  | "vision"
  | "section_header"
  | "core_value"
  | "why_feature"
  | "ecosystem_card"
  | "office"
  | "social_link";

export interface DirectusAboutPageItem {
  id: number;
  type: AboutPageItemType;
  sort: number | null;
  badge: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  content: string | null;
  excerpt: string | null;
  name: string | null;
  category: string | null;
  group: string | null;
  section_key: string | null;
  location: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  link: string | null;
  image: string | null;
  image_url: string | null;

}
export interface AboutHero {
  title: string;
  subtitle: string;
  description: string;
  content: string;
  excerpt: string;
  paragraphs: string[];
  primary_image: string | null;
  secondary_image: string | null;
}
export interface AboutMissionVision {
  title: string;
  description: string;
  image: string | null;
  icon: string;
}

export interface AboutSectionHeader {
  badge: string;
  title: string;
  description: string;
}

export interface AboutCoreValue {
  id: number;
  sort: number;
  title: string;
  description: string;
  icon: string;
}

export interface AboutWhyFeature {
  id: number;
  sort: number;
  title: string;
  description: string;
  image: string | null;
}

export interface AboutEcosystemCard {
  id: number;
  sort: number;
  title: string;
  description: string;
  icon: string;
  variant: "default" | "highlight";
}

export interface AboutOffice {
  id: number;
  sort: number;
  country: string;
  city: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  image: string | null;
}

export interface AboutSocialLink {
  id: number;
  sort: number;
  label: string;
  href: string;
  icon: string;
}

export interface AboutPageContent {
  hero: AboutHero | null;
  mission: AboutMissionVision | null;
  vision: AboutMissionVision | null;
  sectionHeaders: Partial<Record<string, AboutSectionHeader>>;
  coreValues: AboutCoreValue[];
  whyFeatures: AboutWhyFeature[];
  ecosystemCards: AboutEcosystemCard[];
  offices: AboutOffice[];
  socialLinks: AboutSocialLink[];
}

export interface DirectusPartnersPageItem {
  id: number;
  type: string | null;
  name: string | null;
  image: string | null;
  sort?: number | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  badge?: string | null;
  icon?: string | null;
  category?: string | null;
  image_url?: string | null;
  Image?: string | null;
}

export interface PartnersPageSection {
  id: number;
  sort: number;
  title: string;
  description: string;
  icon: string;
  image: string | null;
}

export interface PartnersPageHero {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string | null;
}

export interface PartnersPageContent {
  hero: PartnersPageHero | null;
  sections: PartnersPageSection[];
}

/** Raw Directus `Services_Page` collection row. */
export interface DirectusServicesPageItem {
  id: number;
  image?: string | { id?: string | null } | null;
  title?: string | null;
  desc?: string | null;
  /** Feature list: JSON array string, newline/comma-separated, or null. */
  services?: string | string[] | null;
}

export interface ServicesPageCard {
  id: number;
  title: string;
  description: string;
  image: string | null;
  features: string[];
}

export interface ServicesPageContent {
  cards: ServicesPageCard[];
}

export type AcademyPageItemType =
  | "hero"
  | "gap_stat"
  | "outcome_slice"
  | "cohort_point"
  | "flywheel_phase"
  | "comparison_row"
  | "pathway"
  | "walk_away"
  | "for_you"
  | "not_for_you"
  | "testimonial"
  | "partner"
  | "partner-logo"
  | "faq"
  | "Path-section";

export type DirectusFileRef = string | { id: string };

export interface DirectusAcademyPageItem {
  id: number;
  type: AcademyPageItemType;
  sort: number | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  extra: string | null;
  points: unknown;
  value_a: number | null;
  value_b: number | null;
  icon: string | null;
  tone: string | null;
  logo: string | null;
  cell_uni: string | null;
  cell_online: string | null;
  cell_weekend: string | null;
  cell_innovera: string | null;
  Image?: DirectusFileRef | null;
  image?: DirectusFileRef | null;
  image_url?: string | null;
}

export interface AcademyPathSectionImage {
  id: number;
  sort: number;
  title: string;
  alt: string;
  image: string;
}

export interface AcademyHeroImage {
  id: number;
  sort: number;
  title: string;
  alt: string;
  image: string;
}

export interface AcademyPageContent {
  /** True when data was loaded from Directus; false = use static fallbacks for empty sections. */
  cmsConnected: boolean;
  heroImages: AcademyHeroImage[];
  readinessGap: GapStat[];
  outcomeDistribution: OutcomeSlice[];
  cohortGrowth: CohortPoint[];
  flywheel: FlywheelPhase[];
  comparison: ComparisonRow[];
  pathways: Pathway[];
  walkAway: WalkAwayItem[];
  forYou: string[];
  notForYou: string[];
  testimonials: Testimonial[];
  partners: Partner[];
  faq: FaqItem[];
  pathSectionImages: AcademyPathSectionImage[];
}
