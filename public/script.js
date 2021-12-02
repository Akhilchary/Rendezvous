//client side js
var socket = io();
//this is the video grid element in HTML
const videoGrid = document.getElementById('video-grid');

//we will create myVideo element here
const myVideo = document.createElement('video');
console.log(myVideo);
myVideo.muted = true;

//here we want to run our own peer server

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '6969'
});

//this is used to ger perm from user to access media like video and audio
//it returns a promise, if user rejects we can handle that case differently
//it returns a stream object
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    //assigning stream to a global variable
    myVideoStream = stream;
    //addVideoStream function adds stream to myVideo
    addVideoStream(myVideo, stream);
    //answering to other users call
    peer.on('call', call => {
        call.answer(stream);
        // const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(myVideo, userVideoStream);
        });
    });


    socket.on('user-connected', (userID) => {
        connectToNewUser(userID, stream);
    });
});


//open event is emitted when a connection is established to peer server
peer.on('open', id => {
    console.log(id);
    socket.emit('join-room', ROOM_ID, id);
})

//we are emitting an event join-room signifing that user has joined
// socket.emit('join-room', ROOM_ID);

//catching user-connected event here
// socket.on('user-connected', (userID) => {
//     connectToNewUser(userID,stream);
// });

const connectToNewUser = (userID, stream) => {
    console.log('new user bitchh and id is', userID);

    //exisiting user is calling to the newly joined user
    const call = peer.call(userID, stream);

    //creating a video element for 
    // const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(myVideo, userVideoStream);
    })

}

const addVideoStream = (video, stream) => {
    //The srcObject property of the HTMLMediaElement interface sets or returns the object which serves as the source of the media associated with the HTMLMediaElement.
    video.srcObject = stream;
    //The loadedmetadata event occurs when metadata for the specified audio/video has been loaded.
    video.addEventListener('loadedmetadata', () => {
        video.play();
        // setTimeout(video.pause(), 8000);
    });
    //append it to the div element in room.ejsxx
    videoGrid.append(video);
}