import React from 'react'

class AddMod extends React.Component {
    constructor(props) {
        super(props)
        this.data = {}
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
    }

    handlePostError(error) {
        this.setState({error: error})
    }

    render() {
        return (
            <div className="addMod">
                <img className="addModImage" src="/mods/x/media/logo.png" alt="" />
                <form className="addModForm" onSubmit={e => {
                    e.preventDefault()
                    this.postNewMod({
                        id: this.data.modId.value.trim(),
                        name: this.data.name.value.trim(),
                        author: this.data.author.value.trim(),
                        version: this.data.version.value.trim()
                    }, result => this.handlePostResult(result), error => this.handlePostError(error))
                }}>
                    <div className="newModDiv" id="newModID">
                        Mod ID:
                        <input className="newModInput" type="text" name="id" ref={i => this.data.modId = i}/>
                    </div>
                    <div className="newModDiv" id="newModName">
                        Name:
                        <input className="newModInput" type="text" name="name" ref={i => this.data.name = i}/>
                    </div>
                    <div className="newModDiv" id="newModAuthor">
                        Author:
                        <input className="newModInput" type="text" name="author" ref={i => this.data.author = i}/>
                    </div>
                    <div className="newModDiv" id="newModVersion">
                        Version:
                        <input className="newModInput" type="text" name="version" ref={i => this.data.version = i}/>
                    </div>
                    <input className="newModSubmit" type="submit" value="Create Mod"/>
                </form>
                {this.state && this.state.error ?  <p id="newModError">{this.state.error}</p> : ''}
            </div>
        )
    }
}

export default AddMod
