import React, { useState, useEffect } from 'react';
import { blogService } from '../../api/services.js';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Modal from '../../components/ui/Modal.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import toast from 'react-hot-toast';
import { FaBlog, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';

const CATEGORIES = ['General', 'Homeopathy', 'Wellness', 'Skin Care', 'Respiratory', 'Mental Health', 'Diet & Nutrition', 'Child Health'];

const emptyBlogForm = {
  title: '',
  content: '',
  excerpt: '',
  category: 'General',
  tags: '',
  isPublished: false,
  coverImage: null,
};

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyBlogForm });
  const [submitting, setSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');

  // Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogService.getAllBlogs({ limit: 100 });
      if (res?.success) {
        setBlogs(res.data || []);
      }
    } catch (error) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  // Filtered blogs
  const filtered = blogs.filter((b) => {
    const matchesSearch = !searchTerm.trim() ||
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && b.isPublished) ||
      (statusFilter === 'draft' && !b.isPublished);
    return matchesSearch && matchesStatus;
  });

  const openCreateForm = () => {
    setEditing(null);
    setForm({ ...emptyBlogForm });
    setCoverPreview('');
    setIsFormOpen(true);
  };

  const openEditForm = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      category: blog.category || 'General',
      tags: (blog.tags || []).join(', '),
      isPublished: blog.isPublished || false,
      coverImage: null,
    });
    setCoverPreview(blog.coverImage || '');
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, coverImage: file }));
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('excerpt', form.excerpt);
      formData.append('category', form.category);
      formData.append('tags', form.tags);
      formData.append('isPublished', form.isPublished);
      if (form.coverImage) {
        formData.append('coverImage', form.coverImage);
      }

      if (editing) {
        const res = await blogService.updateBlog(editing._id, formData);
        if (res?.success) {
          toast.success('Blog post updated successfully');
        }
      } else {
        const res = await blogService.createBlog(formData);
        if (res?.success) {
          toast.success('Blog post created successfully');
        }
      }

      setIsFormOpen(false);
      setEditing(null);
      setForm({ ...emptyBlogForm });
      fetchBlogs();
    } catch (error) {
      toast.error(error.message || 'Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublish = async (blog) => {
    try {
      const formData = new FormData();
      formData.append('isPublished', !blog.isPublished);
      const res = await blogService.updateBlog(blog._id, formData);
      if (res?.success) {
        toast.success(blog.isPublished ? 'Blog unpublished' : 'Blog published');
        fetchBlogs();
      }
    } catch (error) {
      toast.error('Failed to toggle publish status');
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      const res = await blogService.deleteBlog(blogToDelete._id);
      if (res?.success) {
        toast.success('Blog post deleted');
        fetchBlogs();
      }
    } catch (error) {
      toast.error('Failed to delete blog post');
    } finally {
      setIsDeleteOpen(false);
      setBlogToDelete(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Blog Management</h1>
          <p className="text-sm text-slate-500 mt-1">Publish homeopathic advice, articles, and clinic announcements.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition flex items-center gap-2 cursor-pointer shadow-sm btn-shimmer"
        >
          <FaPlus /> New Blog Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by title or category..." />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === s
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-teal-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="py-20"><Loader size="lg" /></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3 stagger-children">
          {filtered.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-start hover-lift transition-all"
            >
              {/* Cover thumbnail */}
              <div className="w-full sm:w-24 h-20 sm:h-16 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                ) : (
                  <FaBlog className="text-slate-300 text-xl" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{blog.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <StatusBadge status={blog.isPublished ? 'published' : 'draft'} size="xs" />
                      <span className="text-[10px] text-slate-400 font-semibold">{blog.category}</span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{formatDate(blog.createdAt)}</span>
                      {blog.views > 0 && (
                        <>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{blog.views} views</span>
                        </>
                      )}
                    </div>
                    {blog.excerpt && (
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">{blog.excerpt}</p>
                    )}
                    {blog.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {blog.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => togglePublish(blog)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      title={blog.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {blog.isPublished ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                    </button>
                    <button
                      onClick={() => openEditForm(blog)}
                      className="p-2 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition cursor-pointer"
                      title="Edit"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog)}
                      className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Delete"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FaBlog className="text-teal-500" />}
          title="No blog posts found"
          description="Create your first blog post to share homeopathic advice with your patients."
          action={
            <button
              onClick={openCreateForm}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition cursor-pointer"
            >
              Create First Post
            </button>
          }
        />
      )}

      {/* Blog Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editing ? 'Edit Blog Post' : 'Create New Blog Post'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-slate-800">
          {/* Title */}
          <div>
            <label className="text-xs text-slate-500 font-bold block mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
              placeholder="Enter blog post title..."
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
                placeholder="e.g. homeopathy, wellness, skin care"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-xs text-slate-500 font-bold block mb-1">Cover Image</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition text-xs font-bold text-slate-600">
                <FaImage className="text-teal-500" />
                {form.coverImage ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {coverPreview && (
                <img src={coverPreview} alt="Cover preview" className="w-16 h-12 object-cover rounded-lg border border-slate-200" />
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs text-slate-500 font-bold block mb-1">Excerpt (optional)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500 resize-none"
              placeholder="Brief summary for blog listing..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs text-slate-500 font-bold block mb-1">Content *</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500 resize-y font-mono"
              placeholder="Write your blog content here... (supports plain text and basic HTML)"
            />
          </div>

          {/* Publish toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="accent-teal-600 w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-700">Publish immediately</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-lg text-sm transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Blog Post?"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => { setIsDeleteOpen(false); setBlogToDelete(null); }}
        variant="danger"
      />
    </div>
  );
}
