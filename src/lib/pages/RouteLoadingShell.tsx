"use client";

import { usePathname } from "next/navigation";
import { skeletonForPath } from "./routeRegistry";

/** Client shell used by the single App Router `loading.tsx`. */
export default function RouteLoadingShell() {
  const pathname = usePathname();
  const Skeleton = skeletonForPath(pathname);
  return <Skeleton />;
}
