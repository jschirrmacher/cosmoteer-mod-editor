/**
 * Created by Jasper on 19.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class ShipLibrary extends Component {

    componentWillMount(){
        this.setState({src: '/uploadPicture.png'})
        this.getShips()
    }

    getShips(){
        fetch('/mods/' + this.props.modId + '/shipLibrary/' + this.props.data.folder)
            .then(res => res.json())
            .then(result => {
                this.setState({
                    ships: result
                })
            })
    }

    submitForm(event) {
        fetch('/mods/'+ this.props.modId +'/uploadPicture/' + this.props.data.folder ,{  method: 'POST',
            body: new FormData(event.target.form)
        })
            .then(res => res.json())
            .then(response => {
                if (response.error) {
                    throw response.error
                }
                this.getShips()
            })
            .catch(error => alert(error))

    }

    render() {
        let ships = this.state ? this.state.ships : {paths:[]}
        let shipDiv
        if(ships && !ships.error) {
            shipDiv = ships.paths.map(ship => <img className="ship" src={ship} alt="Ship" />)
        }
        else if (ships) {
            shipDiv = <p>{ships.error}</p>
        }
        return (
            <li>
                <p>Directory: {this.props.data.folder}</p>
                <p>Namekey: {this.props.data.namekey}</p>
                {shipDiv}
                <form className="image-upload shipAdder">
                    <label htmlFor={this.props.data.namekey + 'file-input-x'}>
                        <img className="imageUpload" src={this.state.src} alt="New ship"/>
                    </label>
                    <input className="file-input" id={this.props.data.namekey + 'file-input-x'}
                        onChange={e => this.submitForm(e)} type="file" name="picture"/>
                </form>
            </li>
        )
    }
}

export default ShipLibrary
