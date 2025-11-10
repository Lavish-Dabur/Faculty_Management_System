const http = require('http');
const data = JSON.stringify({ email: 'soumallyanaskar2002@gmail.com', password: 'abc123' });

const opts = {
  hostname: '127.0.0.1',
  port: 5001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(opts, (res) => {
  console.log('STATUS', res.statusCode);
  let body = '';
  res.on('data', (c) => (body += c));
  res.on('end', () => {
    console.log('BODY', body);
  });
});

req.on('error', (e) => console.error('REQERR', e));
req.write(data);
req.end();
