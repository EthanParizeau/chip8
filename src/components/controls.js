import React from 'react';
import '../styles/button.css';

class Controls extends React.Component {
    render() {
        return (
            <div className="Controls">
                <button className="startBtn" onClick={this.props.onStart}>Start</button>
                <button className="stopBtn" onClick={this.props.onStop}>Stop</button>
                <button className="stepBtn" onClick={this.props.onStep}>Step</button>
                <button className="testBtn" onClick={this.props.onTest}>Test</button>
            </div>
        )
    }
}

export default Controls;