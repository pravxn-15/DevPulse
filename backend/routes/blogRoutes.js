const express = require('express');
const router = express.Router();
const { getAllBlogs, getBlogById, createBlog, deleteBlog } = require('../controllers/blogController');

// Blog CRUD routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
