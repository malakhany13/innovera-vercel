import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Config from "@/lib/config/app.config";
import { studentAuthHeaders } from "@/lib/auth/student-headers";
import {
  parseInternshipEnrollmentsPayload,
  type InternshipEnrollment,
} from "@/lib/laravel/internship-enrollments";

/** Student payload returned by login / register BFF. */
export interface AuthStudent {
  id: number;
  full_name: string;
  email: string;
  mobile_number?: string | null;
  academic_year?: string | null;
  college?: string | null;
  role_in_tech?: string | null;
  avatar?: string | null;
}

export interface AuthSessionResponse {
  message?: string;
  token?: string;
  student?: AuthStudent;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  mobile_number: string;
  academic_year: string;
  college: string;
  role_in_tech: string;
}

/**
 * Auth RTK API — paths from {@link Config.AUTH} on {@link Config.BACK_END_URL}
 * (Railway API host, e.g. …/api/student/register).
 */
const authBaseQuery = fetchBaseQuery({
  baseUrl: Config.BACK_END_URL,
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: authBaseQuery,
  tagTypes: ["MyEnrollments"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthSessionResponse, LoginRequest>({
      query: (body) => ({
        url: Config.AUTH.login,
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<AuthSessionResponse, RegisterRequest>({
      query: (body) => ({
        url: Config.AUTH.register,
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<{ ok?: boolean }, string>({
      query: (token) => ({
        url: Config.AUTH.logout,
        method: "POST",
        headers: { Authorization: `Bearer ${token.trim()}` },
      }),
    }),

    getMyEnrollments: builder.query<InternshipEnrollment[], string>({
      query: (token) => ({
        url: Config.AUTH.myEnrollments,
        headers: studentAuthHeaders(token),
      }),
      transformResponse: (response: unknown) =>
        parseInternshipEnrollmentsPayload(response),
      providesTags: ["MyEnrollments"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMyEnrollmentsQuery,
  useLazyGetMyEnrollmentsQuery,
} = authApi;
