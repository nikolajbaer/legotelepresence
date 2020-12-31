<template>
    <div>
        <h3>Select Camera</h3>
        <select v-model="device_id">
            <option v-bind:key="device.value" v-for="device in devices" v-bind:value="device.value">{{ device.label }}</option>
        </select> 
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
            this.connection.changeVideoDevice(newVal)
        }
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