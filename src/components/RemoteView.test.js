import vue_setup from './jest.vue_env.js'
import { mount } from '@vue/test-utils'
import Vue from 'vue';

// Mock the RTC Peer
import RTCPeer from "../RTCPeer.js"
jest.mock('../RTCPeer.js')

let vue_env = vue_setup()


import Component from './RemoteView.vue'

test('Remote View', async () => {
    let test_meeting_id = null
    RTCPeer.mockImplementation( () => {
        return {
            connected: false,
            ready_to_call: true,
            meeting_id: test_meeting_id,
            call(meeting_id){ test_meeting_id = meeting_id }
        }
    })

    const wrapper = mount(Component, {
        propsData: {
            meeting_id: "test-meeting-id" 
        }
    })

    expect(RTCPeer).toHaveBeenCalled()

    await Vue.nextTick()
    
    console.log(wrapper.html())
    await wrapper.find('button').trigger("click")

    expect(test_meeting_id).toBe("test-meeting-id")

})