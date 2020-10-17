<template>
    <div>
        <h1 v-if="session_id != null">{{ session_id }}</h1>
        <h1 v-else>Establishing Connection</h1>
        <div v-if="client_connected">Waiting on Client Connection</div>
        <button v-on:click="disconnect">Disconnect</button>
        <video ref="video" width="800" height="600"></video>
    </div>
</template>

<script>
import PeerHost from "../peer_host.js"

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
        this.connection = new PeerHost(this.$refs['video']);
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
