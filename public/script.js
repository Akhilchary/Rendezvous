//frontend js
//used for showing own video

//this is the video grid element in HTML
const videoGrid = document.getElementById('video-grid');

//we will create myVideo element here
const myVideo = document.createElement('video');
console.log(myVideo);
myVideo.muted = true;

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
})


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