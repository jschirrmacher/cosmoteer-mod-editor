/*global it, beforeAll*/
import React from 'react'           // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme'    // eslint-disable-line no-unused-vars
import { expect } from 'chai'

import App from './App'             // eslint-disable-line no-unused-vars
import Row from './ModRow'          // eslint-disable-line no-unused-vars

global.fetch = require('jest-fetch-mock')

beforeAll(done => {
    fetch.mockResponse(JSON.stringify({mods: []}))
    done()
})

it('renders without crashing', () => {
    shallow(<App />)
})

it('renders a message when there are no mods', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('.ModList').length).to.equal(1)
    expect(wrapper.find('.ModList').text()).to.equal('No Mods found')
})

it('renders a form', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('form')).to.have.length(1)
})

it('renders a list of mods', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find(Row)).to.have.length(0)
    wrapper.setState({mods: [{id: 1, name: 'test'}, {id: 2, name: 'test 2'}]})
    expect(wrapper.find(Row)).to.have.length(2)
})
