import get_servers from './config.js'
import io from 'socket.io-client';

// Based on
// https://codelabs.developers.google.com/codelabs/webrtc-web/#4
// https://github.com/googlecodelabs/webrtc-web/blob/master/step-05/js/main.js

export default class RTCPeer{
    constructor (video_element,is_initiator){
        this.video_element = video_element
        this.listening = false
        this.connected = false
        this.peer = null
        this.remoteStream = null
        this.localStream = null
        this.controlsDataChannel = null
        this.onControlUpdate = null

        // state management
        this.is_initiator = is_initiator;
        this.is_started = false;
        this.is_channel_ready = false
        this.ready_to_call = false
        
        this.servers = null; //get_servers();
        
        // Create Socket.io to signal and bind
        this.createSocket()

        this.conn = null;

        // build list of devices
        this.devices = null
        navigator.mediaDevices.enumerateDevices().then( devices => {
            console.log("Found media devices", devices)
            this.devices =  devices
        });

        window.addEventListener('beforeunload', e => { this.sendMessage('bye'); })
    }

    getVideoStream(device_id){
        const constraints = {
            video: (device_id == null)? {facingMode:'environment'}: {deviceId: {exact:device_id} },
            audio: true,
        }
        // get the media stream
        console.log("requesting user media",constraints)
        navigator.mediaDevices.getUserMedia( constraints ).then( ( stream ) => {
            this.gotLocalMediaStream(stream)
        }).catch( ( error ) =>{
            console.error(error)
        });
    }

    createSocket(){
        this.socket = io()
        this.socket.on('message', message => {
            this.handleMessage(message)
        })
        this.socket.on('created', room => {
            this.is_initiator = true
        })
        this.socket.on('full', room => {
            console.log('room is full', room)
        })
        this.socket.on('join', room => {
            this.is_channel_ready = true
        })
        this.socket.on('joined', room => {
            this.is_channel_ready = true
        })
        this.socket.on('log', a => { console.log.apply(console,a)})

        console.log("joining foo")
        this.socket.emit('create or join', 'foo')
    }

    gotLocalMediaStream(mediaStream) {
        this.video_element.srcObject = mediaStream;
        this.localStream = mediaStream;
        console.log('Connected local stream for preview',mediaStream);
        if(this.is_initiator){
            this.ready_to_call = true
        }else{
            this.listening = true 
        }
    }

    changeVideoDevice(device_id){
        // https://www.twilio.com/blog/2018/04/choosing-cameras-javascript-mediadevices-api.html
        if( this.localStream != null ){
            this.localStream.getTracks().forEach( track => {
                track.stop()
            })
        }
        if(device_id != null){
            console.log("Getting Video Stream ",device_id)
            this.getVideoStream( device_id )
        }
    }

    createPeerConnection(){
        console.log("Createing peer connection")
        try{
            this.conn = new RTCPeerConnection( this.servers )
            this.conn.addEventListener('icecandidate', e => this.onIceCandidate(e));
            this.conn.addEventListener('addstream', e => this.onAddStream(e));
            this.conn.addEventListener('removestream', e => { console.log("Remote stream removed",e) })
            if(this.is_initiator){
                this.controlsDataChannel = this.conn.createDataChannel("controls")
                this.controlsDataChannel.addEventListener("message", e => {
                    console.log(e)
                    this.onControlsDataChannelMessage( e.data )
                })
                this.controlsDataChannel.addEventListener("open", e => { 
                    this.connected = true
                    console.log("Client Data Channel opened") 
                })
                this.controlsDataChannel.addEventListener("close", e => { console.log("Data Channel closed") })
            }else{
                this.conn.addEventListener('datachannel', e => { this.createReceiveDataChannel(e.channel) } )
            }
        }catch(e){                
            console.error("Failed to create peer connection", e)
            alert("Could not create RTC Peer Connection")
        }
    }

    createReceiveDataChannel( channel ){
        this.controlsDataChannel = channel
        this.controlsDataChannel.addEventListener("message", e => {
            this.onControlsDataChannelMessage( e.data  )
        })
        this.controlsDataChannel.addEventListener("open", e => { 
            this.connected = true
            console.log("Host Data Channel opened") 
        })
        this.controlsDataChannel.addEventListener("close", e => { console.log("Data Channel closed") })
    }

    onControlsDataChannelMessage( data ){
        const control_data = JSON.parse(data);
        console.log("control data received", control_data)
        if(this.onControlUpdate){
            this.onControlUpdate(control_data)
        }
    }

    maybeStart(){
        console.log("Maybe starting")
        if(!this.is_started && typeof this.localStream !== 'undefined' && this.is_channel_ready){
            this.createPeerConnection()
            this.conn.addStream(this.localStream)
            this.is_started = true
            if(this.is_initiator){
                this.conn.createOffer( 
                    (desc) => { this.setLocalAndSendMessage(desc) },
                    event => { console.error("create offer error",event)}
                )
            }
        }
    }

    sendMessage(message){
        console.log("client sending message:", message)
        this.socket.emit('message',message)    
    }

    setLocalAndSendMessage(desc){
        this.conn.setLocalDescription(desc)
        this.sendMessage( desc )
    }

    onIceCandidate(event) {
        console.log("on Ice Candidate",this.conn, event)
        const peerConnection = event.target;

        if (event.candidate) {
            this.sendMessage( {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
            })
        }else{
            console.log('End of candidates')
        }
    }

    onAddStream( event ){
        console.log('Remote stream added',event)
        this.remoteStream = event.stream
        this.video_element.srcObject = this.remoteStream
    }

    call(meeting_id){
        console.log("Calling " + meeting_id)
        this.maybeStart() 
    }

    handleMessage(message){
        if( message === 'got user media') {
            this.maybeStart()
        }else if(message.type === 'offer'){
            if(!this.is_initiator && !this.is_started){
                this.maybeStart()
            }
            this.conn.setRemoteDescription( new RTCSessionDescription( message))
            this.conn.createAnswer().then(
                (desc) => { this.setLocalAndSendMessage(desc) },
                event => { console.error("create offer error",event)}
            );
        }else if( message.type === 'answer' && this.is_started ){
            this.conn.setRemoteDescription( new RTCSessionDescription(message))
        }else if(message.type === 'candidate' && this.is_started){
            const candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate,
            })
            this.conn.addIceCandidate( candidate)
        }else if(message === 'bye' && this.is_started){
            this.handleRemoteHangup()
        }
    }

    control( info ){
        const controls = {
            fwd: false,
            rev: false,
            left: false,
            right: false,
        }
        Object.assign(controls,info)
        sendControlData( controls )
    }

    sendControlData( data ){
        if(this.controlsDataChannel != null){
            this.controlsDataChannel.send( JSON.stringify( data ) )
        }
    }

    handleRemoteHangup(){
        this.stop()
        this.is_initiator = false
    }

    hangup(){
        this.stop()
        this.sendMessage('bye')
    }

    stop(){
        this.is_started = false
        this.conn.close()
        this.conn = null
    }
}