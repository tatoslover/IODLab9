const {
  getCharacters,
  getCharacterById,
  getMultipleCharacters,
  getEpisodeById,
  getMultipleEpisodes,
  extractIdFromUrl,
  extractIdsFromUrls
} = require('../config/api');

class Character {
  constructor(characterData) {
    this.id = characterData.id;
    this.name = characterData.name;
    this.status = characterData.status;
    this.species = characterData.species;
    this.type = characterData.type;
    this.gender = characterData.gender;
    this.origin = characterData.origin;
    this.location = characterData.location;
    this.image = characterData.image;
    this.episode = characterData.episode || [];
    this.url = characterData.url;
    this.created = characterData.created;
  }

  // Static method to get all characters with pagination and filters
  static async getAll(options = {}) {
    const { page = 1, name, status, species, type, gender } = options;

    const filters = {};
    if (name) filters.name = name;
    if (status) filters.status = status;
    if (species) filters.species = species;
    if (type) filters.type = type;
    if (gender) filters.gender = gender;

    try {
      const response = await getCharacters(page, filters);
      return {
        info: response.info,
        results: response.results.map(char => new Character(char))
      };
    } catch (error) {
      throw new Error(`Failed to fetch characters: ${error.message}`);
    }
  }

  // Static method to get character by ID
  static async getById(id) {
    try {
      const characterData = await getCharacterById(id);
      return new Character(characterData);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch character ${id}: ${error.message}`);
    }
  }

  // Static method to get multiple characters by IDs
  static async getMultiple(ids) {
    try {
      const response = await getMultipleCharacters(ids);
      // Handle both single character and array responses
      const characters = Array.isArray(response) ? response : [response];
      return characters.map(char => new Character(char));
    } catch (error) {
      throw new Error(`Failed to fetch multiple characters: ${error.message}`);
    }
  }

  // Static method to search characters by name
  static async search(query, options = {}) {
    const { page = 1, status, species, gender } = options;

    const filters = { name: query };
    if (status) filters.status = status;
    if (species) filters.species = species;
    if (gender) filters.gender = gender;

    try {
      const response = await getCharacters(page, filters);
      return {
        info: response.info,
        results: response.results.map(char => new Character(char))
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { info: { count: 0, pages: 0 }, results: [] };
      }
      throw new Error(`Failed to search characters: ${error.message}`);
    }
  }

  // Static method to get random character
  static async getRandom() {
    try {
      // First get total count
      const response = await getCharacters(1);
      const totalCount = response.info.count;

      // Generate random ID
      const randomId = Math.floor(Math.random() * totalCount) + 1;

      return await Character.getById(randomId);
    } catch (error) {
      throw new Error(`Failed to get random character: ${error.message}`);
    }
  }

  // Static method to get characters by status
  static async getByStatus(status, page = 1) {
    return await Character.getAll({ page, status });
  }

  // Static method to get characters by species
  static async getBySpecies(species, page = 1) {
    return await Character.getAll({ page, species });
  }

  // Instance method to get character's episodes
  async getEpisodes() {
    if (!this.episode || this.episode.length === 0) {
      return [];
    }

    try {
      const episodeIds = extractIdsFromUrls(this.episode);
      if (episodeIds.length === 0) return [];

      const episodes = await getMultipleEpisodes(episodeIds);
      return Array.isArray(episodes) ? episodes : [episodes];
    } catch (error) {
      console.error(`Failed to fetch episodes for character ${this.id}:`, error.message);
      return [];
    }
  }

  // Instance method to get character's origin location details
  async getOriginDetails() {
    if (!this.origin?.url) return null;

    try {
      const locationId = extractIdFromUrl(this.origin.url);
      if (!locationId) return null;

      const { getLocationById } = require('../config/api');
      return await getLocationById(locationId);
    } catch (error) {
      console.error(`Failed to fetch origin for character ${this.id}:`, error.message);
      return null;
    }
  }

  // Instance method to get character's current location details
  async getLocationDetails() {
    if (!this.location?.url) return null;

    try {
      const locationId = extractIdFromUrl(this.location.url);
      if (!locationId) return null;

      const { getLocationById } = require('../config/api');
      return await getLocationById(locationId);
    } catch (error) {
      console.error(`Failed to fetch location for character ${this.id}:`, error.message);
      return null;
    }
  }

  // Instance method to get character sheet data
  async getCharacterSheet() {
    try {
      const [episodes, originDetails, locationDetails] = await Promise.allSettled([
        this.getEpisodes(),
        this.getOriginDetails(),
        this.getLocationDetails()
      ]);

      return {
        character: this,
        episodes: episodes.status === 'fulfilled' ? episodes.value : [],
        origin: originDetails.status === 'fulfilled' ? originDetails.value : null,
        currentLocation: locationDetails.status === 'fulfilled' ? locationDetails.value : null,
        stats: {
          episodeCount: this.episode.length,
          firstAppearance: episodes.status === 'fulfilled' && episodes.value.length > 0
            ? episodes.value[0]?.name
            : 'Unknown',
          isAlive: this.status === 'Alive',
          isFromEarth: this.origin?.name?.toLowerCase().includes('earth') || false
        }
      };
    } catch (error) {
      throw new Error(`Failed to generate character sheet: ${error.message}`);
    }
  }

  // Instance method to get character summary
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      species: this.species,
      gender: this.gender,
      origin: this.origin?.name || 'Unknown',
      location: this.location?.name || 'Unknown',
      episodeCount: this.episode.length,
      image: this.image
    };
  }

  // Instance method to check if character is alive
  isAlive() {
    return this.status === 'Alive';
  }

  // Instance method to check if character is human
  isHuman() {
    return this.species.toLowerCase() === 'human';
  }

  // Instance method to check if character is from Earth
  isFromEarth() {
    return this.origin?.name?.toLowerCase().includes('earth') || false;
  }

  // Instance method to get character's first episode
  async getFirstEpisode() {
    if (!this.episode || this.episode.length === 0) return null;

    try {
      const firstEpisodeId = extractIdFromUrl(this.episode[0]);
      if (!firstEpisodeId) return null;

      return await getEpisodeById(firstEpisodeId);
    } catch (error) {
      console.error(`Failed to fetch first episode for character ${this.id}:`, error.message);
      return null;
    }
  }

  // Static method to get character statistics
  static async getStats() {
    try {
      // Get first page to get total count
      const response = await getCharacters(1);
      const totalCharacters = response.info.count;

      // Get sample of characters to analyze
      const sampleSize = Math.min(100, totalCharacters);
      const characters = [];

      for (let i = 1; i <= sampleSize; i++) {
        try {
          const char = await Character.getById(i);
          if (char) characters.push(char);
        } catch (error) {
          // Skip characters that don't exist
          continue;
        }
      }

      // Analyze the sample
      const stats = {
        total: totalCharacters,
        analyzed: characters.length,
        status: {},
        species: {},
        gender: {},
        locations: {}
      };

      characters.forEach(char => {
        // Status stats
        stats.status[char.status] = (stats.status[char.status] || 0) + 1;

        // Species stats
        stats.species[char.species] = (stats.species[char.species] || 0) + 1;

        // Gender stats
        stats.gender[char.gender] = (stats.gender[char.gender] || 0) + 1;

        // Location stats
        if (char.location?.name) {
          stats.locations[char.location.name] = (stats.locations[char.location.name] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to generate character statistics: ${error.message}`);
    }
  }
}

module.exports = Character;
