<template>
    <div>
        <h1>Remote Control</h1>
        <div v-if="connection != null">
            <h2>You Are In Control</h2>
        </div>
        <div v-else>
            <h2>Connecting!</h2>
        </div>
    </div>
</template>

<script>
export default {
    props: ["meeting_id"],
    data: function(){
        return {
            connection: null
        }
    }
}
</script>