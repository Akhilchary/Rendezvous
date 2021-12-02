const express = require('express')
const app = express()

//importing uuid which is used to generate random codes which will be used for room ids
//we are extracting a specific version of uuid
const {
    v4: uuid
} = require('uuid');

//importing peerjs
//we are using peerjs so we need not write complicated code for generating userids
const { ExpressPeerServer } = require('peer');





//setting default view engine as ejs
app.set('view engine', 'ejs');

//telling express that public folder is public
app.use(express.static('public'));

//creating an http server
const server = require('http').Server(app);


//creating a peerserver
//here we are passing our server as a parameter so that it takes all the values of our server like port number etc
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use('/peerjs', peerServer);
//socketio for low latency bidirectional comm
const io = require('socket.io')(server)

//routes
app.get('/', (req, res) => {
    //automatically looks up view folder and renders the file and displays it to the client
    // res.render('room');
    // res.end();

    res.redirect(uuid());
})

//this route specifies that whatever is to the right of / is stored in the var room
app.get('/:room', (req, res) => {
    //the var room is extracted and is assigned to roomID which is sent to room.ejs
    res.render('room', {
        roomID: req.params.room
    });
});

//io on connection event will listen to all socket events mentioned inside it
io.on('connection', socket => {
    //socket on join-room event which is emitted from client side
    socket.on('join-room', (roomID,userID) => {
        // console.log(roomID);
        //here on join-room event the user is connected to a certain roomID
        socket.join(roomID);
        //here emit emits the event to all the clients except the one who just connected
        socket.to(roomID).emit('user-connected',userID);
    })
})

server.listen(6969, () => {
    console.log("Listening at 6969");
});