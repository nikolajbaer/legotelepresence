import express from 'express';
import * as enforce from 'express-sslify';
import cors from 'cors';
import Server from 'socket.io';
import { createServer } from 'http'
import { create } from 'domain';

const port = process.env.PORT || 8080;

var app = express();
app.use(cors());

// If we are in heroku environment, force SSL / domain redirect given appropriate env
if(process.env.REDIRECT_TO_DOMAIN != undefined){ 
  app.all(/.*/, function(req, res, next) {
    var host = req.header("host");
    if (host != process.env.REDIRECT_TO_DOMAIN) {
      res.redirect(301, "https://" + process.env.REDIRECT_TO_DOMAIN );
    }else{
      next();
    }
  });
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(express.static(__dirname + '/dist'));

const http = createServer(app)

const io = new Server(http) 
io.on('connection', (socket) => {
  console.log('user connected',socket.id);

  function log(){
    const array = ['Message from server:']
    array.push.apply(array,arguments)
    socket.emit('log',array)
  }

  socket.on('message', function(message){
    log('Client said: ', message)
    socket.broadcast.emit('message', message)
  })

  socket.on('create or join', function(room){
    log('Received request to create or join room ' + room)
    const clientsInRoom = io.sockets.adapter.rooms[room]
    const numClients = clientsInRoom? Object.keys(clientsInRoom.sockets).length : 0
    log('Room ' + room + 'now has ' + numClients + ' clients(s)')
    if (numClients === 0){
      socket.join(room)
      log('Client ID ' + socket.id + ' created room ' + room)
      socket.emit('created', room, socket.id)
    }else if( numClients === 1){
      log('Client ID ' + socket.id + ' joined room ' + room)
      io.sockets.in(room).emit('join', room)
      socket.join(room)
      socket.emit('joined', room, socket.id)
      io.sockets.in(room).emit('ready')
    }else{ // Max 2 clients 
      socket.emit('full',room)
    }
  })

  socket.on('ipaddr', function(){
    const ifaces = os.networkInterfaces()
    for( var dev in ifaces ){
      ifaces[dev].forEach(function(details){
        if( details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address)
        }
      })
    }
  })

  socket.on('bye', function(){
    console.log('received bye from '+ socket.id)
  })
});

const server = http.listen(port, '', () => {
  console.log('Server listening at http://localhost:%s', port);
});
