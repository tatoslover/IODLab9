const axios = require('axios');

// API base URL
const API_BASE = 'http://localhost:3000/api';

// Demo data
const users = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    passwordHash: '$2y$10$examplehash1',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Tech enthusiast and blogger'
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    passwordHash: '$2y$10$examplehash2',
    firstName: 'Jane',
    lastName: 'Doe',
    bio: 'Travel blogger and photographer'
  },
  {
    username: 'mikejohnson',
    email: 'mike@example.com',
    passwordHash: '$2y$10$examplehash3',
    firstName: 'Mike',
    lastName: 'Johnson',
    bio: 'Food lover and recipe writer'
  }
];

const posts = [
  {
    title: 'Getting Started with Database Design',
    description: 'A comprehensive guide to designing efficient databases for modern applications.',
    imageUrl: 'https://example.com/images/database-design.jpg'
  },
  {
    title: 'My Journey Through Southeast Asia',
    description: 'Amazing experiences and hidden gems discovered during my 3-month backpacking trip.',
    imageUrl: 'https://example.com/images/travel.jpg'
  },
  {
    title: 'The Perfect Chocolate Chip Cookie Recipe',
    description: 'After 50 attempts, I finally found the secret to the perfect cookie.',
    imageUrl: 'https://example.com/images/cookies.jpg'
  }
];

let createdUsers = [];
let createdPosts = [];

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
  console.log('🏥 Checking API health...');
  const response = await apiCall('GET', '/health');
  console.log('✅ API is healthy:', response.message);
  console.log('');
}

async function createUsers() {
  console.log('👥 Creating users...');

  for (const userData of users) {
    try {
      const response = await apiCall('POST', '/users', userData);
      createdUsers.push(response.data);
      console.log(`✅ Created user: ${userData.username}`);
    } catch (error) {
      console.log(`⚠️ User ${userData.username} might already exist`);

      // Try to get existing users
      const allUsers = await apiCall('GET', '/users');
      const existingUser = allUsers.data.find(u => u.username === userData.username);
      if (existingUser) {
        createdUsers.push(existingUser);
      }
    }
  }
  console.log('');
}

async function createPosts() {
  console.log('📝 Creating posts...');

  for (let i = 0; i < posts.length; i++) {
    const postData = {
      ...posts[i],
      authorId: createdUsers[i]._id
    };

    const response = await apiCall('POST', '/posts', postData);
    createdPosts.push(response.data);
    console.log(`✅ Created post: "${posts[i].title}" by ${createdUsers[i].username}`);
  }
  console.log('');
}

async function addLikes() {
  console.log('❤️ Adding likes to posts...');

  // User 1 likes posts by users 2 and 3
  await apiCall('POST', `/posts/${createdPosts[1]._id}/like`, { userId: createdUsers[0]._id });
  await apiCall('POST', `/posts/${createdPosts[2]._id}/like`, { userId: createdUsers[0]._id });

  // User 2 likes posts by users 1 and 3
  await apiCall('POST', `/posts/${createdPosts[0]._id}/like`, { userId: createdUsers[1]._id });
  await apiCall('POST', `/posts/${createdPosts[2]._id}/like`, { userId: createdUsers[1]._id });

  // User 3 likes posts by users 1 and 2
  await apiCall('POST', `/posts/${createdPosts[0]._id}/like`, { userId: createdUsers[2]._id });
  await apiCall('POST', `/posts/${createdPosts[1]._id}/like`, { userId: createdUsers[2]._id });

  console.log('✅ Added likes to all posts');
  console.log('');
}

async function addComments() {
  console.log('💬 Adding comments to posts...');

  const comments = [
    {
      postIndex: 0,
      userIndex: 1,
      content: 'Great article! Really helped me understand database design better.'
    },
    {
      postIndex: 0,
      userIndex: 2,
      content: 'Thanks for sharing. Could you do a follow-up on indexing strategies?'
    },
    {
      postIndex: 1,
      userIndex: 0,
      content: 'Your photos are incredible! Southeast Asia is definitely on my bucket list now.'
    },
    {
      postIndex: 2,
      userIndex: 0,
      content: 'Just tried this recipe and it worked perfectly! Thanks for sharing.'
    }
  ];

  for (const comment of comments) {
    await apiCall('POST', `/posts/${createdPosts[comment.postIndex]._id}/comments`, {
      userId: createdUsers[comment.userIndex]._id,
      content: comment.content
    });

    console.log(`✅ ${createdUsers[comment.userIndex].username} commented on "${createdPosts[comment.postIndex].title}"`);
  }
  console.log('');
}

async function displayResults() {
  console.log('📊 Demo Results:');
  console.log('================');

  // Get all posts with engagement stats
  const allPosts = await apiCall('GET', '/posts');
  console.log('\n📝 All Posts:');
  allPosts.data.forEach(post => {
    console.log(`- "${post.title}" by ${post.author.displayName}`);
    console.log(`  Likes: ${post.stats.likeCount}, Comments: ${post.stats.commentCount}, Views: ${post.stats.viewCount}`);
  });

  // Get trending posts
  const trending = await apiCall('GET', '/posts/trending?limit=3');
  console.log('\n🔥 Trending Posts:');
  trending.data.forEach((post, index) => {
    console.log(`${index + 1}. "${post.title}" by ${post.author.displayName}`);
    console.log(`   Engagement Score: ${Math.round(post.engagementScore)}`);
  });

  // Search functionality
  const searchResults = await apiCall('GET', '/posts/search?q=database');
  console.log('\n🔍 Search Results for "database":');
  searchResults.data.forEach(post => {
    console.log(`- "${post.title}" by ${post.author.displayName}`);
  });

  // User statistics
  console.log('\n👤 Users:');
  createdUsers.forEach(user => {
    console.log(`- ${user.username} (${user.profile.firstName} ${user.profile.lastName})`);
    console.log(`  Bio: ${user.profile.bio}`);
  });

  console.log('\n✅ Demo completed successfully!');
  console.log('\n💡 You can now test the API endpoints manually:');
  console.log('   • GET http://localhost:3000/api/posts');
  console.log('   • GET http://localhost:3000/api/users');
  console.log('   • GET http://localhost:3000/api/posts/trending');
  console.log('   • GET http://localhost:3000/api/posts/search?q=travel');
}

// Main demo function
async function runDemo() {
  try {
    console.log('🚀 Starting MongoDB Blog API Demo');
    console.log('=====================================\n');

    await checkAPIHealth();
    await createUsers();
    await createPosts();
    await addLikes();
    await addComments();
    await displayResults();

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
  }
}

// Run the demo
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };
