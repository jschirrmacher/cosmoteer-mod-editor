import React, { Component } from 'react'
import './ModRow.css'

class ModRow extends Component {
    changed(e) {
        let value = this.props.data
        value[e.target.name] = e.target.value
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
        fetch("/mods/upload/picture/" + this.props.data.id,{  method: 'POST',
            body: new FormData(input.parentNode.parentNode)
        })
        .then(res => res.json())
        .then(response => {
            if (response.error) {
                throw response.error
            }
            alert(response)
        })
        .catch(error => alert(error))

    }

    render() {
        function getDescription(data) {
            return {__html: data.description}
        }

        return (
            <li>
                <form>
                    <div className="image-upload">
                        <label htmlFor="file-input">
                            <img src={this.props.data.logo} alt="Mod Logo"/>
                        </label>
                        <input id="file-input" type="file" onChange={e => this.pictureChanged(e.target)} name="picture"/>
                    </div>
                </form>
                <input type="text" name="title" value={this.props.data.title} onChange={e => this.changed(e)} />
                <input type="text" name="author" value={this.props.data.author} onChange={e => this.changed(e)} />
                <input type="text" name="version" value={this.props.data.version} onChange={e => this.changed(e)} />
                <span className="description" contentEditable onInput={e => this.changed(e)}
                    dangerouslySetInnerHTML={getDescription(this.props.data)}></span>
            </li>
        )
    }
}

export default ModRow
