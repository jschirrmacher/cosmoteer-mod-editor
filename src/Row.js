import React, { Component } from 'react'
import './Row.css'

class Row extends Component {
    render() {
        let description = this.props.active ? <span className="description">{this.props.data.description}</span> : ''
        return (
            <li>
                <img src={this.props.data.logo} />
                <span className="title">{this.props.data.title}</span>
                <span className="author">{this.props.data.author}</span>
                <span className="version">{this.props.data.version}</span>
                {description}
            </li>
        )
    }
}

export default Row
