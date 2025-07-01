const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.static('.'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from each exercise directory
app.use('/calculator_mvc', express.static(path.join(__dirname, 'calculator_mvc')));
app.use('/mysql_blog_implementation', express.static(path.join(__dirname, 'mysql_blog_implementation')));
app.use('/mongodb_blog_implementation', express.static(path.join(__dirname, 'mongodb_blog_implementation')));
app.use('/rickandmorty_app', express.static(path.join(__dirname, 'rickandmorty_app')));
app.use('/chat_app', express.static(path.join(__dirname, 'chat_app')));

// Main portfolio route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Portfolio route (alternative)
app.get('/portfolio', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Exercise-specific routes
app.get('/calculator', (req, res) => {
    const calculatorPath = path.join(__dirname, 'calculator_mvc', 'index.html');
    if (fs.existsSync(calculatorPath)) {
        res.sendFile(calculatorPath);
    } else {
        const viewsPath = path.join(__dirname, 'calculator_mvc', 'views', 'calculator.html');
        if (fs.existsSync(viewsPath)) {
            res.sendFile(viewsPath);
        } else {
            res.status(404).send(`
                <h1>Calculator MVC Exercise</h1>
                <p>Calculator exercise files not found in calculator_mvc directory.</p>
                <a href="/">← Back to Portfolio</a>
            `);
        }
    }
});

app.get('/mysql-blog', (req, res) => {
    const indexPath = path.join(__dirname, 'mysql_blog_implementation', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <h1>MySQL Blog Exercise</h1>
            <p>MySQL blog exercise files not found.</p>
            <a href="/">← Back to Portfolio</a>
        `);
    }
});

app.get('/mongodb-blog', (req, res) => {
    const indexPath = path.join(__dirname, 'mongodb_blog_implementation', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <h1>MongoDB Blog Exercise</h1>
            <p>MongoDB blog exercise files not found.</p>
            <a href="/">← Back to Portfolio</a>
        `);
    }
});

app.get('/rickandmorty', (req, res) => {
    const rickMortyPath = path.join(__dirname, 'rickandmorty_app', 'index.html');
    if (fs.existsSync(rickMortyPath)) {
        res.sendFile(rickMortyPath);
    } else {
        res.status(404).send(`
            <h1>Rick & Morty API Exercise</h1>
            <p>Rick & Morty app files not found in rickandmorty_app directory.</p>
            <a href="/">← Back to Portfolio</a>
        `);
    }
});

// Chat app proxy route (since it runs on port 3000)
app.get('/chat', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Enhanced Chat Application</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                .container { text-align: center; background: #f8f9fa; padding: 40px; border-radius: 15px; }
                .chat-icon { font-size: 4em; margin-bottom: 20px; }
                h1 { color: #2c3e50; margin-bottom: 15px; }
                p { color: #666; margin-bottom: 25px; line-height: 1.6; }
                .instructions { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left; }
                .command { background: #2c3e50; color: white; padding: 3px 8px; border-radius: 4px; font-family: monospace; }
                .btn { display: inline-block; background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; margin: 10px; }
                .btn:hover { background: #2980b9; }
                .btn-secondary { background: #95a5a6; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="chat-icon">💬</div>
                <h1>Enhanced Chat Application</h1>
                <p>The chat application runs on its own server (port 3000) with Socket.IO for real-time communication.</p>

                <div class="instructions">
                    <h3>🚀 To start the chat application:</h3>
                    <ol>
                        <li>Open a new terminal window</li>
                        <li>Navigate to chat directory: <span class="command">cd IOD/Module9Lab/chat_app</span></li>
                        <li>Install dependencies: <span class="command">npm install</span></li>
                        <li>Start the server: <span class="command">npm start</span></li>
                        <li>Open <strong>http://localhost:3000</strong> in your browser</li>
                    </ol>
                </div>

                <h3>✨ Chat Features:</h3>
                <ul style="text-align: left; display: inline-block;">
                    <li>Real-time messaging with Socket.IO</li>
                    <li>Message reactions & emoji support</li>
                    <li>Private messaging system</li>
                    <li>User avatars & status indicators</li>
                    <li>Dark/Light theme toggle</li>
                    <li>Message search & history (SQLite)</li>
                    <li>Interactive chat bot with commands</li>
                </ul>

                <div>
                    <a href="http://localhost:3000" class="btn" target="_blank">🚀 Launch Chat (if running)</a>
                    <a href="/chat_app" class="btn btn-secondary">📁 View Source Code</a>
                    <a href="/" class="btn btn-secondary">← Back to Portfolio</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// API endpoint to check exercise status
app.get('/api/exercises', (req, res) => {
    const exercises = [
        {
            id: 'calculator_mvc',
            name: 'Calculator MVC',
            status: fs.existsSync(path.join(__dirname, 'calculator_mvc')) ? 'available' : 'missing',
            path: '/calculator'
        },
        {
            id: 'mysql_blog',
            name: 'MySQL Blog',
            status: fs.existsSync(path.join(__dirname, 'mysql_blog_implementation')) ? 'available' : 'missing',
            path: '/mysql-blog'
        },
        {
            id: 'mongodb_blog',
            name: 'MongoDB Blog',
            status: fs.existsSync(path.join(__dirname, 'mongodb_blog_implementation')) ? 'available' : 'missing',
            path: '/mongodb-blog'
        },
        {
            id: 'rickandmorty_app',
            name: 'Rick & Morty App',
            status: fs.existsSync(path.join(__dirname, 'rickandmorty_app')) ? 'available' : 'missing',
            path: '/rickandmorty'
        },
        {
            id: 'chat_app',
            name: 'Enhanced Chat App',
            status: fs.existsSync(path.join(__dirname, 'chat_app')) ? 'available' : 'missing',
            path: '/chat',
            note: 'Runs on separate server (port 3000)'
        }
    ];

    res.json(exercises);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        port: PORT,
        exercises: {
            calculator: fs.existsSync(path.join(__dirname, 'calculator_mvc')),
            mysql_blog: fs.existsSync(path.join(__dirname, 'mysql_blog_implementation')),
            mongodb_blog: fs.existsSync(path.join(__dirname, 'mongodb_blog_implementation')),
            rickandmorty: fs.existsSync(path.join(__dirname, 'rickandmorty_app')),
            chat: fs.existsSync(path.join(__dirname, 'chat_app'))
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Page Not Found</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; text-align: center; margin-top: 100px; }
                .error-container { max-width: 500px; margin: 0 auto; }
                h1 { color: #e74c3c; font-size: 3em; margin-bottom: 20px; }
                p { color: #666; margin-bottom: 30px; }
                .btn { background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>404</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" class="btn">← Back to Portfolio</a>
            </div>
        </body>
        </html>
    `);
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Server Error</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; text-align: center; margin-top: 100px; }
                .error-container { max-width: 500px; margin: 0 auto; }
                h1 { color: #e74c3c; font-size: 3em; margin-bottom: 20px; }
                p { color: #666; margin-bottom: 30px; }
                .btn { background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; }
            </style>
        </head>
        <body>
            <div class="error-container">
                <h1>500</h1>
                <p>Something went wrong on our end.</p>
                <a href="/" class="btn">← Back to Portfolio</a>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 Module 9 Lab Portfolio Server Started!

📍 Portfolio URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
🔧 API Status: http://localhost:${PORT}/api/exercises

📂 Available Routes:
   / ..................... Main Portfolio
   /calculator ........... Calculator MVC Exercise
   /mysql-blog ........... MySQL Blog Exercise
   /mongodb-blog ......... MongoDB Blog Exercise
   /rickandmorty ......... Rick & Morty API Exercise
   /chat ................. Enhanced Chat Application Info

💡 Note: The Enhanced Chat App runs on port 3000 separately.
   Start it with: cd chat_app && npm start

🎯 Access all exercises from the main portfolio page!
    `);
});

module.exports = app;
