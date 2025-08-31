import http from 'http';
import https from 'https';
import { URL } from 'url';

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle models endpoint
  if (req.url === '/v1/models' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      object: "list",
      data: [
        { id: "claude-3-5-sonnet-20240620", object: "model", owned_by: "anthropic" },
        { id: "claude-3-5-haiku-20241022", object: "model", owned_by: "anthropic" },
        { id: "claude-3-opus-20240229", object: "model", owned_by: "anthropic" }
      ]
    }));
    return;
  }

  // Proxy all other requests to Anthropic
  const targetUrl = `https://api.anthropic.com${req.url}`;
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: req.url,
      method: req.method,
      headers: {
        'x-api-key': req.headers['x-api-key'],
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Proxy error' }));
    });

    if (body) {
      proxyReq.write(body);
    }
    proxyReq.end();
  });
});

server.listen(3001, () => {
  console.log('Anthropic proxy running on http://localhost:3001');
});


