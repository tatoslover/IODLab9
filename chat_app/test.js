const http = require('http');

// Test if the server starts without errors
console.log('Testing Enhanced Chat Application...');

// Test 1: Check if index.js can be required without syntax errors
try {
    console.log('✓ Testing server file syntax...');
    require('./index.js');
    console.log('✗ Server started (should not start in test mode)');
    process.exit(1);
} catch (error) {
    if (error.code === 'EADDRINUSE') {
        console.log('✓ Server file is valid (port conflict expected in test)');
    } else {
        console.log('✗ Server file has errors:', error.message);
        process.exit(1);
    }
}

// Test 2: Check if required files exist
const fs = require('fs');
const requiredFiles = [
    './index.html',
    './public/chat.js',
    './package.json'
];

console.log('✓ Testing required files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✓ ${file} exists`);
    } else {
        console.log(`  ✗ ${file} missing`);
        process.exit(1);
    }
});

// Test 3: Validate package.json dependencies
console.log('✓ Testing dependencies...');
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const requiredDeps = ['express', 'socket.io', 'sqlite3', 'sqlite'];

requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
        console.log(`  ✓ ${dep} dependency found`);
    } else {
        console.log(`  ✗ ${dep} dependency missing`);
        process.exit(1);
    }
});

// Test 4: Check if HTML file has required elements
console.log('✓ Testing HTML structure...');
const htmlContent = fs.readFileSync('./index.html', 'utf8');
const requiredElements = [
    'profileModal',
    'chatContainer',
    'messages',
    'onlineUsers',
    'emojiModal'
];

requiredElements.forEach(element => {
    if (htmlContent.includes(`id="${element}"`)) {
        console.log(`  ✓ ${element} element found`);
    } else {
        console.log(`  ✗ ${element} element missing`);
        process.exit(1);
    }
});

// Test 5: Check JavaScript file structure
console.log('✓ Testing JavaScript functionality...');
const jsContent = fs.readFileSync('./public/chat.js', 'utf8');
const requiredFunctions = [
    'joinChat',
    'toggleTheme',
    'addMessage',
    'setupSocketListeners'
];

requiredFunctions.forEach(func => {
    if (jsContent.includes(`function ${func}`) || jsContent.includes(`${func} =`)) {
        console.log(`  ✓ ${func} function found`);
    } else {
        console.log(`  ✗ ${func} function missing`);
        process.exit(1);
    }
});

console.log('\n🎉 All tests passed! The Enhanced Chat Application is ready to run.');
console.log('\nTo start the application:');
console.log('  npm start');
console.log('\nThen open http://localhost:3000 in your browser');
console.log('\nFeatures to test:');
console.log('  🌙 Dark/light theme toggle');
console.log('  💬 Private messaging');
console.log('  👤 User avatars and profiles');
console.log('  🟢 User status indicators');
console.log('  🔍 Message history and search');
console.log('  🤖 Chat bot commands (/help, /joke, /weather, etc.)');
