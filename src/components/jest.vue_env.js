import Vue from 'vue';
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import { createLocalVue } from '@vue/test-utils'
import "regenerator-runtime/runtime";

export default function(){

    Vue.use(VueMaterial)

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = new VueRouter()

    const o = {}
    o.localVue = localVue
    o.router = router

    return o
}
