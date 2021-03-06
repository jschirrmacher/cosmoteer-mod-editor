/*eslint-env node*/
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars
import './ModRow.css'
import TextareaAutosize from 'react-autosize-textarea' // eslint-disable-line no-unused-vars
import PartEditor from './PartEditor'                  // eslint-disable-line no-unused-vars

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

    saveComponent(data) {
        let uri = '/mods/' + this.props.data.id + '/parts/' + data.type
        let method = data.create ? 'POST' : 'PUT'
        delete data.type
        delete data.create
        fetch(uri, {method, body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
            .then(res => res.json())
            .then(result => {
                alert(result)
            })
            .catch(e => alert(e))
    }

    render() {
        function getDescription(data) {
            return {__html: data.description.replace(/\\n/g,'\n')}
        }

        let description = this.props.selected ?
            <TextareaAutosize className="description" name="description"
                onChange={e => this.changed(e)}
                value={this.props.data.description.replace(/\\n/g,'\n')} /> :
            <span className="description" dangerouslySetInnerHTML={getDescription(this.props.data)} />

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
                {this.props.selected ?
                    <PartEditor modId={this.props.data.id} mod={this.props.data} saveComponent={data => this.saveComponent(data)} /> :
                    ''
                }
            </li>
        )
    }
}

export default ModRow
