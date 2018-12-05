const http = require('http');
const app = require('./app');
const port  = 5050;
const server = http.createServer(app);
const io = require('socket.io')(server);
app.set('socketio', io);

io.on('connection', function(client) {
    client.on('messages', function(data) {
        client.emit('broad', data);
        client.broadcast.emit('broad',data);
    });

    client.on('broad', function(){
        console.log('Broad called!');
    });
});

server.listen(port, () => {
    console.log('Listing on 5050');
});