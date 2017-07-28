/**
 * Created by Jasper on 24.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class EditorGroup extends Component {

    componentWillMount(){

        var value = this.props.value !== undefined && this.props.value !== null ? this.props.value : 'weapons'
        this.setState({
            value: value
        })
        this.props.edit(this.props.name, value)
    }

    selectAction(e) {
        this.setState({value: e.value})
        this.props.edit(this.props.name, e.value)
    }

    render() {
        let action = (
            <select value={this.state.value} onChange={e => this.selectAction(e.target)}>
                <option value="weapons">Weapons</option>
                <option value="defenses">Defenses</option>
                <option value="flight">Flight</option>
                <option value="munitions">Munitions</option>
                <option value="power">Power</option>
                <option value="crew">Crew</option>
                <option value="misc">Misc</option>
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
