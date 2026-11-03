const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // Decode URL in case of encoded characters like spaces or Vietnamese
  let safeUrl = decodeURI(req.url.split('?')[0]);
  if (safeUrl === '/') safeUrl = '/index.html';

  const filePath = path.join(ROOT, safeUrl);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Smart Fallback for Thien's 3D/Video assets (dist folder)
      const distFallback = path.join(ROOT, 'pro5thanhthien', 'pro5', 'dist', safeUrl);
      fs.stat(distFallback, (errDist, statsDist) => {
        if (!errDist && !statsDist.isDirectory()) {
          serveFile(distFallback, res);
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found: ' + safeUrl);
      });
      return;
    }

    if (stats.isDirectory()) {
      const indexFile = path.join(filePath, 'index.html');
      fs.stat(indexFile, (err2) => {
        if (!err2) {
          serveFile(indexFile, res);
        } else {
          res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Directory listing not enabled.');
        }
      });
      return;
    }

    serveFile(filePath, res);
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 PORTFOLIO HUB NHÓM UTH ĐANG CHẠY TẠI:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`=======================================================`);
  console.log(`Nhấn Ctrl + C để dừng máy chủ.`);
});
