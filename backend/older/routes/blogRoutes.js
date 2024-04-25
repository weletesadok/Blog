const express = require("express");
const router = express.Router();
const Blog = require("./../models/Blog");
const { slugify, slugifyUpdate } = require("./../utils/slugify");
const verifyJWT = require('./../middleware/verifyJWT')

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const posts = await Blog.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/",verifyJWT, upload.single("image"), async (req, res) => {
  try {
    const { title, category, summary, description, userId } = req.body;
    const slug = slugify(title);
    const newPost = new Blog({
      title,
      category,
      summary,
      description,
      slug,
      user: userId,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    console.log(newPost)
    await newPost.save();

    res.status(201).json({ message: "Blog added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", verifyJWT, async (req, res) => {
  try {
    const { title, category, summary, description, date, blogId } = req.body;
    
    const checkPost = await Post.findById(post_id);
    if (!checkPost) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const slug = slugifyUpdate(title, checkPost.slug);

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, category, summary, description, slug, date },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/", verifyJWT, async (req, res) => {
  try {
    const { blogId, userId } = req.body;
    const deletedBlog = await Blog.findOneAndDelete({
      _id: blogId,
    });

    if (!deletedBlog) {
      return res.status(404).json({ error: "blog not found" });
    }

    res.status(200).json({ message: "blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
