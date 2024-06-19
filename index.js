const express =require('express');
const app =express();
const path =require('path');
const PORT =3001;
const http =require('http');
const socketIo =require('socket.io');
const server =http.createServer(app);
const io =socketIo(server);

app.use(express.static(__dirname));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

//pour initialiser socket.io
io.on('connection', (socket)=> {
    console.log('Nv utilisateur connécté');
    io.emit('notification', 'nv utilisateur s\'est connecté');
    socket.on('message',(data)=>{
        console.log('msg recu: ',data);
        io.emit('message', data);
    });
    socket.on('disconnect', () => {
        console.log('utilisateur déconnecté');
        io.emit('notification', 'utilisateur s\'est déconnecté');
    })
});

server.listen(PORT, () => {
    console.log(`Le serveur est démarré sur http://localhost:${PORT}`);});

