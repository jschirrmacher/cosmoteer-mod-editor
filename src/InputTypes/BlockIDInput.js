/**
 * Created by Jasper on 25.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class BlockIDInput extends Component {

    componentWillMount(){
        this.setState({
            value: this.props.value
        })
        fetch('/mods/' + this.props.modId + '/getAllParts')
            .then(req => req.json())
            .then(result => {
                this.setState({parts: result})
            })
            .catch(e => {
                alert(e)
            })
    }

    selectAction(e) {
        this.setState({value: e.value})
        this.props.edit(this.props.name, e.value)
    }

    render() {
        let action = (
            <select value={this.state.value} onChange={e => this.selectAction(e.target)}>
                {this.state && this.state.parts ?
                    this.state.parts.map(part => <option value={part}>{part}</option>) : ''}
            </select>
        )
        return (
            <div>
                <label>{this.props.name}</label>
                {action}
            </div>
        )
    }
}

export default BlockIDInput
