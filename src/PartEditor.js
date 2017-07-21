import React, { Component } from 'react'                // eslint-disable-line no-unused-vars
import ShipLibraryEditForm from './ShipLibraryEditForm' // eslint-disable-line no-unused-vars
import MainModOptions from './MainModOptions'           // eslint-disable-line no-unused-vars
import AddLanguage from './addLanguage'                 // eslint-disable-line no-unused-vars
import LanguageEditor from './LanguageEditor'           // eslint-disable-line no-unused-vars
import ShipLibrary from './shipLibrary'                 // eslint-disable-line no-unused-vars

class PartEditor extends Component {
    selectAction(select) {
        this.setState({action: select[select.selectedIndex].value})
    }

    update() {
        fetch('/mods/Languages/' + this.props.modId)
            .then(res => res.json())
            .then(result =>{
                this.setState({lang:{languages: result.languages, keywords: result.keywords}})
            })
        fetch('/mod/'+this.props.modId)
            .then(res => res.json())
            .then(result => {
                this.setState({data: result.data})
            })
    }

    resetAction(){
        this.setState({action: undefined})
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
                    action = <ShipLibraryEditForm reset={() => this.resetAction()} create={true}
                        saveComponent={data => this.props.saveComponent(data)} update={() => this.update()} />
                    break
                case 'addLanguage':
                    action = <AddLanguage create={true} reset={() => this.resetAction()} update={() => this.update()}
                        saveComponent={data => this.props.saveComponent(data)} />
                    break
                case undefined:
                    //Ignore
                    break
                default:
                    alert('This action is not supported: ' + this.state.action)
                    break
            }
        }
        let shipLibraries = this.state && this.state.data && this.state.data.shiplibraries ? this.state.data.shiplibraries.map(lib => <ShipLibrary data={lib}/>) : ''

        return (
            <div>
                <ul>
                    <li className = "ModList"><MainModOptions update = {() => this.update()}
                        modId ={this.props.modId} reset={() => this.resetAction()}/></li>
                    <li><LanguageEditor data={this.state? this.state.lang : undefined}
                        newData = {() => this.update()} reset={() => this.resetAction()}
                        modId={this.props.modId}/> </li>
                    {shipLibraries}
                </ul>
                {action}
                <button onClick={() => this.resetAction()}>Cancel</button>
            </div>
        )
    }
}

export default PartEditor
