import { useNavigate, Link } from "react-router-dom";
import {
  useGetBlogsQuery,
  useGetBlogQuery,
  useDeleteBlogMutation,
  useLikeBlogMutation,
  useCommentBlogMutation,
} from "./blogSlice";
import { memo, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import formatDate from "./../../helpers/formatDate.helper";
import { PulseLoader } from "react-spinners";

const Blog = ({ blogId }) => {
  const { isAdmin, username, id } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [
    deleteBlog,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteBlogMutation();

  const [
    likeBlog,
    { isSuccess: isLikeSuccess, isError: isLikeError, error: likeError },
  ] = useLikeBlogMutation();

  const [
    commentBlog,
    {
      isSuccess: isCommentSuccess,
      isError: isCommentError,
      error: commentError,
    },
  ] = useCommentBlogMutation();
  const handleEdit = () => navigate(`/blogs/edit/${blogId}`);

  const handleDelete = async () => {
    try {
      const deleteResponse = await deleteBlog({ id: blogId });
    } catch (e) {
      console.log(e);
    }
  };
useEffect(()=>{
    if (isCommentError) {
      setErrMsg("error while commenting");
    } else if (isDelError) {
      setErrMsg("error while deleting post please try again");
    } else if (isLikeError) {
      setErrMsg("error while liking post please try again");
    } else if (isDelSuccess) {
      setMessage("succefully deleted");
    } else if (isCommentSuccess) {
      setMessage("successfully commented given post");
    } else if (isLikeSuccess) {
      setMessage("liked");
    }
  }, [isCommentError, isDelError, isLikeError, isDelSuccess, isCommentSuccess, isLikeSuccess])
  
  const handleLike = async () => {
    try {
      const likeResponse = await likeBlog({ postId: blogId, userId: id });
      console.log(id, likeResponse);
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const commentResponse = await commentBlog({
        postId: blogId,
        userId: id,
        comment,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const { blog } = useGetBlogsQuery("blogsList", {
    selectFromResult: ({ data }) => ({
      blog: data?.entities[blogId],
    }),
  });

  // const {data:blog, isError, isSuccess, isLoading, error} = useGetBlogQuery({postId:blogId});
  let content;
  if(blog.author){
    content = (<>
        {errMsg && <h1 className="text-red-500">{errMsg}</h1>}
        {message && <h1 className="text-red-500">{message}</h1>}
        <div className="flex flex-col items-center justify-start bg-green-500 m-2 w-[75%]">
          <div>
            <img src={blog.image} alt="" />
          </div>
          <div className="p-1  w-full">by: {blog.author.username}</div>
          <div className="p-1  w-full">title: {blog.title}</div>
          <div className="p-1  w-full">content: {blog.content}</div>
          <div className="p-1  w-full">category: {blog.category}</div>
          <div className="p-1 w-full">{formatDate(blog.createdAt)}</div>
          <div>
            <Link to={`/blogs/user/${blog.author._id}`}>
              other posts of {blog.author.username}
            </Link>{" "}
          </div>
          <div className="w-full flex items-center justify-evenly">
            {(username === blog.author.username || isAdmin) && <button onClick={handleEdit}>Edit</button>}
            {(username === blog.author.username || isAdmin) && (
              <button
                onClick={handleDelete}
                className="p-1 w-full rounded text-center"
              >
                Delete
              </button>
            )}
            {username && <input type="checkbox" onChange={handleLike} />}
            {username && (
              <>
                <form onSubmit={handleComment}>
                  <input
                    type="text"
                    onChange={(e) => setComment(e.target.value)}
                    className="dark:text-black "
                  />
                  <input hidden type="submit" />
                </form>
              </>
            )}
          </div>
        </div>
      </>
    );

  }
  // else if(isLoading){
  //   content = <PulseLoader color="green"/>
  // }
  //   else if(isError){
  //   content = (<p>something went wrong please try agian</p>)
  // }
  else {
    content = null;
  }

    return content;
};

const memoizedBlog = memo(Blog);

export default memoizedBlog;
