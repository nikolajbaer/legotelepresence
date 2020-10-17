// Routed components
import Welcome from "./components/Welcome.vue";
import Configure from "./components/Configure.vue";
import HostView from "./components/HostView.vue";
import RemoteView from "./components/RemoteView.vue";
import LocalTestView from "./components/LocalTestView.vue";
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
            component: HostView
        },
        {
            path: '/rc/:meeting_id', 
            name: 'remotecontrol',
            component: RemoteView,
            props: true,
        },
        {
            path: '/test', 
            name: 'test-local',
            component: LocalTestView,
            props: true,
        },
    ],
});