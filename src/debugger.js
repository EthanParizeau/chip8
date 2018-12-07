import {toHex} from './util';

/**
 * Debugger for chip8
 *
 * @class Debugger
 */
class Debugger {

    constructor(cpu) {
        this.cpu = cpu;
        
    }


    /**
     * Start debugging the cpu
     *
     * @memberof Debugger
     */
    debug() {
        this.dumpMem();
        this.dumpRegs();
    }

    /**
     * Update the memory and registers
     *
     * @memberof Debugger
     */
    update() {
        this.dumpRegs();
    }

    /**
     * Display CPU registers
     *
     * @memberof Debugger
     */
    dumpRegs() {

        for (let i = 0; i < this.cpu.reg.length; i++) {
            let element = document.getElementById("V" + i);
            element.innerText = this.cpu.reg[i];
        }

        let pc = document.getElementById("pc");
        pc.innerText = toHex(this.cpu.pc);
        let i = document.getElementById("i");
        i.innerText = toHex(this.cpu.i);
        let dt = document.getElementById("dt");
        dt.innerText = toHex(this.cpu.delayTimer);
        let st = document.getElementById("st");
        st.innerText = toHex(this.cpu.soundTimer);
        let ci = document.getElementById("currentInstruction");
        let currentOp = this.cpu.memory[this.cpu.pc] << 8 | this.cpu.memory[this.cpu.pc + 1];
        ci.innerText = "0x" + toHex(this.cpu.pc) + " - " + this.decodeOpcode(currentOp);
        
        let currInstr = document.getElementById(this.cpu.pc);
        let prevInstr = document.getElementById(this.cpu.pc - 2);
        // Remove the background of the previous instruction
        prevInstr.removeAttribute("class");
        // Set the background of the current instruction to red
        currInstr.setAttribute("class", "currentInstructionBackground");
    }

    /**
     * Display CPU memory
     *
     * @memberof Debugger
     */
    dumpMem() {
        for(var i = 0x200; i < this.cpu.memory.length; i += 2) {
            let opcode = this.cpu.memory[i] << 8 | this.cpu.memory[i + 1];
            this.addMemItem(i, this.decodeOpcode(opcode));
        }
    }

    /**
     * dump graphics memory
     *
     * @memberof Debugger
     */
    dumpGfx() {
        console.dir(this.cpu.gfx);
    }

