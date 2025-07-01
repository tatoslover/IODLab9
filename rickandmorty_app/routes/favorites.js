const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const {
  validateFavoriteId,
  validateAddFavorite,
  validateUpdateFavoriteNotes,
  validateRecentFavorites,
  validateDateRange,
  validateIntId
} = require('../middleware/validation');

// GET /api/favorites - Get all favorites
router.get('/', favoriteController.getAllFavorites);

// GET /api/favorites/stats - Get favorites statistics
router.get('/stats', favoriteController.getFavoriteStats);

// GET /api/favorites/recent - Get recent favorites (query parameter)
// Examples:
// /api/favorites/recent?limit=5
// /api/favorites/recent?limit=20
router.get('/recent', validateRecentFavorites, favoriteController.getRecentFavorites);

// GET /api/favorites/range - Get favorites by date range (query parameters)
// Examples:
// /api/favorites/range?startDate=2024-01-01&endDate=2024-12-31
// /api/favorites/range?startDate=2024-06-01&endDate=2024-06-30
router.get('/range', validateDateRange, favoriteController.getFavoritesByDateRange);

// POST /api/favorites - Add character to favorites
// Body: { "characterId": 1 }
router.post('/', validateAddFavorite, favoriteController.addFavorite);

// DELETE /api/favorites/clear - Clear all favorites
router.delete('/clear', favoriteController.clearAllFavorites);

// GET /api/favorites/:id - Get favorite by ID (path parameter)
// Examples:
// /api/favorites/1
// /api/favorites/5
router.get('/:id', validateFavoriteId, favoriteController.getFavoriteById);

// PUT /api/favorites/:id/notes - Update favorite notes (path parameter)
// Examples:
// /api/favorites/1/notes
// Body: { "notes": "My favorite character because..." }
router.put('/:id/notes', validateUpdateFavoriteNotes, favoriteController.updateFavoriteNotes);

// GET /api/favorites/:id/sheet - Get character sheet for favorite (path parameter)
// Examples:
// /api/favorites/1/sheet
// /api/favorites/3/sheet
router.get('/:id/sheet', validateFavoriteId, favoriteController.getFavoriteCharacterSheet);

// DELETE /api/favorites/:id - Remove favorite by ID (path parameter)
// Examples:
// /api/favorites/1
// /api/favorites/5
router.delete('/:id', validateFavoriteId, favoriteController.removeFavorite);

// GET /api/favorites/check/:characterId - Check if character is favorited (path parameter)
// Examples:
// /api/favorites/check/1
// /api/favorites/check/15
router.get('/check/:characterId', validateIntId('characterId'), favoriteController.checkIsFavorited);

// DELETE /api/favorites/character/:characterId - Remove favorite by character ID (path parameter)
// Examples:
// /api/favorites/character/1
// /api/favorites/character/10
router.delete('/character/:characterId', validateIntId('characterId'), favoriteController.removeFavoriteByCharacterId);

module.exports = router;
