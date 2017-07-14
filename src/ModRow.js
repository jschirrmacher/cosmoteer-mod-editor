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

    render() {
        function getDescription(data) {
            return {__html: data.description}
        }

        return (
            <li>
                <img src={this.props.data.logo} alt="Mod Logo" />
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
