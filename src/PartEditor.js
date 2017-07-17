import React, { Component } from 'react'                 // eslint-disable-line no-unused-vars
import ShipLibraryEditForm from './ShipLibraryEditForm'  // eslint-disable-line no-unused-vars
import MainModOptions from './MainModOptions'

class PartEditor extends Component {
    selectAction(select) {
        this.setState({action: select[select.selectedIndex].value})
    }

    render() {
        let action = (
            <select onChange={e => this.selectAction(e.target)}>
                <option disabled selected>Select action</option>
                <option value="createShipLibrary">Create ship library</option>
            </select>
        )

        if (this.state) {
            switch (this.state.action) {
                case 'createShipLibrary':
                    action = <ShipLibraryEditForm create={true} />
                    break
                default:
                    console.log("This is not supported: " + this.state.action)
                    break
            }
        }

        return (
            <div>
                <ul>
                    <li className = "ModList"><MainModOptions modId ={this.props.modId} /></li>
                    <li>Another part</li>
                </ul>
                {action}
            </div>
        )
    }
}

export default PartEditor
