const axios = require('axios');

// API base URL
const API_BASE = 'http://localhost:3001/api';

// Demo data - same as Module 8 MySQL implementation
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
  console.log('🏥 Checking MySQL API health...');
  const response = await apiCall('GET', '/health');
  console.log('✅ API is healthy:', response.message);
  console.log('💾 Database:', response.database);
  console.log('');
}

async function createUsers() {
  console.log('👥 Creating users...');

  for (const userData of users) {
    try {
      const response = await apiCall('POST', '/users', userData);
      createdUsers.push(response.data);
      console.log(`✅ Created user: ${userData.username} (ID: ${response.data.user_id})`);
    } catch (error) {
      console.log(`⚠️ User ${userData.username} might already exist`);

      // Try to get existing users and find by username
      const allUsers = await apiCall('GET', '/users');
      const existingUser = allUsers.data.find(u => u.username === userData.username);
      if (existingUser) {
        createdUsers.push(existingUser);
        console.log(`📝 Using existing user: ${userData.username} (ID: ${existingUser.user_id})`);
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
      authorId: createdUsers[i].user_id
    };

    try {
      const response = await apiCall('POST', '/posts', postData);
      createdPosts.push(response.data);
      console.log(`✅ Created post: "${posts[i].title}" by ${createdUsers[i].username} (ID: ${response.data.post_id})`);
    } catch (error) {
      console.log(`⚠️ Post "${posts[i].title}" might already exist`);

      // Try to get existing posts
      const allPosts = await apiCall('GET', '/posts');
      const existingPost = allPosts.data.find(p => p.title === posts[i].title);
      if (existingPost) {
        createdPosts.push(existingPost);
        console.log(`📝 Using existing post: "${posts[i].title}" (ID: ${existingPost.post_id})`);
      }
    }
  }
  console.log('');
}

async function addLikes() {
  console.log('❤️ Adding likes to posts...');

  const likeOperations = [
    { postIndex: 0, userIndex: 1 }, // Jane likes John's database post
    { postIndex: 0, userIndex: 2 }, // Mike likes John's database post
    { postIndex: 1, userIndex: 0 }, // John likes Jane's travel post
    { postIndex: 1, userIndex: 2 }, // Mike likes Jane's travel post
    { postIndex: 2, userIndex: 0 }, // John likes Mike's cookie post
    { postIndex: 2, userIndex: 1 }  // Jane likes Mike's cookie post
  ];

  for (const operation of likeOperations) {
    try {
      await apiCall('POST', `/posts/${createdPosts[operation.postIndex].post_id}/like`, {
        userId: createdUsers[operation.userIndex].user_id
      });
      console.log(`✅ ${createdUsers[operation.userIndex].username} liked "${createdPosts[operation.postIndex].title}"`);
    } catch (error) {
      console.log(`⚠️ Like operation failed for ${createdUsers[operation.userIndex].username}`);
    }
  }
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
    try {
      await apiCall('POST', `/posts/${createdPosts[comment.postIndex].post_id}/comments`, {
        userId: createdUsers[comment.userIndex].user_id,
        content: comment.content
      });

      console.log(`✅ ${createdUsers[comment.userIndex].username} commented on "${createdPosts[comment.postIndex].title}"`);
    } catch (error) {
      console.log(`⚠️ Comment failed for ${createdUsers[comment.userIndex].username}`);
    }
  }
  console.log('');
}

async function displayResults() {
  console.log('📊 Demo Results:');
  console.log('================');

  try {
    // Get all posts with engagement stats
    const allPosts = await apiCall('GET', '/posts');
    console.log('\n📝 All Posts:');
    allPosts.data.forEach(post => {
      console.log(`- "${post.title}" by ${post.author_name || post.username}`);
      console.log(`  Likes: ${post.like_count}, Comments: ${post.comment_count}`);
      console.log(`  ID: ${post.post_id}, Author ID: ${post.user_id}`);
    });

    // Get trending posts
    const trending = await apiCall('GET', '/posts/trending?limit=3');
    console.log('\n🔥 Trending Posts:');
    trending.data.forEach((post, index) => {
      console.log(`${index + 1}. "${post.title}" by ${post.author_name || post.username}`);
      console.log(`   Likes: ${post.like_count}, Comments: ${post.comment_count}`);
    });

    // Search functionality
    const searchResults = await apiCall('GET', '/posts/search?q=database');
    console.log('\n🔍 Search Results for "database":');
    searchResults.data.forEach(post => {
      console.log(`- "${post.title}" by ${post.author_name || post.username}`);
    });

    // User statistics
    console.log('\n👤 User Statistics:');
    for (const user of createdUsers) {
      try {
        const stats = await apiCall('GET', `/users/${user.user_id}/stats`);
        console.log(`${user.username}:`);
        console.log(`  Posts: ${stats.data.posts_created}, Likes Given: ${stats.data.likes_given}, Comments: ${stats.data.comments_made}`);
      } catch (error) {
        console.log(`  ${user.username}: Stats unavailable`);
      }
    }

    console.log('\n✅ MySQL Demo completed successfully!');
    console.log('\n📈 MySQL demonstrates excellent performance for:');
    console.log('   • ACID compliance and data integrity');
    console.log('   • Complex JOIN operations');
    console.log('   • Structured relationships with foreign keys');
    console.log('   • SQL-based queries and views');
    console.log('   • Consistent data normalization');

    console.log('\n💡 You can now test the API endpoints manually:');
    console.log('   • GET http://localhost:3001/api/posts');
    console.log('   • GET http://localhost:3001/api/users');
    console.log('   • GET http://localhost:3001/api/posts/trending');
    console.log('   • GET http://localhost:3001/api/posts/search?q=travel');

  } catch (error) {
    console.error('Error displaying results:', error.message);
  }
}

// Main demo function
async function runDemo() {
  try {
    console.log('🚀 Starting MySQL Blog API Demo');
    console.log('==================================\n');

    await checkAPIHealth();
    await createUsers();
    await createPosts();
    await addLikes();
    await addComments();
    await displayResults();

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   • MySQL server is running');
    console.log('   • Database "blogging_app" exists');
    console.log('   • Tables are created (run mysql_blog.sql)');
    console.log('   • API server is running: npm run dev');
  }
}

// Run the demo
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };
