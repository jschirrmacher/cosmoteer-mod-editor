import React, { Component } from 'react'
import './ModRow.css'
import TextareaAutosize from 'react-autosize-textarea'

class ModRow extends Component {
    state = {
        selected: false
    }

    select() {
        this.setState({selected: true})
    }

    deselect() {
        this.setState({selected: false})
    }

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
        fetch("/mods/upload/picture/" + this.props.data.id,{  method: 'POST',
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


    render() {
        function getDescription(data) {
            return {__html: data.description}
        }

        let description = this.state.selected ?
            <TextareaAutosize className="description" name="description"
                onChange={e => this.changed(e)}
                onBlur={() => this.deselect()}
                value={this.props.data.description} /> :
            <span className="description" onClick={() => this.select()}
                dangerouslySetInnerHTML={getDescription(this.props.data)} />

        return (
            <li>
                <form>
                    <div className="image-upload">
                        <label htmlFor={this.props.data.id + "file-input"}>
                            <img src={this.props.data.logo} alt="Mod Logo"/>
                        </label>
                        <input className="file-input" id={this.props.data.id + "file-input"} type="file" onChange={e => this.pictureChanged(e.target)} name="picture"/>
                    </div>
                </form>
                <input type="text" name="title" value={this.props.data.title} onChange={e => this.changed(e)} />
                <input type="text" name="author" value={this.props.data.author} onChange={e => this.changed(e)} />
                <input type="text" name="version" value={this.props.data.version} onChange={e => this.changed(e)} />
                {description}
            </li>
        )
    }
}

export default ModRow
