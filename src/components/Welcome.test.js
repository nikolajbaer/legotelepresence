import vue_setup from './jest.vue_env.js'
import Component from './Welcome.vue'
import { mount } from '@vue/test-utils'

let vue_env = vue_setup()

test('Welcome renders', () => {
  const wrapper = mount(Component, {
    localVue: vue_env.localVue,
    router: vue_env.router
  })

  // Assert the rendered text of the component
  expect(wrapper.text()).toContain('Requirements')
})
