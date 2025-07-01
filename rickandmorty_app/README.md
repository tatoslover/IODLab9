# Rick and Morty Character Explorer - Express API

A simple Express.js application that integrates with the Rick and Morty API to provide character information, favorites management, and advanced features like character sheets and analytics.

## Features

- **Third-Party API Integration** - Rick and Morty API integration
- **Character Browser** - Browse and search all Rick and Morty characters
- **Favorites System** - Save and manage favorite characters locally
- **Character Sheets** - Generate detailed character profiles
- **Advanced Search** - Search by name, status, species, and more
- **Character Analytics** - Statistics and character comparisons
- **API Caching** - Performance optimization with caching
- **MVC Architecture** - Clean separation of concerns

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for third-party API calls
- **Node-cache** - In-memory caching
- **express-validator** - Request validation
- **CORS, Helmet, Morgan** - Standard middleware
- **File System** - JSON-based local storage for favorites

## Third-Party API

- **API**: [Rick and Morty API](https://rickandmortyapi.com)
- **Base URL**: `https://rickandmortyapi.com/api`
- **Free to use** - No API key required
- **Data**: 800+ characters, episodes, and locations

## Installation

1. Navigate to the project directory:
```bash
cd IOD/Module9Lab/rickandmorty_app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3002`

## API Endpoints

### Health Check
- `GET /api/health` - Check API and third-party service status

### Characters

#### Basic Operations
- `GET /api/characters` - Get all characters (with pagination and filtering)
- `GET /api/characters/:id` - Get character by ID
- `GET /api/characters/random` - Get random character
- `GET /api/characters/stats` - Get character statistics

#### Search and Filter (Query Parameters)
- `GET /api/characters/search?q=rick` - Search characters by name
- `GET /api/characters?page=2&status=alive` - Filter by status with pagination
- `GET /api/characters?species=human&gender=female` - Multiple filters

#### Category Endpoints (Path Parameters)
- `GET /api/characters/status/:status` - Get characters by status (alive/dead/unknown)
- `GET /api/characters/species/:species` - Get characters by species

#### Advanced Features
- `GET /api/characters/:id/episodes` - Get character's episodes
- `GET /api/characters/:id/sheet` - Get detailed character sheet
- `GET /api/characters/compare/:id1/:id2` - Compare two characters
- `POST /api/characters/multiple` - Get multiple characters by IDs

### Favorites

#### Basic Operations
- `GET /api/favorites` - Get all favorite characters
- `POST /api/favorites` - Add character to favorites
- `DELETE /api/favorites/:id` - Remove favorite by ID

#### Advanced Features
- `GET /api/favorites/stats` - Get favorites statistics
- `GET /api/favorites/recent?limit=10` - Get recent favorites (query parameter)
- `GET /api/favorites/range?startDate=2024-01-01&endDate=2024-12-31` - Get favorites by date range
- `PUT /api/favorites/:id/notes` - Update favorite notes
- `GET /api/favorites/:id/sheet` - Get character sheet for favorite
- `GET /api/favorites/check/:characterId` - Check if character is favorited
- `DELETE /api/favorites/character/:characterId` - Remove by character ID

## Request Parameter Examples

### Query Parameters
```bash
# Pagination and filtering
GET /api/characters?page=2&status=alive&species=human

# Search with filters
GET /api/characters/search?q=morty&gender=male&page=1

# Date range for favorites
GET /api/favorites/range?startDate=2024-01-01&endDate=2024-12-31

# Limit results
GET /api/favorites/recent?limit=5
```

### Path Parameters
```bash
# Character by ID
GET /api/characters/1

# Characters by status
GET /api/characters/status/alive

# Characters by species
GET /api/characters/species/human

# Compare characters
GET /api/characters/compare/1/2

# Character episodes
GET /api/characters/5/episodes

# Remove favorite by character ID
DELETE /api/favorites/character/10
```

## Usage Examples

### 1. Get Rick Sanchez
```bash
curl http://localhost:3002/api/characters/1
```

### 2. Search for Morty characters
```bash
curl "http://localhost:3002/api/characters/search?q=morty"
```

### 3. Get alive characters with pagination
```bash
curl "http://localhost:3002/api/characters/status/alive?page=2"
```

### 4. Add character to favorites
```bash
curl -X POST http://localhost:3002/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"characterId": 1}'
```

### 5. Get character sheet
```bash
curl http://localhost:3002/api/characters/1/sheet
```

### 6. Compare two characters
```bash
curl http://localhost:3002/api/characters/compare/1/2
```

### 7. Advanced filtering
```bash
curl "http://localhost:3002/api/characters?status=alive&species=human&gender=female"
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

## Data Models

### Character (from Rick and Morty API)
```json
{
  "id": 1,
  "name": "Rick Sanchez",
  "status": "Alive",
  "species": "Human",
  "type": "",
  "gender": "Male",
  "origin": {
    "name": "Earth (C-137)",
    "url": "https://rickandmortyapi.com/api/location/1"
  },
  "location": {
    "name": "Citadel of Ricks",
    "url": "https://rickandmortyapi.com/api/location/3"
  },
  "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  "episode": ["https://rickandmortyapi.com/api/episode/1"],
  "url": "https://rickandmortyapi.com/api/character/1",
  "created": "2017-11-04T18:48:46.250Z"
}
```

### Favorite (local storage)
```json
{
  "id": 1,
  "characterId": 1,
  "characterName": "Rick Sanchez",
  "characterImage": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  "dateAdded": "2024-01-15T10:30:00Z",
  "notes": "The smartest man in the universe!"
}
```

## Project Structure

```
rickandmorty_app/
├── package.json
├── server.js                    # Main application entry point
├── demo.js                      # API demonstration script
├── config/
│   └── api.js                   # Third-party API configuration and caching
├── models/
│   ├── Character.js             # Character model (API wrapper)
│   └── Favorite.js              # Favorite model (local storage)
├── controllers/
│   ├── characterController.js   # Character business logic
│   └── favoriteController.js    # Favorite business logic
├── routes/
│   ├── characters.js            # Character route definitions
│   └── favorites.js             # Favorite route definitions
├── middleware/
│   └── validation.js            # Request validation middleware
└── data/
    └── favorites.json           # Local favorites storage (auto-created)
```

## Key Features Demonstrated

### Third-Party API Integration
- **HTTP Client Configuration** - Axios with timeouts and interceptors
- **Error Handling** - Specific handling for API errors
- **Request/Response Logging** - Comprehensive API call logging
- **Health Checks** - Monitor third-party service availability

### Request Parameters
- **Query Parameters** - Pagination, filtering, search terms
- **Path Parameters** - Resource IDs, categories, comparisons
- **Parameter Validation** - Input validation and sanitization
- **Complex Queries** - Multiple parameter combinations

### Performance Optimization
- **API Caching** - In-memory caching with TTL
- **Cache Management** - Cache statistics and clearing
- **Connection Pooling** - Efficient HTTP client usage
- **Response Optimization** - Selective data retrieval

### Local Data Management
- **File-based Storage** - JSON files for favorites
- **CRUD Operations** - Full create/read/update/delete
- **Data Persistence** - Automatic file management
- **Data Validation** - Input validation and error handling

## Testing the API

1. **Start the server**: `npm run dev`
2. **Run the demo**: `npm run demo`
3. **Visit documentation**: `http://localhost:3002`
4. **Health check**: `http://localhost:3002/api/health`
5. **Use curl, Postman, or any HTTP client**

## Demo Script

Run the automated demo to test all functionality:

```bash
npm run demo
```

The demo will:
1. Check API health and third-party service
2. Demonstrate character browsing and search
3. Show favorites management
4. Test advanced features like character sheets
5. Display statistics and analytics

## Environment Variables

Configure these environment variables if needed:

- `PORT`: Server port (default: 3002)
- `NODE_ENV`: Environment (development/production)

## Error Handling

The application handles various error scenarios:

- **Network Errors**: Third-party API unavailable
- **Timeout Errors**: Slow API responses
- **Validation Errors**: Invalid request parameters
- **Not Found Errors**: Missing characters or favorites
- **Rate Limiting**: Third-party API limits

## Caching Strategy

- **Cache Duration**: 5 minutes for API responses
- **Cache Keys**: Generated from endpoint and parameters
- **Cache Statistics**: Monitor hit/miss ratios
- **Cache Management**: Manual clearing capability

## Module 9 Lab Exercise 4 Requirements Met

✅ **Third-Party API Integration** - Rick and Morty API  
✅ **Query Parameters** - Pagination, filtering, search  
✅ **Path Parameters** - Character IDs, status, species  
✅ **MVC Architecture** - Models, Views (JSON), Controllers  
✅ **Express Routes** - RESTful endpoint design  
✅ **Additional Functionality** - Favorites, analytics, caching  

## Notes

- This is a demonstration/learning project
- No authentication implemented (keeping it simple)
- Local JSON storage for favorites (production would use database)
- Comprehensive error handling for third-party API integration
- Demonstrates both query and path parameter usage extensively
- Shows practical microservice integration patterns