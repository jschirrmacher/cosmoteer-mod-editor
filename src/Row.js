import React, { Component } from 'react'
import './Row.css'

class Row extends Component {
    state = {active: false}

    select() {
        this.setState({active: !this.state.active})
    }

    render() {
        let description = this.state.active ? <span className="description">{this.props.data.description}</span> : ''
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

export default Row
