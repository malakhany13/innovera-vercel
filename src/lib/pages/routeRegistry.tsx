import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  AboutPageSkeleton,
  ContactPageSkeleton,
  CourseCatalogSkeleton,
  CourseDetailSkeleton,
  EnrollPageSkeleton,
  EventsPageSkeleton,
  GalleryPageSkeleton,
  HomePageSkeleton,
  HowToBuyPageSkeleton,
  LegalPageSkeleton,
  NewsPageSkeleton,
  PartnersPageSkeleton,
} from "@/components/ui/skeletons";
import { emptyAcademyPageContent } from "@/features/directus/transforms";
import {
  CourseNotFoundError,
  getAboutPage,
  getAcademyPage,
  getCourseById,
  getCoursesWithVendors,
  getEventsPage,
  getHomePage,
  getLessons,
  getNewsPage,
  getPartnersPage,
  getServicesPage,
} from "@/lib/directus";
import { buildCourseMetadata, buildPageMetadata } from "@/lib/metadata";
import {
  loadCourseCatalog,
  loadEventsPage,
  loadNewsPage,
  skipRemotePrerender,
} from "./loaders";
import type { CmsPageSlug, StaticPageSlug } from "./staticParams";

type RouteKind = "static" | "cms" | "catalog" | "dynamic";

interface SiteRoute {
  kind: RouteKind;
  skeleton: ComponentType;
  metadata: Metadata;
  render: () => ReactNode | Promise<ReactNode>;
  resolveMetadata?: (segments: string[]) => Promise<Metadata>;
}

function staticRoute(
  meta: Parameters<typeof buildPageMetadata>[0],
  load: () => Promise<{ default: ComponentType }>,
  skeleton: ComponentType,
): SiteRoute {
  return {
    kind: "static",
    skeleton,
    metadata: buildPageMetadata(meta),
    render: async () => {
      const { default: Component } = await load();
      return <Component />;
    },
  };
}

function forgotPasswordRoute(
  step: "email" | "otp" | "reset",
  meta: Parameters<typeof buildPageMetadata>[0],
): SiteRoute {
  return {
    kind: "static",
    skeleton: ContactPageSkeleton,
    metadata: buildPageMetadata(meta),
    render: async () => {
      const { default: ForgotPasswordPage } = await import(
        "@/components/pages/Auth/ForgotPasswordPage"
      );
      return <ForgotPasswordPage step={step} />;
    },
  };
}

function cmsRoute<TProps>(
  meta: Parameters<typeof buildPageMetadata>[0],
  skeleton: ComponentType,
  load: () => Promise<TProps>,
  render: (props: TProps) => ReactNode | Promise<ReactNode>,
): SiteRoute {
  return {
    kind: "cms",
    skeleton,
    metadata: buildPageMetadata(meta),
    render: async () => {
      const props = await load();
      return render(props);
    },
  };
}

const STATIC_ROUTES: Record<StaticPageSlug, SiteRoute> = {
  contact: staticRoute(
    {
      title: "Contact",
      description: "Get in touch with Innovera for training, digital solutions, and partnerships.",
      path: "/contact",
    },
    () => import("@/components/pages/Contact"),
    ContactPageSkeleton,
  ),
  internship: staticRoute(
    {
      title: "Internship",
      description:
        "Join Innovera internship tracks across AI, software, HR, administration, and digital marketing.",
      path: "/internship",
    },
    () => import("@/components/pages/Internship"),
    ContactPageSkeleton,
  ),
  login: staticRoute(
    {
      title: "Login",
      description: "Sign in to your Innovera account.",
      path: "/login",
    },
    () => import("@/components/pages/Auth/LoginPage"),
    ContactPageSkeleton,
  ),
  signup: staticRoute(
    {
      title: "Sign up",
      description: "Create your Innovera account.",
      path: "/signup",
    },
    () => import("@/components/pages/Auth/SignupPage"),
    ContactPageSkeleton,
  ),
  "forgot-password": forgotPasswordRoute("email", {
    title: "Forgot Password",
    description: "Reset your Innovera account password.",
    path: "/forgot-password",
  }),
  account: staticRoute(
    {
      title: "My Account",
      description: "Manage your Innovera account.",
      path: "/account",
    },
    () => import("@/components/pages/Account"),
    ContactPageSkeleton,
  ),
  gallery: staticRoute(
    {
      title: "Gallery",
      description: "Photos from Innovera events, training sessions, and corporate activities.",
      path: "/gallery",
    },
    () => import("@/components/pages/Gallery"),
    GalleryPageSkeleton,
  ),
  "how-to-buy": staticRoute(
    {
      title: "How to Buy",
      description: "Steps to purchase Innovera training courses and enterprise solutions.",
      path: "/how-to-buy",
    },
    () => import("@/components/pages/HowToBuy"),
    HowToBuyPageSkeleton,
  ),
  privacy: staticRoute(
    {
      title: "Privacy Policy",
      description: "How Innovera collects, uses, and protects your personal information.",
      path: "/privacy",
    },
    () => import("@/components/pages/Privacy"),
    LegalPageSkeleton,
  ),
  terms: staticRoute(
    {
      title: "Terms of Service",
      description: "Terms and conditions for using Innovera services and training programs.",
      path: "/terms",
    },
    () => import("@/components/pages/Terms"),
    LegalPageSkeleton,
  ),
  cookies: staticRoute(
    {
      title: "Cookie Policy",
      description: "How Innovera uses cookies and similar technologies on our website.",
      path: "/cookies",
    },
    () => import("@/components/pages/Cookies"),
    LegalPageSkeleton,
  ),
};

