<template>
    <div>
        <h1>Remote Control for {{ meeting_id }}</h1>
        <select-device v-bind:connection="connection"></select-device>

        <div v-if="connected">
            <h2>You Are In Control</h2>
            <button v-on:click="forward()">Forward</button>
            <button v-on:click="left()">Left</button>
            <button v-on:click="right()">Right</button>
            <button v-on:click="reverse()">Reverse</button>
        </div>
        <div v-else>
            <button v-if="ready_to_call" v-on:click="connect">Connect</button>
        </div>

        <video autoplay playsinline ref="video" width="640" height="480"></video>

    </div>
</template>

<script>
import RTCPeer from "../RTCPeer.js"
import SelectDevice from "./SelectDevice.vue"

export default {
    components: {SelectDevice},
    props: ['meeting_id'],
    data: function(){
        return {
            connection: null,
        }
    },
    computed: {
        connected(){
            return this.connection != null && this.connection.connected
        },
        ready_to_call(){
            return this.connection != null && this.connection.ready_to_call
        },
    },
    mounted(){
        this.connection = new RTCPeer(this.$refs['video'],true)
        window.client_peer = this.connection
    },
    methods: {
        connect(){
            console.log("Calling",this.meeting_id)
            this.connection.call(this.meeting_id)
        },
        forward(){
            this.connection.sendControlData({fwd:true})
        },
        reverse(){
            this.connection.sendControlData({rev:true})
        },
        left(){
            this.connection.sendControlData({left:true})
        },
        right(){
            this.connection.sendControlData({right:true})
        },
    }
}
</script>

<style scoped>
    video {
        filter: hue-rotate(-404deg) saturate(180%);
    }
</style>>
