import Peer from 'peerjs';
import get_config from './config.js'

export default class PeerHost{
    constructor (video_element){
        this.video_element = video_element
        this.connected = false
        this.peer = new Peer(get_config());
        this.session_id = null

        this.peer.on('open', (id) => {
            console.log("peer opened",this.peer,id)
            window.peer = this.peer
            this.session_id = id
        })

        this.peer.on('connection', (conn) =>{
            this.setup_connection(conn) 
        })

        this.peer.on('call', (call) => {
            console.log("Call received", call)
            navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
                console.log("Answering")
                call.answer(stream); // Answer the call with an A/V stream.
                this.connected = true;
                call.on('stream', (remoteStream) => {
                    this.video_element.srcObject = remoteStream
                });
            }, (err) => {
                console.error('Failed to get local stream', err);
            }); 
        })

        this.peer.connect(this.session_id)
    }

    setup_connection(conn){
        console.log("Setting up connection",conn)
        this.conn = conn 
        conn.on('data', (data) => {
            console.log("Received ",data)
        })
        conn.on('open', (id) => {
            console.log("opened",id)
        })
    }

}