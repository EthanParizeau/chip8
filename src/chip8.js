import React from 'react';
import ReactDOM from 'react-dom';
import testText from './components/test.js';
import CPU from './cpu.js';

let cpu = new CPU();

/**
 * Load the IBM file from server
 *
 */
window.loadFile = (rom) => {
    const reader = new FileReader();
    let data;
    //TODO: There must be a better event to listen for.
    reader.onload = (e) => {
        e.preventDefault();
        data = new Uint8Array(e.target.result);
        cpu.load(data); // Send data to chip8
    };
    reader.readAsArrayBuffer(rom);
};

window.loadTest = () => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "../roms/BC_test", true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
        let data = new Uint8Array(xhr.response);
        cpu.load(data);
    };
    xhr.send();
};
