import { useNavigate, Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import formatDate from "../../helpers/formatDate.helper";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import {
  useGetBlogQuery,
  useDeleteBlogMutation,
  useLikeBlogMutation,
  useCommentBlogMutation,
} from "./blogSlice";
import { PulseLoader } from "react-spinners";
import { useEffect, useState } from "react";
import Image from "./../../img/image.jpeg";
import Alert from "./../../components/Alert";

export default () => {
  const { id: postId } = useParams();
  const [like, setLike] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const { isAdmin, username, id } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const {
    data: blog,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetBlogQuery({ postId });
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
  const handleEdit = () => navigate(`/blogs/edit/${blog._id}`);

  const handleDelete = async () => {
    try {
      await deleteBlog({ id: blog._id });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (isCommentError) {
      setMessage("error while commenting");
      setSeverity("error");
    } else if (isDelError) {
      setMessage("error while deleting post please try again");
      setSeverity("error");
    } else if (isLikeError) {
      setMessage("error while liking post please try again");
      setSeverity("error");
    } else if (isDelSuccess) {
      setMessage("succefully deleted");
      setSeverity("success");
      navigate("/blogs");
    } else if (isCommentSuccess) {
      setMessage("successfully commented given post");
      setSeverity("success");
      setComment("");
    } else if (isLikeSuccess) {
      setMessage("liked");
      setSeverity("success");
    } else if (isError) {
      setMessage("Error while loading post please try again later");
      setSeverity("error");
    } else if (isSuccess) {
      setIsLike(blog.likes.includes(id));
      setLike(blog.likes.length);
    }
    return () => {
      setMessage("");
      setSeverity("");
    };
  }, [
    isCommentError,
    isDelError,
    isLikeError,
    isDelSuccess,
    isCommentSuccess,
    isLikeSuccess,
    isError,
  ]);

  const handleLike = async () => {
    setLike(like + (isLike ? -1 : 1));
    try {
      await likeBlog({ postId: blog._id, userId: id });
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const commentResponse = await commentBlog({
        postId: blog._id,
        userId: id,
        comment,
        username,
      });
    } catch (e) {
      console.error(e);
    }
  };

  let content;
  if (isSuccess) {
    content = (
      <>
        <div className="p-4 dark:bg-gray-900 w-[100vw]">
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <p className="text-white text-sm">
            Published on <time>{formatDate(blog.createdAt)}</time>
          </p>

          <img
            src={blog.image ? blog.image : Image}
            alt="Featured image"
            className="h-60 rounded m-2"
          />

          <p className="m-2 text-wrap w-full">{blog.content}</p>
          {message && <Alert severity={severity} message={message} />}

          {username && (
            <div className="flex w-[75%] m-2 rounded justify-around  bg-black flex-wrap">
              {(username === blog.author.username || isAdmin) && (
                <button onClick={handleEdit}>
                  <EditIcon className="text-green-500" />
                </button>
              )}
              {(username === blog.author.username || isAdmin) && (
                <button onClick={handleDelete}>
                  <DeleteIcon className="text-red-500" />
                </button>
              )}
              {username && (
                <>
                  <button onClick={handleLike} disabled={isLike}>
                    {<FavoriteIcon className="text-yellow-500" />} {like}
                  </button>
                  <form
                    onSubmit={handleComment}
                    className="w-[75%] min-w-[8rem] bg-inherit m-0 p-0"
                  >
                    <input
                      type="text"
                      value={comment}
                      placeholder="Add a comment..."
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <input hidden type="submit" />
                  </form>
                </>
              )}
            </div>
          )}
          <Comment comments={blog.comments} />
        </div>
      </>
    );
  } else if (isLoading) {
    content = <PulseLoader color="yellow" />;
  } else {
    content = (
      <p className="text-red-500 bg-white rounded p-6 text-center ">
        Something went wrong please try again later
      </p>
    );
  }
  return <>{content}</>;
};
