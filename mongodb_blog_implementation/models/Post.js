const mongoose = require('mongoose');

// Comment schema for embedding in posts
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  replies: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Reply cannot exceed 1000 characters']
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Like schema for embedding in posts
const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  likedAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    displayName: {
      type: String,
      required: true
    }
  },
  likes: [likeSchema],
  comments: [commentSchema],
  stats: {
    likeCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes for performance
postSchema.index({ 'author.userId': 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ slug: 1 });
postSchema.index({ isPublished: 1 });

// Generate slug from title before saving
postSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Method to add a like
postSchema.methods.addLike = function(userId, username) {
  // Check if user already liked this post
  const existingLike = this.likes.find(like => like.userId.toString() === userId.toString());
  if (existingLike) {
    return false; // Already liked
  }

  this.likes.push({ userId, username });
  this.stats.likeCount = this.likes.length;
  return true;
};

// Method to remove a like
postSchema.methods.removeLike = function(userId) {
  const likeIndex = this.likes.findIndex(like => like.userId.toString() === userId.toString());
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
    this.stats.likeCount = this.likes.length;
    return true;
  }
  return false;
};

// Method to add a comment
postSchema.methods.addComment = function(userId, username, content) {
  this.comments.push({ userId, username, content });
  this.stats.commentCount = this.comments.filter(comment => !comment.isDeleted).length;
  return this.comments[this.comments.length - 1];
};

// Method to get engagement score
postSchema.methods.getEngagementScore = function() {
  return (this.stats.likeCount * 2) + (this.stats.commentCount * 3) + (this.stats.viewCount * 0.1);
};

module.exports = mongoose.model('Post', postSchema);
