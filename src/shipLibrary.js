/**
 * Created by Jasper on 19.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class ShipLibrary extends Component {

    render() {
        return (
            <li>
                <p>Directory: {this.props.data.folder}</p>
                <p>Namekey: {this.props.data.namekey}</p>
            </li>
        )
    }
}

export default ShipLibrary
