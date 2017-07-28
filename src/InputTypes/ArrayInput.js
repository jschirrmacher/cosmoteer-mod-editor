/**
 * Created by Jasper on 24.07.2017.
 */
import React, { Component } from 'react'                // eslint-disable-line no-unused-vars
import IntInput from './IntInput'                       // eslint-disable-line no-unused-vars

class ArrayInput extends Component {

    componentWillMount(){
        let value = this.props.value
        if(value === undefined){
            switch(this.props.valType){
                case 'int':
                    value = []
                    for(let i = 0; i < this.props.number; i++){
                        value.push(0)
                    }
            }
        }
        this.setState({
            value: value,
            number: this.props.number
        })
        this.props.edit(this.props.name, value)
    }

    change(name, value) {
        let position = parseInt(name.replace(/[^0-9.]/g, ''))
        this.setState(state =>  {
            state.value[position] = value
            return state
        })
        this.props.edit(this.props.name, this.state.value)
    }

    render() {
        let rows = []
        if(this.state.value)
        {
            for(let i = 0; i < this.props.number; i++){
                switch(this.props.valType){
                    case 'int':
                        rows.push(<IntInput key={i} name={'Element ' + i}
                            edit={(name, value) => this.change(name, value)} value={this.state.value[i]}/>)
                        break
                    default:
                        alert('Error in ArrayInput: Not found ' + this.props.valType)
                }
            }
        }
        return (
            <div>
                <label>{this.props.name}</label>
                {rows}
            </div>
        )
    }
}

export default ArrayInput