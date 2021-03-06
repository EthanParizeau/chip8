import React from 'react';
import '../styles/screen.css';

class Screen extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.props.display.attachCanvas(this.canvas.current);
        this.props.display.clear();
    }

    render() {
        return (
            <canvas
                ref={this.canvas}
                className="chip8-screen"
                width="640"
                height="320">
            </canvas>
        )
    }
}

export default Screen;