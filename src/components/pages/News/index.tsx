"use client";

import { useMemo, useState } from "react";
import ContentFeaturedLayout from "@/src/components/sections/ContentFeaturedLayout";
import ContentGridSection from "@/src/components/sections/ContentGridSection";
import ArticleDetailModal from "@/src/components/ui/ArticleDetailModal";
import type { NewsPageArticle, NewsPageContent } from "@/features/directus/types";
import { useGetNewsPageQuery } from "@/features/directus/directusApi";
import { FALLBACK_NEWS_IMAGE, resolveNewsImage } from "@/lib/content-images";
import type { ContentArticle } from "@/src/types/content";

function toContentArticle(article: NewsPageArticle): ContentArticle {
  return {
    id: article.id,
    title: article.title,
    date: article.date,
    category: article.category,
    image: resolveNewsImage(article.image),
    excerpt: article.excerpt,
    content: article.content?.trim() || article.excerpt,
    featured: article.featured,
  };
}

interface NewsProps {
  initialNewsPage?: NewsPageContent | null;
  fetchError?: boolean;
}

export default function News({
  initialNewsPage = null,
  fetchError = false,
}: NewsProps) {
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(null);

  // Always load from Laravel via BFF `/api/news` (same pattern as courses/events).
  const {
    data: apiNewsPage,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetNewsPageQuery(undefined, {
    // Always hit `/api/news` on mount so Network matches courses/events.
    refetchOnMountOrArgChange: true,
  });

  const page = apiNewsPage ?? initialNewsPage;

  const articles = useMemo(() => {
    const fromApi = page?.articles ?? [];
    return fromApi.map(toContentArticle);
  }, [page]);

  const topStory = articles[0];
  const sideStories = articles.slice(1, 3);
  const regularStories = articles.slice(3);

  const showError =
    articles.length === 0 && (isError || fetchError) && !isLoading;
  const isPageLoading =
    isLoading || (isFetching && articles.length === 0);

  const toFeatured = (article: ContentArticle) => ({
    id: article.id,
    title: article.title,
    date: article.date,
    category: article.category,
    image: article.image,
    summary: article.excerpt,
  });

  if (showError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg">
          <p className="text-red-800 font-medium mb-4">
            We couldn&apos;t load news right now. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="px-6 py-2 bg-brand-cyan text-white font-medium rounded-full hover:bg-cyan-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!topStory) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <p className="text-slate-500">
          {isPageLoading
            ? "Loading news…"
            : "News content is unavailable right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ContentFeaturedLayout
        topItem={toFeatured(topStory)}
        sideItems={sideStories.map(toFeatured)}
        imageFallback={FALLBACK_NEWS_IMAGE}
        onItemClick={(item) => {
          const article = articles.find((n) => n.id === item.id);
          if (article) setSelectedArticle(article);
        }}
      />
      <ContentGridSection
        title={page?.gridHeader?.title ?? "Latest News"}
        items={regularStories.map(toFeatured)}
        imageFallback={FALLBACK_NEWS_IMAGE}
        onItemClick={(item) => {
          const article = articles.find((n) => n.id === item.id);
          if (article) setSelectedArticle(article);
        }}
      />
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
