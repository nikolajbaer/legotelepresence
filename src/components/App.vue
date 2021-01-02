<template>
    <div class="page-container">
        <md-app>
            <md-app-toolbar class="md-primary">
                <div class="md-toolbar-section-start">
                    <router-link to="/">
                        <h1 class="md-title" style="flex: 1">
                            Lego Boost Telepresence
                        </h1>
                    </router-link>
                </div>

                <div class="md-toolbar-section-end">
                    <span v-if="boost && boost.connected()">🔌 Boost Connected</span>
                </div>
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
    computed: {
        boost(){
            return this.$store.getters.boost;
        }
    }
}
</script>