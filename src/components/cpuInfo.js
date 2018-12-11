import React from 'react';
import '../styles/cpuInfo.css';
import {toHex} from '../util';

class CpuInfo extends React.Component {
    
    render() {
        return (
            <div className="cpuInfo">
                <table>
                    <tbody>
                        <tr>
                            <th>PC: <span>{toHex(this.props.cpu.pc)}</span></th>
                            <th>I: <span>{toHex(this.props.cpu.i)}</span></th>
                            <th>DT: <span>{toHex(this.props.cpu.delayTimer)}</span></th>
                            <th>ST: <span>{toHex(this.props.cpu.soundTimer)}</span></th>
                        </tr>
                        <tr>
                            <td>V0: <span>{toHex(this.props.cpu.reg[0])}</span></td>
                            <td>V1: <span>{toHex(this.props.cpu.reg[1])}</span></td>
                            <td>V2: <span>{toHex(this.props.cpu.reg[2])}</span></td>
                            <td>V3: <span>{toHex(this.props.cpu.reg[3])}</span></td>
                        </tr>
                        <tr>
                            <td>V4: <span>{toHex(this.props.cpu.reg[4])}</span></td>
                            <td>V5: <span>{toHex(this.props.cpu.reg[5])}</span></td>
                            <td>V6: <span>{toHex(this.props.cpu.reg[6])}</span></td>
                            <td>V7: <span>{toHex(this.props.cpu.reg[7])}</span></td>
                        </tr>
                        <tr>
                            <td>V8: <span>{toHex(this.props.cpu.reg[8])}</span></td>
                            <td>V9: <span>{toHex(this.props.cpu.reg[9])}</span></td>
                            <td>VA: <span>{toHex(this.props.cpu.reg[0xA])}</span></td>
                            <td>VB: <span>{toHex(this.props.cpu.reg[0xB])}</span></td>
                        </tr>
                        <tr>
                            <td>VC: <span>{toHex(this.props.cpu.reg[0xC])}</span></td>
                            <td>VD: <span>{toHex(this.props.cpu.reg[0xD])}</span></td>
                            <td>VE: <span>{toHex(this.props.cpu.reg[0xE])}</span></td>
                            <td>VF: <span>{toHex(this.props.cpu.reg[0xF])}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default CpuInfo;