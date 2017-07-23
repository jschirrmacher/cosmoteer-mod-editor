/**
 * Created by Jasper on 19.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class ShipLibrary extends Component {

    componentWillMount(){
        fetch('/mods/' + this.props.modId + '/shipLibrary/' + this.props.data.folder)
            .then(res => res.json())
            .then(result => {
                this.setState({
                    ships: result
                })
            })
    }

    submitForm(event) {
        event.preventDefault()
        let form = event.target
        fetch('/mods/'+ this.props.modId +'/uploadPicture/' + this.props.data.folder ,{  method: 'POST',
            body: new FormData(form)
        })
            .then(res => res.json())
            .then(response => {
                alert(response)
                if (response.error) {
                    throw response.error
                }
            })
            .catch(error => alert(error))

    }

    render() {
        let ships = this.state ? this.state.ships : {paths:[]}
        let shipDiv
        if(!ships.error) shipDiv = ships.paths.map(ship => <img className="ship" src={ship}/>)
        else ships = <p>{ships.error}</p>
        return (
            <li>
                <p>Directory: {this.props.data.folder}</p>
                <p>Namekey: {this.props.data.namekey}</p>
                {shipDiv}
                <form onSubmit={i => this.submitForm(i)}>
                    <div className="image-upload shipAdder" >
                        <p>Add ship</p>
                        <label htmlFor={this.props.data.namekey + 'file-input-x'}>
                            <img className="imageUpload" src="/uploadPicture.png" alt="Mod Logo"/>
                        </label>
                        <input className="file-input" id={this.props.data.namekey + 'file-input-x'} type="file" name="picture"/>
                        <button >Submit</button>
                    </div>
                </form>
            </li>
        )
    }
}

export default ShipLibrary
