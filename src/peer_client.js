import Peer from 'peerjs'

class PeerHost{
    constructor (session_id, video_element){
        this.session_id = session_d
        this.video_element = video_element
        this.peer = new Peer(session_id);
        this.peer.on('connection', (conn) =>{
            this.setup_connection(conn) 
        })
        this.call = null
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

    call(){
        navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
            this.call = this.peer.call(this.session_id, stream);
            call.on('stream', (remoteStream) => {
                // Show stream in some <video> element.
            });
        }, (err) => {
            console.error('Failed to get local stream', err);
        });    
    }

}