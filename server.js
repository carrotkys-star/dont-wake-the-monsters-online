const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const rooms = new Map();
const MAX_PLAYERS = 4;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeCode() {
  let code;
  do {
    code = Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function publicPlayers(room) {
  return [...room.players.values()].map(p => ({
    id: p.id,
    name: p.name,
    x: p.x,
    z: p.z,
    yaw: p.yaw,
    pitch: p.pitch
  }));
}

function broadcastRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  io.to(roomCode).emit('roomUpdate', {
    code: roomCode,
    host: room.host,
    players: publicPlayers(room),
    started: room.started
  });
}

io.on('connection', socket => {
  socket.on('createRoom', ({ name } = {}) => {
    if (socket.data.room) return socket.emit('roomError', 'คุณอยู่ในห้องอยู่แล้ว');

    const code = makeCode();
    const playerName = String(name || 'Player 1').trim().slice(0, 18) || 'Player 1';
    const room = {
      host: socket.id,
      started: false,
      players: new Map()
    };

    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      x: 6,
      z: 6,
      yaw: 0,
      pitch: 0
    });

    rooms.set(code, room);
    socket.join(code);
    socket.data.room = code;

    socket.emit('roomCreated', {
      code,
      host: true,
      players: publicPlayers(room)
    });
  });

  socket.on('joinRoom', ({ code, name } = {}) => {
    const roomCode = String(code || '').trim().toUpperCase();
    const room = rooms.get(roomCode);

    if (!room) return socket.emit('roomError', 'ไม่พบห้องนี้');
    if (room.started) return socket.emit('roomError', 'เกมห้องนี้เริ่มไปแล้ว');
    if (room.players.size >= MAX_PLAYERS) return socket.emit('roomError', 'ห้องเต็มแล้ว (สูงสุด 4 คน)');
    if (socket.data.room) return socket.emit('roomError', 'คุณอยู่ในห้องอยู่แล้ว');

    const playerName = String(name || `Player ${room.players.size + 1}`).trim().slice(0, 18) || 'Player';

    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      x: 6,
      z: 6,
      yaw: 0,
      pitch: 0
    });

    socket.join(roomCode);
    socket.data.room = roomCode;
    broadcastRoom(roomCode);
  });

  socket.on('startGame', () => {
    const code = socket.data.room;
    const room = rooms.get(code);
    if (!room) return;
    if (room.host !== socket.id) return socket.emit('roomError', 'เฉพาะ Host เท่านั้นที่เริ่มเกมได้');
    if (room.players.size < 2) return socket.emit('roomError', 'ต้องมีผู้เล่นอย่างน้อย 2 คน');

    room.started = true;
    io.to(code).emit('gameStarted', { players: publicPlayers(room) });
  });

  socket.on('playerState', state => {
    const code = socket.data.room;
    const room = rooms.get(code);
    const p = room?.players.get(socket.id);
    if (!p || !room.started) return;

    if (Number.isFinite(state?.x)) p.x = state.x;
    if (Number.isFinite(state?.z)) p.z = state.z;
    if (Number.isFinite(state?.yaw)) p.yaw = state.yaw;
    if (Number.isFinite(state?.pitch)) p.pitch = state.pitch;

    socket.to(code).emit('playerState', {
      id: socket.id,
      name: p.name,
      x: p.x,
      z: p.z,
      yaw: p.yaw,
      pitch: p.pitch
    });
  });

  socket.on('disconnect', () => {
    const code = socket.data.room;
    const room = rooms.get(code);
    if (!room) return;

    room.players.delete(socket.id);

    if (room.players.size === 0) {
      rooms.delete(code);
      return;
    }

    if (room.host === socket.id) {
      room.host = room.players.keys().next().value;
    }

    io.to(code).emit('playerLeft', { id: socket.id });
    broadcastRoom(code);
  });
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`DON'T WAKE THE MONSTERS online server running on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}/DONT_WAKE_THE_MONSTERS_ONLINE.html`);
});
