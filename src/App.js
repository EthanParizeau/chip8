import React, { Component } from 'react';
import './App.css';
import Screen from './components/screen';
import Controls from './components/controls';
import MemView from './components/memView';

class App extends Component {
  constructor(props) {
    super(props);
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
  }

  test() {
    console.log("test");
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "../roms/BC_test", true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
        let data = new Uint8Array(xhr.response);
        this.props.cpu.load(data);
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
        <MemView />
      </div>
    );
  }
}

export default App;
