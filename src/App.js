import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Row from './ModRow'

class App extends Component {
    state = {
        mods: []
    }

    componentWillMount() {
        fetch('/mods')
            .then(res => res.json())
            .then(state => this.setState(state))
            .catch((e) => {
                throw new Error('fetch failed: ' + e)
            })
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
                ? this.state.mods.map((row) => <Row key={row.id} data={row} />)
                : 'Keine Mods gefunden'
                }
                </ul>
            </div>
        )
    }
}

export default App;
