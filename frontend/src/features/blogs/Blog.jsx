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
  useEffect(() => {
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
  }, [
    isCommentError,
    isDelError,
    isLikeError,
    isDelSuccess,
    isCommentSuccess,
    isLikeSuccess,
  ]);

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
  if (blog.author) {
    content = (
      <>
        <div className="max-w-sm rounded overflow-hidden card">
          <img
            className="w-full h-48 object-cover object-center"
            src={blog.image}
            alt="Image"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{blog.title}</div>
            <p className="text-gray-700 text-base">{blog.content}</p>
            <div className="flex items-center mt-4">
              <Link to={`/blogs/user/${blog.author._id}`}>
                <img
                  className="w-10 h-10 rounded-full mr-4"
                  src={blog.author.avatar}
                  alt="Avatar"
                />
              </Link>
              <div className="text-sm">
                <p className="text-gray-900 leading-none">
                  {blog.author.username}
                </p>
                <p className="text-gray-600">
                  Published on {formatDate(blog.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            {(username === blog.author.username || isAdmin) && (
              <button onClick={handleEdit}>edit icon</button>
            )}
            {(username === blog.author.username || isAdmin) && (
              <button onClick={handleDelete}>dekete icon</button>
            )}
            {username && (
              <button type="button" onChange={handleLike}>
                heart button
              </button>
            )}
          </div>
          {username && (
            <>
              <form
                onSubmit={handleComment}
                className="w-full bg-inherit m-0 p-0"
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  onChange={(e) => setComment(e.target.value)}
                  // className="w-full bg-red"
                />
                <input hidden type="submit" />
              </form>
            </>
          )}
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
