const express =require('express');
const app =express();
const path =require('path');
const PORT=3001;
const http =require('http');
const socketIo=require('socket.io');
const server= http.createServer(app);
const io =socketIo(server);

app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/channel/:channelName', (req, res) => {
    res.sendFile(path.join(__dirname,'channel.html'));
});

io.on('connection', (socket) => {
    console.log('Nv utilisateur connecté');

    socket.on('joinChannel', (channelName) => {
        socket.join(channelName);
        io.to(channelName).emit('notification', `Un nouvel utilisateur a rejoint le canal ${channelName}`);
    });

    socket.on('leaveChannel', (channelName) => {
        socket.leave(channelName);
        io.to(channelName).emit('notification', `Un utilisateur a quitté le canal ${channelName}`);
    });

    socket.on('message', (data) => {
        const { channelName, message } = data;
        console.log(`Message reçu sur ${channelName}: `, message);
        io.to(channelName).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('utilisateur déconnecté');
    });
});

server.listen(PORT, () => {
    console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});
