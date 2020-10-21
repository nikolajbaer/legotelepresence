<template>
    <div>
        <h1>Remote Control for {{ meeting_id }}</h1>
        <select-device v-bind:connection="connection"></select-device>

        <div v-if="connected">
            <h2>You Are In Control</h2>
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

        }
    }
}
</script>

<style scoped>
    video {
        filter: hue-rotate(-404deg) saturate(180%);
    }
</style>>
