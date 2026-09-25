import { Suspense, type ComponentType, type ReactNode } from "react";
import { buildPageMetadata, type PageMetadataInput } from "@/lib/metadata";

export function SuspensePage({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/** One-liner factory for App Router `loading.tsx` files. */
export function createRouteLoading(Skeleton: ComponentType) {
  function RouteLoading() {
    return <Skeleton />;
  }

  return RouteLoading;
}

interface CmsPageConfig<TProps> {
  meta: PageMetadataInput;
  skeleton: ComponentType;
  load: () => Promise<TProps>;
  render: (props: TProps) => ReactNode;
}

/** CMS page: metadata + Suspense streaming + skeleton fallback (statically generated). */
export function createCmsPage<TProps>({
  meta,
  skeleton,
  load,
  render,
}: CmsPageConfig<TProps>) {
  async function Content() {
    const props = await load();
    return render(props);
  }

  function Page() {
    const Skeleton = skeleton;
    return (
      <SuspensePage fallback={<Skeleton />}>
        <Content />
      </SuspensePage>
    );
  }

  return {
    metadata: buildPageMetadata(meta),
    Page,
  };
}

interface StaticPageConfig {
  meta: PageMetadataInput;
  component: ComponentType;
}

/** Static page: metadata only (no server fetch shell). */
export function createStaticPage({
  meta,
  component: Component,
}: StaticPageConfig) {
  function Page() {
    return <Component />;
  }

  return {
    metadata: buildPageMetadata(meta),
    Page,
  };
}

interface DynamicPageShellConfig<TParams extends Record<string, string>, TData> {
  skeleton: ComponentType;
  getParam: (params: TParams) => string;
  load: (key: string) => Promise<TData>;
  render: (data: TData) => ReactNode;
}

/** Dynamic route shell with Suspense (metadata/generateStaticParams stay in the route file). */
export function createDynamicPageShell<TParams extends Record<string, string>, TData>({
  skeleton,
  getParam,
  load,
  render,
}: DynamicPageShellConfig<TParams, TData>) {
  return function DynamicPage({ params }: { params: Promise<TParams> }) {
    async function Content() {
      const resolved = await params;
      const data = await load(getParam(resolved));
      return render(data);
    }

    const Skeleton = skeleton;
    return (
      <SuspensePage fallback={<Skeleton />}>
        <Content />
      </SuspensePage>
    );
  };
}
