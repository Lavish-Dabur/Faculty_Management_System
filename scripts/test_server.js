const http = require('http');
const opts = { hostname: '127.0.0.1', port: 5001, path: '/test', method: 'GET' };
const req = http.request(opts, res => {
  console.log('STATUS', res.statusCode);
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log('BODY', body));
});
req.on('error', e => console.error('REQERR', e));
req.end();
