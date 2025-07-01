const Favorite = require('../models/Favorite');
const Character = require('../models/Character');

// Get all favorites
const getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.getAll();

    res.json({
      success: true,
      count: favorites.length,
      data: favorites.map(fav => fav.getSummary())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

// Get favorite by ID
const getFavoriteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid favorite ID'
      });
    }

    const favorite = await Favorite.getById(parseInt(id));

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      data: favorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorite',
      error: error.message
    });
  }
};

// Add character to favorites
const addFavorite = async (req, res) => {
  try {
    const { characterId } = req.body;

    if (!characterId || isNaN(parseInt(characterId))) {
      return res.status(400).json({
        success: false,
        message: 'Valid character ID is required'
      });
    }

    // Check if character exists in Rick and Morty API
    const character = await Character.getById(parseInt(characterId));

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found in Rick and Morty database'
      });
    }

    // Check if already favorited
    const isAlreadyFavorited = await Favorite.isFavorited(characterId);
    if (isAlreadyFavorited) {
      return res.status(409).json({
        success: false,
        message: 'Character is already in favorites'
      });
    }

    const favorite = await Favorite.add(character);

    res.status(201).json({
      success: true,
      message: 'Character added to favorites successfully',
      data: favorite
    });
  } catch (error) {
    if (error.message.includes('already in favorites')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error adding favorite',
      error: error.message
    });
  }
};

// Remove favorite by ID
const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid favorite ID'
      });
    }

    const removed = await Favorite.removeById(parseInt(id));

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Favorite removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing favorite',
      error: error.message
    });
  }
};

// Remove favorite by character ID
const removeFavoriteByCharacterId = async (req, res) => {
  try {
    const { characterId } = req.params;

    if (!characterId || isNaN(parseInt(characterId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID'
      });
    }

    const removed = await Favorite.removeByCharacterId(parseInt(characterId));

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Character not found in favorites'
      });
    }

    res.json({
      success: true,
      message: 'Character removed from favorites successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing favorite',
      error: error.message
    });
  }
};

// Update favorite notes
const updateFavoriteNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid favorite ID'
      });
    }

    if (typeof notes !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Notes must be a string'
      });
    }

    const updatedFavorite = await Favorite.updateNotes(parseInt(id), notes);

    res.json({
      success: true,
      message: 'Favorite notes updated successfully',
      data: updatedFavorite
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating favorite notes',
      error: error.message
    });
  }
};

// Get recent favorites
const getRecentFavorites = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    if (isNaN(limitNum) || limitNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be a positive number'
      });
    }

    const favorites = await Favorite.getRecent(limitNum);

    res.json({
      success: true,
      count: favorites.length,
      data: favorites.map(fav => fav.getSummary())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent favorites',
      error: error.message
    });
  }
};

// Get favorites statistics
const getFavoriteStats = async (req, res) => {
  try {
    const stats = await Favorite.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorite statistics',
      error: error.message
    });
  }
};

// Check if character is favorited
const checkIsFavorited = async (req, res) => {
  try {
    const { characterId } = req.params;

    if (!characterId || isNaN(parseInt(characterId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID'
      });
    }

    const isFavorited = await Favorite.isFavorited(parseInt(characterId));

    res.json({
      success: true,
      data: {
        characterId: parseInt(characterId),
        isFavorited
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking favorite status',
      error: error.message
    });
  }
};

// Get character sheet for favorite
const getFavoriteCharacterSheet = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid favorite ID'
      });
    }

    const favorite = await Favorite.getById(parseInt(id));

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    // Get character details from API
    const character = await Character.getById(favorite.characterId);

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character no longer exists in Rick and Morty database'
      });
    }

    // Generate character sheet
    const characterSheet = await character.getCharacterSheet();

    res.json({
      success: true,
      data: {
        favorite: favorite,
        characterSheet: characterSheet
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating favorite character sheet',
      error: error.message
    });
  }
};

// Clear all favorites
const clearAllFavorites = async (req, res) => {
  try {
    await Favorite.clear();

    res.json({
      success: true,
      message: 'All favorites cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing favorites',
      error: error.message
    });
  }
};

// Get favorites by date range
const getFavoritesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use ISO format (YYYY-MM-DD)'
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    const favorites = await Favorite.getByDateRange(startDate, endDate);

    res.json({
      success: true,
      dateRange: { startDate, endDate },
      count: favorites.length,
      data: favorites.map(fav => fav.getSummary())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites by date range',
      error: error.message
    });
  }
};

module.exports = {
  getAllFavorites,
  getFavoriteById,
  addFavorite,
  removeFavorite,
  removeFavoriteByCharacterId,
  updateFavoriteNotes,
  getRecentFavorites,
  getFavoriteStats,
  checkIsFavorited,
  getFavoriteCharacterSheet,
  clearAllFavorites,
  getFavoritesByDateRange
};
