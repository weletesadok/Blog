import { useGetBlogsQuery } from "./blogSlice"
import Blog from './Blog'
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const BlogsList = () => {
    useTitle('Blogs')

    const {
        data: blogs,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBlogsQuery('blogsList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
        console.log(error)
    }

    if (isSuccess) {
        console.log(blogs)
        const { ids } = blogs

        content=  (<div className="flex flex-col items-center justify-between">
                {ids.map(id=>{
                    return <Blog blogId={id} key={id}/>
                })}
            </div>)
    }

    return content
}
export default BlogsList