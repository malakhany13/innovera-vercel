"use client";

import { useMemo, useState } from "react";
import ContentFeaturedLayout from "@/src/components/sections/ContentFeaturedLayout";
import ContentGridSection from "@/src/components/sections/ContentGridSection";
import LightPageHero from "@/src/components/ui/LightPageHero";
import type { EventsPageContent, EventsPageEvent } from "@/features/directus/types";
import { useGetEventsPageQuery } from "@/features/directus/directusApi";
import { FALLBACK_EVENT_IMAGE, resolveEventImage } from "@/lib/content-images";
import type { ContentEvent } from "@/src/types/content";
import EventDetailModal from "./EventDetailModal";

function toContentEvent(event: EventsPageEvent): ContentEvent {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    description: event.description,
    content: event.content?.trim() || event.description,
    image: resolveEventImage(event.image),
    category: event.category,
    link: event.link?.trim() || "#",
  };
}

interface EventsProps {
  initialEventsPage?: EventsPageContent | null;
  fetchError?: boolean;
}

export default function Events({
  initialEventsPage = null,
  fetchError = false,
}: EventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<ContentEvent | null>(null);

  // Always load from Laravel via BFF `/api/events` (same pattern as courses).
  const {
    data: apiEventsPage,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetEventsPageQuery(undefined, {
    // Always hit `/api/events` on mount so Network matches courses/news.
    refetchOnMountOrArgChange: true,
  });

  const page = apiEventsPage ?? initialEventsPage;

  const eventItems = useMemo(() => {
    const events = page?.events ?? [];
    return events.map(toContentEvent);
  }, [page]);

  const topEvent = eventItems[0];
  const sideEvents = eventItems.slice(1, 3);
  const regularEvents = eventItems.slice(3);

  const showError =
    eventItems.length === 0 && (isError || fetchError) && !isLoading;
  const isPageLoading =
    isLoading || (isFetching && eventItems.length === 0);

  const toFeatured = (event: ContentEvent) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    category: event.category,
    image: event.image,
    summary: event.description,
  });

  const hero = page?.hero;

  if (showError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center max-w-lg">
          <p className="text-red-800 font-medium mb-4">
            We couldn&apos;t load events right now. Please try again in a moment.
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

  if (!topEvent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <p className="text-slate-500">
          {isPageLoading
            ? "Loading events…"
            : "Events content is unavailable right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ContentFeaturedLayout
        header={
          <LightPageHero
            eyebrow={hero?.badge ?? "Stay Connected"}
            title={
              <>
                Events & <span className="text-brand-cyan">Conferences</span>
              </>
            }
            description={
              hero?.description ||
              "Join us at the forefront of technology. We participate in and host major events across Egypt and the region to share knowledge and innovate together."
            }
          />
        }
        topItem={toFeatured(topEvent)}
        sideItems={sideEvents.map(toFeatured)}
        imageFallback={FALLBACK_EVENT_IMAGE}
        onItemClick={(item) => {
          const event = eventItems.find((e) => e.id === item.id);
          if (event) setSelectedEvent(event);
        }}
      />
      <ContentGridSection
        title={page?.gridHeader?.title ?? "Upcoming Events"}
        items={regularEvents.map(toFeatured)}
        imageFallback={FALLBACK_EVENT_IMAGE}
        onItemClick={(item) => {
          const event = eventItems.find((e) => e.id === item.id);
          if (event) setSelectedEvent(event);
        }}
      />
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
