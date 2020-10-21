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
  console.log('a user connected');
});

const server = http.listen(port, () => {
  console.log('Server listening at http://localhost:%s', port);
});
