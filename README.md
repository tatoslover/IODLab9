# <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG3HuBlAUw3Wu-46hoogyANMHo1VC-tKnE1Q&s" alt="IOD Logo" style="width: 40px; height: 40px; border-radius: 50%; vertical-align: middle; margin-right: 10px;">IOD Lab 9 - Full-Stack Backend Development Portfolio

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

### Model-View-Controller Architecture Demonstration
```javascript
// Model - Calculator logic
class Calculator {
    constructor() {
        this.currentValue = 0;
        this.previousValue = 0;
        this.operation = null;
    }
    
    calculate(a, b, operation) {
        switch(operation) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 'Error';
            default: return 0;
        }
    }
}

// View - UI Updates
class CalculatorView {
    updateDisplay(value) {
        document.getElementById('display').textContent = value;
    }
    
    bindEvents(controller) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', controller.handleInput.bind(controller));
        });
    }
}

// Controller - Business Logic
class CalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.bindEvents(this);
    }
    
    handleInput(event) {
        const input = event.target.textContent;
        const result = this.model.processInput(input);
        this.view.updateDisplay(result);
    }
}
```

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

### Key API Endpoints
```javascript
// User Management
POST /api/users           // Create new user
GET  /api/users           // Get all users with pagination
GET  /api/users/:id       // Get user by ID
PUT  /api/users/:id       // Update user profile
DELETE /api/users/:id     // Soft delete user

// Post Management
POST /api/posts           // Create new post
GET  /api/posts           // Get all posts with engagement stats
GET  /api/posts/:id       // Get post by ID with full details
PUT  /api/posts/:id       // Update post
DELETE /api/posts/:id     // Soft delete post
POST /api/posts/:id/like  // Toggle like on post
POST /api/posts/:id/comments // Add comment to post

// Advanced Features
GET  /api/posts/trending     // Get trending posts by engagement
GET  /api/posts/search?q=... // Search posts by content
GET  /api/posts/user/:userId // Get posts by specific user
```

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

