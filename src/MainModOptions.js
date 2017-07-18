/**
 * Created by Jasper on 17.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class MainModOptions extends Component {

    componentWillMount(){
        fetch('/mods/mainModData/' + this.props.modId)
            .then(res => res.json())
            .then(result => {
                this.setState({data: result})
            })
            .catch(e => alert(e))
    }

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
                .then(res => res.json())
                .then(() => this.props.update())
                .catch(() => {
                    alert(e)
                })
        }
        e.preventDefault()
    }


    render() {
        return (
            <div>
                <form>
                    <p>Mod Options</p>
                    <label>Strings Folder for Language Files</label>
                    <input type="text" name="stringsfolder" placeholder="Folder for languages" value ={this.state ? this.state.data.stringsfolder : ''}
                        onChange={event => this.change(event)} />
                    <button onClick={(e) => this.upload(e)}>{'Save changes'}</button>
                </form>
            </div>
        )
    }
}

export default MainModOptions
