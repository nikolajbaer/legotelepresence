import get_servers from './config.js'
import io from 'socket.io-client';

export default class RTCPeer{
    constructor (video_element,is_initiator){
        this.video_element = video_element
        this.listening = false
        this.connected = false
        this.peer = null
        this.is_initiator = is_initiator;
        this.socket = io()

        const servers = get_servers();

        // https://codelabs.developers.google.com/codelabs/webrtc-web/#4
        // https://github.com/googlecodelabs/webrtc-web/blob/master/step-05/js/main.js
        this.conn = new RTCPeerConnection( servers )
        this.conn.addEventListener('icecandidate', e => this.onIceCandidate(this.conn, e));
        this.conn.addEventListener('iceconnectionstatechange', e => this.onIceConnectionStateChange(this.conn, e));

        // get the media stream
        navigator.mediaDevices.getUserMedia( { video:true, audio: true }).then( ( stream ) => {
            this.gotLocalMediaStream(stream)
        }).catch( ( error ) =>{
            console.error(error)
        });
    }

    gotLocalMediaStream(mediaStream) {
        this.video_element.srcObject = mediaStream;
        this.localStream = mediaStream;
        console.log('Connected local stream for preview');
        if(this.is_initiator){
           this.maybeStart() 
        }else{
           this.listening = true 
        }
    }

    maybeStart(){
        this.conn.addStream(this.localStream)
        this.conn.createOffer( desc => {
            this.conn.setLocalDescription(desc)
            this.sendMessage( desc )
        }, event => { console.error("create offer error",event)})
    }

    sendMessage(message){
        console.log("client sending message:", message)
        this.socket.emit('message',message)    
    }

    onIceCandidate(pc, event) {
        console.log("on Ice Candidate",pc, event)
        const peerConnection = event.target;
        const iceCandidate = event.candidate;

        if (iceCandidate) {
            const newIceCandidate = new RTCIceCandidate(iceCandidate);
            const otherPeer = this.getOtherPeer(peerConnection);

            otherPeer.addIceCandidate(newIceCandidate)
            .then(() => {
                this.handleConnectionSuccess(peerConnection);
            }).catch((error) => {
                console.error("Connection Failure",peerConnection, error);
            });

            trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
                        `${event.candidate.candidate}.`);
        } 
    }

    getOtherPeer( peerConnection ) {
        // Only will work on test view!
        if(window.client_peer && window.client_peer === this.conn){
            return window.host_peer.conn;
        }else{
            return window.client_peer.conn;
        }
        // TODO implement signalling!
    }

    handleConnectionSuccess( peer ){
        this.peer = peer
        this.connected = true
        // TODO
        // initiate remote stream 
        // disconnect local stream from video_el
        // connect local_stream to peer
        // connect remote steram to video_el
        // create data channel for Remote Control
    }

    onIceConnectionStateChange( event ){
        console.log("Connection State Change",event)
    }

    call(meeting_id){
        alert("TODO Call " + meeting_id)
    }
}