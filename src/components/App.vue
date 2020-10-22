<template>
    <div class="page-container">
        <md-app>
            <md-app-toolbar class="md-primary">
                <h1 class="md-title">Lego Boost Telepresence</h1>
            </md-app-toolbar>

            <md-app-content>
                <router-view></router-view>
            </md-app-content>

        </md-app>
    </div>
</template>

<script>

export default {
    data: function() {
        return {
        }
    },
}
</script>