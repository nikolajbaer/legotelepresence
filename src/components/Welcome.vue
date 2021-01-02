<template>
    <div>
        <p>Lego Boost Telepresecence is a tool to let you create a telepresence robot using the Lego Boost brick and a smartphone or chromebook</p>
        <h3>Requirements</h3>
        <ul>
            <li>Lego Boost Brick</li>
            <li>
                Ideally, a lego build that lets you place your phone or device onto the Lego Boost brick so that your guest can drive / manipulate it remotely! Check out these examples or be Creative!
            </li>
            <li>
                Device that supports Web Bluetooth
                e.g. Android Phone, Chromebook
            </li>
            <li>
                A friend or relative to "teleport" into your home!
            </li>
        </ul>

        <h3>Host someone with your Lego Boost</h3>
        <router-link class="md-button" to="host">Host a Session</router-link>

        <h3>Teleport to a Robot</h3>
        <md-field>
            <label>Meeting Id</label>
            <md-input v-model="meeting_id" placeholder="Enter Meeting Id" /> 
        </md-field>
        <md-button v-on:click="join">Join</md-button>
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            meeting_id: ""
        }
    },
    methods: {
        join: function(){
            if( this.meeting_id ){
                this.$router.push({ name: 'remotecontrol', params: {"meeting_id": this.meeting_id}})
            }
        }
    }
}
</script>