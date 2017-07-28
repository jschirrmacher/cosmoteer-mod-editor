/**
 * Created by Jasper on 25.07.2017.
 */
import React, { Component } from 'react'                // eslint-disable-line no-unused-vars

class ComponentInput extends Component {

    componentWillMount(){
        this.setState({
            value: this.props.value
        })
    }

    render() {
        return (
            <div>
                <label>Components: {this.props.name}</label>
            </div>
        )
    }
}

export default ComponentInput