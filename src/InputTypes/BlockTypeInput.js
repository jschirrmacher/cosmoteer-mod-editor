/**
 * Created by Jasper on 24.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class EditorGroup extends Component {

    componentWillMount(){
        this.setState({
            value: this.props.value
        })
    }

    selectAction(e) {
        this.props.edit(this.props.name, e.value)
        this.setState({value: e.value})
    }

    render() {
        let action = (
            <select value={this.state.value} onChange={e => this.selectAction(e.target)}>
                <option value="operational">Operational</option>
                <option value="structural">Structural</option>
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

export default EditorGroup
