const BlogPost = require('../models/Blog');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dpuotea85',
    api_key: '269375457246699',
    api_secret: 'X9pIatqQEemSd33QDw9h3Q3m47I',
    api_environment_variable: 'CLOUDINARY_URL=cloudinary://269375457246699:X9pIatqQEemSd33QDw9h3Q3m47I@dpuotea85'
  });

const getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find().lean();

        if (!blogPosts?.length) {
            return res.status(400).json({ message: 'No blog posts found' });
        }

        res.json(blogPosts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'});
    }
};

const getSingleBlogPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const blogPost = await BlogPost.findById(postId).lean().exec();

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.json(blogPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const searchBlogPosts = async (req, res) => {
    try {
        const { q } = req.query;

        const blogPosts = await BlogPost.find({ $text: { $search: q } }).lean();

        if (!blogPosts?.length) {
            return res.status(404).json({ message: 'No matching blog posts found' });
        }

        res.json(blogPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({ message: 'Category parameter is required' });
        }

        const blogPosts = await BlogPost.find({ category }).lean().exec();

        if (!blogPosts?.length) {
            return res.status(404).json({ message: `No blog posts found for category: ${category}` });
        }

        res.json(blogPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getBlogPostsByTag = async (req, res) => {
    try {
        const { tag } = req.params;

        const blogPosts = await BlogPost.find({ tags: tag }).lean();

        if (!blogPosts?.length) {
            return res.status(404).json({ message: 'No blog posts found with this tag' });
        }

        res.json(blogPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createBlogPost = async (req, res) => {
    const { author, title, content, tags, category } = req.body;
    try {
        const userInfo = await User.findOne({username: author}).lean().exec();
        if(!userInfo) return res.status(401).json({ message: 'Unuthorized' });
        const authorId = userInfo._id
        if (!author || !title || !content) {
            return res.status(400).json({ message: 'Author, title, and content are required' });
        }

        const existingPost = await BlogPost.findOne({ title }).lean().exec();

        if (existingPost) {
            return res.status(409).json({ message: 'Duplicate post title' });
        }

        let image;
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          image = result.secure_url;
        }

        const blogPost = await BlogPost.create({ author:authorId, title, content, tags, category, image });

        res.status(201).json({ message: 'New blog post created', blogPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBlogPost = async (req, res) => {
    try {
        const { postId, title, content, tags, category } = req.body;

        if (!postId || !title || !content) {
            return res.status(400).json({ message: 'Post ID, title, and content are required' });
        }

        const existingPost = await BlogPost.findById(postId).exec();

        if (!existingPost) {
            return res.status(400).json({ message: 'Post not found' });
        }

        let image;
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path);
          image = result.secure_url;
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(postId, { title, content, tags, category, image }, { new: true });

        res.json({ message: 'Blog post updated', updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteBlogPost = async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({ message: 'Post ID required' });
        }

        const deletedPost = await BlogPost.findByIdAndDelete(postId).exec();

        if (!deletedPost) {
            return res.status(400).json({ message: 'Post not found' });
        }

        res.json({ message: `Blog post with ID ${postId} deleted` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const likeBlogPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const user = req.user; // Assuming user attribute uniquely identifies each user

        if (!postId) {
            return res.status(400).json({ message: 'Post ID required' });
        }

        const blogPost = await BlogPost.findById(postId).exec();

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if the user has already liked the post
        if (blogPost.likes.includes(user)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Update the post to include the user's like
        blogPost.likes.push(user);
        await blogPost.save();

        res.json({ message: `Liked blog post with ID ${postId}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



const getUserBlogPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        const userPosts = await BlogPost.find({ author: userId }).lean().exec();

        if (!userPosts?.length) {
            return res.status(400).json({ message: 'No blog posts found for the user' });
        }

        res.json(userPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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
};
