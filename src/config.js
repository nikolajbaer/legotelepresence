

// https://gist.github.com/yetithefoot/7592580
export default function get_peer_config(){
    return {
        /*host: 'localhost', port: 8080, path: '/peerjs',*/
        config: {'iceServers': [
            { url: 'stun:stun1.l.google.com:19302' },
            { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
        ]}
    } 
}