const FORGOT_PASSWORD_OTP_ROUTE = forgotPasswordRoute("otp", {
  title: "Verify OTP",
  description: "Enter the verification code sent to your email.",
  path: "/forgot-password/otp",
});

const FORGOT_PASSWORD_RESET_ROUTE = forgotPasswordRoute("reset", {
  title: "Reset Password",
  description: "Choose a new password for your Innovera account.",
  path: "/forgot-password/reset",
});

const INTERNSHIP_TERMS_ROUTE = staticRoute(
  {
    title: "Internship AI Interview Terms",
    description:
      "Terms and conditions for the Innovera AI Interview Assessment and educational program.",
    path: "/internship/terms",
  },
  () => import("@/components/pages/InternshipTerms"),
  LegalPageSkeleton,
);

const CMS_SLUG_ROUTES: Record<CmsPageSlug, SiteRoute> = {
  services: cmsRoute(
    {
      title: "Services",
      description:
        "Innovera technology services — AI, cybersecurity, cloud, consulting, and managed operations.",
      path: "/services",
    },
    GalleryPageSkeleton,
    async () => ({ initialServicesPage: await getServicesPage().catch(() => null) }),
    async (props) => {
      const { default: Services } = await import("@/components/pages/Services");
      return <Services {...props} />;
    },
  ),
  partners: cmsRoute(
    {
      title: "Partners & Clients",
      description: "Innovera's technology partners, clients, and ecosystem collaborations.",
      path: "/partners",
    },
    PartnersPageSkeleton,
    async () => ({ initialPartnersPage: await getPartnersPage().catch(() => null) }),
    async (props) => {
      const { default: Partners } = await import("@/components/pages/Partners");
      return <Partners {...props} />;
    },
  ),
  about: cmsRoute(
    {
      title: "About Us",
      description: "Learn about Innovera's mission, vision, values, and global presence.",
      path: "/about",
    },
    AboutPageSkeleton,
    async () => ({ initialAboutPage: await getAboutPage().catch(() => null) }),
    async (props) => {
      const { default: About } = await import("@/components/pages/About");
      return <About {...props} />;
    },
  ),
  academy: cmsRoute(
    {
      title: "Innovera Academy — From Classroom to Co-Founder",
      description:
        "Turn your technical skills into a funded startup. A 12–16 week program with MVP build, cloud credits, micro-grants, and a Demo Day with real investors.",
      path: "/academy",
    },
    HomePageSkeleton,
    async () => ({
      initialAcademyPage: await getAcademyPage().catch(() => emptyAcademyPageContent()),
    }),
    async (props) => {
      const { default: Academy } = await import("@/components/pages/Academy");
      return <Academy {...props} />;
    },
  ),
  events: cmsRoute(
    {
      title: "Events",
      description: "Upcoming Innovera events, conferences, and industry gatherings.",
      path: "/events",
    },
    EventsPageSkeleton,
    loadEventsPage,
    async ({ initialEventsPage, fetchError }) => {
      const { default: Events } = await import("@/components/pages/Events");
      return (
        <Events initialEventsPage={initialEventsPage} fetchError={fetchError} />
      );
    },
  ),
  news: cmsRoute(
    {
      title: "News",
      description: "Latest news and announcements from Innovera Academy and corporate teams.",
      path: "/news",
    },
    NewsPageSkeleton,
    loadNewsPage,
    async ({ initialNewsPage, fetchError }) => {
      const { default: News } = await import("@/components/pages/News");
      return (
        <News initialNewsPage={initialNewsPage} fetchError={fetchError} />
      );
    },
  ),
};

