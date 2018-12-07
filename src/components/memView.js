import React from 'react';
import '../styles/memView.css';

class MemView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disRom: this.props.disRom,
        }
        
    }

    componentDidMount() {
        
    }

    load(data) {
        console.log("load");
    }

    render() {
        if(this.props.disRom === undefined) {
            console.log("disRom undefined");
            return(<p></p>);
        }

        // Map disRom to html
        const items = this.props.disRom.map((disRom) => {
            if(this.props.currentAddress === disRom.pc) {
                return <p className="nextOpcode" key={disRom.addr}>{disRom.addr}-<span>{disRom.dis}</span></p>
            } else {
                return <p key={disRom.addr}>{disRom.addr}-<span>{disRom.dis}</span></p>
            }
        });
        
        return (
            <div className="memView">
                {items}
            </div>
        )
    }
}

export default MemView;