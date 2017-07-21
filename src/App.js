import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { connect } from 'react-redux'
import { listMods, selectMod } from './actions'
import './App.css'
import Row from './ModRow'      // eslint-disable-line no-unused-vars
import AddMod from './AddMod'   // eslint-disable-line no-unused-vars

class App extends Component {
    componentDidMount() {
        this.props.listMods()
    }

    static titleSort(a, b) {
        return a.name.localeCompare(b.name)
    }

    addNewMod(mod) {
        this.setState(state => {
            state.mods.push(mod)
            state.mods.sort(App.titleSort)
            return state
        })
    }

    rowChanged(value) {
        this.props.mods.some((row, index, mods) => {
            if (row.id === value.id) {
                mods[index] = value
                this.setState({mods})
                return true
            } else {
                return false
            }
        }, this)
    }

    render() {
        let modList = (<div>
            <ul className="ModList">
                {this.props.mods.length
                    ? this.props.mods.map((row) => <Row key={row.id} data={row}
                        selected={this.props.selectedRow === row.id}
                        rowChanged={v => this.rowChanged(v)}
                        onUserClick={() => this.props.rowSelected(row.id)}
                    />)
                    : 'No Mods found'
                }
            </ul>
            < AddMod addNewMod={mod => this.addNewMod(mod)}/>
        </div>)

        return <div className="App">
            <div className="App-header">
                <img src="https://cosmoteer.net/site_images/logo.png" className="App-logo" alt="logo" />
                <h2>Mod Editor</h2>
            </div>
            {this.props.error ? <p className="error">{this.props.error}</p> :
                this.props.isLoading ? <p>Loading…</p> : modList}
        </div>
    }
}

const mapStateToProps = state => {
    return {
        mods: state.listMods,
        error: state.listModsHasError,
        isLoading: state.listModsIsLoading,
        selectedRow: state.selectMod
    }
}

const mapDispatchToProps = dispatch => {
    return {
        listMods: () => dispatch(listMods()),
        rowSelected: (id) => dispatch(selectMod(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
