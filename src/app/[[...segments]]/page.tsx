import type { Metadata } from "next";
import {
  matchSiteRoute,
  resolveSiteMetadata,
  routeNeedsSuspense,
} from "@/lib/pages/routeRegistry";
import { generateAllStaticParams } from "@/lib/pages/staticParams";
import { SuspensePage } from "@/lib/pages/pageFactory";

interface SitePageProps {
  params: Promise<{ segments?: string[] }>;
}

// Must be static literals (Next cannot analyze ternary route segment config).
// Live Directus updates in `next d` come from `cache: "no-store"` in directus-admin.
// `dynamicParams: true` in next-dev so course pages work without enumerating
// every Laravel id on startup. `build:static` patches this to `false`.
export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = false;

export async function generateStaticParams() {
  return generateAllStaticParams();
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { segments } = await params;
  return resolveSiteMetadata(segments);
}

export default async function SitePage({ params }: SitePageProps) {
  const { segments } = await params;
  const route = matchSiteRoute(segments);

  if (!routeNeedsSuspense(route)) {
    return route.render();
  }

  const Skeleton = route.skeleton;

  async function Content() {
    return route.render();
  }

  return (
    <SuspensePage fallback={<Skeleton />}>
      <Content />
    </SuspensePage>
  );
}
