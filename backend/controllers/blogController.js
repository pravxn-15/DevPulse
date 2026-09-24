const fs = require('fs');
const path = require('path');
const Blog = require('../models/Blog');

const blogsFilePath = path.join(__dirname, '../data/blogs.json');

function getBlogsFromFile() {
  try {
    return JSON.parse(fs.readFileSync(blogsFilePath, 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveBlogsToFile(blogs) {
  fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), 'utf8');
}

// @desc   Get all blogs from MongoDB (with category, status, and search filters)
// @route  GET /api/blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, search, status } = req.query;

    try {
      const filter = {};
      if (category && category !== 'All') filter.category = new RegExp(`^${category}$`, 'i');
      if (status && status !== 'All') filter.status = new RegExp(`^${status}$`, 'i');
      if (search) {
        filter.$or = [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { category: new RegExp(search, 'i') }
        ];
      }

      const dbBlogs = await Blog.find(filter).sort({ createdAt: -1 });
      if (dbBlogs && dbBlogs.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbBlogs.length,
          data: dbBlogs
        });
      }
    } catch (dbErr) {}

    // Fallback JSON DB
    let blogs = getBlogsFromFile();
    if (category && category !== 'All') {
      blogs = blogs.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    if (status && status !== 'All') {
      blogs = blogs.filter(b => b.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const query = search.toLowerCase();
      blogs = blogs.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query)
      );
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving blogs.', error: error.message });
  }
};

// @desc   Get single blog by ID & increment view count
// @route  GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
  try {
    const id = req.params.id;

    try {
      const blog = await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
      if (blog) {
        return res.status(200).json({ success: true, data: blog });
      }
    } catch (dbErr) {}

    const blogs = getBlogsFromFile();
    const blog = blogs.find(b => b.id === id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    blog.views = (blog.views || 0) + 1;
    saveBlogsToFile(blogs);

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching blog details.', error: error.message });
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

    try {
      const authorAvatar = req.body.authorAvatar || 'male.jpg';
      const dbBlog = await Blog.create({
        title: title.trim(),
        category: category || 'Technology',
        description: description.trim(),
        content: content.trim(),
        author: author || 'Alex Morgan',
        authorAvatar: authorAvatar,
        image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
        status: status || 'Published',
        readTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
      });

      return res.status(201).json({
        success: true,
        message: 'Blog post created successfully in MongoDB!',
        data: dbBlog
      });
    } catch (dbErr) {}

    const blogs = getBlogsFromFile();
    const newBlog = {
      id: 'blog_' + Date.now(),
      title: title.trim(),
      category: category || 'Technology',
      description: description.trim(),
      content: content.trim(),
      author: author || 'Alex Morgan',
      authorAvatar: req.body.authorAvatar || 'male.jpg',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
      image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
      status: status || 'Published',
      views: 0,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
    };

    blogs.unshift(newBlog);
    saveBlogsToFile(blogs);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully!',
      data: newBlog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating blog.', error: error.message });
  }
};

// @desc   Update blog post by ID
// @route  PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, category, description, content, image, status, tags } = req.body;

    try {
      const updatedDbBlog = await Blog.findByIdAndUpdate(
        id,
        { title, category, description, content, image, status, tags },
        { new: true, runValidators: true }
      );
      if (updatedDbBlog) {
        return res.status(200).json({
          success: true,
          message: 'Blog post updated successfully in MongoDB!',
          data: updatedDbBlog
        });
      }
    } catch (dbErr) {}

    let blogs = getBlogsFromFile();
    const blogIndex = blogs.findIndex(b => b.id === id);

    if (blogIndex === -1) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    blogs[blogIndex] = {
      ...blogs[blogIndex],
      title: title || blogs[blogIndex].title,
      category: category || blogs[blogIndex].category,
      description: description || blogs[blogIndex].description,
      content: content || blogs[blogIndex].content,
      image: image || blogs[blogIndex].image,
      status: status || blogs[blogIndex].status,
      tags: tags || blogs[blogIndex].tags
    };

    saveBlogsToFile(blogs);

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully!',
      data: blogs[blogIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating blog.', error: error.message });
  }
};

// @desc   Delete blog post by ID
// @route  DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;

    try {
      const deletedBlog = await Blog.findByIdAndDelete(id);
      if (deletedBlog) {
        return res.status(200).json({ success: true, message: 'Blog post deleted from MongoDB.' });
      }
    } catch (dbErr) {}

    let blogs = getBlogsFromFile();
    const blogIndex = blogs.findIndex(b => b.id === id);

    if (blogIndex === -1) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    blogs.splice(blogIndex, 1);
    saveBlogsToFile(blogs);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting blog.', error: error.message });
  }
};
