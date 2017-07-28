/**
 * Created by Jasper on 24.07.2017.
 */

/**
 * Created by Jasper on 19.07.2017.
 */
import React, { Component } from 'react'                                // eslint-disable-line no-unused-vars
import StringInput from './InputTypes/stringInput'                      // eslint-disable-line no-unused-vars
import EditorGroup from './InputTypes/editorGroup'                      // eslint-disable-line no-unused-vars
import IntInput from './InputTypes/IntInput'                            // eslint-disable-line no-unused-vars
import ArrayInput from './InputTypes/ArrayInput'                        // eslint-disable-line no-unused-vars
import BoolInput from './InputTypes/BoolInput'                          // eslint-disable-line no-unused-vars
import PercentInput from './InputTypes/PercentInput'                    // eslint-disable-line no-unused-vars
import ListInput from './InputTypes/ListInput'                          // eslint-disable-line no-unused-vars
import BlockType from './InputTypes/BlockTypeInput'                     // eslint-disable-line no-unused-vars
import BlockIDInput from './InputTypes/BlockIDInput'                    // eslint-disable-line no-unused-vars
import ComponentInput from './InputTypes/ComponentInput'                // eslint-disable-line no-unused-vars

class NewPart extends Component {

    componentWillMount(){
        fetch('/mods/' + this.props.modId + '/getPartInfo/' + this.props.part)
            .then(res => res.json())
            .then(result => {
                if(result.error){
                    alert(result.error)
                } else{
                    this.setState({
                        partData : result.part
                    })
                }
            })
            //.catch(e => {
            //    alert(e)
            //})
    }

    updateValues(name, value){
        this.setState(state => {state.partData[name].value = value; return state})
    }

    submit() {
        let toAdd = ''
        Object.keys(this.state.partData).forEach(key => {
            if(this.state.partData[key].value === undefined){
                toAdd += key + '\n'
            }
        })
        if(toAdd.length !== 0){
            alert('Please add the following data to the part: \n' + toAdd)
        } else if(Math.min(this.state.partData.Size) === 0){
            alert('The size can not be 0')
        }
        else{
            console.log(this.state.partData)
            fetch('/mods/' + this.props.modId + '/parts/part',
                {method: 'POST',
                    body: JSON.stringify({name: this.state.partData.NameKey.value, data: this.state.partData}),
                    headers: {'Content-Type': 'application/json'}})
                .then(res => res.json())
                .then(result => {
                    if(result.error) alert(result.error)
                    else console.log(result)
                })
                .catch( e => alert(e))
            alert('Success!')
        }
    }

    correctInput(val, id){
        switch(val.type){
            case 'string':
                return <StringInput key={id + '.' + this.props.part} value={val.value}
                    name={id} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'editorGroup':
                return <EditorGroup key={id + '.' + this.props.part} value={val.value}
                    name={id} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'int':
                return  <IntInput key={id + '.' + this.props.part} value={val.value}
                    name={id} edit={(n, v) => this.updateValues(n ,v)}/>
            case '2D':
                return <ArrayInput key={id + '.' + this.props.part}
                    name={id} value={val.value} valType={val.valType}
                    number={2} edit={(n, v) => this.updateValues(n ,v)}/>
            case '4D':
                return <ArrayInput key={id + '.' + this.props.part}
                    name={id} value={val.value} valType={val.valType}
                    number={4} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'bool':
                return <BoolInput key={id + '.' + this.props.part}
                    name={id} value={val.value} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'Percent':
                return  <PercentInput key={id + '.' + this.props.part}
                    value={val.value} name={id} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'array':
                return <ListInput key={id + '.' + this.props.part}
                    value={val.value} name= {id} valType={val.valType}
                    number = {val.value.length} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'BlockType':
                return <BlockType key={id + '.' + this.props.part}
                    value={val.value} name={id} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'BlockID':
                return <BlockIDInput key={id + '.' + this.props.part}
                    value={val.value} name={id} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'Component':
                return <ComponentInput key={id + '.' + this.props.part}
                    value={val.value} name={id} edit={(n, v) => this.updateValues(n ,v)}/>
            case 'textArray':
                return
            default:
                alert('This type is not defined: ' + val.type + ' ' + val.value)
        }
    }

    render() {
        let data = this.state ? Object.keys(this.state.partData).map(field =>
            this.correctInput(this.state.partData[field], field))  : ''
        return (<div>
            <p>{this.props ? this.props.part : ''}</p>
            {data}
            <button onClick={() => this.submit()}>Submit</button>
        </div>)
    }
}

export default NewPart
