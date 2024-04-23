const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Blog.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const post = await Blog.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const posts = await Blog.find({ category: req.params.category });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const posts = await Blog.find({ $text: { $search: query } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search/:category", async (req, res) => {
  try {
    const query = req.query.q;
    const category = req.params.category;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const posts = await Blog.find({ $text: { $search: query }, category });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userPosts = await Blog.find({ user: userId });
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:userId/:postId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    const userPost = await Blog.findOne({ _id: postId, user: userId });
    if (!userPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(userPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/user/:userId/add-post", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, category, summary, description, slug, date } = req.body;

    const newPost = new Blog({
      title,
      category,
      summary,
      description,
      slug,
      date,
      user: userId,
    });

    await newPost.save();

    res.status(201).json({ message: "Post added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/user/:userId/:postId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;
    const { title, category, summary, description, slug, date } = req.body;

    const updatedPost = await Blog.findOneAndUpdate(
      { _id: postId, user: userId },
      { title, category, summary, description, slug, date },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/user/:userId/:postId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;

    const deletedPost = await Blog.findOneAndDelete({
      _id: postId,
      user: userId,
    });

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router
