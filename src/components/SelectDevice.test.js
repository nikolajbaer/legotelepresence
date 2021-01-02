import vue_setup from './jest.vue_env.js'
import { mount } from '@vue/test-utils'
import Component from './SelectDevice.vue'
import Vue from 'vue';

let vue_env = vue_setup()

const conn_mock = {
    test_device: null,
    changeVideoDevice(newVal) { this.test_device = newVal },
    devices: [
        {label:"Test 1",deviceId:"test1",kind:'videoinput'},
        {label:"Test 2",deviceId:"test2",kind:'videoinput'},
        {label:"Test Ingore",deviceId:"test-ignore",kind:'audioinput'},
        {label:"Test Ingore 2",deviceId:"",kind:'videoinput'}
    ]
}

test('Device drop down shows all devices', async () => {
  const wrapper = mount(Component, {
    propsData: {
        connection: conn_mock
    }
  })

  // We need to give the component a chance to render the <select>
  await Vue.nextTick()

  //console.log(wrapper.htm())

  // Assert that we have all the passing options in the devices list
  expect(wrapper.findAll('option').length).toBe(3)

  // trigger select of device
  // Select 3rd option (the second device, since 0 is "Select Camera")
  await wrapper.findAll('option').at(2).setSelected()
  expect(conn_mock.test_device).toBe("test2")

  // no change if we select the empty "Select Camera" again
  await wrapper.findAll('option').at(0).setSelected()
  expect(conn_mock.test_device).toBe("test2")
 
})
