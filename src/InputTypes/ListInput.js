/**
 * Created by Jasper on 24.07.2017.
 */
import React, { Component } from 'react'                // eslint-disable-line no-unused-vars
import IntInput from './IntInput'                       // eslint-disable-line no-unused-vars
import BlockIDInput from './BlockIDInput'               // eslint-disable-line no-unused-vars
import ArrayInput from './ArrayInput'        // eslint-disable-line no-unused-vars

class ListInput extends Component {

    componentWillMount(){
        let value = this.props.value !== '' ? this.props.value : []
        this.setState({
            number: this.props.number,
            value: value
        })
        switch(this.props.valType){
            case 'int':
                this.setState({
                    unit: 0
                })
                break
            case '2D':
                this.setState({
                    unit: [0,0]
                })
                break
            case 'BlockID':
                this.setState({
                    unit: 'corridor'
                })
                break
            default:
                alert('This form of data is not supported in a list: ' + this.props.valType)
        }
    }

    change(name, value) {
        let position = parseInt(name.replace(/[^0-9.]/g, ''))
        this.setState(state =>  state.value[this.props.name][position] = value)
        this.props.edit(this.props.name, this.state.value)
    }

    render() {
        let rows = []
        if(this.state.value)
        {
            for(let i = 0; i < this.state.number; i++){
                switch(this.props.valType){
                    case 'int':
                        rows.push(<IntInput key={i} name={'Element ' + i}
                            edit={(name, value) => this.change(name, value)}
                            value={this.state.value[i]}/>)
                        break
                    case 'BlockID':
                        rows.push(<BlockIDInput key={i} name={'Element '+ i}
                            edit={(name, value) => this.change(name, value)}
                            value={this.state.value[i]}/>)
                        break
                    case '2D':
                        rows.push(<ArrayInput key={i} name={'Element '+ i} number={2}
                            edit={(name, value) => this.change(name, value)}
                            value={this.state.value[i]} valType="int"/>)
                        break
                    default:
                        alert('Not found ' + this.props.valType)
                }
            }
        }
        let THIS = this
        return (
            <div>
                <label>{this.props.name}</label>
                {rows}
                <button onClick={() => {
                    let newValue = THIS.state.value
                    newValue.push(THIS.state.unit)
                    THIS.setState({number: THIS.state.number + 1, value: newValue})
                }}> Add Object </button>
            </div>
        )
    }
}

export default ListInput