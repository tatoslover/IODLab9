# IOD Lab 9 - Full-Stack Backend Development Portfolio

[![GitHub Repo](https://img.shields.io/badge/GitHub-IODLab9-blue?logo=github)](https://github.com/tatoslover/IODLab9)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-brightgreen?logo=netlify)](https://iodlab9.netlify.app)

This comprehensive portfolio demonstrates modern backend development practices, database integration, real-time communication, and full-stack application architecture across multiple exercises and technologies.

## Project Overview

A complete collection of backend development exercises showcasing:
- **MVC Architecture** (Calculator application)
- **Database Integration** (MySQL and MongoDB blog platforms)
- **External API Consumption** (Rick & Morty character explorer)
- **Real-time Communication** (Enhanced chat application with advanced features)
- **Professional Documentation** and code organization

## Quick Start Guide

### 1. Main Portfolio Setup
```bash
cd IODLab9
npm install
npm start
```
**Access at:** http://localhost:8080

### 2. Chat Application (Separate Server)
```bash
cd IODLab9/chat_app
npm install
npm start
```
**Access at:** http://localhost:3000

### 3. Database Requirements (Optional)
```bash
# MySQL (for blog exercises)
brew install mysql
brew services start mysql

# MongoDB (for NoSQL blog exercises)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

This comprehensive portfolio demonstrates modern backend architecture patterns used in production applications, from initial design through implementation and optimization.

## Installation & Setup

### Prerequisites
- **Node.js** (v14.0.0 or higher)
- **npm** (comes with Node.js)
- **MySQL** (v5.7 or higher) - for MySQL blog exercise
- **MongoDB** (v4.0 or higher) - for MongoDB blog exercise

### Complete Setup Instructions

1. **Clone or navigate to the project:**
   ```bash
   cd IODLab9
   ```

2. **Install main portfolio dependencies:**
   ```bash
   npm install
   ```

3. **Install individual application dependencies:**
   ```bash
   # Calculator MVC (no additional dependencies)

   # MySQL Blog Implementation
   cd mysql_blog_implementation
   npm install
   cd ..

   # MongoDB Blog Implementation
   cd mongodb_blog_implementation
   npm install
   cd ..

   # Rick & Morty API App
   cd rickandmorty_app
   npm install
   cd ..

   # Enhanced Chat Application
   cd chat_app
   npm install
   cd ..
   ```

4. **Database setup (optional for full functionality):**
   ```bash
   # MySQL setup
   brew install mysql
   brew services start mysql
   mysql -u root -p
   # Then run: source mysql_blog.sql

   # MongoDB setup
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

5. **Start the applications:**
   ```bash
   # Main portfolio server
   npm start
   # Access: http://localhost:8080

   # Chat application (separate terminal)
   cd chat_app && npm start
   # Access: http://localhost:3000
   ```

## Project Structure

```
IODLab9/
├── 📄 README.md                           # This comprehensive documentation
├── 🏠 index.html                          # Portfolio landing page
├── 🖥️ server.js                           # Main portfolio Express server
├── 📦 package.json                        # Portfolio dependencies
├── 🔒 .gitignore                          # Git ignore patterns
├──
├── 🧮 calculator_mvc/                     # Exercise 1: MVC Architecture
│   ├── index.html                         # Calculator interface
│   ├── script.js                          # MVC implementation
│   └── styles.css                         # Modern calculator styling
├──
├── 📝 mysql_blog_implementation/          # Exercise 2: MySQL Integration
│   ├── server.js                          # Express server with MySQL
│   ├── demo.js                           # API demonstration script
│   ├── package.json                      # MySQL-specific dependencies
│   ├── config/database.js                # MySQL connection pool
│   ├── models/                           # User and Post models
│   ├── controllers/                      # Business logic
│   ├── routes/                           # API endpoints
│   └── middleware/                       # Validation middleware
├──
├── 🍃 mongodb_blog_implementation/        # Exercise 3: MongoDB Integration
│   ├── server.js                         # Express server with MongoDB
│   ├── demo.js                           # API demonstration script
│   ├── package.json                     # MongoDB-specific dependencies
│   ├── config/database.js               # MongoDB connection
│   ├── models/                          # Mongoose schemas
│   ├── controllers/                     # Business logic
│   ├── routes/                          # API endpoints
│   └── middleware/                      # Validation middleware
├──
├── 🛸 rickandmorty_app/                  # Exercise 4: External API Integration
│   ├── server.js                        # Express server with API client
│   ├── demo.js                          # API demonstration script
│   ├── package.json                     # API client dependencies
│   ├── config/api.js                    # Third-party API configuration
│   ├── models/                          # Character and Favorite models
│   ├── controllers/                     # API integration logic
│   ├── routes/                          # API endpoints
│   ├── middleware/                      # Validation middleware
│   └── data/favorites.json              # Local
```

## Technology Comparison

| Exercise | Technology Stack | Database | Key Features |
|----------|------------------|----------|--------------|
| **Calculator MVC** | HTML5, CSS3, JavaScript | None | MVC Pattern, Clean Architecture |
| **MySQL Blog** | Node.js, Express, MySQL | Relational (4 Tables) | ACID Compliance, Complex Queries |
| **MongoDB Blog** | Node.js, Express, MongoDB | Document (2 Collections) | Flexible Schema, Embedded Documents |
| **Rick & Morty API** | Node.js, Express, Axios | Local JSON | Third-party Integration, Caching |
| **Enhanced Chat** | Node.js, Socket.IO, SQLite | Real-time + Persistence | WebSockets, Real-time Features |

## Files in This Portfolio

- `README.md` - This comprehensive guide
- `server.js` - Main portfolio Express server
- `index.html` - Portfolio landing page with modern UI
- `calculator_mvc/` - MVC architecture demonstration
- `mysql_blog_implementation/` - Relational database integration
- `mongodb_blog_implementation/` - NoSQL database implementation
- `rickandmorty_app/` - External API consumption
- `chat_app/` - Real-time communication with advanced features

## Key Learning Outcomes

1. **Backend Development Principles** - Server architecture and API design
2. **Database Technology Selection** - When to use SQL vs NoSQL vs Cache
3. **Real-time Communication** - WebSocket implementation and management
4. **External API Integration** - Third-party service consumption patterns
5. **Production-ready Implementation** - Professional code structure and documentation

## Exercise 1: Calculator MVC

### Features
- **Clean Architecture** - Proper separation of concerns
- **Event-driven Design** - Responsive user interactions
- **Error Handling** - Division by zero and invalid operations
- **Modern UI** - Responsive calculator interface with CSS Grid

**Access:** http://localhost:8080/calculator

---

## Exercise 2: MySQL Blog Implementation

### Relational Database Schema
```sql
-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Posts table
CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    slug VARCHAR(250) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Likes table
CREATE TABLE likes (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post_like (user_id, post_id)
);

-- Comments table
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id)
);
```

### Key Features
- Complete CRUD operations for users and posts
- RESTful API endpoints with proper HTTP methods
- Advanced features like search, trending posts, and user-specific queries

### MySQL Benefits vs Trade-offs
✅ **Benefits:**
- ACID compliance guarantees data integrity
- No data duplication (normalized design)
- Complex relationships with proper foreign keys
- Mature ecosystem with extensive tooling
- SQL standards for portable queries

⚠️ **Trade-offs:**
- Multiple JOINs required for complete data
- Vertical scaling limitations
- Schema rigidity requires migrations for changes

**Access:** http://localhost:8080/mysql-blog

---

## Exercise 3: MongoDB Blog Implementation

### Document-Based Design Philosophy
MongoDB uses **2 collections** with embedded documents for optimal read performance:

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: "johndoe",
  email: "john@example.com",
  passwordHash: "$2y$10$hash...",
  profile: {
    firstName: "John",
    lastName: "Doe",
    bio: "Tech blogger",
    avatarUrl: "https://example.com/avatar.jpg"
  },
  createdAt: Date,
  updatedAt: Date,
  isActive: true
}
```

#### Posts Collection (with embedded likes & comments)
```javascript
{
  _id: ObjectId,
  title: "My Blog Post",
  description: "Post content goes here...",
  imageUrl: "https://example.com/image.jpg",
  slug: "my-blog-post",

  // Embedded author info (denormalized for performance)
  author: {
    userId: ObjectId,
    username: "johndoe",
    displayName: "John Doe"
  },

  // Embedded likes array
  likes: [
    {
      userId: ObjectId,
      username: "janedoe",
      likedAt: Date
    }
  ],

  // Embedded comments with nested replies
  comments: [
    {
      commentId: ObjectId,
      userId: ObjectId,
      username: "mikejohnson",
      content: "Great post!",
      createdAt: Date,
      isDeleted: false,
      replies: [
        {
          commentId: ObjectId,
          userId: ObjectId,
          username: "johndoe",
          content: "Thanks!",
          createdAt: Date,
          isDeleted: false
        }
      ]
    }
  ],

  // Cached statistics for performance
  stats: {
    likeCount: 5,
    commentCount: 8,
    viewCount: 150
  },

  createdAt: Date,
  updatedAt: Date,
  isPublished: true
}
```

### MongoDB Indexes
```javascript
// Users collection indexes
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// Posts collection indexes
db.posts.createIndex({ "author.userId": 1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ slug: 1 }, { unique: true });
db.posts.createIndex({ isPublished: 1 });
db.posts.createIndex({ "likes.userId": 1 });
```

### MongoDB Benefits vs Trade-offs
✅ **Benefits:**
- Single query to get complete post with all data
- No JOINs required
- Natural JSON structure for APIs
- Atomic updates for likes/comments
- Horizontal scaling ready

⚠️ **Trade-offs:**
- Data duplication (author info repeated)
- Document size can grow large with many comments
- Complex updates when user info changes
- Harder to query comments independently

**Access:** http://localhost:8080/mongodb-blog

---

## Exercise 4: Rick & Morty API Integration

### API Integration Architecture
- External API consumption with proper error handling
- Caching layer for performance optimization
- Advanced features like character sheets and comparisons
- Flexible parameter handling (query and path parameters)

### Features
- **External API Integration** - Rick and Morty API consumption
- **Caching Strategy** - In-memory caching with TTL
- **Query & Path Parameters** - Flexible filtering and pagination
- **Favorites Management** - Local JSON storage with CRUD operations
- **Character Analytics** - Statistics and comparison features
- **Error Handling** - Network timeouts and API errors

**Access:** http://localhost:8080/rickandmorty

---

## Exercise 5: Enhanced Chat Application

### Real-time Communication Architecture
- Socket.IO server with SQLite database persistence
- Real-time event handling for messaging, user management, and search
- Comprehensive client-side chat application with modern UI

### Advanced Features

#### Real-time Communication
- **WebSocket connection** with Socket.IO
- **Multiple chat rooms** (general and private)
- **Typing indicators** with automatic timeout
- **Online user tracking** with status updates
- **Message persistence** with SQLite database

#### User Experience
- **Message reactions** with emoji support (👍, ❤️, 😂, 😮)
- **Dark/Light theme toggle** with localStorage persistence
- **User avatars** with 12+ emoji options
- **Status indicators** (Online, Away, Busy)
- **Private messaging** with click-to-chat functionality

#### Interactive Features
- **Message search** with real-time results highlighting
- **Chat bot** with 5+ commands (/help, /time, /weather, /joke, /quote)
- **Message history** loading on join
- **Auto-scroll** to latest messages
- **Responsive design** for all device sizes

#### Offline Demo Mode
- **Automatic detection** of server availability
- **Seamless fallback** to demo mode
- **Simulated responses** for portfolio viewing
- **Full UI functionality** without server setup

**Access:** http://localhost:3000 (separate server required)

---
