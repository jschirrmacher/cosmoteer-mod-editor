import React from 'react'

class AddMod extends React.Component {
    constructor(props) {
        super(props)
        this.state = {id: '', name: '', author: '', version: ''}
    }

    postNewMod(data, success, error) {
        if (!data.id || !data.name || !data.author || !data.version) {
            this.setState({error: 'Please fill in all fields!'})
        } else {
            fetch('/mods', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            })
                .then(response => response.json())
                .then(response => {
                    if (response.error) {
                        error(response.error)
                    } else {
                        success(response)
                    }
                })
                .catch(e => {
                    error(e)
                })
        }
    }

    handlePostResult(response) {
        this.props.addNewMod(response)
        this.setState({id: '', name: '', author: '', version: ''})
    }

    handlePostError(error) {
        this.setState({error: error})
    }

    inputChange(e) {
        this.setState(state => {
            state[e.target.name] = e.target.value
            return state
        })
    }

    render() {
        return (
            <div className="addMod">
                <img className="addModImage" src="/mods/x/media/logo.png" alt="" />
                <form className="addModForm" onSubmit={e => {
                    e.preventDefault()
                    this.postNewMod({
                        id: this.state.id.trim(),
                        name: this.state.name.trim(),
                        author: this.state.author.trim(),
                        version: this.state.version.trim()
                    }, result => this.handlePostResult(result), error => this.handlePostError(error))
                }}>
                    <div className="newModDiv" id="newModID">
                        Mod ID:
                        <input className="newModInput" type="text" name="id" value={this.state.id}
                            onChange={e => this.inputChange(e)}/>
                    </div>
                    <div className="newModDiv" id="newModName">
                        Name:
                        <input className="newModInput" type="text" name="name" value={this.state.name}
                            onChange={e => this.inputChange(e)} />
                    </div>
                    <div className="newModDiv" id="newModAuthor">
                        Author:
                        <input className="newModInput" type="text" name="author" value={this.state.author}
                            onChange={e => this.inputChange(e)} />
                    </div>
                    <div className="newModDiv" id="newModVersion">
                        Version:
                        <input className="newModInput" type="text" name="version" value={this.state.version}
                            onChange={e => this.inputChange(e)} />
                    </div>
                    <input className="newModSubmit" type="submit" value="Create Mod"/>
                </form>
                {this.state.error && <p id="newModError">{this.state.error}</p>}
            </div>
        )
    }
}

export default AddMod
