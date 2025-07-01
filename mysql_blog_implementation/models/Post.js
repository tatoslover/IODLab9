const { executeQuery, executeTransaction } = require('../config/database');

class Post {
  constructor(postData) {
    this.post_id = postData.post_id;
    this.user_id = postData.user_id;
    this.title = postData.title;
    this.description = postData.description;
    this.image_url = postData.image_url;
    this.slug = postData.slug;
    this.created_at = postData.created_at;
    this.updated_at = postData.updated_at;
    this.is_published = postData.is_published;

    // Additional fields from post_details view
    this.username = postData.username;
    this.first_name = postData.first_name;
    this.last_name = postData.last_name;
    this.author_name = postData.author_name;
    this.like_count = postData.like_count || 0;
    this.comment_count = postData.comment_count || 0;
  }

  // Create a new post
  static async create(postData) {
    // Generate slug from title
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const query = `
      INSERT INTO posts (user_id, title, description, image_url, slug)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      postData.user_id || postData.authorId,
      postData.title,
      postData.description,
      postData.image_url || postData.imageUrl || '',
      slug
    ];

    try {
      const result = await executeQuery(query, params);
      const postId = result.insertId;

      // Get the created post with author details
      return await Post.findById(postId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('A post with this title already exists');
      }
      throw error;
    }
  }

  // Find post by ID with author and engagement details
  static async findById(postId) {
    const query = `
      SELECT * FROM post_details
      WHERE post_id = ? AND is_published = TRUE
    `;

    const results = await executeQuery(query, [postId]);

    if (results.length === 0) {
      return null;
    }

    return new Post(results[0]);
  }

  // Get all posts with pagination and sorting
  static async findAll(options = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = options;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM post_details
      WHERE is_published = TRUE
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const results = await executeQuery(query, [parseInt(limit), parseInt(offset)]);
    return results.map(postData => new Post(postData));
  }

  // Get total count of posts
  static async getCount() {
    const query = 'SELECT COUNT(*) as count FROM posts WHERE is_published = TRUE';
    const results = await executeQuery(query);
    return results[0].count;
  }

  // Get posts by user
  static async findByUserId(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM post_details
      WHERE user_id = ? AND is_published = TRUE
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const results = await executeQuery(query, [userId, parseInt(limit), parseInt(offset)]);
    return results.map(postData => new Post(postData));
  }

  // Get posts count by user
  static async getCountByUserId(userId) {
    const query = 'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND is_published = TRUE';
    const results = await executeQuery(query, [userId]);
    return results[0].count;
  }

  // Search posts
  static async search(searchTerm, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM post_details
      WHERE (title LIKE ? OR description LIKE ?) AND is_published = TRUE
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const searchPattern = `%${searchTerm}%`;
    const results = await executeQuery(query, [searchPattern, searchPattern, parseInt(limit), parseInt(offset)]);
    return results.map(postData => new Post(postData));
  }

  // Get search results count
  static async getSearchCount(searchTerm) {
    const query = `
      SELECT COUNT(*) as count FROM posts
      WHERE (title LIKE ? OR description LIKE ?) AND is_published = TRUE
    `;
    const searchPattern = `%${searchTerm}%`;
    const results = await executeQuery(query, [searchPattern, searchPattern]);
    return results[0].count;
  }

  // Get trending posts (by engagement score)
  static async getTrending(limit = 5) {
    const query = `
      SELECT *,
        (like_count * 2 + comment_count * 3) as engagement_score
      FROM post_details
      WHERE is_published = TRUE
      ORDER BY engagement_score DESC, created_at DESC
      LIMIT ?
    `;

    const results = await executeQuery(query, [parseInt(limit)]);
    return results.map(postData => new Post(postData));
  }

  // Update post
  static async updateById(postId, updateData) {
    const allowedFields = ['title', 'description', 'image_url'];
    const updates = [];
    const params = [];

    // Build dynamic update query
    for (const [key, value] of Object.entries(updateData)) {
      const dbField = key === 'imageUrl' ? 'image_url' : key;

      if (allowedFields.includes(dbField)) {
        updates.push(`${dbField} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Update slug if title is being updated
    if (updateData.title) {
      const slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      updates.push('slug = ?');
      params.push(slug);
    }

    params.push(postId);
    const query = `
      UPDATE posts
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE post_id = ? AND is_published = TRUE
    `;

    const result = await executeQuery(query, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return await Post.findById(postId);
  }

  // Soft delete post
  static async deleteById(postId) {
    const query = `
      UPDATE posts
      SET is_published = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE post_id = ? AND is_published = TRUE
    `;

    const result = await executeQuery(query, [postId]);
    return result.affectedRows > 0;
  }

  // Check if user has liked a post
  static async hasUserLiked(postId, userId) {
    const query = 'SELECT COUNT(*) as count FROM likes WHERE post_id = ? AND user_id = ?';
    const results = await executeQuery(query, [postId, userId]);
    return results[0].count > 0;
  }

  // Toggle like on a post
  static async toggleLike(postId, userId) {
    const hasLiked = await Post.hasUserLiked(postId, userId);

    if (hasLiked) {
      // Remove like
      const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
      await executeQuery(query, [postId, userId]);
      return { action: 'unliked', hasLiked: false };
    } else {
      // Add like
      const query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
      await executeQuery(query, [postId, userId]);
      return { action: 'liked', hasLiked: true };
    }
  }

  // Get likes for a post
  static async getLikes(postId) {
    const query = `
      SELECT l.*, u.username, CONCAT(u.first_name, ' ', u.last_name) as full_name
      FROM likes l
      JOIN users u ON l.user_id = u.user_id
      WHERE l.post_id = ?
      ORDER BY l.created_at DESC
    `;

    return await executeQuery(query, [postId]);
  }

  // Add comment to a post
  static async addComment(postId, userId, content, parentCommentId = null) {
    const query = `
      INSERT INTO comments (post_id, user_id, content, parent_comment_id)
      VALUES (?, ?, ?, ?)
    `;

    const params = [postId, userId, content, parentCommentId];
    const result = await executeQuery(query, params);

    // Get the created comment with user details
    return await Post.getCommentById(result.insertId);
  }

  // Get comment by ID
  static async getCommentById(commentId) {
    const query = `
      SELECT c.*, u.username, CONCAT(u.first_name, ' ', u.last_name) as commenter_name
      FROM comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.comment_id = ? AND c.is_deleted = FALSE
    `;

    const results = await executeQuery(query, [commentId]);
    return results.length > 0 ? results[0] : null;
  }

  // Get comments for a post
  static async getComments(postId) {
    const query = `
      SELECT c.*, u.username, CONCAT(u.first_name, ' ', u.last_name) as commenter_name
      FROM comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.post_id = ? AND c.is_deleted = FALSE
      ORDER BY c.parent_comment_id IS NULL DESC, c.created_at ASC
    `;

    return await executeQuery(query, [postId]);
  }

  // Instance method to get full post details with comments
  async getFullDetails() {
    const comments = await Post.getComments(this.post_id);
    const likes = await Post.getLikes(this.post_id);

    return {
      ...this,
      comments,
      likes
    };
  }

  // Instance method to add like
  async addLike(userId) {
    return await Post.toggleLike(this.post_id, userId);
  }

  // Instance method to add comment
  async addComment(userId, content, parentCommentId = null) {
    return await Post.addComment(this.post_id, userId, content, parentCommentId);
  }

  // Instance method to update
  async update(updateData) {
    return await Post.updateById(this.post_id, updateData);
  }

  // Instance method to delete
  async delete() {
    return await Post.deleteById(this.post_id);
  }
}

module.exports = Post;
