const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(blogPostController.getAllBlogPosts);

// router.route('/:postId')
//     .get(blogPostController.getSingleBlogPost);

// router.route('/search')
//     .get(blogPostController.searchBlogPosts);

// router.route('/popular')
//     .get(blogPostController.getPopularBlogPosts);

// router.route('/tags/:tag')
//     .get(blogPostController.getBlogPostsByTag);
    
// router.use(verifyJWT);

router.route('/')
    .post(blogPostController.createBlogPost)
    .patch(blogPostController.updateBlogPost)
    .delete(blogPostController.deleteBlogPost);

// router.route('/:postId/like')
//     .post(blogPostController.likeBlogPost);

// router.route('/user/:userId')
//     .get(blogPostController.getUserBlogPosts);


module.exports = router;
