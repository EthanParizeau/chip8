import React, { Component } from 'react';
import './styles/App.css';
import Screen from './components/screen';
import Controls from './components/controls';
import MemView from './components/memView';
import CpuInfo from './components/cpuInfo';

const getCpuState = (cpu) => ({
  pc: cpu.pc,
  i: cpu.i,
  delayTimer: cpu.delayTimer,
  soundTimer: cpu.soundTimer,
  reg: cpu.reg
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cpu: getCpuState(this.props.cpu),
      rom: null,
    };
    // Setup bindings so buttons work
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.step = this.step.bind(this);
    this.test = this.test.bind(this);
  }

  start() {
    console.log("start");
    this.props.cpu.start();
  }

  stop() {
    console.log("stop");
    this.props.cpu.stop();
  }

  step() {
    console.log("step");
    this.props.cpu.step();
    this.setState({cpu: getCpuState(this.props.cpu)});
  }

  test() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "../roms/IBM", true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
        let data = new Uint8Array(xhr.response);
        this.props.cpu.load(data); // Load data into CPU
        this.setState({ 
          rom: data, 
          disRom: this.props.cpu.debug.dissAsm(), // Decode rom
        });
    };
    xhr.send();
    
  }

  render() {
    return (
      <div className="App">
        <div id="screen-controls">
          <Screen display={this.props.cpu.display}/>
          <Controls 
              onStart={this.start}
              onStop={this.stop}
              onStep={this.step}
              onTest={this.test}/>
        </div>
        <CpuInfo cpu={this.state.cpu} />
        <MemView 
            debugger={this.props.cpu.debug}
            disRom={this.state.disRom}/>
      </div>
    );
  }
}

export default App;
