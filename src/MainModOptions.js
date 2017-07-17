/**
 * Created by Jasper on 17.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class ShipLibraryEditForm extends Component {
    change(e) {
        let value = e.target.value
        let name = e.target.name
        this.setState(state => {
            state.data = {}
            state.data[name] = value
        })
    }

    upload(e) {
        for(let data in this.state.data){
            if(!this.state.data.hasOwnProperty(data)) continue
            fetch('/mods/mainModData/' + this.props.modId + '/' + data + '/' + this.state.data[data], {method: 'POST'})
        }
        e.preventDefault()
    }


    render() {
        if(this.state === undefined) this.setState({data: this.props.getData()})
        return (
            <div>
                <form>
                    <p>Mod Options</p>
                    <input type="text" name="stringsfolder" placeholder="Folder for languages" value ={this.state ? this.state.data.stringsfolder : ''}
                        onChange={event => this.change(event)} />
                    <button onClick={(e) => this.upload(e)}>{'Save changes'}</button>
                </form>
            </div>
        )
    }
}

export default ShipLibraryEditForm
