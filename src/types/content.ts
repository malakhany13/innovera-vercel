export interface FeaturedCard {
  title: string;
  date: string;
  category: string;
  image: string;
  /** Optional id used when opening a detail modal on the same page. */
  id?: number | string;
  /** When set, the card becomes a link. Prefer onItemClick for in-page modals. */
  href?: string;
}

export interface ContentArticle {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  featured: boolean;
}

export interface ContentEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  content: string;
  image: string;
  category: string;
  link: string;
}
