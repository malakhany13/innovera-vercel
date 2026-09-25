import Link from "next/link";
import { Award, Check, Clock, Code, Globe, ArrowLeft } from "lucide-react";
import CoursePoweredBy from "@/components/CoursePoweredBy";
import CourseOutlinePdfLink from "@/components/courses/CourseOutlinePdfLink";
import CourseEnrollButton from "./CourseEnrollButton";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { FALLBACK_COURSE_IMAGE_ALT } from "@/lib/directus";
import type { Course, Lesson } from "@/features/directus/types";

interface CourseDetailViewProps {
  course: Course;
  lessons?: Lesson[];
}

export default function CourseDetailView({ course, lessons = [] }: CourseDetailViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-cyan transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to courses
        </Link>

        <article className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="relative h-44 sm:h-56 overflow-hidden">
            <OptimizedImage
              src={course.image || FALLBACK_COURSE_IMAGE_ALT}
              alt={course.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              fallbackSrc={FALLBACK_COURSE_IMAGE_ALT}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/30" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-brand-cyan text-white text-xs font-bold rounded-full shadow-lg">
                  {course.track}
                </span>
                <span className="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                  {course.level}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
                {course.title}
              </h1>
            </div>
          </div>

          {course.vendor && (
            <div className="px-6 md:px-8 py-4 bg-slate-50 border-b border-slate-100">
              <CoursePoweredBy
                vendor={course.vendor}
                logoClassName="h-10 max-w-[120px] object-contain"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Clock, label: "Duration", value: `${course.hours} Hours`, color: "bg-blue-50 text-blue-600" },
                { icon: Globe, label: "Format", value: course.format, color: "bg-emerald-50 text-emerald-600" },
                { icon: Award, label: "Credential", value: "Certificate / Badge", color: "bg-purple-50 text-purple-600" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                    <p className="font-semibold text-slate-900 truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {course.description?.trim() && (
              <p className="text-slate-600 text-base leading-relaxed mb-10">
                {course.description.trim()}
              </p>
            )}

            {/* Laravel `features` only — never merged with cover / prerequisites. */}
            {(course.features?.length ?? 0) > 0 ? (
              <section
                aria-labelledby="course-features-heading"
                className="mb-10 rounded-2xl border border-brand-cyan/20 bg-gradient-to-br from-brand-cyan/10 via-white to-white p-6 md:p-8"
              >
                <h2
                  id="course-features-heading"
                  className="text-lg font-display font-bold text-brand-navy mb-5 flex items-center gap-2"
                >
                  <Award className="w-5 h-5 text-brand-cyan" />
                  Features
                </h2>
                <ul className="space-y-3">
                  {course.features!.map((item, idx) => (
                    <li key={`feature-${idx}`} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-cyan/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-brand-cyan" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {course.whatYouWillCover.length > 0 ? (
              <section
                aria-labelledby="course-cover-heading"
                className="mb-10 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 md:p-8"
              >
                <h2
                  id="course-cover-heading"
                  className="text-lg font-display font-bold text-brand-navy mb-5 flex items-center gap-2"
                >
                  <Check className="w-5 h-5 text-brand-cyan" />
                  What you will cover
                </h2>
                <ul className="space-y-3">
                  {course.whatYouWillCover.map((item, idx) => (
                    <li key={`cover-${idx}`} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-cyan/15 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {course.prerequisites.length > 0 ? (
              <section
                aria-labelledby="course-prerequisites-heading"
                className="mb-10 rounded-2xl border border-slate-100 bg-slate-50 p-6 md:p-8"
              >
                <h2
                  id="course-prerequisites-heading"
                  className="text-lg font-display font-bold text-brand-navy mb-4"
                >
                  Prerequisites
                </h2>
                <ul className="space-y-3">
                  {course.prerequisites.map((item, idx) => (
                    <li key={`prereq-${idx}`} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {course.handsOn.length > 0 ? (
              <section
                aria-labelledby="course-hands-on-heading"
                className="mb-10 rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm"
              >
                <h2
                  id="course-hands-on-heading"
                  className="text-lg font-display font-bold text-brand-navy mb-4 flex items-center gap-2"
                >
                  <Code className="w-5 h-5 text-brand-cyan" />
                  Hands-on Elements
                </h2>
                <ul className="space-y-3">
                  {course.handsOn.map((item, idx) => (
                    <li
                      key={`hands-${idx}`}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/80"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center shrink-0">
                        <Code className="w-4 h-4 text-brand-cyan" />
                      </div>
                      <span className="text-slate-700 text-sm mt-1 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {lessons.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg font-display font-bold text-brand-navy mb-4">Course curriculum</h2>
                <ol className="space-y-3">
                  {lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div>
                        <p className="font-semibold text-brand-navy">{lesson.title}</p>
                        {lesson.description && (
                          <p className="text-sm text-slate-500 mt-1">{lesson.description}</p>
                        )}
                      </div>
                      {lesson.durationMinutes != null && (
                        <span className="text-xs font-medium text-slate-400 shrink-0">
                          {lesson.durationMinutes} min
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <Link
                href="/courses"
                className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors text-center"
              >
                Browse all courses
              </Link>
              <CourseOutlinePdfLink attachment={course.attachment ?? course.syllabusPdf ?? null} />
              <CourseEnrollButton courseId={course.id} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
