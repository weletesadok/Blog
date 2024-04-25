import { useNavigate } from 'react-router-dom'
import { useGetBlogsQuery } from './blogSlice'
import { memo } from 'react'

const Blog = ({ blogId }) => {
    const author = "use some tstaff to get the author and based on roles allow editing or deleting"
    const { blog } = useGetBlogsQuery("blogsList", {
        selectFromResult: ({ data }) => ({
            blog: data?.entities[blogId]
        }),
    })
    const navigate = useNavigate()

    if (blog) {
        const handleEdit = () => navigate(`/dash/blogs/edit/${blogId}`)
        return "blog contents that have edit and delete based on role and is owner"

    } else return null
}

const memoizedBlog = memo(Blog)

export default memoizedBlog