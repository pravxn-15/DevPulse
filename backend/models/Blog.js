const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Technology', 'Web Development', 'Programming', 'Career', 'Design', 'Education'],
    default: 'Technology'
  },
  description: {
    type: String,
    required: [true, 'Please provide a short description'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please write full article content']
  },
  author: {
    type: String,
    default: 'Alex Morgan'
  },
  authorAvatar: {
    type: String,
    default: 'praveen photo.jpeg'
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Published'
  },
  views: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', BlogSchema);
