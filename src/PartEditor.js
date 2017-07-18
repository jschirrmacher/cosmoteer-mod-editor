import React, { Component } from 'react'                 // eslint-disable-line no-unused-vars
import ShipLibraryEditForm from './ShipLibraryEditForm'
import MainModOptions from './MainModOptions'
import AddLanguage from './AddLanguage'
import LanguageEditor from './LanguageEditor'

class PartEditor extends Component {
    selectAction(select) {
        this.setState({action: select[select.selectedIndex].value})
    }

    updateLanguageData() {
        fetch('/mods/Languages/' + this.props.modId)
            .then(res => res.json())
            .then(result =>{
                this.setState({lang:{languages: result.languages, keywords: result.keywords}})
            })
    }

    render() {
        let action = (
            <select onChange={e => this.selectAction(e.target)}>
                <option disabled selected>Select action</option>
                <option value="createShipLibrary">Create ship library</option>
                <option value="addLanguage">Add language</option>
            </select>
        )

        if (this.state) {
            switch (this.state.action) {
                case 'createShipLibrary':
                    action = <ShipLibraryEditForm create={true} saveComponent={data => this.props.saveComponent(data)} />
                    break
                case 'addLanguage':
                    action = <AddLanguage saveComponent={data => this.props.saveComponent(data)} />
                    break
                case undefined:
                    //Ignore
                    break
                default:
                    alert('This action is not supported: ' + this.state.action)
                    break
            }
        }

        return (
            <div>
                <ul>
                    <li className = "ModList"><MainModOptions update = {() => this.updateLanguageData()} modId ={this.props.modId} /></li>
                    <li><LanguageEditor data={this.state? this.state.lang : undefined} newData = {() => this.updateLanguageData()} modId={this.props.modId}/> </li>
                    <li>Another part</li>
                </ul>
                {action}
            </div>
        )
    }
}

export default PartEditor
