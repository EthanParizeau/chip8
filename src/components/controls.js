import React from 'react';
import '../styles/button.css';

class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
        this.handleLoad = this.handleLoad.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.loadRom(this.fileInput.current.files[0]);
    }

    handleLoad() {
        this.fileInput.current.click();
    }

    render() {
        return (
            <div className="Controls">
                <button className="startBtn" onClick={this.props.onStart}>Start</button>
                <button className="stopBtn" onClick={this.props.onStop}>Stop</button>
                <button className="stepBtn" onClick={this.props.onStep}>Step</button>
                <button className="resetBtn" onClick={this.props.onReset}>Reset</button>
                <button className="loadBtn" onClick={this.handleLoad}>Load</button>
                <input style={{display: 'none'}} className="loadBtn" type="file" ref={this.fileInput} onChange={this.handleSubmit}/>
            </div>
        )
    }
}

export default Controls;