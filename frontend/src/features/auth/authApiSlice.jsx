import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    forget: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/forget",
        method: "POST",
        body: { email },
      }),
    }),
    forgetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/forget/${token}`,
        method: "POST",
        body: { password },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, password, newPassword }) => ({
        url: `/auth/reset`,
        method: "POST",
        body: { password, newPassword, email },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: "/auth/me",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getProfile: builder.query({
      query: ({ id }) => `/auth/me/${id}`,
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useForgetPasswordMutation,
  useForgetMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
} = authApiSlice;
