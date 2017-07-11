import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Row from './Row'

class App extends Component {
    state = {
        mods: []
    }

    componentWillMount() {
        const req = new XMLHttpRequest()
        req.onload = this.listener.bind(this)
        req.open('get', 'http://localhost:3001/mods')
        req.send()
    }

    listener(event) {
        this.setState(JSON.parse(event.currentTarget.responseText))
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Cosmoteer Mod Editor</h2>
                </div>
                <ul className="App-intro">
            {this.state.mods.length
                ? this.state.mods.map((row) => <Row key={row.id} name={row.name} />)
                : 'Keine Mods gefunden'
                }
                </ul>
            </div>
        )
    }
}

export default App;
