#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) =>
  new Promise((res) => rl.question(q, (answer) => res(answer.trim())));

(async () => {
  console.log('[proofly] Let’s set up your local dashboard!');

  // Ask for siteId
  const siteId = await ask('👉 Enter your Site ID (e.g., my-portfolio-2025): ');

  // Use your deployed relay URL
  const relayUrl = 'https://relay-server-zatg.onrender.com'; // TODO: Replace with your real Render URL

  rl.close();

  // === Directories ===
  const ROOT = process.cwd();
  const DASHBOARD_DIR = path.join(ROOT, 'local-dashboard');
  const DATA_DIR = path.join(ROOT, 'Proofly');

  if (!fs.existsSync(DASHBOARD_DIR)) fs.mkdirSync(DASHBOARD_DIR);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
    fs.writeFileSync(path.join(DATA_DIR, 'events.json'), '[]');
  }

  // === Write dashboard.js ===
  fs.writeFileSync(
    path.join(DASHBOARD_DIR, 'dashboard.js'),
`import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import ioClient from 'socket.io-client';
import fs from 'fs';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const LOCAL_DATA_DIR = '../Proofly';
const EVENTS_FILE = path.join(LOCAL_DATA_DIR, 'events.json');

const RELAY_URL = '${relayUrl}';
const siteId = '${siteId}';

const socket = ioClient('https://relay-server-zatg.onrender.com', { transports: ['websocket'] });

socket.on('connect', () => {
  console.log('[dashboard] Connected:', socket.id);
  socket.emit('join_site', siteId);
});

socket.on('live_view', (data) => {
  console.log('[dashboard] Event:', data);
  saveEvent(data);
  io.emit('update', data);
});

function saveEvent(event) {
  const content = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'));
  content.push(event);
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(content, null, 2));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static(__dirname));

io.on('connection', socket => {
  console.log('[dashboard] Local UI connected:', socket.id);
});

server.listen(4000, () => {
  console.log('[dashboard] Running at http://localhost:4000');
});
`
  );

  // === Write index.html ===
  fs.writeFileSync(
    path.join(DASHBOARD_DIR, 'index.html'),
`<!DOCTYPE html>
<html>
  <head>
    <title>Proofly Dashboard</title>
  </head>
  <body>
    <h1>Proofly Local Dashboard</h1>
    <ul id="events"></ul>
    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
      socket.on('update', (event) => {
        const li = document.createElement('li');
        li.textContent = JSON.stringify(event);
        document.getElementById('events').appendChild(li);
      });
    </script>
  </body>
</html>`
  );

  // === Write package.json ===
  fs.writeFileSync(
    path.join(DASHBOARD_DIR, 'package.json'),
`{
  "name": "proofly-local-dashboard",
  "version": "1.0.0",
  "main": "dashboard.js",
  "type": "module",
  "scripts": {
    "start": "node dashboard.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "socket.io-client": "^4.7.2"
  }
}`
  );

  console.log('\n✅ Local dashboard scaffolded at ./local-dashboard');
  console.log('👉 Next: cd local-dashboard && npm install && npm start');
})();
