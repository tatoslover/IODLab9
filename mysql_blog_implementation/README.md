# MySQL Blog Implementation - Express API

A simple Express.js back-end application for a Blog website using MySQL, demonstrating MVC architecture and RESTful API design with relational database operations.

## Features

- **User Management**: Create and manage user accounts
- **Blog Posts**: Users can create posts with title, description, and images
- **Post Engagement**: Like posts and add comments (including nested replies)
- **MVC Architecture**: Proper separation of concerns
- **MySQL Integration**: Using mysql2 with connection pooling
- **RESTful API**: Clean endpoint design with SQL operations
- **Validation**: Request validation middleware
- **Error Handling**: MySQL-specific error responses
- **Database Views**: Leveraging MySQL views for efficient queries

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **mysql2** - MySQL client with Promise support
- **express-validator** - Request validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

## Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **MySQL database** with tables created (see Database Setup)

## Installation

1. Navigate to the project directory:
```bash
cd IOD/Module9Lab/mysql_blog_implementation
```

2. Install dependencies:
```bash
npm install
```

3. Set up the MySQL database:
```bash
# Connect to MySQL
mysql -u root -p

# Create database and tables
source ../../Module8Lab/mysql_blog.sql
```

4. Configure database connection (optional):
   - Default settings: `localhost:3306`, database: `blogging_app`, user: `root`
   - Set environment variables if different:
     ```bash
     export DB_HOST=localhost
     export DB_PORT=3306
     export DB_USER=root
     export DB_PASSWORD=your_password
     export DB_NAME=blogging_app
     ```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Database Schema

The application uses the same MySQL schema from Module 8 Lab:

### Tables
- **users** - User accounts with profile information
- **posts** - Blog posts with foreign key to users
- **likes** - Junction table for user-post likes
- **comments** - Comments with self-referencing foreign key for replies

### Views
- **post_details** - Posts with author info and engagement stats
- **comment_details** - Comments with author information

### Key Relationships
- Users → Posts (1:Many)
- Users → Likes (1:Many)
- Posts → Likes (1:Many)
- Users → Comments (1:Many)
- Posts → Comments (1:Many)
- Comments → Comments (Self-referencing for replies)

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (soft delete)
- `GET /api/users/:id/stats` - Get user statistics

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post (soft delete)
- `POST /api/posts/:id/like` - Toggle like on a post
- `POST /api/posts/:id/comments` - Add comment to a post
- `GET /api/posts/user/:userId` - Get posts by specific user
- `GET /api/posts/trending` - Get trending posts
- `GET /api/posts/search?q=keyword` - Search posts

## Usage Examples

### 1. Create a User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "passwordHash": "$2y$10$examplehash",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Tech enthusiast"
  }'
```

### 2. Create a Post
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "description": "This is my first post about web development",
    "imageUrl": "https://example.com/image.jpg",
    "authorId": 1
  }'
```

### 3. Like a Post
```bash
curl -X POST http://localhost:3001/api/posts/1/like \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2
  }'
```

### 4. Add a Comment
```bash
curl -X POST http://localhost:3001/api/posts/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "content": "Great post! Very helpful."
  }'
```

### 5. Get All Posts
```bash
curl http://localhost:3001/api/posts
```

### 6. Search Posts
```bash
curl "http://localhost:3001/api/posts/search?q=database"
```

### 7. Get Trending Posts
```bash
curl http://localhost:3001/api/posts/trending
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors if applicable */ ]
}
```

## Database Models

### User Model
```javascript
{
  user_id: 1,
  username: "johndoe",
  email: "john@example.com",
  first_name: "John",
  last_name: "Doe",
  bio: "Tech enthusiast",
  avatar_url: "https://example.com/avatar.jpg",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:30:00Z",
  is_active: true
}
```

### Post Model (from post_details view)
```javascript
{
  post_id: 1,
  user_id: 1,
  title: "Getting Started with Database Design",
  description: "A comprehensive guide...",
  image_url: "https://example.com/image.jpg",
  slug: "getting-started-database-design",
  username: "johndoe",
  author_name: "John Doe",
  like_count: 5,
  comment_count: 3,
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:30:00Z",
  is_published: true
}
```