const HOME_ROUTE: SiteRoute = cmsRoute(
  {
    title: "Home",
    description:
      "Innovera - Empowering Talent, Shaping the Future. World-class training and intelligent outsourcing solutions.",
    path: "/",
  },
  HomePageSkeleton,
  async () => {
    // `next build` has a 30s page budget. Empty Directus URL + Laravel 3×20s
    // retries blow that. Seeds are optional — HomeSeedContext refetches via RTK.
    if (skipRemotePrerender()) {
      return {
        initialHomePage: null,
        initialCourses: [],
        initialServicesCards: [],
        initialNewsArticles: [],
        initialEvents: [],
      };
    }

    const [homePage, courses, servicesPage, newsPage, eventsPage] = await Promise.all([
      getHomePage().catch(() => null),
      getCoursesWithVendors().catch(() => []),
      getServicesPage().catch(() => null),
      getNewsPage().catch(() => null),
      getEventsPage().catch(() => null),
    ]);
    return {
      initialHomePage: homePage,
      initialCourses: courses,
      initialServicesCards: servicesPage?.cards ?? [],
      initialNewsArticles: newsPage?.articles ?? [],
      initialEvents: eventsPage?.events ?? [],
    };
  },
  async (props) => {
    const { default: Home } = await import("@/components/pages/Home");
    return <Home {...props} />;
  },
);

const TRAINING_ROUTE: SiteRoute = cmsRoute(
  {
    title: "Courses",
    description: "Browse Innovera Academy courses — certified training across cybersecurity, AI, and more.",
    path: "/training",
  },
  CourseCatalogSkeleton,
  loadCourseCatalog,
  async ({ initialCourses, fetchError }) => {
    const { default: TrainingCatalog } = await import(
      "@/components/pages/Training/TrainingCatalog"
    );
    return (
      <TrainingCatalog
        initialCourses={initialCourses}
        fetchError={fetchError}
        courseLinkPrefix="/courses"
      />
    );
  },
);

const COURSES_ROUTE: SiteRoute = cmsRoute(
  {
    title: "Courses",
    description:
      "Browse Innovera Academy courses — certified training across cybersecurity, AI, and more.",
    path: "/courses",
  },
  CourseCatalogSkeleton,
  loadCourseCatalog,
  async ({ initialCourses, fetchError }) => {
    const { default: TrainingCatalog } = await import(
      "@/components/pages/Training/TrainingCatalog"
    );
    return (
      <TrainingCatalog
        initialCourses={initialCourses}
        fetchError={fetchError}
        courseLinkPrefix="/courses"
      />
    );
  },
);

function courseShellRoute(path: string, variant: "detail" | "enroll"): SiteRoute {
  return {
    kind: "dynamic",
    skeleton: CourseDetailSkeleton,
    metadata: buildPageMetadata({
      title: "Course",
      description: "Innovera Academy course details.",
      path,
    }),
    render: async () => {
      const { default: CourseLiveShell } = await import(
        "@/components/pages/Courses/CourseLiveShell"
      );
      return <CourseLiveShell variant={variant} />;
    },
  };
}

function courseDetailRoute(id: string): SiteRoute {
  return {
    kind: "dynamic",
    skeleton: CourseDetailSkeleton,
    metadata: buildPageMetadata({
      title: "Course",
      description: "Innovera Academy course details.",
      path: `/courses/${id}`,
    }),
    resolveMetadata: async () => {
      try {
        const course = await getCourseById(id);
        return buildCourseMetadata(course);
      } catch {
        return buildPageMetadata({
          title: "Course not found",
          description: "The requested course could not be found.",
          path: `/courses/${id}`,
        });
      }
    },
    render: async () => {
      try {
        const [{ default: CourseDetailClient }, course, lessons] = await Promise.all([
          import("@/components/pages/Courses/CourseDetailClient"),
          getCourseById(id),
          getLessons(id),
        ]);
        return <CourseDetailClient initialCourse={course} lessons={lessons} />;
      } catch (error) {
        if (error instanceof CourseNotFoundError) notFound();
        throw error;
      }
    },
  };
}

