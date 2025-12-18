'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      
      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        setPosts(data.user.posts || []);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!newPost.trim()) return;

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newPost }),
      });

      if (res.ok) {
        setNewPost('');
        fetchProfile();
      }
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchProfile();
      }
    } catch (err) {
      setError('Failed to like post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* Navigation Bar */}
      <nav className="bg-gray-800/50 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/profile" className="text-xl font-bold text-white hover:text-blue-300 transition duration-200">
                Postify
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="md:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gray-700/50 border border-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
                  <span className="text-5xl text-gray-300">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between text-gray-300 mb-2">
                  <span className="font-semibold">Posts</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Post Creation and Feed */}
          <div className="md:col-span-2">
            {/* Create Post */}
            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Create New Post</h3>
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your thoughts..."
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-200"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            <h3 className="text-2xl font-bold text-white mb-4 px-1">Your Posts</h3>
            {posts.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
                <p className="text-center text-gray-400">You haven't created any posts yet.</p>
              </div>
            ) : (
              posts.slice().reverse().map((post) => (
                <div key={post._id} className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-700/50 border border-gray-600 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-xl text-gray-300">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{user.username}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 ml-13">{post.content}</p>

                  <div className="flex justify-end items-center space-x-4 border-t border-gray-600 pt-3 mt-3 text-sm">
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className="text-blue-400 hover:text-blue-300 transition duration-200"
                    >
                      {post.likes && post.likes.includes(user._id) ? 'Unlike' : 'Like'} ({post.likes ? post.likes.length : 0})
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-400 hover:text-red-300 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
