// Routed components
import Welcome from "./components/Welcome.vue";
import Configure from "./components/Configure.vue";
import ActiveTelePresence from "./components/ActiveTelePresence.vue";
import RemoteControl from "./components/RemoteControl.vue";
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

// Router
export default new Router({
    routes: [
        {
            path: '/', 
            name: 'welcome',
            component: Welcome,
        },
        {
            path: '/configure', 
            name: 'configure',
            component: Configure
        },
        {
            path: '/host',
            name: 'host',
            component: ActiveTelePresence
        },
        {
            path: '/rc/:meeting_id', 
            name: 'remotecontrol',
            component: RemoteControl,
            props: true,
        },
    ],
});