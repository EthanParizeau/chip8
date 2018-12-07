import React from 'react';
import '../styles/memView.css';

class MemView extends React.Component {
    constructor(props) {
        super(props);
        this.lines = {};
    }

    render() {
        return (
            <div className="memView">
                <p>MEMVIEW</p>
            </div>
        )
    }
}

export default MemView;