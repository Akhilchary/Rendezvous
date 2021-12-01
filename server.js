const express = require('express')
const app = express()
var cors = require('cors')

//importing uuid which is used to generate random codes which will be used for room ids
//we are extracting a specific version of uuid
const {
    v4: uuid
} = require('uuid');




//CORS
app.use(cors())

//setting default view engine as ejs
app.set('view engine', 'ejs');

//telling express that public folder is public
app.use(express.static('public'));

//creating an http server
const server = require('http').Server(app);

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

server.listen(6969, () => {
    console.log("Listening at 6969");
});