<template>
    <div>
        <h1>{{ name }}</h1>
        <video width="100%" height="100%"></video>
        <p>Tap anywhere to disable control</p>
        <button v-on:click="disconnect">Disconnect</button>
    </div>
</template>

<script>
export default {
     data: function() {
        return {
            boost: null,
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
        disconnect: function(){

        }
    }   
}
</script>
