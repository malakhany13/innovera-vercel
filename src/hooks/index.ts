export {
  useGetCoursesQuery,
  useGetCourseWithLessonsQuery,
  useEnrollInCourseMutation,
  useGetInternshipProgramsQuery,
  useLazyGetInternshipProgramsQuery,
  useGetHomePageQuery,
  useGetNewsPageQuery,
  useGetEventsPageQuery,
  useGetAboutPageQuery,
} from "@/store/baseApi";
export {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMyEnrollmentsQuery,
  useLazyGetMyEnrollmentsQuery,
} from "@/store/authApi";
export { useCoursesWithVendors } from "./useCoursesWithVendors";
