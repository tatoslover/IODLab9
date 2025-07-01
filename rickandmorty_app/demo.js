const axios = require('axios');

// API base URL
const API_BASE = 'http://localhost:3002/api';

// Helper function to make API calls
async function apiCall(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: { 'Content-Type': 'application/json' }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error with ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Demo functions
async function checkAPIHealth() {
  console.log('🏥 Checking Rick and Morty API health...');
  const response = await apiCall('GET', '/health');
  console.log('✅ API is healthy:', response.message);
  console.log('🎭 Third-party API status:', response.thirdPartyAPI.status);
  console.log('');
}

async function demonstrateCharacterEndpoints() {
  console.log('👥 Demonstrating Character Endpoints:');
  console.log('=====================================');

  // Get all characters (first page)
  console.log('\n1. Getting first page of characters...');
  const allCharacters = await apiCall('GET', '/characters?page=1&limit=5');
  console.log(`Found ${allCharacters.data.info.count} total characters`);
  allCharacters.data.characters.forEach(char => {
    console.log(`- ${char.name} (${char.species}, ${char.status})`);
  });

  // Get Rick Sanchez (character 1)
  console.log('\n2. Getting Rick Sanchez details...');
  const rick = await apiCall('GET', '/characters/1');
  console.log(`Character: ${rick.data.name}`);
  console.log(`Status: ${rick.data.status}, Species: ${rick.data.species}`);
  console.log(`Episodes: ${rick.data.episode.length}`);

  // Search for Morty characters
  console.log('\n3. Searching for "Morty" characters...');
  const mortySearch = await apiCall('GET', '/characters/search?q=morty&page=1');
  console.log(`Found ${mortySearch.data.info.count} Morty characters`);
  mortySearch.data.characters.slice(0, 3).forEach(char => {
    console.log(`- ${char.name} (${char.species})`);
  });

  // Get alive characters
  console.log('\n4. Getting alive characters...');
  const aliveCharacters = await apiCall('GET', '/characters/status/alive?page=1');
  console.log(`Found ${aliveCharacters.data.info.count} alive characters`);
  console.log(`Showing first 3:`);
  aliveCharacters.data.characters.slice(0, 3).forEach(char => {
    console.log(`- ${char.name} (${char.species})`);
  });

  // Get human characters
  console.log('\n5. Getting human characters...');
  const humanCharacters = await apiCall('GET', '/characters/species/human?page=1');
  console.log(`Found ${humanCharacters.data.info.count} human characters`);
  console.log(`Showing first 3:`);
  humanCharacters.data.characters.slice(0, 3).forEach(char => {
    console.log(`- ${char.name} (${char.status})`);
  });

  // Get random character
  console.log('\n6. Getting a random character...');
  const randomChar = await apiCall('GET', '/characters/random');
  console.log(`Random character: ${randomChar.data.name} (${randomChar.data.species})`);

  // Get character episodes
  console.log('\n7. Getting Rick\'s episodes...');
  const rickEpisodes = await apiCall('GET', '/characters/1/episodes');
  console.log(`Rick appears in ${rickEpisodes.data.episodeCount} episodes`);
  if (rickEpisodes.data.episodes.length > 0) {
    console.log(`First episode: ${rickEpisodes.data.episodes[0].name}`);
  }

  // Compare two characters
  console.log('\n8. Comparing Rick and Morty...');
  const comparison = await apiCall('GET', '/characters/compare/1/2');
  console.log(`Comparing ${comparison.data.character1.name} vs ${comparison.data.character2.name}:`);
  console.log(`Similarities: ${comparison.data.similarities.join(', ') || 'None'}`);
  console.log(`Differences: ${comparison.data.differences.slice(0, 2).join(', ')}`);

  console.log('');
}

async function demonstrateFavoriteEndpoints() {
  console.log('❤️ Demonstrating Favorite Endpoints:');
  console.log('=====================================');

  // Add Rick to favorites
  console.log('\n1. Adding Rick Sanchez to favorites...');
  try {
    const addRick = await apiCall('POST', '/favorites', { characterId: 1 });
    console.log(`✅ Added ${addRick.data.characterName} to favorites`);
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('⚠️ Rick is already in favorites');
    } else {
      throw error;
    }
  }

  // Add Morty to favorites
  console.log('\n2. Adding Morty Smith to favorites...');
  try {
    const addMorty = await apiCall('POST', '/favorites', { characterId: 2 });
    console.log(`✅ Added ${addMorty.data.characterName} to favorites`);
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('⚠️ Morty is already in favorites');
    } else {
      throw error;
    }
  }

  // Add Summer to favorites
  console.log('\n3. Adding Summer Smith to favorites...');
  try {
    const addSummer = await apiCall('POST', '/favorites', { characterId: 3 });
    console.log(`✅ Added ${addSummer.data.characterName} to favorites`);
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('⚠️ Summer is already in favorites');
    } else {
      throw error;
    }
  }

  // Get all favorites
  console.log('\n4. Getting all favorites...');
  const allFavorites = await apiCall('GET', '/favorites');
  console.log(`You have ${allFavorites.count} favorite characters:`);
  allFavorites.data.forEach(fav => {
    console.log(`- ${fav.characterName} (ID: ${fav.characterId}, Added: ${new Date(fav.dateAdded).toLocaleDateString()})`);
  });

  // Check if character is favorited
  console.log('\n5. Checking if Rick is favorited...');
  const checkRick = await apiCall('GET', '/favorites/check/1');
  console.log(`Is Rick favorited? ${checkRick.data.isFavorited ? 'Yes' : 'No'}`);

  // Update favorite notes
  if (allFavorites.count > 0) {
    const firstFavorite = allFavorites.data[0];
    console.log(`\n6. Adding notes to ${firstFavorite.characterName}...`);
    const updateNotes = await apiCall('PUT', `/favorites/${firstFavorite.id}/notes`, {
      notes: 'The smartest man in the universe! A brilliant but reckless scientist.'
    });
    console.log(`✅ Updated notes for ${firstFavorite.characterName}`);
  }

  // Get favorite character sheet
  if (allFavorites.count > 0) {
    const firstFavorite = allFavorites.data[0];
    console.log(`\n7. Generating character sheet for ${firstFavorite.characterName}...`);
    const characterSheet = await apiCall('GET', `/favorites/${firstFavorite.id}/sheet`);
    const sheet = characterSheet.data.characterSheet;
    console.log(`Character: ${sheet.character.name}`);
    console.log(`Episodes: ${sheet.stats.episodeCount}`);
    console.log(`Origin: ${sheet.character.origin?.name || 'Unknown'}`);
    console.log(`First appearance: ${sheet.stats.firstAppearance}`);
  }

  // Get favorites statistics
  console.log('\n8. Getting favorites statistics...');
  const favStats = await apiCall('GET', '/favorites/stats');
  console.log(`Total favorites: ${favStats.data.total}`);
  if (favStats.data.total > 0) {
    console.log(`Oldest favorite: ${new Date(favStats.data.oldest).toLocaleDateString()}`);
    console.log(`Newest favorite: ${new Date(favStats.data.newest).toLocaleDateString()}`);
  }

  console.log('');
}

