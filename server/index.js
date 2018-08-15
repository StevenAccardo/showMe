const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const connections = [];
let title = 'Untitled Presentation';

io.on('connection', socket => {
  //adds socket to the connections array
  connections.push(socket);
  console.log(`Connected with ${socket.id}, ${connections.length} clients connected.`);

  socket.emit('welcome', { title });

  socket.once('disconnect', () => {
    //removes socket from connections array
    connections.splice(connections.indexOf(socket), 1);
    //ensures server disconnects
    socket.disconnect();
    console.log(`Disconnected: ${connections.length} clients still connected.`);
  });
});

if (process.env.NODE_ENV !== 'production') {
  console.log('Dev');

  const webpackMiddleware = require('webpack-dev-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.dev.js');
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler));

  app.get('*', (req, res, next) => {
    const filename = path.resolve(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  app.use(express.static('dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const port = process.env.PORT || 3000;

server.listen(3000, () => console.log(`Server is listening on ${port}`));
