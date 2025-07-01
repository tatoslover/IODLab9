const { executeQuery, executeTransaction } = require('../config/database');

class User {
  constructor(userData) {
    this.user_id = userData.user_id;
    this.username = userData.username;
    this.email = userData.email;
    this.password_hash = userData.password_hash;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.bio = userData.bio;
    this.avatar_url = userData.avatar_url;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
    this.is_active = userData.is_active;
  }

  // Create a new user
  static async create(userData) {
    const query = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, bio, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      userData.username,
      userData.email,
      userData.password_hash || userData.passwordHash,
      userData.first_name || userData.firstName,
      userData.last_name || userData.lastName,
      userData.bio || '',
      userData.avatar_url || userData.avatarUrl || ''
    ];

    try {
      const result = await executeQuery(query, params);
      const userId = result.insertId;

      // Get the created user
      return await User.findById(userId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const field = error.message.includes('username') ? 'username' : 'email';
        throw new Error(`${field} already exists`);
      }
      throw error;
    }
  }

  // Find user by ID
  static async findById(userId) {
    const query = 'SELECT * FROM users WHERE user_id = ? AND is_active = TRUE';
    const results = await executeQuery(query, [userId]);

    if (results.length === 0) {
      return null;
    }

    return new User(results[0]);
  }

  // Find user by username
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
    const results = await executeQuery(query, [username]);

    if (results.length === 0) {
      return null;
    }

    return new User(results[0]);
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ? AND is_active = TRUE';
    const results = await executeQuery(query, [email]);

    if (results.length === 0) {
      return null;
    }

    return new User(results[0]);
  }

  // Get all users
  static async findAll(options = {}) {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = options;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM users
      WHERE is_active = TRUE
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const results = await executeQuery(query, [parseInt(limit), parseInt(offset)]);
    return results.map(userData => new User(userData));
  }

  // Get total count of users
  static async getCount() {
    const query = 'SELECT COUNT(*) as count FROM users WHERE is_active = TRUE';
    const results = await executeQuery(query);
    return results[0].count;
  }

  // Update user
  static async updateById(userId, updateData) {
    const allowedFields = ['first_name', 'last_name', 'bio', 'avatar_url'];
    const updates = [];
    const params = [];

    // Build dynamic update query
    for (const [key, value] of Object.entries(updateData)) {
      // Convert camelCase to snake_case
      const dbField = key === 'firstName' ? 'first_name' :
                     key === 'lastName' ? 'last_name' :
                     key === 'avatarUrl' ? 'avatar_url' : key;

      if (allowedFields.includes(dbField)) {
        updates.push(`${dbField} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(userId);
    const query = `
      UPDATE users
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND is_active = TRUE
    `;

    const result = await executeQuery(query, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return await User.findById(userId);
  }

  // Soft delete user
  static async deleteById(userId) {
    const query = `
      UPDATE users
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND is_active = TRUE
    `;

    const result = await executeQuery(query, [userId]);
    return result.affectedRows > 0;
  }

  // Get user statistics
  static async getStats(userId) {
    const query = `
      SELECT
        u.username,
        CONCAT(u.first_name, ' ', u.last_name) as full_name,
        COUNT(DISTINCT p.post_id) as posts_created,
        COUNT(DISTINCT l.like_id) as likes_given,
        COUNT(DISTINCT c.comment_id) as comments_made
      FROM users u
      LEFT JOIN posts p ON u.user_id = p.user_id AND p.is_published = TRUE
      LEFT JOIN likes l ON u.user_id = l.user_id
      LEFT JOIN comments c ON u.user_id = c.user_id AND c.is_deleted = FALSE
      WHERE u.user_id = ? AND u.is_active = TRUE
      GROUP BY u.user_id
    `;

    const results = await executeQuery(query, [userId]);

    if (results.length === 0) {
      return null;
    }

    return results[0];
  }

  // Get user's posts with engagement stats
  async getPosts(options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM post_details
      WHERE user_id = ? AND is_published = TRUE
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    return await executeQuery(query, [this.user_id, parseInt(limit), parseInt(offset)]);
  }

  // Instance method to get public profile (without sensitive data)
  getPublicProfile() {
    const profile = { ...this };
    delete profile.password_hash;
    return profile;
  }

  // Instance method to get full name
  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  // Instance method to update
  async update(updateData) {
    return await User.updateById(this.user_id, updateData);
  }

  // Instance method to delete
  async delete() {
    return await User.deleteById(this.user_id);
  }
}

module.exports = User;
