import Peer from 'peerjs'
import get_config from './config.js'

export default class PeerClient{
    constructor (video_element,meeting_id){
        this.video_element = video_element
        this.peer = new Peer(get_config());
        this.peer.on('connection', (conn) =>{
            this.setup_connection(conn) 
        })
        this.current_conn = null

        window.peer = this.peer
    }

    connected(){
        return this.current_conn != null
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

    call(session_id){
        console.log("starting client call to", session_id)
        const conn = this.peer.connect(session_id)
        conn.on('open', () => {
            conn.on('data', function(data) {
                console.log('Received', data);
            });
            conn.send('Hello Worldy')
        })

        /*
        navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
            console.log("starting call to ",session_id)
            this.current_conn = this.peer.call(session_id, stream);
            this.peer.send("Helloo World")
            this.current_conn.on('stream', (remoteStream) => {
                console.log("Stream received")
                this.video_element.srcObject = remoteStream
            });
        }, (err) => {
            console.error('Failed to get local stream', err);
        });    */
    }

}