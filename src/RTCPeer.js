import get_config from './config.js'

export default class RTCPeer{
    constructor (video_element){
        this.video_element = video_element
        this.listening = false
        this.connected = false
        this.peer = null

        // https://codelabs.developers.google.com/codelabs/webrtc-web/#4
        this.conn = new RTCPeerConnection( {} )
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
        this.listening = true 
    }

    onIceCandidate(pc, event) {
        const peerConnection = event.target;
        const iceCandidate = event.candidate;

        if (iceCandidate) {
            const newIceCandidate = new RTCIceCandidate(iceCandidate);
            const otherPeer = getOtherPeer(peerConnection);

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