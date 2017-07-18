/**
 * Created by Jasper on 18.07.2017.
 */
import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class AddLanguage extends Component {
    save(event) {
        event.preventDefault()
        this.props.saveComponent({
            create: this.props.create,
            type: 'language',
            lang: event.target.elements.language.value
        })
    }

    render() {
        return (
            <form onSubmit={e => this.save(e)}>
                <label><span>Language as in the two letter 639-1 language code</span>
                    <input type="text" name="language" value={this.props.dirname} placeholder="Example: en" /></label>
                <button>Add new language</button>
            </form>
        )
    }
}

export default AddLanguage
