import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const blogsAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = blogsAdapter.getInitialState();

export const blogSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => ({
        url: "/blogs",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadeBlogs = responseData.map((blog) => {
          blog.id = blog._id;
          return blog;
        });
        return blogsAdapter.setAll(initialState, loadeBlogs);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Blog", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Blog", id })),
          ];
        } else return [{ type: "Blog", id: "LIST" }];
      },
    }),
    addNewBlog: builder.mutation({
      query: (initialBlog) => ({
        url: "/blogs",
        method: "POST",
        body: {
          ...initialBlog,
        },
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
    updateBlog: builder.mutation({
      query: (initialBlog) => ({
        url: "/blogs",
        method: "PATCH",
        body: {
          ...initialBlog,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Blog", id: arg.id }],
    }),
    deleteBlog: builder.mutation({
      query: ({ id }) => ({
        url: `/blogs`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Blog", id: arg.id }],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useAddNewBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogSlice;

export const selectBlogsResult = blogSlice.endpoints.getBlogs.select();

const selectBlogsData = createSelector(
  selectBlogsResult,
  (notesResult) => notesResult.data
);

export const {
  selectAll: selectAllBlogs,
  selectById: selectBlogById,
  selectIds: selectBlogIds,
} = blogsAdapter.getSelectors(
  (state) => selectBlogsData(state) ?? initialState
);
