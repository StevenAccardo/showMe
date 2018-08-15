const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const _ = require('underscore');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const connections = [];
let title = 'Untitled Presentation';
const audience = [];
const speaker = {};

io.on('connection', socket => {
  //adds socket to the connections array
  connections.push(socket);
  console.log(`Connected with ${socket.id}, ${connections.length} clients connected.`);

  socket.on('join', function(data) {
    var newMember = {
      id: this.id,
      name: data.name,
      type: 'member'
    };
    this.emit('joined', newMember);
    audience.push(newMember);
    io.sockets.emit('audience', audience);
  });

  socket.on('start', function({ name, title }) {
    speaker.name = name;
    speaker.id = this.id;
    speaker.type = 'speaker';
    title = title;
    this.emit('joined', speaker);
    console.log(`Presentation Started: ${title} by ${speaker.name}`);
  });

  socket.emit('welcome', { title });

  socket.once('disconnect', function() {
    //Find the audience member that disconnected

    const member = _.findWhere(audience, { id: this.id });

    //If they were found, remove them from the audience array, emit a notice to all audience members sending them the updated audience array.
    if (member) {
      audience.splice(audience.indexOf(member), 1);
      io.sockets.emit('audience', audience);
      console.log(`${member.name} has left. There are ${audience.length} audience members left.`);
    }

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
