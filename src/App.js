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
    this.reset = this.reset.bind(this);
    this.loadRom = this.loadRom.bind(this);
  }

  start() {
    console.log("%c-- Starting CPU --", "color: orange");
    let interval = 1000 / this.props.cpu.cpuSpeed;
    this.stop();
    this.setState({ running: true });
    this.timer = setInterval(() => {
      this.step();
    }, interval);
  }

  stop() {
    console.log("%c-- Stopping CPU --", "color: orange");
    this.setState({ running: false });
    clearTimeout(this.timer);
    this.timer = null;
  }

  step() {
    console.log("%c-- Step --", "color: lightgreen");
    this.props.cpu.step();
    this.setState({cpu: getCpuState(this.props.cpu)});
  }

  reset() {
    console.log("%c-- Chip8 Reset --", "color: orange");
    this.props.cpu.reset();
    this.setState({ cpu: getCpuState(this.props.cpu) });
  }

  loadRom(romFile) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "../roms/" + romFile.name, true);
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
              onReset={this.reset}
              onTest={this.test}
              loadRom={this.loadRom}/>
        </div>
        <CpuInfo cpu={this.state.cpu} />
        <MemView 
            currentAddress={this.state.cpu.pc}
            disRom={this.state.disRom}/>
      </div>
    );
  }
}

export default App;
