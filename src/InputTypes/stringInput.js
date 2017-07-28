/**
 * Created by Jasper on 24.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class StringInput extends Component {

    componentWillMount(){
        let value = this.props.value !== '' && this.props.value !== undefined ? this.props.value : this.props.name + '1'
        this.setState({
            value: value
        })
        this.props.edit(this.props.name, value)
    }

    change(e) {
        this.setState({value: e.target.value})
        this.props.edit(this.props.name, e.target.value)
    }

    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                <input type="text" onChange={e => this.change(e)}
                    value={this.state ? this.state.value : ''} />
            </div>
        )
    }
}

export default StringInput
