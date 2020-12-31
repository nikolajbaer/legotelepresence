import VueRouter from 'vue-router'
import Component from '../src/components/Welcome.vue'

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