async function demonstrateAdvancedFeatures() {
  console.log('🔬 Demonstrating Advanced Features:');
  console.log('====================================');

  // Get multiple characters
  console.log('\n1. Getting multiple characters at once...');
  const multipleChars = await apiCall('POST', '/characters/multiple', {
    ids: [1, 2, 3, 4, 5]
  });
  console.log(`Requested 5 characters, found ${multipleChars.data.found}:`);
  multipleChars.data.characters.forEach(char => {
    console.log(`- ${char.name} (${char.species})`);
  });

  // Get character statistics
  console.log('\n2. Getting character statistics...');
  const charStats = await apiCall('GET', '/characters/stats');
  console.log(`Total characters analyzed: ${charStats.data.analyzed} of ${charStats.data.total}`);
  console.log('Status distribution:', Object.entries(charStats.data.status));
  console.log('Top species:', Object.entries(charStats.data.species).slice(0, 3));

  // Get cache statistics
  console.log('\n3. Getting cache statistics...');
  const cacheStats = await apiCall('GET', '/characters/cache');
  console.log(`Cache keys: ${cacheStats.data.cache.keys}`);
  console.log(`Cache hits: ${cacheStats.data.cache.hits}`);
  console.log(`Cache misses: ${cacheStats.data.cache.misses}`);

  // Demonstrate filtering with multiple parameters
  console.log('\n4. Advanced filtering - Alive human females...');
  const filtered = await apiCall('GET', '/characters?status=alive&species=human&gender=female&page=1');
  console.log(`Found ${filtered.data.info.count} alive human females`);
  if (filtered.data.characters.length > 0) {
    filtered.data.characters.slice(0, 3).forEach(char => {
      console.log(`- ${char.name} (${char.origin})`);
    });
  }

  console.log('');
}

async function displaySummary() {
  console.log('📊 Demo Summary:');
  console.log('================');

  try {
    // Get totals
    const allChars = await apiCall('GET', '/characters?page=1');
    const allFavorites = await apiCall('GET', '/favorites');
    const health = await apiCall('GET', '/health');

    console.log(`✅ Rick and Morty API Integration Demo Completed!`);
    console.log(`🎭 Third-party API: ${health.thirdPartyAPI.name} (${health.thirdPartyAPI.status})`);
    console.log(`👥 Total characters available: ${allChars.data.info.count}`);
    console.log(`❤️ Your favorite characters: ${allFavorites.count}`);

    console.log('\n🚀 Features Demonstrated:');
    console.log('   • Third-party API integration (Rick and Morty API)');
    console.log('   • Query parameters (pagination, filtering, search)');
    console.log('   • Path parameters (character IDs, status, species)');
    console.log('   • Local data storage (favorites with JSON files)');
    console.log('   • API caching for performance');
    console.log('   • Character comparison and analytics');
    console.log('   • Character sheets with detailed information');

    console.log('\n💡 You can now test the API endpoints manually:');
    console.log('   • GET http://localhost:3002/api/characters?page=1&status=alive');
    console.log('   • GET http://localhost:3002/api/characters/search?q=rick');
    console.log('   • GET http://localhost:3002/api/characters/1/episodes');
    console.log('   • POST http://localhost:3002/api/favorites (body: {"characterId": 5})');
    console.log('   • GET http://localhost:3002/api/favorites/check/1');

  } catch (error) {
    console.error('Error getting summary data:', error.message);
  }
}

// Main demo function
async function runDemo() {
  try {
    console.log('🚀 Starting Rick and Morty API Explorer Demo');
    console.log('===============================================\n');

    await checkAPIHealth();
    await demonstrateCharacterEndpoints();
    await demonstrateFavoriteEndpoints();
    await demonstrateAdvancedFeatures();
    await displaySummary();

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   • Server is running: npm run dev');
    console.log('   • Rick and Morty API is accessible');
    console.log('   • Network connection is available');
  }
}

// Run the demo
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };
