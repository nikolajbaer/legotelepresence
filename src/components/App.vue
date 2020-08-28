<template>
    <div>
        <h1>Lego Boost Telepresence</h1>
        <div v-if="deviceInfo != null && deviceInfo.connected">
            <button v-on:click="disconnect">Disconnect</button>
            <div>Connected</div>
            <button v-on:click="boost.forward()">Forward</button>
            <button v-on:click="boost.left()">Left</button>
            <button v-on:click="boost.right()">Right</button>
            <button v-on:click="boost.back()">Back</button>
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
        }
    }
}
</script>