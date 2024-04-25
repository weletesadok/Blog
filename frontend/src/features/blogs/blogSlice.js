import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const blogsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = blogsAdapter.getInitialState()

export const blogsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBlogs: builder.query({
            query: () => ({
                url: '/blogs',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedBlogs = responseData.map(note => {
                    note.id = note._id
                    return note
                });
                return blogsAdapter.setAll(initialState, loadedBlogs)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Blog', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Blog', id }))
                    ]
                } else return [{ type: 'Blog', id: 'LIST' }]
            }
        }),
        addNewBlog: builder.mutation({
            query: initialNote => ({
                url: '/blogs',
                method: 'POST',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: [
                { type: 'Blog', id: "LIST" }
            ]
        }),
        updateBlog: builder.mutation({
            query: initialNote => ({
                url: '/blogs',
                method: 'PATCH',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Blog', id: arg.id }
            ]
        }),
        deleteBlog: builder.mutation({
            query: ({ id }) => ({
                url: `/blogs`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Blog', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetBlogsQuery,
    useAddNewBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogsApiSlice


export const selectBlogsResult = blogsApiSlice.endpoints.getBlogs.select()


const selectBlogsData = createSelector(
    selectBlogsResult,
    blogsResult => blogsResult.data 
)


export const {
    selectAll: selectAllBlogs,
    selectById: selectBlogById,
    selectIds: selectBlogIds
    
} = blogsAdapter.getSelectors(state => selectBlogsData(state) ?? initialState)