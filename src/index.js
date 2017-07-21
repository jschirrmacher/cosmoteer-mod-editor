import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import reducer from './reducers'
import registerServiceWorker from './registerServiceWorker'

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger)
}

const store = createStore(reducer, applyMiddleware(...middleware))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'))

registerServiceWorker()
