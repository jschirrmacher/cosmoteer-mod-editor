import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import './ModRow.css'
import TextareaAutosize from 'react-autosize-textarea' // eslint-disable-line no-unused-vars

class ModRow extends Component {

    changed(e) {
        let value = this.props.data
        value[e.target.getAttribute('name')] = e.target.value || e.target.innerHTML
        this.props.rowChanged(value)

        fetch('/mods/' + this.props.data.id, {
            method: 'PUT',
            body: JSON.stringify(value),
            headers: {'Content-Type':'application/json'}
        })
            .then(res => res.json())
            .then(response => {
                if (response.error) {
                    throw response.error
                }
            })
            .catch(error => alert(error))
    }

    pictureChanged(input) {
        fetch('/mods/upload/picture/' + this.props.data.id,{  method: 'POST',
            body: new FormData(input.parentNode.parentNode)
        })
            .then(res => res.json())
            .then(response => {
                if (response.error) {
                    throw response.error
                }
                let value = this.props.data
                value.logo = response
                this.props.rowChanged(value)
            })
            .catch(error => alert(error))

    }

    createNewPart() {

    }

    render() {
        function getDescription(data) {
            return {__html: data.description.replace(/\\n/g,"\n")}
        }

        let description = this.props.selected ?
            <TextareaAutosize className="description" name="description"
                onChange={e => this.changed(e)}
                value={this.props.data.description.replace(/\\n/g,'\n')} /> :
            <span className="description" dangerouslySetInnerHTML={getDescription(this.props.data)} />

        let userChoices

        if(this.props.newPartData) {
            userChoices = this.props.newPartData.map((userInput) => {
                switch(userInput.type){
                    case 'string':
                        return (<div>
                            <p>{userInput.text}</p>
                            <input type="text" name = {userInput.id}/>
                        </div>)
                    default:
                        return ''
                }
            })
            userChoices = <div>{userChoices} <button onClick={() => this.createNewPart()}> Create </button> </div>
        }
        else userChoices = ''

        let modEditor = this.props.selected ?
            <div className = "modPartEditor ">
                <hr/>
                <p>To Show</p>
                <div className="dropdown">
                    <button className="dropbtn">Add new Part</button>
                    <div className="dropdown-content">
                        <a id="addShipLibrary" onClick={e => this.props.requestDataAboutNewPart(e)}>Add Ship Library</a>
                    </div>
                </div>
            {userChoices}
            </div> : ''

        return (
            <li onClick = {() => this.props.onUserClick()}>
                <div className = "modTitleContainer">
                    <form>
                        <div className="image-upload">
                            <label htmlFor={this.props.data.id + 'file-input'}>
                                <img src={this.props.data.logo} alt="Mod Logo"/>
                            </label>
                            <input className="file-input" id={this.props.data.id + 'file-input'} type="file" onChange={e => this.pictureChanged(e.target)} name="picture"/>
                        </div>
                    </form>
                    <input type="text" name="name" value={this.props.data.name} onChange={e => this.changed(e)} />
                    <input type="text" name="author" value={this.props.data.author} onChange={e => this.changed(e)} />
                    <input type="text" name="version" value={this.props.data.version} onChange={e => this.changed(e)} />
                    {description}
                </div>
            {modEditor}
            </li>
        )
    }
}

export default ModRow
