const Character = require('../models/Character');
const { getCacheStats, clearCache } = require('../config/api');

// Get all characters with pagination and filtering
const getAllCharacters = async (req, res) => {
  try {
    const {
      page = 1,
      name,
      status,
      species,
      type,
      gender
    } = req.query;

    const options = { page: parseInt(page) };
    if (name) options.name = name;
    if (status) options.status = status;
    if (species) options.species = species;
    if (type) options.type = type;
    if (gender) options.gender = gender;

    const result = await Character.getAll(options);

    res.json({
      success: true,
      data: {
        info: result.info,
        characters: result.results.map(char => char.getSummary())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching characters',
      error: error.message
    });
  }
};

// Get character by ID
const getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID'
      });
    }

    const character = await Character.getById(parseInt(id));

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    res.json({
      success: true,
      data: character
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching character',
      error: error.message
    });
  }
};

// Search characters by name
const searchCharacters = async (req, res) => {
  try {
    const { q, page = 1, status, species, gender } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const options = { page: parseInt(page) };
    if (status) options.status = status;
    if (species) options.species = species;
    if (gender) options.gender = gender;

    const result = await Character.search(q.trim(), options);

    res.json({
      success: true,
      query: q.trim(),
      data: {
        info: result.info,
        characters: result.results.map(char => char.getSummary())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching characters',
      error: error.message
    });
  }
};

// Get random character
const getRandomCharacter = async (req, res) => {
  try {
    const character = await Character.getRandom();

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'No random character found'
      });
    }

    res.json({
      success: true,
      data: character
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting random character',
      error: error.message
    });
  }
};

// Get character's episodes
const getCharacterEpisodes = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID'
      });
    }

    const character = await Character.getById(parseInt(id));

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    const episodes = await character.getEpisodes();

    res.json({
      success: true,
      data: {
        character: character.getSummary(),
        episodes: episodes,
        episodeCount: episodes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching character episodes',
      error: error.message
    });
  }
};

// Get character sheet (detailed info)
const getCharacterSheet = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID'
      });
    }

    const character = await Character.getById(parseInt(id));

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    const characterSheet = await character.getCharacterSheet();

    res.json({
      success: true,
      data: characterSheet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating character sheet',
      error: error.message
    });
  }
};

// Get characters by status
const getCharactersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1 } = req.query;

    const validStatuses = ['alive', 'dead', 'unknown'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: alive, dead, or unknown'
      });
    }

    const result = await Character.getByStatus(status, parseInt(page));

    res.json({
      success: true,
      data: {
        status: status,
        info: result.info,
        characters: result.results.map(char => char.getSummary())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching characters by status',
      error: error.message
    });
  }
};

// Get characters by species
const getCharactersBySpecies = async (req, res) => {
  try {
    const { species } = req.params;
    const { page = 1 } = req.query;

    if (!species || species.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Species parameter is required'
      });
    }

    const result = await Character.getBySpecies(species, parseInt(page));

    res.json({
      success: true,
      data: {
        species: species,
        info: result.info,
        characters: result.results.map(char => char.getSummary())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching characters by species',
      error: error.message
    });
  }
};

// Get multiple characters by IDs
const getMultipleCharacters = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Array of character IDs is required'
      });
    }

    // Validate all IDs are numbers
    const validIds = ids.filter(id => !isNaN(parseInt(id))).map(id => parseInt(id));

    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid character IDs provided'
      });
    }

    const characters = await Character.getMultiple(validIds);

    res.json({
      success: true,
      data: {
        requested: validIds.length,
        found: characters.length,
        characters: characters.map(char => char.getSummary())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching multiple characters',
      error: error.message
    });
  }
};

// Get character statistics
const getCharacterStats = async (req, res) => {
  try {
    const stats = await Character.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating character statistics',
      error: error.message
    });
  }
};

// Compare two characters
const compareCharacters = async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    if (!id1 || !id2 || isNaN(parseInt(id1)) || isNaN(parseInt(id2))) {
      return res.status(400).json({
        success: false,
        message: 'Two valid character IDs are required'
      });
    }

    const [character1, character2] = await Promise.all([
      Character.getById(parseInt(id1)),
      Character.getById(parseInt(id2))
    ]);

    if (!character1 || !character2) {
      return res.status(404).json({
        success: false,
        message: 'One or both characters not found'
      });
    }

    const comparison = {
      character1: character1.getSummary(),
      character2: character2.getSummary(),
      similarities: [],
      differences: []
    };

    // Check similarities and differences
    if (character1.species === character2.species) {
      comparison.similarities.push(`Both are ${character1.species}`);
    } else {
      comparison.differences.push(`Species: ${character1.species} vs ${character2.species}`);
    }

    if (character1.status === character2.status) {
      comparison.similarities.push(`Both are ${character1.status}`);
    } else {
      comparison.differences.push(`Status: ${character1.status} vs ${character2.status}`);
    }

    if (character1.gender === character2.gender) {
      comparison.similarities.push(`Both are ${character1.gender}`);
    } else {
      comparison.differences.push(`Gender: ${character1.gender} vs ${character2.gender}`);
    }

    if (character1.origin?.name === character2.origin?.name) {
      comparison.similarities.push(`Both from ${character1.origin?.name}`);
    } else {
      comparison.differences.push(`Origin: ${character1.origin?.name} vs ${character2.origin?.name}`);
    }

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error comparing characters',
      error: error.message
    });
  }
};

// Get cache statistics
const getCacheStatistics = async (req, res) => {
  try {
    const stats = getCacheStats();

    res.json({
      success: true,
      data: {
        cache: stats,
        message: 'API cache statistics'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting cache statistics',
      error: error.message
    });
  }
};

// Clear API cache
const clearApiCache = async (req, res) => {
  try {
    clearCache();

    res.json({
      success: true,
      message: 'API cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cache',
      error: error.message
    });
  }
};

module.exports = {
  getAllCharacters,
  getCharacterById,
  searchCharacters,
  getRandomCharacter,
  getCharacterEpisodes,
  getCharacterSheet,
  getCharactersByStatus,
  getCharactersBySpecies,
  getMultipleCharacters,
  getCharacterStats,
  compareCharacters,
  getCacheStatistics,
  clearApiCache
};