    /**
     * Decode an opcode
     *
     * @param {*} op - Opcode to decode
     * @memberof Debugger
     */
    decodeOpcode(op) {

        // Fetch opcode
        let opcode = op;
        let x = (opcode >> 8) & 0xF;
        let y = (opcode >> 4) & 0xF;
        let addr = opcode & 0xFFF;
        let byte = opcode & 0xFF;
        let nybble = opcode & 0xF;

        // Decode opcode
        switch (opcode & 0xF000) {

            case 0x0000:
                switch (opcode) {
                    case 0x00E0: // Clear the display
                        return "CLS";

                    case 0x00EE: // Returns from subroutine
                        return "RTS";

                    default:
                        return "Unknown Opcode: " + opcode.toString(16).toUpperCase();
                }
                break;

            case 0x1000: // Jump to address NNN
                return "JUMP $" + toHex(addr);

            case 0x2000: // Call subroutine from NNN
                return "CALL $" + toHex(addr);

            case 0x3000: // SE if VX == NN
                return "SKIP.EQ V" + toHex(x) + ", #$" + byte;

            case 0x4000: // SE if VX != NN
                return "SKIP.NE V" + toHex(x) + ", #$" + byte;

            case 0x5000: // SE if VX == VY
                return "SKIP.EQ V" + toHex(x) + ", V" + toHex(y);

            case 0x6000: // Set VX to NN
                return "LD V" + toHex(x) + ", #$" + toHex(byte);

            case 0x7000: // Adds NN to VX
                return "ADD V" + toHex(x) + ", #$" + toHex(byte);

            case 0x8000: // Arithmetic instructions
                switch (opcode & 0xF) {
                    case 0x0000: // Sets VX to VY
                        return "LD V" + toHex(x) + ", V" + toHex(y);

                    case 0x1000: // Sets VX to VX | VY
                        return "OR V" + toHex(x) + ", V" + toHex(y);

                    case 0x2000: // Sets VX to VY & VY
                        return "AND V" + toHex(x) + ", V" + toHex(y);

                    case 0x3000: // Sets VX to VX ^ VY
                        return "XOR V" + toHex(x) + ", V" + toHex(y);

                    case 0x4000: // Adds VY to VX. VF set to 1 when carry
                        return "ADD V" + toHex(x) + ", V" + toHex(y);

                    case 0x5000: // VY is subtracted from VX. VF set to 0 when borrow
                        return "SUB V" + toHex(x) + ", V" + toHex(y);

                    case 0x6000: // Stores the least significant bit of VX in VF and shifts VX right by 1
                        return "SHR V" + toHex(x) + ", V" + toHex(y);

                    case 0x7000: // Sets VX to VY minus VX. VF is set to 0 when borrow
                        return "SUBN V" + toHex(x) + ", V" + toHex(y);

                    case 0xE000: //Stores the most significant bit of VX in VF then shifts VX left 1
                        return "SHL V" + toHex(x) + ", V" + toHex(y);

                    default:
                        return "Unknown Opcode: " + opcode.toString(16).toUpperCase();
                }
                break;

            case 0x9000: // SE if VX != VY
                return "SNE V" + toHex(x) + ", V" + toHex(y);

            case 0xA000: // Sets I to the address NNN
                return "LD I, " + toHex(addr);

            case 0xB000: // Jumps to the address NNN plus V0
                return "JP V" + toHex(x) + ", $#" + toHex(addr);

            case 0xC000: // Sets VX to the result of & on a random number and NN
                return "RND V" + toHex(x) + ", $#" + toHex(byte);

            case 0xD000: // Draws a sprite at coordinate (VX, VY) that has width 8px and height of N px
                return "DRW V" + toHex(x) + ", V" + toHex(y) + " , " + toHex(nybble);

            case 0xE000:
                switch (opcode & 0xFF) {
                    case 0x9E: // SE if key in VX is pressed
                        return "SKP V" + toHex(x);

                    case 0xA1: // SE if key in VX isn't pressed
                        return "SKNP V" + toHex(x);
                    default:
                        return "Unknown Opcode: " + opcode.toString(16).toUpperCase();
                }
                break;

            case 0xF000:
                switch (opcode & 0xFF) {
                    case 0x07: // Sets VX to the value of the delay timer
                        return "LD V" + toHex(x) + " DT";

                    case 0x0A: // A key press is awaited then stored in VX. Blocking operation.
                        return "LD V" + toHex(x) + " K";

                    case 0x15: // Sets the delay timer to VX
                        return "LD DT, V" + toHex(x);

                    case 0x18: // Sets the sound timer to VX
                        return "LD ST, V" + toHex(x);

                    case 0x1E: // Adds VX to I
                        return "ADD I, V" + toHex(x);

                    case 0x29: // Sets I to the loc of the sprite for character in VX. Characters 0-F are represented by a 4x5 font
                        return "LD F, V" + toHex(x);

                    case 0x33: // Stores the binary representation of VX with most significant of three digits at the addr in I, the middle digit at I + 1 and the least at I + 2.
                        return "LD B, V" + toHex(x);

                    case 0x55: // Stores V0 to VX (including VX) in memory starting at addr I
                        return "LD [I], V" + toHex(x);

                    case 0x65: // Fills V0 to VX (including VX) with values from memory starting at addr I.
                        return "LD V" + toHex(x) + ", [I]";

                    default:
                        return "Unknown Opcode: " + opcode.toString(16).toUpperCase();
                }
                break;
            default:
                return "Unknown Opcode: " + opcode.toString(16).toUpperCase();
        }
    }

    /**
     * Adds an element for memory view
     *
     * @param {*} addr - Memory address of instruction
     * @param {*} item - Instruction
     * @memberof Debugger
     */
    addMemItem(addr, item) {
        var view = document.getElementById("memory-viewer");
        let p = document.createElement("p");
        p.setAttribute("id", addr);
        let ptext = document.createTextNode("0x" + addr.toString(16).toUpperCase() + ": " + item);
        p.appendChild(ptext);
        view.appendChild(p);
    }

    test() {
        
    }
}

export default Debugger;