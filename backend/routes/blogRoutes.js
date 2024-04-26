const express = require("express");
const router = express.Router();
const blogPostController = require("../controllers/blogPostController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(blogPostController.getAllBlogPosts);

router.route("/:postId").get(blogPostController.getSingleBlogPost);

router.route("/search").get(blogPostController.searchBlogPosts);
router.route("/like").patch(blogPostController.likeBlogPost);
router.route("/comment").patch(blogPostController.commentBlogPost);

router.route("/tags/:tag").get(blogPostController.getBlogPostsByTag);
router.route("/user/:userId").get(blogPostController.getUserBlogPosts);

router.use(verifyJWT);

router
  .route("/")
  .post(blogPostController.createBlogPost)
  .patch(blogPostController.updateBlogPost)
  .delete(blogPostController.deleteBlogPost);

router.post("/:postId/like", blogPostController.likeBlogPost);

module.exports = router;
