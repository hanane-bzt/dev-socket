const express =require('express');
const app =express();
const path=require('path');
const PORT=3001;
const http =require('http');
const socketIo= require('socket.io');
const server =http.createServer(app);
const io=socketIo(server);

app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/channel/:channelName', (req, res) => {
    res.sendFile(path.join(__dirname, 'channel.html'));
});
const users = {};
io.on('connection', (socket) => {
    console.log('Nv utilisateur connecté');
    socket.on('setPseudo', (pseudo, callback)=> {
        if (pseudo === 'Allan'){
            return callback({ success: false,message:'Pseudo interdit' });
        }if (Object.values(users).includes(pseudo)) {
            return callback({success: false, message:'Pseudo déjà pris' });
        }
        users[socket.id] = pseudo;
        callback({ success: true });});
    socket.on('joinChannel',(channelName)=>{
        socket.join(channelName);
        io.to(channelName).emit('notification',`${users[socket.id]} a rejoint le canal ${channelName}`);
    });
    socket.on('leaveChannel',(channelName) =>{
        socket.leave(channelName);
        io.to(channelName).emit('notification',`${users[socket.id]} a quitté le canal ${channelName}`);
    });
    socket.on('message',(data) => {
        const {channelName,message}= data;
        console.log(`Message reçu sur ${channelName}: `,message);
        io.to(channelName).emit('message',`${users[socket.id]}: ${message}`);
    });
    socket.on('disconnect',() =>{
        console.log('utilisateur déconnecté');
        const pseudo = users[socket.id];
        delete users[socket.id];
        io.emit('notification',`${pseudo} s'est déconnecté`);
    });});
server.listen(PORT, () => {
    console.log(`Le serveur est démarré sur http://localhost:${PORT}`);
});
