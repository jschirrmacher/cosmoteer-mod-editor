import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class ShipLibraryEditForm extends Component {
    render() {
        return (
            <form>
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
