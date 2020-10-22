<template>
    <div>
        <h1>Remote Control for {{ meeting_id }}</h1>
        <select-device v-bind:connection="connection"></select-device>

        <div v-if="connected">
            <h2>You Are In Control</h2>
            <button v-on:click="forward()">Forward</button>
            <button v-on:click="left()">Left</button>
            <button v-on:click="right()">Right</button>
            <button v-on:click="back()">Back</button>
        </div>
        <div v-else>
            <button v-on:click="connect">Connect</button>
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
        }
    },
    mounted(){
    },
    methods: {
        connect(){
            console.log("Calling",this.meeting_id)
            this.connection = new RTCPeer(this.$refs['video'],true)
            this.connection.call(this.meeting_id)
            window.client_peer = this.connection

        },
        forward(){
            this.connection.controls({fwd:true})
        },
        reverse(){
            this.connection.control({rev:true})
        },
        left(){
            this.connection.control({left:true})
        },
        right(){
            this.connection.control({right:true})
        },
    }
}
</script>

<style scoped>
    video {
        filter: hue-rotate(-404deg) saturate(180%);
    }
</style>>
