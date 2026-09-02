import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LiquidGlassCard from '../components/LiquidGlassCard';
import SkeletonCard from '../components/SkeletonCard';
import { MessageSquare, Heart, Bookmark, Share2, Plus, Sparkles, Send, Tag, User } from 'lucide-react';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [activePostId, setActivePostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      if (res.success) setPosts(res.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await api.post('/posts', { title, content, category });
      if (res.success) {
        setTitle('');
        setContent('');
        setShowCreate(false);
        fetchPosts();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, likesCount: p.likesCount + 1 } : p));
    api.post(`/posts/${postId}/like`).catch(() => {});
  };

  const handleOpenComments = async (postId) => {
    setActivePostId(postId);
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      if (res.success) setComments(res.comments || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !activePostId) return;

    try {
      const res = await api.post(`/posts/${activePostId}/comments`, { text: commentText });
      if (res.success) {
        setComments(prev => [res.comment, ...prev]);
        setCommentText('');
        fetchPosts();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-[#8B7CFF]" /> PROFESSIONAL EDUCATIONAL FEED
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
            Community <span className="accent-gradient-text">Posts</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Share projects, learning updates, questions, and exchange technical insights with peer mentors.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-3 rounded-2xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Educational Post
        </button>
      </div>

      {/* Create Post Form */}
      {showCreate && (
        <LiquidGlassCard className="p-6 space-y-4 border border-[#8B7CFF]/40">
          <h3 className="text-base font-extrabold text-white">Share a Learning Update or Project</h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Post Title (e.g. Built a custom React state hook today!)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#0D1524] border border-white/20 text-white text-xs"
            />
            <textarea
              required
              rows={4}
              placeholder="What did you build or learn? Share details or questions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#0D1524] border border-white/20 text-white text-xs"
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-xs font-bold text-slate-400">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl accent-gradient-bg text-[#05070A] font-black text-xs">Publish Post 🚀</button>
            </div>
          </form>
        </LiquidGlassCard>
      )}

      {/* Posts Feed Grid */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : posts.length === 0 ? (
        <LiquidGlassCard className="p-12 text-center space-y-3 border border-dashed border-white/15">
          <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No community posts yet</h3>
          <p className="text-xs text-slate-400">Be the first to share a project showcase or technical question!</p>
        </LiquidGlassCard>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <LiquidGlassCard key={post._id} className="p-6 space-y-4 border border-white/15 hover:border-white/25 transition-all">
              
              {/* Author Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.authorId?.avatar} alt={post.authorId?.name} className="w-11 h-11 rounded-2xl object-cover border border-[#8B7CFF]/40" />
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{post.authorId?.name}</h3>
                    <p className="text-xs text-slate-400">@{post.authorId?.username} • {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] text-[10px] font-extrabold uppercase border border-[#8B7CFF]/30">
                  {post.category}
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h4 className="text-lg font-black text-white">{post.title}</h4>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>

              {/* Engagement Controls */}
              <div className="flex items-center gap-6 pt-3 border-t border-white/10 text-xs font-bold text-slate-400">
                <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 hover:text-rose-400 cursor-pointer">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                  <span>{post.likesCount || 0} Likes</span>
                </button>

                <button onClick={() => handleOpenComments(post._id)} className="flex items-center gap-2 hover:text-[#72C7FF] cursor-pointer">
                  <MessageSquare className="w-4 h-4 text-[#72C7FF]" />
                  <span>{post.commentsCount || 0} Comments</span>
                </button>
              </div>

              {/* Comments Section Drawer */}
              {activePostId === post._id && (
                <div className="pt-4 space-y-3 border-t border-white/10">
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a technical response..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-[#0D1524] border border-white/15 text-xs text-white"
                    />
                    <button type="submit" className="px-4 py-2 rounded-xl accent-gradient-bg text-[#05070A] font-bold text-xs">Post</button>
                  </form>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {comments.map(c => (
                      <div key={c._id} className="p-3 rounded-xl bg-white/[0.03] text-xs space-y-1">
                        <div className="flex justify-between font-bold text-[#8B7CFF]">
                          <span>{c.authorId?.name}</span>
                          <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-300">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </LiquidGlassCard>
          ))}
        </div>
      )}

    </div>
  );
};

export default CommunityPage;
