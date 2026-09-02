const Post = require('../models/Post');
const Comment = require('../models/Comment');

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('authorId', 'name username avatar trustScore headline')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, imageUrl } = req.body;
    const post = await Post.create({
      authorId: req.user._id,
      title,
      content,
      category: category || 'General',
      tags: tags || [],
      imageUrl: imageUrl || ''
    });

    const populated = await Post.findById(post._id).populate('authorId', 'name username avatar trustScore headline');
    res.json({ success: true, post: populated });
  } catch (err) {
    next(err);
  }
};

const toggleLikePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const likedIndex = post.likes.indexOf(userId);
    if (likedIndex > -1) {
      post.likes.splice(likedIndex, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.likes.push(userId);
      post.likesCount += 1;
    }

    await post.save();
    res.json({ success: true, likesCount: post.likesCount, isLiked: post.likes.includes(userId) });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const comment = await Comment.create({
      postId,
      authorId: req.user._id,
      text
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    const populated = await Comment.findById(comment._id).populate('authorId', 'name username avatar');

    res.json({ success: true, comment: populated });
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .populate('authorId', 'name username avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, createPost, toggleLikePost, addComment, getComments };
