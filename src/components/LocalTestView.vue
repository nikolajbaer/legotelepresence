<template>
    <div>
        <div style="width: 50%; position: absolute; left: 0px; top: 100px; border: 1px;">
            <HostView></HostView> 
        </div>
        <div style="width: 50%; position: absolute; right: 0px; top: 100px; boreder: 1px;">
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