function enrollRoute(courseId: string): SiteRoute {
  return {
    kind: "dynamic",
    skeleton: EnrollPageSkeleton,
    metadata: buildPageMetadata({
      title: "Enroll in Course",
      description: "Submit your enrollment request for an Innovera Academy course.",
      path: `/courses/enroll/${courseId}`,
    }),
    resolveMetadata: async () => {
      try {
        const course = await getCourseById(courseId);
        return buildCourseMetadata(course, {
          path: `/courses/enroll/${courseId}`,
          titlePrefix: "Enroll — ",
        });
      } catch {
        return buildPageMetadata({
          title: "Enroll in Course",
          description: "Submit your enrollment request for an Innovera Academy course.",
          path: `/courses/enroll/${courseId}`,
        });
      }
    },
    render: async () => {
      try {
        const [{ default: TrainingCourseEnrollPage }, course] = await Promise.all([
          import("@/components/pages/Training/TrainingCourseEnrollPage"),
          getCourseById(courseId),
        ]);
        return <TrainingCourseEnrollPage course={course} />;
      } catch (error) {
        if (error instanceof CourseNotFoundError) notFound();
        throw error;
      }
    },
  };
}

/** Resolve a site route from URL path segments (optional catch-all). */
function resolveSiteRoute(segments?: string[]): SiteRoute | null {
  const path = segments ?? [];

  // Never treat `/api/...` as a CMS/site page (that would return HTML 200).
  // Payment JSON is served by `src/app/api/payment/[token]` (next-dev) or
  // Laravel (static export). Falling through here must 404, not render a page.
  if (path[0] === "api") return null;

  if (path.length === 0) return HOME_ROUTE;

  if (path.length === 1) {
    const slug = path[0];
    if (slug === "training") return TRAINING_ROUTE;
    if (slug === "courses") return COURSES_ROUTE;
    const cmsSlugRoute = CMS_SLUG_ROUTES[slug as CmsPageSlug];
    if (cmsSlugRoute) return cmsSlugRoute;
    const staticSlugRoute = STATIC_ROUTES[slug as StaticPageSlug];
    if (staticSlugRoute) return staticSlugRoute;
  }

  if (path.length === 2 && path[0] === "forgot-password") {
    if (path[1] === "otp") return FORGOT_PASSWORD_OTP_ROUTE;
    if (path[1] === "reset") return FORGOT_PASSWORD_RESET_ROUTE;
  }

  if (path.length === 2 && path[0] === "internship" && path[1] === "terms") {
    return INTERNSHIP_TERMS_ROUTE;
  }

  if (path.length === 2 && path[0] === "courses") {
    // Always the live shell — it reads the id from the URL and hits
    // GET /api/courses/{id}. Server-side getCourseById + notFound() skipped a
    // working BFF and 404'd the page with no Network request.
    return courseShellRoute(`/courses/${path[1]}`, "detail");
  }

  // Preferred enroll path: /courses/enroll/:id
  // Legacy enroll path:    /training/enroll/:id
  if (
    path.length === 3 &&
    path[1] === "enroll" &&
    (path[0] === "courses" || path[0] === "training")
  ) {
    return courseShellRoute(`/${path[0]}/enroll/${path[2]}`, "enroll");
  }

  return null;
}

export function matchSiteRoute(segments?: string[]): SiteRoute {
  const route = resolveSiteRoute(segments);
  if (!route) notFound();
  return route;
}

/** Pick the loading skeleton for a pathname (used by the single loading.tsx). */
export function skeletonForPath(pathname: string): ComponentType {
  const segments = pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  return (
    resolveSiteRoute(segments.length ? segments : undefined)?.skeleton ?? HomePageSkeleton
  );
}

export async function resolveSiteMetadata(segments?: string[]): Promise<Metadata> {
  const route = matchSiteRoute(segments);
  if (route.resolveMetadata) {
    return route.resolveMetadata(segments ?? []);
  }
  return route.metadata;
}

export function routeNeedsSuspense(route: SiteRoute): boolean {
  return route.kind === "cms" || route.kind === "dynamic";
}
