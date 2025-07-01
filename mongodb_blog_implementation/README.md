# MongoDB Blog Implementation - Express API

A simple Express.js back-end application for a Blog website using MongoDB, demonstrating MVC architecture and RESTful API design.

## Features

- **User Management**: Create and manage user accounts
- **Blog Posts**: Users can create posts with title, description, and images
- **Post Engagement**: Like posts and add comments
- **MVC Architecture**: Proper separation of concerns
- **MongoDB Integration**: Using Mongoose ODM
- **RESTful API**: Clean endpoint design
- **Validation**: Request validation middleware
- **Error Handling**: Comprehensive error responses

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **express-validator** - Request validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

## Installation

1. Clone the repository and navigate to the project directory:
```bash
cd IOD/mongodb_blog_implementation
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running on your system:
```bash
# Start MongoDB (if using local installation)
mongod
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (soft delete)

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
curl -X POST http://localhost:3000/api/users \
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
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "description": "This is my first post about web development",
    "imageUrl": "https://example.com/image.jpg",
    "authorId": "USER_ID_HERE"
  }'
```

### 3. Like a Post
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID_HERE/like \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE"
  }'
```

### 4. Add a Comment
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID_HERE/comments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "content": "Great post! Very helpful."
  }'
```

### 5. Get All Posts
```bash
curl http://localhost:3000/api/posts
```

### 6. Search Posts
```bash
curl "http://localhost:3000/api/posts/search?q=web%20development"
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

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  passwordHash: String,
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatarUrl: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  imageUrl: String,
  slug: String (auto-generated),
  author: {
    userId: ObjectId,
    username: String,
    displayName: String
  },
  likes: [{
    userId: ObjectId,
    username: String,
    likedAt: Date
  }],
  comments: [{
    userId: ObjectId,
    username: String,
    content: String,
    isDeleted: Boolean,
    createdAt: Date,
    replies: [/* nested comments */]
  }],
  stats: {
    likeCount: Number,
    commentCount: Number,
    viewCount: Number
  },
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
mongodb_blog_implementation/
├── package.json
├── server.js              # Main application entry point
├── config/
│   └── database.js        # MongoDB connection configuration
├── models/
│   ├── User.js           # User model with Mongoose schema
│   └── Post.js           # Post model with embedded comments/likes
├── controllers/
│   ├── userController.js  # User business logic
│   └── postController.js  # Post business logic
├── routes/
│   ├── users.js          # User route definitions
│   └── posts.js          # Post route definitions
└── middleware/
    └── validation.js     # Request validation middleware
```

## Key Features Demonstrated

1. **MVC Architecture**: Clean separation of Models, Views (JSON responses), and Controllers
2. **MongoDB Integration**: Using Mongoose with proper schema design
3. **RESTful Design**: Following REST principles for API endpoints
4. **Data Validation**: Input validation using express-validator
5. **Error Handling**: Comprehensive error responses
6. **Embedded Documents**: Comments and likes stored within posts for performance
7. **Pagination**: Support for paginated responses
8. **Search Functionality**: Text search across posts
9. **Engagement Features**: Like/unlike posts and commenting system

## Environment Variables

You can configure the following environment variables:

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/blogging_app)
- `NODE_ENV`: Environment (development/production)

## Testing the API

1. Start the server: `npm run dev`
2. Visit `http://localhost:3000` for API documentation
3. Use the health check endpoint: `http://localhost:3000/api/health`
4. Test endpoints using curl, Postman, or any HTTP client

## Notes

- This is a demonstration/learning project - not production-ready
- No authentication/authorization implemented (keeping it simple)
- Passwords are stored as hashes (but hashing not implemented in this demo)
- Basic error handling and validation
- Uses the same database structure as Module 8 Lab MongoDB implementation

## Module 9 Lab Exercise 2 Requirements Met

✅ **MVC Structure**: Proper separation with Models, Controllers, and Routes
✅ **User Creation**: POST /api/users endpoint
✅ **Post Creation**: Users can create posts with title, description, and image
✅ **Post Engagement**: Like posts and add comments functionality
✅ **MongoDB Integration**: Using the database model from Module 8
✅ **Express Back-end**: RESTful API with proper HTTP methods