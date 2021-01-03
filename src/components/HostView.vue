<template>
    <div>
        <h1 v-if="meeting_id != null">Your Meeting Id: {{ meeting_id }}</h1>
        <h1 v-else>Establishing Connection</h1>

        <div v-if="client_connected">Waiting on Client Connection</div>


        <div v-if="boost && boost.connected()">
            Boost Connected
            <button v-on:click="disconnect">Disconnect</button>
        </div>
        <div v-else>
            Boost Not Connected!
            <button id="show-configure" @click="show_configure = true">Connect Boost Hub</button>
            <md-dialog :md-active.sync="show_configure">
                <md-dialog-title>Configure Boost Hub</md-dialog-title>
                <div class="md-dialog-content">
                    <Configure />
                    <md-dialog-actions>
                        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
                    </md-dialog-actions>
                </div>
            </md-dialog>
        </div>

        <SelectDevice v-bind:connection="connection" />

        <video autoplay playsinline ref="video" width="640" height="480"></video>
    </div>
</template>

<script>
import RTCPeer from "../RTCPeer.js"
import SelectDevice from "./SelectDevice.vue"
import Configure from "./Configure.vue"

export default {
    components: {SelectDevice,Configure},
    data: function() {
        return {
            connection: null,
            meeting_id: null,
            devices: null,
            device_id: null,
            boost_connected: false,
            show_configure: false,
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
        this.connection = new RTCPeer(this.$refs['video'],false,null);
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
                this.meeting_id = this.connection.meeting_id
            }
        },
        disconnect: function(){
            if(this.boost && this.boost.connected()){
                this.boost.disconnect()
            }
        },
    }   
}
</script>

<style scoped>
    video {
        filter: hue-rotate(75deg) saturate(200%);
    }
</style>>
