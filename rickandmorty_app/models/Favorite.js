const fs = require('fs').promises;
const path = require('path');

const FAVORITES_FILE = path.join(__dirname, '../data/favorites.json');

class Favorite {
  constructor(favoriteData) {
    this.id = favoriteData.id;
    this.characterId = favoriteData.characterId;
    this.characterName = favoriteData.characterName;
    this.characterImage = favoriteData.characterImage;
    this.dateAdded = favoriteData.dateAdded || new Date().toISOString();
    this.notes = favoriteData.notes || '';
  }

  // Ensure data directory and file exist
  static async ensureDataFile() {
    try {
      const dataDir = path.dirname(FAVORITES_FILE);
      await fs.mkdir(dataDir, { recursive: true });

      try {
        await fs.access(FAVORITES_FILE);
      } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(FAVORITES_FILE, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('Error ensuring data file:', error.message);
      throw error;
    }
  }

  // Read favorites from file
  static async readFavorites() {
    try {
      await Favorite.ensureDataFile();
      const data = await fs.readFile(FAVORITES_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading favorites:', error.message);
      return [];
    }
  }

  // Write favorites to file
  static async writeFavorites(favorites) {
    try {
      await Favorite.ensureDataFile();
      await fs.writeFile(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
    } catch (error) {
      console.error('Error writing favorites:', error.message);
      throw error;
    }
  }

  // Get all favorites
  static async getAll() {
    try {
      const favoritesData = await Favorite.readFavorites();
      return favoritesData.map(fav => new Favorite(fav));
    } catch (error) {
      throw new Error(`Failed to get favorites: ${error.message}`);
    }
  }

  // Get favorite by ID
  static async getById(id) {
    try {
      const favorites = await Favorite.readFavorites();
      const favorite = favorites.find(fav => fav.id === parseInt(id));
      return favorite ? new Favorite(favorite) : null;
    } catch (error) {
      throw new Error(`Failed to get favorite ${id}: ${error.message}`);
    }
  }

  // Check if character is already favorited
  static async isFavorited(characterId) {
    try {
      const favorites = await Favorite.readFavorites();
      return favorites.some(fav => fav.characterId === parseInt(characterId));
    } catch (error) {
      return false;
    }
  }

  // Add character to favorites
  static async add(characterData) {
    try {
      const { id: characterId, name, image } = characterData;

      // Check if already favorited
      const isAlreadyFavorited = await Favorite.isFavorited(characterId);
      if (isAlreadyFavorited) {
        throw new Error('Character is already in favorites');
      }

      const favorites = await Favorite.readFavorites();

      // Generate new ID
      const newId = favorites.length > 0
        ? Math.max(...favorites.map(fav => fav.id)) + 1
        : 1;

      const newFavorite = new Favorite({
        id: newId,
        characterId: parseInt(characterId),
        characterName: name,
        characterImage: image,
        dateAdded: new Date().toISOString()
      });

      favorites.push(newFavorite);
      await Favorite.writeFavorites(favorites);

      return newFavorite;
    } catch (error) {
      throw new Error(`Failed to add favorite: ${error.message}`);
    }
  }

  // Remove favorite by character ID
  static async removeByCharacterId(characterId) {
    try {
      const favorites = await Favorite.readFavorites();
      const initialLength = favorites.length;

      const updatedFavorites = favorites.filter(
        fav => fav.characterId !== parseInt(characterId)
      );

      if (updatedFavorites.length === initialLength) {
        return false; // Nothing was removed
      }

      await Favorite.writeFavorites(updatedFavorites);
      return true;
    } catch (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }
  }

  // Remove favorite by favorite ID
  static async removeById(id) {
    try {
      const favorites = await Favorite.readFavorites();
      const initialLength = favorites.length;

      const updatedFavorites = favorites.filter(fav => fav.id !== parseInt(id));

      if (updatedFavorites.length === initialLength) {
        return false; // Nothing was removed
      }

      await Favorite.writeFavorites(updatedFavorites);
      return true;
    } catch (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }
  }

  // Update favorite notes
  static async updateNotes(id, notes) {
    try {
      const favorites = await Favorite.readFavorites();
      const favoriteIndex = favorites.findIndex(fav => fav.id === parseInt(id));

      if (favoriteIndex === -1) {
        throw new Error('Favorite not found');
      }

      favorites[favoriteIndex].notes = notes;
      await Favorite.writeFavorites(favorites);

      return new Favorite(favorites[favoriteIndex]);
    } catch (error) {
      throw new Error(`Failed to update favorite notes: ${error.message}`);
    }
  }

  // Get favorites count
  static async getCount() {
    try {
      const favorites = await Favorite.readFavorites();
      return favorites.length;
    } catch (error) {
      return 0;
    }
  }

  // Get favorites by date range
  static async getByDateRange(startDate, endDate) {
    try {
      const favorites = await Favorite.readFavorites();
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filtered = favorites.filter(fav => {
        const date = new Date(fav.dateAdded);
        return date >= start && date <= end;
      });

      return filtered.map(fav => new Favorite(fav));
    } catch (error) {
      throw new Error(`Failed to get favorites by date range: ${error.message}`);
    }
  }

  // Get recent favorites
  static async getRecent(limit = 10) {
    try {
      const favorites = await Favorite.readFavorites();
      const sorted = favorites
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, limit);

      return sorted.map(fav => new Favorite(fav));
    } catch (error) {
      throw new Error(`Failed to get recent favorites: ${error.message}`);
    }
  }

  // Clear all favorites
  static async clear() {
    try {
      await Favorite.writeFavorites([]);
      return true;
    } catch (error) {
      throw new Error(`Failed to clear favorites: ${error.message}`);
    }
  }

  // Get favorites statistics
  static async getStats() {
    try {
      const favorites = await Favorite.readFavorites();

      if (favorites.length === 0) {
        return {
          total: 0,
          oldest: null,
          newest: null,
          withNotes: 0
        };
      }

      const dates = favorites.map(fav => new Date(fav.dateAdded));
      const withNotes = favorites.filter(fav => fav.notes && fav.notes.trim().length > 0);

      return {
        total: favorites.length,
        oldest: new Date(Math.min(...dates)).toISOString(),
        newest: new Date(Math.max(...dates)).toISOString(),
        withNotes: withNotes.length
      };
    } catch (error) {
      throw new Error(`Failed to get favorites statistics: ${error.message}`);
    }
  }

  // Instance method to update notes
  async updateNotes(notes) {
    return await Favorite.updateNotes(this.id, notes);
  }

  // Instance method to remove this favorite
  async remove() {
    return await Favorite.removeById(this.id);
  }

  // Instance method to get summary
  getSummary() {
    return {
      id: this.id,
      characterId: this.characterId,
      characterName: this.characterName,
      characterImage: this.characterImage,
      dateAdded: this.dateAdded,
      hasNotes: !!(this.notes && this.notes.trim().length > 0)
    };
  }
}

module.exports = Favorite;