### Third-Party API Integration Architecture
```javascript
// API Client Configuration
const apiClient = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Caching Layer
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes
  checkperiod: 60 
});

// Character Model with API Integration
class Character {
  static async getAll(page = 1, filters = {}) {
    const cacheKey = `characters_${page}_${JSON.stringify(filters)}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    // Fetch from API
    const response = await apiClient.get('/character', {
      params: { page, ...filters }
    });
    
    // Cache the result
    cache.set(cacheKey, response.data);
    return response.data;
  }
  
  static async search(query, filters = {}) {
    return await this.getAll(1, { name: query, ...filters });
  }
  
  static async getById(id) {
    const cacheKey = `character_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const response = await apiClient.get(`/character/${id}`);
    cache.set(cacheKey, response.data);
    return response.data;
  }
}
```

### Advanced API Features
```javascript
// Character Sheet Generation
app.get('/api/characters/:id/sheet', async (req, res) => {
  try {
    const character = await Character.getById(req.params.id);
    const episodes = await Promise.all(
      character.episode.map(url => apiClient.get(url))
    );
    
    const characterSheet = {
      ...character,
      episodeDetails: episodes.map(ep => ep.data),
      stats: {
        totalEpisodes: episodes.length,
        firstAppearance: episodes[0]?.data.name,
        lastSeen: episodes[episodes.length - 1]?.data.name
      }
    };
    
    res.json({ success: true, data: characterSheet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Character Comparison
app.get('/api/characters/compare/:id1/:id2', async (req, res) => {
  try {
    const [char1, char2] = await Promise.all([
      Character.getById(req.params.id1),
      Character.getById(req.params.id2)
    ]);
    
    const comparison = {
      characters: [char1, char2],
      similarities: {
        sameSpecies: char1.species === char2.species,
        sameStatus: char1.status === char2.status,
        sameGender: char1.gender === char2.gender,
        sameOrigin: char1.origin.name === char2.origin.name
      },
      differences: {
        species: [char1.species, char2.species],
        status: [char1.status, char2.status],
        location: [char1.location.name, char2.location.name]
      }
    };
    
    res.json({ success: true, data: comparison });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Request Parameter Handling
```javascript
// Query Parameters: /api/characters?page=2&status=alive&species=human
app.get('/api/characters', async (req, res) => {
  const { page = 1, status, species, gender, name } = req.query;
  
  const filters = {};
  if (status) filters.status = status;
  if (species) filters.species = species;
  if (gender) filters.gender = gender;
  if (name) filters.name = name;
  
  const characters = await Character.getAll(page, filters);
  res.json({ success: true, data: characters });
});

// Path Parameters: /api/characters/status/alive
app.get('/api/characters/status/:status', async (req, res) => {
  const { status } = req.params;
  const { page = 1 } = req.query;
  
  const characters = await Character.getAll(page, { status });
  res.json({ success: true, data: characters });
});
```

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
```javascript
// Server-side Socket.IO Implementation
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Database Schema (SQLite)
const initializeDatabase = () => {
  db.serialize(() => {
    // Messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id TEXT,
      sender_nickname TEXT,
      content TEXT,
      room TEXT DEFAULT 'general',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      message_type TEXT DEFAULT 'message'
    )`);
    
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT,
      avatar TEXT,
      status TEXT DEFAULT 'online',
      status_message TEXT,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
};

// Real-time Event Handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // User joins chat
  socket.on('user joined', (userData) => {
    socket.userData = userData;
    socket.join('general');
    
    // Store user in database
    const stmt = db.prepare(`INSERT OR REPLACE INTO users 
      (id, nickname, avatar, status, status_message) 
      VALUES (?, ?, ?, ?, ?)`);
    stmt.run(socket.id, userData.nickname, userData.avatar, 
             userData.status, userData.statusMessage);
    
    // Broadcast user connection
    socket.to('general').emit('user connected', {
      id: socket.id,
      nickname: userData.nickname,
      avatar: userData.avatar
    });
    
    // Send message history
    db.all(`SELECT * FROM messages WHERE room = 'general' 
            ORDER BY timestamp DESC LIMIT 50`, (err, rows) => {
      if (!err) {
        socket.emit('message history', rows.reverse());
      }
    });
  });
  
  // Handle chat messages
  socket.on('chat message', (data) => {
    const messageData = {
      id: Date.now(),
      senderId: socket.id,
      senderNickname: socket.userData?.nickname || 'Anonymous',
      content: data.message,
      room: data.room || 'general',
      timestamp: new Date().toISOString(),
      messageType: 'message'
    };
    
    // Save to database
    const stmt = db.prepare(`INSERT INTO messages 
      (sender_id, sender_nickname, content, room, message_type) 
      VALUES (?, ?, ?, ?, ?)`);
    stmt.run(messageData.senderId, messageData.senderNickname, 
             messageData.content, messageData.room, messageData.messageType);
    
    // Broadcast to room
    socket.to(messageData.room).emit('chat message', messageData);
  });
  
  // Private messaging
  socket.on('start private chat', (targetUserId) => {
    const roomName = [socket.id, targetUserId].sort().join('_');
    socket.join(roomName);
    
    socket.emit('private chat started', {
      roomName,
      targetUserId,
      message: `Private chat started`
    });
  });
  
  // Search messages
  socket.on('search messages', (query) => {
    db.all(`SELECT * FROM messages 
            WHERE content LIKE ? 
            ORDER BY timestamp DESC LIMIT 50`, 
           [`%${query}%`], (err, rows) => {
      if (!err) {
        socket.emit('search results', rows);
      }
    });
  });
});
```

### Client-side Features (614 lines of JavaScript)
```javascript
// Socket.IO Client Connection
const socket = io();

// Chat Application Class
class ChatApp {
  constructor() {
    this.currentRoom = 'general';
    this.isPrivateChat = false;
    this.targetUserId = null;
    this.onlineUsers = new Map();
    this.isTyping = false;
    this.typingTimeout = null;
    
    this.initializeEventListeners();
    this.checkTheme();
  }
  
  // Message handling with reactions
  addMessage(messageData, isOwnMessage = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwnMessage ? 'own-message' : ''}`;
    messageDiv.innerHTML = `
      <div class="message-header">
        <span class="sender">${messageData.senderNickname}</span>
        <span class="timestamp">${this.formatTime(messageData.timestamp)}</span>
      </div>
      <div class="message-content">${this.escapeHtml(messageData.content)}</div>
      <div class="message-reactions">
        <button class="reaction-btn" data-reaction="👍">👍</button>
        <button class="reaction-btn" data-reaction="❤️">❤️</button>
        <button class="reaction-btn" data-reaction="😂">😂</button>
        <button class="reaction-btn" data-reaction="😮">😮</button>
      </div>
    `;
    
    // Add reaction event listeners
    messageDiv.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.addReaction(messageData.id, e.target.dataset.reaction);
      });
    });
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }
  
  // Theme switching with persistence
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('chat-theme', newTheme);
    
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }
  
  // Real-time search
  performSearch(query) {
    if (query.length < 3) {
      this.searchResults.innerHTML = '<p>Enter at least 3 characters to search</p>';
      return;
    }
    
    socket.emit('search messages', query);
  }
  
  // Bot commands
  handleBotCommand(message) {
    const command = message.toLowerCase();
    let response = '';
    
    switch(command) {
      case '/help':
        response = `Available commands:
        /help - Show this help message
        /time - Show current time
        /weather - Get weather update
        /joke - Get a random joke
        /quote - Get an inspirational quote`;
        break;
      case '/time':
        response = `Current time: ${new Date().toLocaleString()}`;
        break;
      case '/weather':
        const weather = ['Sunny ☀️', 'Cloudy ☁️', 'Rainy 🌧️', 'Snowy ❄️'];
        response = `Weather update: ${weather[Math.floor(Math.random() * weather.length)]}`;
        break;
      case '/joke':
        const jokes = [
          'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
          'How many programmers does it take to change a light bulb? None, that\'s a hardware problem! 💡',
          'Why do Java developers wear glasses? Because they can\'t C# 👓'
        ];
        response = jokes[Math.floor(Math.random() * jokes.length)];
        break;
      case '/quote':
        const quotes = [
          '"Code is like humor. When you have to explain it, it\'s bad." – Cory House',
          '"First, solve the problem. Then, write the code." – John Johnson',
          '"Programming isn\'t about what you know; it\'s about what you can figure out." – Chris Pine'
        ];
        response = quotes[Math.floor(Math.random() * quotes.length)];
        break;
      default:
        response = 'Unknown command. Type /help for available commands.';
    }
    
    return response;
  }
}
```

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

## Performance & Optimization

### Server-Side Optimizations
- **Connection pooling** for database operations
- **Indexed database queries** for fast searches
- **Room-based messaging** to reduce bandwidth
- **API caching** with TTL for external services
- **Graceful error handling** and connection cleanup

### Client-Side Performance
- **Event delegation** for dynamic content
- **Debounced search** to prevent excessive API calls
- **Efficient DOM updates** using targeted selectors
- **Memory management** for event listeners
- **Lazy loading** for message history

### Database Optimization
- **Prepared statements** for SQL injection prevention
- **Database indexes** on frequently queried columns
- **Connection pooling** for concurrent requests
- **Query optimization** with LIMIT and proper WHERE clauses

## Security Considerations

### Input Validation & Sanitization
- **Message length limits** to prevent spam
- **Nickname validation** and character restrictions
- **SQL injection protection** using parameterized queries
- **XSS prevention** with proper HTML escaping
- **Content Security Policy** headers

### Rate Limiting & Throttling
- **Typing indicator throttling** (1-second timeout)
- **Search query debouncing** (300ms delay)
- **Message rate limiting** to prevent spam
- **API call throttling** for external services

## Production Deployment Considerations

### Environment Configuration
```javascript
// Environment variables
const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || 3306,
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'blogging_app'
};

// Production optimizations
if (config.nodeEnv === 'production') {
  app.use(helmet()); // Security headers
  app.use(compression()); // Gzip compression
  app.use(morgan('combined')); // Detailed logging
}
```

### Scalability Patterns
- **Horizontal scaling** with load balancers
- **Database connection pooling** for concurrent users
- **Redis caching** for session management
- **CDN integration** for static assets
- **Microservice architecture** for large applications

## Browser Compatibility

- **Chrome 60+** - Full feature support
- **Firefox 55+** - Full feature support  
- **Safari 12+** - Full feature support
- **Edge 79+** - Full feature support
- **Mobile browsers** - Responsive design optimized

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