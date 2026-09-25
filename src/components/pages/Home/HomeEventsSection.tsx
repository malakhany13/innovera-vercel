"use client";

import { useMemo, useState } from "react";
import FeaturedCardsSection from "@/src/components/sections/FeaturedCardsSection";
import EventDetailModal from "@/components/pages/Events/EventDetailModal";
import type { EventsPageEvent } from "@/features/directus/types";
import { events as fallbackEvents } from "@/src/constants";
import { FALLBACK_EVENT_IMAGE, resolveEventImage } from "@/lib/content-images";
import type { ContentEvent, FeaturedCard } from "@/src/types/content";
import { FEATURED_EVENTS } from "./constants";

interface HomeEventsSectionProps {
  events?: EventsPageEvent[];
}

function toContentEvent(event: EventsPageEvent): ContentEvent {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location || "",
    description: event.description || "",
    content: event.content?.trim() || event.description || "",
    image: resolveEventImage(event.image),
    category: event.category || "Event",
    link: event.link?.trim() || "#",
  };
}

export default function HomeEventsSection({ events = [] }: HomeEventsSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<ContentEvent | null>(null);

  const detailEvents = useMemo(() => {
    if (events.length > 0) {
      return events.slice(0, 3).map(toContentEvent);
    }
    return FEATURED_EVENTS.map((card) => {
      const fallback = fallbackEvents.find((item) => item.id === card.id) ??
        fallbackEvents.find((item) => item.title === card.title);
      return (
        fallback ?? {
          id: Number(card.id) || 0,
          title: card.title,
          date: card.date,
          location: "",
          description: card.title,
          content: card.title,
          image: card.image,
          category: card.category,
          link: "#",
        }
      );
    });
  }, [events]);

  const items: FeaturedCard[] = useMemo(
    () =>
      detailEvents.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        category: event.category,
        image: event.image,
      })),
    [detailEvents],
  );

  return (
    <>
      <FeaturedCardsSection
        eyebrow="Stay Updated"
        title="Upcoming Events"
        viewAllHref="/events"
        viewAllLabel="View All Events"
        items={items}
        className="py-32 bg-white"
        imageFallback={FALLBACK_EVENT_IMAGE}
        onItemClick={(item) => {
          const event = detailEvents.find((entry) => entry.id === item.id);
          if (event) setSelectedEvent(event);
        }}
      />
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
