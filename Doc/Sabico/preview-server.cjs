const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'};
http.createServer((request,response) => {
  const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (file !== root && !file.startsWith(root + path.sep)) return response.writeHead(403).end();
  fs.readFile(file,(error,data) => error ? response.writeHead(404).end('Not found') : response.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream'}).end(data));
}).listen(4173,() => console.log('Local: http://localhost:4173'));
