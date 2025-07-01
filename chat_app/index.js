const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize SQLite database
const db = new sqlite3.Database('./chat.db');

// Create tables if they don't exist
db.serialize(() => {
  // Messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT,
    sender_nickname TEXT,
    content TEXT,
    room TEXT DEFAULT 'general',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    message_type TEXT DEFAULT 'message'
  )`);



  // Users table for profiles
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    nickname TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'online',
    status_message TEXT,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Store connected users
const connectedUsers = new Map();
const userRooms = new Map(); // Track which room each user is in

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Bot responses
const botResponses = {
  '/help': 'Available commands:\n/help - Show this help\n/time - Current time\n/weather - Random weather\n/joke - Random joke\n/quote - Inspirational quote',
  '/time': () => `Current time: ${new Date().toLocaleString()}`,
  '/weather': () => {
    const weather = ['☀️ Sunny', '🌧️ Rainy', '⛅ Cloudy', '🌨️ Snowy', '🌈 Rainbow after rain'];
    return `Weather: ${weather[Math.floor(Math.random() * weather.length)]}`;
  },
  '/joke': () => {
    const jokes = [
      'Why don\'t scientists trust atoms? Because they make up everything!',
      'Why did the scarecrow win an award? He was outstanding in his field!',
      'Why don\'t eggs tell jokes? They\'d crack each other up!',
      'What do you call a fake noodle? An impasta!',
      'Why did the math book look so sad? Because it was full of problems!'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },
  '/quote': () => {
    const quotes = [
      '"The only way to do great work is to love what you do." - Steve Jobs',
      '"Innovation distinguishes between a leader and a follower." - Steve Jobs',
      '"Life is what happens to you while you\'re busy making other plans." - John Lennon',
      '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
      '"It is during our darkest moments that we must focus to see the light." - Aristotle'
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining with profile
  socket.on('user joined', (userData) => {
    const user = {
      id: socket.id,
      nickname: userData.nickname,
      avatar: userData.avatar || '👤',
      status: 'online',
      statusMessage: userData.statusMessage || '',
      room: 'general',
      isTyping: false
    };

    // Store user info
    connectedUsers.set(socket.id, user);
    userRooms.set(socket.id, 'general');

    // Join general room by default
    socket.join('general');

    // Save/update user in database
    db.run(`INSERT OR REPLACE INTO users (id, nickname, avatar, status, status_message)
            VALUES (?, ?, ?, ?, ?)`,
      [socket.id, user.nickname, user.avatar, user.status, user.statusMessage]);

    // Broadcast to all other users that someone joined
    socket.broadcast.to('general').emit('user connected', {
      nickname: user.nickname,
      avatar: user.avatar,
      message: `${user.nickname} joined the chat`
    });

    // Send message history to the new user
    loadMessageHistory('general', (messages) => {
      socket.emit('message history', messages);
    });

    // Send current online users to the new user
    const onlineUsers = Array.from(connectedUsers.values()).map(u => ({
      id: u.id,
      nickname: u.nickname,
      avatar: u.avatar,
      status: u.status,
      statusMessage: u.statusMessage
    }));

    socket.emit('online users', onlineUsers);
    io.emit('update online users', onlineUsers);

    console.log(`${user.nickname} (${socket.id}) joined the chat`);
  });

  // Handle room switching
  socket.on('join room', (roomName) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const oldRoom = user.room;

      // Leave old room
      socket.leave(oldRoom);

      // Join new room
      socket.join(roomName);
      user.room = roomName;
      userRooms.set(socket.id, roomName);

      // Load message history for new room
      loadMessageHistory(roomName, (messages) => {
        socket.emit('message history', messages);
      });

      socket.emit('room changed', roomName);
    }
  });

  // Handle private message requests
  socket.on('start private chat', (targetUserId) => {
    const user = connectedUsers.get(socket.id);
    const targetUser = connectedUsers.get(targetUserId);

    if (user && targetUser) {
      const roomName = `private_${[socket.id, targetUserId].sort().join('_')}`;

      // Join both users to private room
      socket.join(roomName);
      io.to(targetUserId).socketsJoin(roomName);

      // Update user room
      user.room = roomName;
      targetUser.room = roomName;

      // Load private message history
      loadMessageHistory(roomName, (messages) => {
        io.to(roomName).emit('message history', messages);
        io.to(roomName).emit('private chat started', {
          roomName,
          participants: [user, targetUser]
        });
      });
    }
  });

  // Listen for chat messages
  socket.on('chat message', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const room = user.room || 'general';

      // Check for bot commands
      if (data.message.startsWith('/')) {
        const command = data.message.toLowerCase();
        if (botResponses[command]) {
          const response = typeof botResponses[command] === 'function'
            ? botResponses[command]()
            : botResponses[command];

          const botMessage = {
            id: Date.now(),
            nickname: '🤖 ChatBot',
            message: response,
            timestamp: new Date().toLocaleTimeString(),
            senderId: 'bot',
            avatar: '🤖',
            room: room
          };

          socket.emit('chat message', botMessage);
          return;
        }
      }

      const messageData = {
        sender_id: socket.id,
        sender_nickname: user.nickname,
        content: data.message,
        room: room,
        timestamp: new Date().toISOString(),
        avatar: user.avatar
      };

      // Save message to database
      db.run(`INSERT INTO messages (sender_id, sender_nickname, content, room)
              VALUES (?, ?, ?, ?)`,
        [messageData.sender_id, messageData.sender_nickname, messageData.content, messageData.room],
        function(err) {
          if (!err) {
            messageData.id = this.lastID;

            console.log(`Message from ${user.nickname} in ${room}: ${data.message}`);

            // Send message to all users in the same room except sender
            socket.broadcast.to(room).emit('chat message', messageData);
          }
        });
    }
  });

  // Handle user status updates
  socket.on('update status', (statusData) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.status = statusData.status;
      user.statusMessage = statusData.message || '';

      // Update in database
      db.run(`UPDATE users SET status = ?, status_message = ? WHERE id = ?`,
        [user.status, user.statusMessage, socket.id]);

      // Broadcast status update
      const onlineUsers = Array.from(connectedUsers.values()).map(u => ({
        id: u.id,
        nickname: u.nickname,
        avatar: u.avatar,
        status: u.status,
        statusMessage: u.statusMessage
      }));

      io.emit('update online users', onlineUsers);
    }
  });

  // Search messages
  socket.on('search messages', (query) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const room = user.room || 'general';
      db.all(`SELECT * FROM messages WHERE room = ? AND content LIKE ? ORDER BY timestamp DESC LIMIT 50`,
        [room, `%${query}%`],
        (err, results) => {
          if (!err) {
            socket.emit('search results', results);
          }
        });
    }
  });

  // Handle typing indicators
  socket.on('typing', () => {
    const user = connectedUsers.get(socket.id);
    if (user && !user.isTyping) {
      user.isTyping = true;
      const room = user.room || 'general';
      socket.broadcast.to(room).emit('user typing', {
        nickname: user.nickname,
        isTyping: true
      });
    }
  });

  socket.on('stop typing', () => {
    const user = connectedUsers.get(socket.id);
    if (user && user.isTyping) {
      user.isTyping = false;
      const room = user.room || 'general';
      socket.broadcast.to(room).emit('user typing', {
        nickname: user.nickname,
        isTyping: false
      });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      // Update last seen in database
      db.run(`UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = ?`, [socket.id]);

      // Remove user from connected users
      connectedUsers.delete(socket.id);
      userRooms.delete(socket.id);

      // Broadcast to all users that someone left
      socket.broadcast.emit('user disconnected', {
        nickname: user.nickname,
        avatar: user.avatar,
        message: `${user.nickname} left the chat`
      });

      // Send updated online users list to all remaining clients
      const onlineUsers = Array.from(connectedUsers.values()).map(u => ({
        id: u.id,
        nickname: u.nickname,
        avatar: u.avatar,
        status: u.status,
        statusMessage: u.statusMessage
      }));

      io.emit('update online users', onlineUsers);

      console.log(`${user.nickname} (${socket.id}) disconnected`);
    }
  });
});

// Helper function to load message history
function loadMessageHistory(room, callback) {
  db.all(`SELECT m.*
          FROM messages m
          WHERE m.room = ?
          ORDER BY m.timestamp DESC LIMIT 50`,
    [room],
    (err, rows) => {
      if (err) {
        console.error('Error loading message history:', err);
        callback([]);
        return;
      }

      const messages = rows.map(row => ({
        id: row.id,
        nickname: row.sender_nickname,
        message: row.content,
        timestamp: new Date(row.timestamp).toLocaleTimeString(),
        senderId: row.sender_id,
        room: row.room
      })).reverse();

      callback(messages);
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Enhanced chat server running on http://localhost:${PORT}`);
  console.log('Features: Themes, Private Messages, Avatars, Status, History, Bots');
});
