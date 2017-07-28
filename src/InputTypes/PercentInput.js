/**
 * Created by Jasper on 24.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class IntInput extends Component {

    change(e) {
        let val = e.target.value
        let isEmpty = val === ''
        val = parseInt(val.replace(/[^0-9.]+/g, ''))
        val = isEmpty ? 0 : val
        if((val > -1 && val < 101)){
            this.props.edit(this.props.name, val)
        }
    }

    render() {
        return (
            <div>
                <label>{this.props.name}</label>
                <input type="text" onFocus={() => this.setState({focus: true})}
                    onBlur={() => this.setState({focus: false})} onChange={e => this.change(e)}
                    value={this.props ? this.state && this.state.focus ? this.props.value
                        : this.props.value + '%': ''} />
            </div>
        )
    }
}

export default IntInput