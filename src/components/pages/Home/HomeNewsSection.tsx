"use client";

import { useMemo, useState } from "react";
import FeaturedCardsSection from "@/src/components/sections/FeaturedCardsSection";
import ArticleDetailModal from "@/src/components/ui/ArticleDetailModal";
import type { NewsPageArticle } from "@/features/directus/types";
import { FALLBACK_NEWS_IMAGE, resolveNewsImage } from "@/lib/content-images";
import { newsItems } from "@/components/pages/News/constants";
import type { ContentArticle, FeaturedCard } from "@/src/types/content";
import { FEATURED_NEWS } from "./constants";

interface HomeNewsSectionProps {
  articles?: NewsPageArticle[];
}

function toContentArticle(article: NewsPageArticle): ContentArticle {
  return {
    id: article.id,
    title: article.title,
    date: article.date,
    category: article.category || "News",
    image: resolveNewsImage(article.image),
    excerpt: article.excerpt || "",
    content: article.content?.trim() || article.excerpt || "",
    featured: article.featured,
  };
}

export default function HomeNewsSection({ articles = [] }: HomeNewsSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(null);

  const detailArticles = useMemo(() => {
    if (articles.length > 0) {
      return articles.slice(0, 3).map(toContentArticle);
    }
    return FEATURED_NEWS.map((card) => {
      const fallback = newsItems.find((item) => item.id === card.id) ?? newsItems.find(
        (item) => item.title === card.title,
      );
      return (
        fallback ?? {
          id: Number(card.id) || 0,
          title: card.title,
          date: card.date,
          category: card.category,
          image: card.image,
          excerpt: card.title,
          content: card.title,
          featured: true,
        }
      );
    });
  }, [articles]);

  const items: FeaturedCard[] = useMemo(
    () =>
      detailArticles.map((article) => ({
        id: article.id,
        title: article.title,
        date: article.date,
        category: article.category,
        image: article.image,
      })),
    [detailArticles],
  );

  return (
    <>
      <FeaturedCardsSection
        eyebrow="Latest Updates"
        title="Latest News"
        viewAllHref="/news"
        viewAllLabel="View All News"
        items={items}
        imageFallback={FALLBACK_NEWS_IMAGE}
        onItemClick={(item) => {
          const article = detailArticles.find((entry) => entry.id === item.id);
          if (article) setSelectedArticle(article);
        }}
      />
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  );
}
