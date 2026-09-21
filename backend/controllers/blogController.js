const fs = require('fs');
const path = require('path');
const Blog = require('../models/Blog');
const { getIsConnected } = require('../config/db');

const blogsFilePath = path.join(__dirname, '../data/blogs.json');

// Helper to read blogs from JSON file
function getJsonBlogs() {
  try {
    const data = fs.readFileSync(blogsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function saveJsonBlogs(blogs) {
  try {
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving blogs JSON:', err.message);
  }
}

// @desc   Get all blogs (with search, category, status filter)
// @route  GET /api/blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, search, status } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (status && status !== 'All') {
        query.status = { $regex: new RegExp(`^${status}$`, 'i') };
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }
      const dbBlogs = await Blog.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: dbBlogs.length,
        data: dbBlogs.map(b => ({ ...b.toObject(), id: b._id.toString() }))
      });
    }

    // JSON Fallback
    let blogs = getJsonBlogs();
    if (category && category !== 'All') {
      blogs = blogs.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    if (status && status !== 'All') {
      blogs = blogs.filter(b => b.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      blogs = blogs.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error fetching blogs', error: err.message });
  }
};

// @desc   Get single blog by ID
// @route  GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      let blog = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await Blog.findById(id);
      } else {
        blog = await Blog.findOne({ _id: id });
      }
      if (blog) {
        return res.status(200).json({
          success: true,
          data: { ...blog.toObject(), id: blog._id.toString() }
        });
      }
    }

    // Fallback search
    const blogs = getJsonBlogs();
    const found = blogs.find(b => b.id === id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }
    return res.status(200).json({ success: true, data: found });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving article', error: err.message });
  }
};

// @desc   Create new blog post
// @route  POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const { title, category, description, content, image, tags, status, author } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ success: false, message: 'Please provide Title, Description, and Content.' });
    }

    const blogData = {
      title: title.trim(),
      category: category || 'Technology',
      description: description.trim(),
      content: content.trim(),
      author: author || 'Alex Morgan',
      authorAvatar: 'praveen photo.jpeg',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
      image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
      status: status || 'Published',
      views: 0,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [])
    };

    if (getIsConnected()) {
      const dbBlog = await Blog.create(blogData);
      const blogObj = { ...dbBlog.toObject(), id: dbBlog._id.toString() };
      
      // Sync to JSON file too
      const jsonBlogs = getJsonBlogs();
      jsonBlogs.unshift(blogObj);
      saveJsonBlogs(jsonBlogs);

      return res.status(201).json({
        success: true,
        message: 'Blog post created successfully in MongoDB!',
        data: blogObj
      });
    }

    // JSON Fallback
    const jsonBlogs = getJsonBlogs();
    const newBlog = {
      id: 'blog_' + Date.now(),
      ...blogData
    };
    jsonBlogs.unshift(newBlog);
    saveJsonBlogs(jsonBlogs);

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully!',
      data: newBlog
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating blog post', error: err.message });
  }
};

// @desc   Delete blog post by ID
// @route  DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected() && id.match(/^[0-9a-fA-F]{24}$/)) {
      await Blog.findByIdAndDelete(id);
    }

    let jsonBlogs = getJsonBlogs();
    jsonBlogs = jsonBlogs.filter(b => b.id !== id);
    saveJsonBlogs(jsonBlogs);

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting blog post', error: err.message });
  }
};
