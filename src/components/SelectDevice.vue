<template>
    <div>
        <h3>Select Camera</h3>
        <md-select v-model="device_id">
            <md-option v-bind:key="device.value" v-for="device in devices" v-bind:value="device.value">
                {{ device.label }}
            </md-option>
        </md-select> 
    </div>
</template>

<script>
export default {
    props: ['connection'],
    data: function() {
        return {
            devices: null,
            device_id: '',
        }
    },
    watch: {
        'connection.devices': function(newVal, oldVal){
            this.update_devices()
        },
        device_id: function(newVal, oldVal) {
            if(newVal != ''){
                this.connection.changeVideoDevice(newVal)
            }
        }
    },
    mounted(){
        this.update_devices()
    },
    methods: {
        update_devices(){
            if(this.connection == null || this.connection.devices == null){ return [] }
            const devices = [{value:'',label:'- Select Camera -'}]
            var n = 1;
            this.connection.devices.forEach( d => {
                if( d.kind === 'videoinput' && d.deviceId != ''){
                    devices.push({value: d.deviceId, label:d.label || `Camera ${n++}`})
                }
            })
            this.devices = devices
        },
    }
}
</script>