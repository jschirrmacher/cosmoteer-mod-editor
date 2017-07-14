import React, { Component } from 'react'
import './App.css'
import Row from './ModRow'

class App extends Component {

    state = {
        mods: [],
        newMod: {},
        newModData: {hasError : false, message: ""}
    }

    handleInputChange(event) {
        const target = event.target;
        this.setState((state) => {
            state.newMod[target.name] = target.value
            return state
        })
    }

    componentWillMount() {
        let newMods = undefined
        fetch('/mods')
            .then(res => res.json())
            .then(state => {
                newMods = state.mods
                //Sort mods
                newMods.sort((a, b) => {
                    let textA = a.title.toUpperCase();
                    let textB = b.title.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })
                this.setState({mods: newMods})})
            .catch((e) => {
                throw new Error('fetch failed: ' + e)
            })
    }

    handleSubmit(event) {
        //Check if all data is there
        let data = this.state.newMod
        if (data.id !== undefined && data.name !== undefined && data.author !== undefined && data.version !== undefined) {
            fetch("/mods", {method: 'POST', body: JSON.stringify(this.state.newMod), headers: {'Content-Type':'application/json'}})
            .then((response) => response.json())
            .then((response) => {
                if (!response.error) {
                    this.setState((state) => {
                        state.mods.push(response)
                        state.mods.sort((a, b) => {
                            let textA = a.title.toUpperCase();
                            let textB = b.title.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        })
                        state.newModData.hasError = false
                        return state
                    })
                }
                else{
                    this.setState((state) => {
                        state.newModData.hasError = true
                        state.newModData.message = response.error
                    })
                }
            })
        } else{
            this.setState((state) => {
                state.newModData.hasError = true
                state.newModData.message = "Please fill in all fields!"
                return state
            })
        }
        event.preventDefault()
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

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src="https://cosmoteer.net/site_images/logo.png" className="App-logo" alt="logo" />
                    <h2>Mod Editor</h2>
                </div>
                <ul className="App-intro">
                {this.state.mods.length
                    ? this.state.mods.map((row) => <Row key={row.id} data={row} rowChanged={v => this.rowChanged(v)}/>)
                    : 'Keine Mods gefunden'
                }
                </ul>
                <div className="addMod">
                    <img className="addModImage" src="/mods/x/media/logo.png" alt="" />
                    <form className="addModForm" onSubmit={(event) => this.handleSubmit(event)}>
                        <div className="newModDiv" id="newModID">
                            Mod ID:
                            <input className="newModInput" type="text" name="id" onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <div className="newModDiv" id="newModName">
                            Name:
                            <input className="newModInput" type="text" name="name" onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <div className="newModDiv" id="newModAuthor">
                            Author:
                            <input className="newModInput" type="text" name="author" onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <div className="newModDiv" id="newModVersion">
                            Version: <input className="newModInput" type="text" name="version" onChange={(event) => this.handleInputChange(event)}/>
                        </div>
                        <input className="newModSubmit" type="submit" value="Create Mod"/>
                    </form>
                    {this.state.newModData.hasError ? <p id="newModError">{this.state.newModData.message}</p> : ""}
                </div>
            </div>

        )
    }
}

export default App;
