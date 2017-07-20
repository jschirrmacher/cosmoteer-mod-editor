import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import './App.css'
import Row from './ModRow'      // eslint-disable-line no-unused-vars
import AddMod from './AddMod'   // eslint-disable-line no-unused-vars

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mods: []
        }
    }

    static titleSort(a, b) {
        return a.name.localeCompare(b.name)
    }

    componentWillMount() {
        fetch('/mods')
            .then(res => res.json())
            .then(state => this.setState({mods: state.mods.sort(App.titleSort)}))
            .catch(e => {
                throw new Error('fetch failed: ' + e)
            })
    }

    addNewMod(mod) {
        this.setState(state => {
            state.mods.push(mod)
            state.mods.sort(App.titleSort)
            return state
        })
    }

    rowChanged(value) {
        this.state.mods.some((row, index, mods) => {
            if (row.id === value.id) {
                mods[index] = value
                this.setState({mods})
                return true
            } else {
                return false
            }
        }, this)
    }

    rowSelected(id) {
        this.setState({
            selectedRow: id
        })
    }

    render() {
        return <div className="App">
            <div className="App-header">
                <img src="https://cosmoteer.net/site_images/logo.png" className="App-logo" alt="logo" />
                <h2>Mod Editor</h2>
            </div>
            <ul className="ModList">
                {this.state.mods.length
                    ? this.state.mods.map((row) => <Row key={row.id} data={row}
                        selected={this.state.selectedRow === row.id}
                        rowChanged={v => this.rowChanged(v)}
                        onUserClick={() => this.rowSelected(row.id)}
                    />)
                    : 'No Mods found'
                }
            </ul>
            <AddMod addNewMod={mod => this.addNewMod(mod)}/>
        </div>
    }
}

export default App
