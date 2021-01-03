<template>
    <div>
        <h1>Remote Control for {{ meeting_id }}</h1>

        <div class="md-layout md-gutter">
            <select-device class="md-layout-item" v-bind:connection="connection"></select-device>
        </div>

        <div class="md-layout md-gutter" v-if="connected">
            <h2>You Are In Control</h2>
            <md-button v-on:click="forward()">Forward</md-button>
            <md-button v-on:click="left()">Left</md-button>
            <md-button v-on:click="right()">Right</md-button>
            <md-button v-on:click="reverse()">Reverse</md-button>
        </div>
        <div class="md-layout md-gutter" v-else>
            <md-button v-if="ready_to_call" v-on:click="connect">Connect</md-button>
        </div>

        <div class="md-layout md-gutter">
            <video autoplay playsinline ref="video" width="640" height="480"></video>
        </div>

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
        console.log("connecting to " + this.meeting_id)
        this.connection = new RTCPeer(this.$refs['video'],true,this.meeting_id)
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