## Project Structure

```
mysql_blog_implementation/
├── package.json
├── server.js                 # Main application entry point
├── demo.js                   # API demonstration script
├── config/
│   └── database.js           # MySQL connection pool configuration
├── models/
│   ├── User.js              # User model with SQL operations
│   └── Post.js              # Post model with SQL operations
├── controllers/
│   ├── userController.js     # User business logic
│   └── postController.js     # Post business logic
├── routes/
│   ├── users.js             # User route definitions
│   └── posts.js             # Post route definitions
└── middleware/
    └── validation.js        # Request validation middleware
```

## Key MySQL Features Demonstrated

1. **Connection Pooling** - Efficient database connection management
2. **Prepared Statements** - SQL injection prevention
3. **Foreign Key Constraints** - Data integrity enforcement
4. **Database Views** - Complex queries with `post_details` and `comment_details`
5. **Transactions** - ACID compliance for multi-step operations
6. **JOIN Operations** - Relational data retrieval
7. **Indexes** - Performance optimization
8. **Soft Deletes** - Data preservation with `is_active` and `is_published` flags

## MySQL vs MongoDB Comparison

| Aspect | MySQL Implementation | MongoDB Implementation |
|--------|---------------------|----------------------|
| **Data Structure** | Normalized tables with foreign keys | Embedded documents |
| **Queries** | SQL with JOINs | Single document queries |
| **Relationships** | Foreign key constraints | Embedded/referenced documents |
| **Consistency** | ACID compliance | Eventual consistency |
| **Schema** | Fixed schema with migrations | Flexible schema |
| **Scalability** | Vertical scaling | Horizontal scaling |
| **Complexity** | Higher (multiple tables) | Lower (fewer collections) |

## Testing the API

1. **Start the server**: `npm run dev`
2. **Run the demo**: `npm run demo`
3. **Visit documentation**: `http://localhost:3001`
4. **Health check**: `http://localhost:3001/api/health`
5. **Use curl, Postman, or any HTTP client**

## Environment Variables

Configure these environment variables if needed:

- `PORT`: Server port (default: 3001)
- `DB_HOST`: MySQL host (default: localhost)
- `DB_PORT`: MySQL port (default: 3306)
- `DB_USER`: MySQL username (default: root)
- `DB_PASSWORD`: MySQL password (default: empty)
- `DB_NAME`: Database name (default: blogging_app)
- `NODE_ENV`: Environment (development/production)

## Error Handling

The application handles MySQL-specific errors:

- **ER_DUP_ENTRY**: Duplicate key violations
- **ER_NO_REFERENCED_ROW_2**: Foreign key constraint violations
- **ECONNREFUSED**: Database connection errors
- **Validation errors**: Input validation failures

## Demo Script

Run the automated demo to test all functionality:

```bash
npm run demo
```

The demo will:
1. Create sample users (John, Jane, Mike)
2. Create sample posts
3. Add likes and comments
4. Display results and statistics
5. Test search and trending features

## Module 9 Lab Exercise 3 Requirements Met

✅ **MVC Structure**: Clean separation with Models, Controllers, and Routes  
✅ **User Creation**: Complete user management with MySQL operations  
✅ **Post Creation**: Users can create posts with relational data integrity  
✅ **Post Engagement**: Like posts and add comments with foreign key relationships  
✅ **MySQL Integration**: Using the exact database model from Module 8  
✅ **Express Back-end**: RESTful API with proper HTTP methods and SQL operations  

## Notes

- This is a demonstration/learning project - not production-ready
- No authentication/authorization implemented (keeping it simple)
- Passwords stored as hashes (hashing not implemented in demo)
- Uses the same database structure as Module 8 Lab MySQL implementation
- Demonstrates relational database concepts vs NoSQL approach
- Shows proper use of SQL joins, views, and constraints