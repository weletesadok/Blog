import { useGetBlogsQuery } from "./blogSlice";

export default ()=>{
    const { username, isManager, isAdmin } = useAuth()

    const {
        data: blogs,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotesQuery('notesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    
}