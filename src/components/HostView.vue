<template>
    <div>
        <h1 v-if="session_id != null">{{ session_id }}</h1>
        <h1 v-else>Establishing Connection</h1>

        <div v-if="client_connected">Waiting on Client Connection</div>

        <div v-if="boost && boost.connected()">
            Boost Connected
            <button v-on:click="disconnect">Disconnect</button>
        </div>
        <div v-else>
            Boost Not Connected!
            <router-link to="configure">Connect to Boost Hub</router-link>
        </div>

        <SelectDevice v-bind:connection="connection" />

        <video autoplay playsinline ref="video" width="640" height="480"></video>
    </div>
</template>

<script>
import RTCPeer from "../RTCPeer.js"
import SelectDevice from "./SelectDevice.vue"

export default {
    components: {SelectDevice},
    data: function() {
        return {
            connection: null,
            session_id: null,
            devices: null,
            device_id: null,
            boost_connected: false,
        }
    },
    computed: {
        boost(){
            return this.$store.getters.boost
        },
        client_connected(){
            return this.connection != null && !this.connection.connected
        },
    },
    mounted(){
        this.updater = setInterval(this.updateState,200);
        this.connection = new RTCPeer(this.$refs['video'],false);
        this.connection.onControlUpdate = d => {
            console.log("host received control update",d)
            if(d.fwd){ 
                this.boost.forward()
            }else if(d.rev){
                this.boost.back()
            }else if(d.left){
                this.boost.left()
            }else if(d.right){
                this.boost.right()
            }
        } 
        console.log("Connecting",this.$refs['video'],"to ",this.connection)
        window.host_peer = this.connection
    },
    destroyed(){
        clearInterval(this.updater);
    },
    methods: {
        updateState: function(){
            this.boost_connected = this.boost != null && this.boost.connected()

            if(this.connection != null){
                this.session_id = this.connection.session_id
            }
        },
        disconnect: function(){
            // todo store action?
        },
    }   
}
</script>

<style scoped>
    video {
        filter: hue-rotate(75deg) saturate(200%);
    }
</style>>
