import React, { Component } from 'react'
import './ModRow.css'

class ModRow extends Component {
    state = {
        active: false,
        value: {}
    }

    componentWillMount() {
        this.setState({ value: this.props.data })
    }

    select() {
        this.setState({ active: true })
    }

    changed(change) {
        this.setState(state => {
            state.value[change.name] = change.value
            return {
                value: state.value
            }
        })
    }

    render() {
        function getDescription(data) {
            return {__html: data.description}
        }

        return (
            <li onClick={() => this.select()}>
                <img src={this.props.data.logo} alt="Mod Logo" />
                <input type="text" name="title" value={this.props.data.title} onChange={e => this.changed(e.target)} />
                <input type="text" name="author" value={this.props.data.author} onChange={e => this.changed(e.target)} />
                <input type="text" name="version" value={this.props.data.version} onChange={e => this.changed(e.target)} />
                <span className="description" contentEditable onInput={e => this.changed(e.target)}
                    dangerouslySetInnerHTML={getDescription(this.props.data)}></span>
            </li>
        )
    }
}

export default ModRow
