const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const {
  validateCharacterId,
  validateCharacterSearch,
  validateCharacterFilter,
  validateStatusParam,
  validateSpeciesParam,
  validateMultipleCharacters,
  validateCompareCharacters,
  validateRecentFavorites
} = require('../middleware/validation');

// GET /api/characters - Get all characters with optional filters (query parameters)
// Examples:
// /api/characters?page=2&status=alive
// /api/characters?name=rick&species=human&gender=male
router.get('/', validateCharacterFilter, characterController.getAllCharacters);

// GET /api/characters/search - Search characters by name (query parameters)
// Examples:
// /api/characters/search?q=morty
// /api/characters/search?q=rick&status=alive&page=2
router.get('/search', validateCharacterSearch, characterController.searchCharacters);

// GET /api/characters/random - Get a random character
router.get('/random', characterController.getRandomCharacter);

// GET /api/characters/stats - Get character statistics
router.get('/stats', characterController.getCharacterStats);

// GET /api/characters/cache - Get cache statistics
router.get('/cache', characterController.getCacheStatistics);

// DELETE /api/characters/cache - Clear API cache
router.delete('/cache', characterController.clearApiCache);

// POST /api/characters/multiple - Get multiple characters by IDs
// Body: { "ids": [1, 2, 3] }
router.post('/multiple', validateMultipleCharacters, characterController.getMultipleCharacters);

// GET /api/characters/status/:status - Get characters by status (path parameter)
// Examples:
// /api/characters/status/alive
// /api/characters/status/dead?page=2
router.get('/status/:status', validateStatusParam, characterController.getCharactersByStatus);

// GET /api/characters/species/:species - Get characters by species (path parameter)
// Examples:
// /api/characters/species/human
// /api/characters/species/alien?page=3
router.get('/species/:species', validateSpeciesParam, characterController.getCharactersBySpecies);

// GET /api/characters/compare/:id1/:id2 - Compare two characters (path parameters)
// Examples:
// /api/characters/compare/1/2
// /api/characters/compare/5/10
router.get('/compare/:id1/:id2', validateCompareCharacters, characterController.compareCharacters);

// GET /api/characters/:id - Get character by ID (path parameter)
// Examples:
// /api/characters/1 (Rick Sanchez)
// /api/characters/2 (Morty Smith)
router.get('/:id', validateCharacterId, characterController.getCharacterById);

// GET /api/characters/:id/episodes - Get character's episodes (path parameter)
// Examples:
// /api/characters/1/episodes
// /api/characters/2/episodes
router.get('/:id/episodes', validateCharacterId, characterController.getCharacterEpisodes);

// GET /api/characters/:id/sheet - Get character sheet (path parameter)
// Examples:
// /api/characters/1/sheet
// /api/characters/2/sheet
router.get('/:id/sheet', validateCharacterId, characterController.getCharacterSheet);

module.exports = router;
