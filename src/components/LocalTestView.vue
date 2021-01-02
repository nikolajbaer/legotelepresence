<template>
    <div>
        <div>
            <HostView></HostView> 
        </div>
        <div>
            <RemoteView v-bind:meeting_id="meeting_id"></RemoteView>
        </div>
    </div>
</template>

<script>
import HostView from './HostView.vue'
import RemoteView from './RemoteView.vue'

export default {
    components: {
        HostView, 
        RemoteView
    },
    data: function(){
        return {
            meeting_id: "TEST-LOCAL",
        }
    }   
}
</script>