/**
 * Created by Jasper on 18.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class LanguageEditor extends Component {

    componentWillMount() {
        this.props.newData()
        this.setState({setData: false})
    }

    uploadChangedLibraries() {
        let toSend = {}
        for(let prop in this.data){
            if(this.data.hasOwnProperty(prop)){
                toSend[prop] = {}
                for(let w in this.data[prop]){
                    if(this.data[prop].hasOwnProperty(w)){
                        toSend[prop][w] = this.data[prop][w].value
                    }
                }
            }
        }
        fetch('/mods/' + this.props.modId + '/updateLanguage', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(toSend)
        })

    }

    render() {
        if(!this.state.setData && this.props !== undefined && this.props.data !== undefined){
            this.state.setData = true
            this.data = {}
            this.props.data.languages.forEach(lang => {
                this.data[lang.id] = {}
            })
        }

        let state = this.props.data
        let titleRow =
            <tr>
                <th>Keywords</th>
                {state !== undefined ? state.languages.map(lang => <th key={lang.id}> {lang.id} </th>) : ''}
            </tr>
        let tableBody = state !== undefined ? state.keywords.map(word => {
            return (<tr>
                <td>{word}</td>
                {state.languages.map(lang => {
                    let keyword = lang.keywords[word]
                    keyword = keyword === undefined ? '---' : keyword
                    return <td><input key={lang.id} className="languageInput" type="text"
                        defaultValue={keyword} ref={input => this.data[lang.id][word] = input}
                        name={word} /></td>
                })}
            </tr>)
        }) : ''
        return (
            <table>
                <tbody>
                    {titleRow}
                    {tableBody}
                    <button onClick={() => this.uploadChangedLibraries()} >Submit</button>
                </tbody>
            </table>
        )
    }
}

export default LanguageEditor
