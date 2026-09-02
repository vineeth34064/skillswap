const express = require('express');
const router = express.Router();
const { getPosts, createPost, toggleLikePost, addComment, getComments } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:postId/like', protect, toggleLikePost);
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, addComment);

module.exports = router;
