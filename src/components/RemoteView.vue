<template>
    <div>
        <h1>Remote Control for {{ meeting_id }}</h1>

        <video ref="video" width="800" height="600"></video>

        <div v-if="connected">
            <h2>You Are In Control</h2>
        </div>
        <div v-else>
            <button v-on:click="connect">Connect</button>
        </div>
    </div>
</template>

<script>
import PeerClient from "../peer_client.js"

export default {
    data: function(){
        return {
            connection: null
        }
    },
    computed: {
        meeting_id() {
            return this.$route.params.meeting_id
        },
        connected(){
            return this.connection != null && this.connection.connected()
        }
    },
    mounted(){
    },
    methods: {
        connect(){
            console.log("Calling",this.meeting_id)
            this.connection = new PeerClient(this.meeting_id,this.$refs['video'])
            this.connection.call(this.meeting_id)
        }
    }
}
</script>