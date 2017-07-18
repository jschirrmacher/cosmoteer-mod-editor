/**
 * Created by Jasper on 18.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class LanguageEditor extends Component {
    componentWillMount() {
        this.props.newData()
    }

    render() {
        let state = this.props.data
        let titleRow =
            <tr>
                <th>Keywords</th>
                {state !== undefined ? state.languages.map(lang => <th> {lang.id} </th>) : ''}
            </tr>
        let tableBody = state !== undefined ? state.keywords.map(word => {
            return (<tr>
                <td>{word}</td>
                {state.languages.map(lang => {
                    let keywords = lang.keywords.filter(key => key.id === word)
                    if (keywords.length) {
                        return <td>{keywords[0].value}</td>
                    } else {
                        return <td>---</td>
                    }
                })}
                </tr>)
        }) : ''
        return (
            <table>
                <tbody>
                    {titleRow}
                    {tableBody}
                </tbody>
            </table>
        )
    }
}

export default LanguageEditor
