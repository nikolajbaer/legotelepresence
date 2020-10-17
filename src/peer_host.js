import Peer from 'peerjs';

class PeerHost{
    constructor (video_element){
        this.video_element = video_element
        this.peer = new Peer();
        this.peer.on('connection', (conn) =>{
            this.setup_connection(conn) 
        })
        this.peer.on('call', (call) => {
            navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
                call.answer(stream); // Answer the call with an A/V stream.
                call.on('stream', (remoteStream) => {
                    // Show stream in some <video> element.
                });
            }, (err) => {
                console.error('Failed to get local stream', err);
            }); 
        })
    }

    setup_connection(conn){
        this.conn = conn 
        conn.on('data', (data) => {
            console.log("Received ",data)
        })
        conn.on('open', () => {
            conn.send('Hello')
        })
    }

}