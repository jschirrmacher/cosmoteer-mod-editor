/**
 * Created by Jasper on 24.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class BoolInput extends Component {

    componentWillMount(){
        this.setState({
            value: this.props.value !== '' ? this.props.value : false
        })
    }

    change(e) {
        this.setState({value: e.target.checked})
        this.props.edit(this.props.name, e.target.checked)
    }

    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                <input type="checkbox" onChange={e => this.change(e)}
                    checked={this.state.value} />
            </div>
        )
    }
}

export default BoolInput
