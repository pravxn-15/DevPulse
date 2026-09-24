const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a blog title'],
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
    maxlength: [250, 'Description cannot exceed 250 characters']
  },
  content: {
    type: String,
    required: [true, 'Please enter the blog content']
  },
  author: {
    type: String,
    default: 'Alex Morgan'
  },
  authorAvatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
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
    default: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
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
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', BlogSchema);
