const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validatePost, validateComment, validateLike, validatePostUpdate, validateMongoId } = require('../middleware/validation');

// POST /api/posts - Create a new post
router.post('/', validatePost, postController.createPost);

// GET /api/posts - Get all posts (with pagination and sorting)
router.get('/', postController.getAllPosts);

// GET /api/posts/trending - Get trending posts
router.get('/trending', postController.getTrendingPosts);

// GET /api/posts/search - Search posts
router.get('/search', postController.searchPosts);

// GET /api/posts/:id - Get post by ID
router.get('/:id', validateMongoId('id'), postController.getPostById);

// PUT /api/posts/:id - Update post
router.put('/:id', validateMongoId('id'), validatePostUpdate, postController.updatePost);

// DELETE /api/posts/:id - Delete post (soft delete)
router.delete('/:id', validateMongoId('id'), postController.deletePost);

// POST /api/posts/:id/like - Toggle like on a post
router.post('/:id/like', validateMongoId('id'), validateLike, postController.toggleLike);

// POST /api/posts/:id/comments - Add comment to a post
router.post('/:id/comments', validateMongoId('id'), validateComment, postController.addComment);

// GET /api/posts/user/:userId - Get posts by user
router.get('/user/:userId', validateMongoId('userId'), postController.getPostsByUser);

module.exports = router;
