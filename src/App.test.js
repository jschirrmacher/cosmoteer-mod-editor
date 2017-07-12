import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
global.fetch = require('jest-fetch-mock')

it('renders without crashing', () => {
    const div = document.createElement('div')
    fetch.mockResponse(JSON.stringify({
        mods: [{id: 1, name: 'test'}]
    }))
    ReactDOM.render(<App />, div)
})
