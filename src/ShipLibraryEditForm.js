import React, { Component } from 'react'               // eslint-disable-line no-unused-vars

class ShipLibraryEditForm extends Component {
    render() {
        return (
            <form>
                <input type="text" name="dirname" placeholder="Directory name" value={this.props.dirname} />
                <input type="text" name="titleID" placeholder="ID of library title text" value={this.props.title} />
                <button>{this.props.create ? 'Create ship library' : 'Save changes'}</button>
            </form>
        )
    }
}

export default ShipLibraryEditForm
