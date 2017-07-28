/**
 * Created by Jasper on 24.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class IntInput extends Component {

    componentWillMount(){
        this.setState({
            value: this.props.value !== '' ? this.props.value : '0'
        })
    }

    change(e) {
        var raw_val = e.target.value
        raw_val = raw_val === '' ? '0' : raw_val
        let val = parseInt(raw_val.replace(/[^0-9.]+/g, ''))
        this.setState({value: val})
        this.props.edit(this.props.name, val)
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

export default IntInput