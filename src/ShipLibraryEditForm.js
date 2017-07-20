import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class ShipLibraryEditForm extends Component {
    save(event) {
        event.preventDefault()
        this.props.update()
        this.props.saveComponent({
            create: this.props.create,
            type: 'shipLibrary',
            dirName: event.target.elements.dirname.value,
            titleId: event.target.elements.titleID.value
        })
        this.props.update()
    }

    render() {
        return (
            <form onSubmit={e => this.save(e)}>
                <label><span>Directory name</span>
                    <input type="text" name="dirname" value={this.props.dirname} /></label>
                <label><span>ID of library title text</span>
                    <input type="text" name="titleID" value={this.props.title} /></label>
                <button>{this.props.create ? 'Create ship library' : 'Save changes'}</button>
            </form>
        )
    }
}

export default ShipLibraryEditForm
