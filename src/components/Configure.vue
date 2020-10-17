<template>
    <div>
        <h1>Configure Lego Boost</h1>
        <div v-if="deviceInfo != null && deviceInfo.connected">
            <button v-on:click="disconnect">Disconnect</button>
            <div>Connected</div>

            <h2>Test Robot</h2>
            <button v-on:click="boost.forward()">Forward</button>
            <button v-on:click="boost.left()">Left</button>
            <button v-on:click="boost.right()">Right</button>
            <button v-on:click="boost.back()">Back</button>

            <h2>Invite Guest</h2>
            <button v-on:click="invite_guest">Invite</button>
        </div>
        <div v-else>
            <div>Not Connected</div>
            <button v-on:click="connect">Connect</button>
        </div>
    </div>
</template>

<script>
import BoostController from '../boost_control.js';

export default {
    data: function() {
        return {
            boost: null,
            updater: null,
            deviceInfo: null
        }
    },
    mounted(){
        this.boost = new BoostController();
        this.updater = setInterval(this.updateState,200);
    },
    destroyed(){
        clearInterval(this.updater);
    },
    methods: {
        updateState: function(){
            this.deviceInfo = this.boost.boost.deviceInfo
        },
        connect: function(){
            this.boost.connect();
        },
        disconnect: function(){
            this.boost.disconnect();
        },
        invite_guest: function(){
            alert("Todo create invite link");
        }
    }
}
</script>