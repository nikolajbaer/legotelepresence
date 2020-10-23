<template>
    <div>
        <h1>Configure Lego Boost</h1>
        <div v-if="deviceInfo != null && deviceInfo.connected">
            <md-button v-on:click="disconnect">Disconnect</md-button>
            <div>Connected</div>

            <h2>Test Robot</h2>
            <md-button v-on:click="boost.forward()">Forward</md-button>
            <md-button v-on:click="boost.left()">Left</md-button>
            <md-button v-on:click="boost.right()">Right</md-button>
            <md-button v-on:click="boost.back()">Back</md-button>

            <h2>Invite Guest</h2>
            <button v-on:click="invite_guest">Invite</button>
        </div>
        <div v-else>
            <div>Not Connected</div>
            <md-button v-on:click="connect">Connect</md-button>
        </div>
    </div>
</template>

<script>
import BoostController from '../boost_control.js';

export default {
    data: function() {
        return {
            updater: null,
            deviceInfo: null
        }
    },
    computed:{
        boost(){
            return this.$store.getters.boost;
        }
    },
    mounted(){
        this.updater = setInterval(this.updateState,200);
        if(this.boost == null){
            this.$store.commit('create_boost')
        }
    },
    destroyed(){
        clearInterval(this.updater);
    },
    methods: {
        updateState: function(){
            if(this.boost != null){
                this.deviceInfo = this.boost.boost.deviceInfo
            }else{
                this.deviceInfo = null
            }
        },
        connect: function(){
            // todo move to store action
            this.boost.connect();
        },
        disconnect: function(){
            // todo move to store action
            if( this.boost.connected ){
                this.boost.disconnect();
            }
        },
        invite_guest: function(){
            this.$router.push( {path: 'host' } )
        }
    }
}
</script>