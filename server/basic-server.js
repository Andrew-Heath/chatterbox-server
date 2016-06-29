var express = require('express');
var server = express();
var fs = require('fs');
var _chats = [];

var readFile = function(callback) {
  fs.readFile('messageData.txt', 'utf-8', (err, chatData) => {
    if (err) { throw err; }
    callback(chatData);
  });
};

var writeFile = function(chatData) {
  fs.writeFile('messageData.txt', chatData, function(err) {
    if (err) {
      return console.log(err);
    }
  }); 
};

readFile((chatData) => _chats = JSON.parse(chatData || '[]'));

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var headers = defaultCorsHeaders;
headers['Content-Type'] = 'application/json';

var port = 3000;

var ip = '127.0.0.1';

server.use(express.static('client'));

server.options('/classes/messages', (request, response) => {
  response.header(headers);
  response.set(200).send();
});

server.get('/classes/messages', (request, response) => {
  response.header(headers);
  response.send({results: _chats});
});

server.post('/classes/messages', (request, response) => {
  request.on('data', chunk => {
    var data = JSON.parse(chunk.toString());
    data.createdAt = new Date;
    _chats.push(data);

    if (_chats.length > 100) { _chats.unshift(); }
    writeFile(JSON.stringify(_chats));
  });
  response.header(headers);
  response.set(201).send({statusCode: 201, success: 'Message received'});
});

server.listen(port, () => {
  console.log('Listening on http://' + ip + ':' + port);
});