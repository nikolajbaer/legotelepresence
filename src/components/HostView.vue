<template>
    <div>
        <h1 v-if="session_id != null">{{ session_id }}</h1>
        <h1 v-else>Establishing Connection</h1>
        <div v-if="client_connected">Waiting on Client Connection</div>
        <button v-on:click="disconnect">Disconnect</button>
        <video autoplay playsinline ref="video" width="640" height="480"></video>
    </div>
</template>

<script>
import RTCPeer from "../RTCPeer.js"

export default {
    data: function() {
        return {
            connection: null,
            session_id: null,
        }
    },
    computed: {
        boost(){
            return this.$store.getters.boost
        },
        client_connected(){
            return this.connection != null && !this.connection.connected
        }
    },
    mounted(){
        this.updater = setInterval(this.updateState,200);
        this.connection = new RTCPeer(this.$refs['video']);
        console.log("Connecting",this.$refs['video'],"to ",this.connection)
        window.host_peer = this.connection
    },
    destroyed(){
        clearInterval(this.updater);
    },
    methods: {
        updateState: function(){
            if(this.boost != null){
                this.deviceInfo = this.boost.boost.deviceInfo
            }
            if(this.connection != null){
                this.session_id = this.connection.session_id
            }
        },
        disconnect: function(){
            // todo store action?
        }
    }   
}
</script>
