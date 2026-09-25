/**
 * Vite React Router → Next.js App Router mapping for Innovera.
 * Auth pages: /login, /signup, /forgot-password, /forgot-password/otp, /forgot-password/reset.
 * Course catalog + enroll live under `/courses`.
 */
export const APP_ROUTES = {
  home: "/",
  about: "/about",
  /** @deprecated Use `courses` — kept for older bookmarks. */
  training: "/courses",
  courses: "/courses",
  courseDetail: (id: string | number) => `/courses/${id}`,
  trainingEnroll: (courseId: string | number) => `/courses/enroll/${courseId}`,
  courseEnroll: (courseId: string | number) => `/courses/enroll/${courseId}`,
  internship: "/internship",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  forgotPasswordOtp: "/forgot-password/otp",
  forgotPasswordReset: "/forgot-password/reset",
  account: "/account",
  news: "/news",
  events: "/events",
  gallery: "/gallery",
  services: "/services",
  terms: "/terms",
  privacy: "/privacy",
  cookies: "/cookies",
  howToBuy: "/how-to-buy",
  partners: "/partners",
  contact: "/contact",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
