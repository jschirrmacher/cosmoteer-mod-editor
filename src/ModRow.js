import React, { Component } from 'react'
import './ModRow.css'

class ModRow extends Component {
    state = {active: false}

    select() {
        this.setState({active: !this.state.active})
    }

    render() {
        function getDescription(data) {
            return {__html: data.description}
        }

        let description = this.state.active ?
            <span className="description" dangerouslySetInnerHTML={getDescription(this.props.data)}></span> :
            ''
        return (
            <li onClick={() => this.select()}>
                <img src={this.props.data.logo} />
                <span className="title">{this.props.data.title}</span>
                <span className="author">{this.props.data.author}</span>
                <span className="version">{this.props.data.version}</span>
                {description}
            </li>
        )
    }
}

export default ModRow
