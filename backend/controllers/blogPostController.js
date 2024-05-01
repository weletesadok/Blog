const BlogPost = require("../models/Blog");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate("author").lean();

    if (!blogPosts?.length) {
      return res.status(400).json({ message: "No blog posts found" });
    }

    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getSingleBlogPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const blogPost = await BlogPost.findById(postId)
      .populate("comments", "likes", "author")
      .lean()
      .exec();

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const searchBlogPosts = async (req, res) => {
  try {
    const { q } = req.query;

    const blogPosts = await BlogPost.find({ $text: { $search: q } }).lean();

    if (!blogPosts?.length) {
      return res.status(404).json({ message: "No matching blog posts found" });
    }

    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res
        .status(400)
        .json({ message: "Category parameter is required" });
    }

    const blogPosts = await BlogPost.find({ category }).lean().exec();

    if (!blogPosts?.length) {
      return res
        .status(404)
        .json({ message: `No blog posts found for category: ${category}` });
    }

    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getBlogPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const blogPosts = await BlogPost.find({ tags: tag }).lean();

    if (!blogPosts?.length) {
      return res
        .status(404)
        .json({ message: "No blog posts found with this tag" });
    }

    res.json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const createBlogPost = async (req, res) => {
  const { author, title, content, tags, category } = req.body;
  try {
    if (!author || !title || !content) {
      return res
        .status(400)
        .json({ message: "Author, title, and content are required" });
    }

    const existingPost = await BlogPost.findOne({ title }).lean().exec();

    if (existingPost) {
      return res.status(409).json({ message: "Duplicate post title" });
    }

    let image;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
      console.log(image);
    }

    const blogPost = await BlogPost.create({
      author,
      title,
      content,
      tags,
      category,
      image,
    });

    res.status(201).json({ message: "New blog post created", blogPost });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { postId, title, content, author, category } = req.body;

    if (!postId || !title || !content) {
      return res
        .status(400)
        .json({ message: "Post ID, title and content are required" });
    }

    const existingPost = await BlogPost.findById(postId).exec();

    if (!existingPost) {
      return res.status(400).json({ message: "Post not found" });
    }

    let image;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      postId,
      { title, content, category, image, author },
      { new: true }
    );

    res.json({ message: "Blog post updated", updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const { id: postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post ID required" });
    }

    const deletedPost = await BlogPost.findByIdAndDelete(postId).exec();

    if (!deletedPost) {
      return res.status(400).json({ message: "Post not found" });
    }

    res.json({ message: `Blog post with ID ${postId} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const likeBlogPost = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "Post and user IDs are required" });
    }

    const blogPost = await BlogPost.findById(postId).exec();

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (blogPost.likes.includes(userId)) {
      return res
        .json({ message: "You have already liked this post" });
    }

    blogPost.likes.push(userId);
    await blogPost.save();

    res.json({ message: `Liked blog post with ID ${postId}` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
const commentBlogPost = async (req, res) => {
  try {
    const username = req.params.id
    const { postId, userId, comment } = req.body;
    console.log(username, comment)

    if (!postId || !userId || !comment) {
      return res
        .status(400)
        .json({ message: "Post and user IDs are required" });
    }

    const blogPost = await BlogPost.findById(postId).exec();

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    const commentWithId = { user: userId, comment,  createdAt: new Date()};
    blogPost.comments.push(commentWithId);
    const withCommetn = await blogPost.save();
    console.log(withCommetn);

    res.json({ message: `commented successfully` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getUserBlogPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    const userPosts = await BlogPost.find({ author: userId })
      .populate(["comments", "likes"])
      .lean()
      .exec();

    if (!userPosts?.length) {
      return res
        .status(400)
        .json({ message: "No blog posts found for the user" });
    }

    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  getAllBlogPosts,
  getSingleBlogPost,
  searchBlogPosts,
  getPostsByCategory,
  getBlogPostsByTag,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  getUserBlogPosts,
  commentBlogPost,
};
