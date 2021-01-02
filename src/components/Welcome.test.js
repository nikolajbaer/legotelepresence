import Vue from 'vue';
import VueRouter from 'vue-router'
import Component from './Welcome.vue'
import { mount, createLocalVue } from '@vue/test-utils'

import VueMaterial from 'vue-material'
Vue.use(VueMaterial)

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

test('Welcome renders', () => {
  const wrapper = mount(Component, {
    localVue,
    router
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Requirements')
})
