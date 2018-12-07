import Debugger from './debugger.js';
import { toHex } from './util.js';

/**
 * The CPU for the Chip8
 *
 * @class CPU
 */
class CPU {

    constructor(display) {

        this.debug = new Debugger(this);
        this.memory = new Uint8Array(new ArrayBuffer(0xFFF));
        this.display = display;
        this.reg = new Uint8Array(new ArrayBuffer(0x10));
        this.pc = 0x200;
        this.i = 0;
        this.sp = 0;
        this.stack = new Uint16Array(16);
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.keyState = new Uint8Array(new ArrayBuffer(0x10));
        this.running = false;
        this.cpuSpeed = 100; // Hz
        this.awaitingKey = false;
        this.opCode = 0;
        this.font = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80 // F
        ];

        // Load font into memory starting at 0x50 (80)
        for (let i = 0; i < 80; i++) {
            this.memory[i] = this.font[i];
        }
        console.log("%c-- Chip8 Initialized --", "color: orange");
    }

    /**
     * Start the cpu
     *
     * @memberof CPU
     */
    start() {
        console.log("%c-- Starting CPU --", "color: orange");
        let interval = 1000 / this.cpuSpeed;
        this.stop();
        this.running = true;
        this.timer = setInterval(() => {
            this.step();
        }, interval);
    }

    /**
     * Step one cycle
     *
     * @memberof CPU
     */
    step() {
        console.log("%c-- Step --", "color: lightgreen");

        let incr = true;

        // Fetch opcode
        let opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
        this.opCode = opcode;
        let x = (opcode >> 8) & 0xF;
        let y = (opcode >> 4) & 0xF;
        let addr = opcode & 0xFFF;
        let byte = opcode & 0xFF;
        let nybble = opcode & 0xF;

        //console.log("%cPc: 0x" + cpu.pc.toString(16).toUpperCase(), "color: cyan");
        //console.log("%cOp: " + opcode.toString(16).toUpperCase(), "color: cyan");

        // Decode opcode
        switch (opcode & 0xF000) {

            case 0x0000:
                switch (opcode) {
                    case 0x00E0: // Clear the display
                        this.display.clear();
                        console.log("%cCLS", "color: lightblue");
                        break;

                    case 0x00EE: // Returns from subroutine
                        this.pc = this.stack[--this.sp];
                        console.log("%cRTS", "color: lightblue");
                        break;

                    default:
                        console.log("%cUnknown Opcode: " + opcode.toString(16).toUpperCase(), "color: red");
                }
                break;

            case 0x1000: // Jump to address NNN
                this.pc = addr;
                incr = false;
                console.log("%cJUMP $" + toHex(addr), "color: lightblue");
                break;

            case 0x2000: // Call subroutine from NNN
                this.stack[this.sp++] = this.pc;
                this.pc = addr;
                incr = false;
                console.log("%cCALL $" + toHex(addr), "color: lightblue");
                break;

            case 0x3000: // SE if VX == NN
                if (this.reg[x] == byte) {
                    this.pc += 2;
                }
                console.log("%cSKIP.EQ V" + toHex(x) + ", #$" + byte, "color: lightblue");
                break;

            case 0x4000: // SE if VX != NN
                if (this.reg[x] != byte) {
                    this.pc += 2;
                }
                console.log("%cSKIP.NE V" + toHex(x) + ", #$" + byte, "color: lightblue");
                break;

            case 0x5000: // SE if VX == VY
                if (this.reg[x] == this.reg[y]) {
                    this.pc += 2;
                }
                console.log("%cSKIP.EQ V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                break;

            case 0x6000: // Set VX to NN
                this.reg[x] = byte;
                console.log("%cLD V" + toHex(x) + ", #$" + toHex(byte), "color: lightblue");
                break;

            case 0x7000: // Adds NN to VX
                this.reg[x] += byte;
                console.log("%cADD V" + toHex(x) + ", #$" + toHex(byte), "color: lightblue");
                break;

            case 0x8000: // Arithmetic instructions
                switch (opcode & 0xF) {
                    case 0x0000: // Sets VX to VY
                        this.reg[x] = this.reg[y];
                        console.log("%cLD V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    case 0x1000: // Sets VX to VX | VY
                        this.reg[x] |= this.reg[y];
                        console.log("%cOR V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    case 0x2000: // Sets VX to VY & VY
                        this.reg[x] &= this.reg[y];
                        console.log("%cAND V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    case 0x3000: // Sets VX to VX ^ VY
                        this.reg[x] ^= this.reg[y];
                        console.log("%cXOR V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    case 0x4000: // Adds VY to VX. VF set to 1 when carry.
                        {
                            const result = this.reg[x] + this.reg[y];
                            this.reg[0xF] = result > 0xFF ? 1 : 0;
                            this.reg[x] = result;
                        }
                        console.log("%cADD V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    case 0x5000: // VY is subtracted from VX. VF set to 0 when borrow
                        {
                            const vx = this.reg[x];
                            const vy = this.reg[y];
                            const newValue = vx - vy;
                            this.reg[0xF] = newValue < 0 ? 0 : 1;
                            this.reg[x] = newValue & 0xFF;


                        }
                        console.log("%cSUB V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    case 0x6000: // Stores the least significant bit of VX in VF and shifts VX right by 1
                        this.reg[0xF] = this.reg[x] & 1;
                        this.reg[x] >>= 1;
                        console.log("%cSHR V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    case 0x7000: // Sets VX to VY minus VX. VF is set to 0 when borrow.
                        {
                            const result = this.reg[y] - this.reg[x];
                            this.reg[0xF] = this.reg[x] < this.reg[y] ? 1 : 0;
                            this.reg[x] = result;
                        }
                        console.log("%cSUBN V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    case 0xE000: //Stores the most significant bit of VX in VF then shifts VX left 1
                        this.reg[0xF] = this.reg[x] & 0x80 == 0x80 ? 1 : 0;
                        this.reg[x] <<= 1;
                        console.log("%cSHL V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                        break;

                    default:
                        console.log("%cUnknown Opcode: " + opcode.toString(16).toUpperCase(), "color: red");
                }
                break;

            case 0x9000: // SE if VX != VY
                if (this.reg[x] != this.reg[y]) {
                    this.pc += 2;
                }
                console.log("%cSNE V" + toHex(x) + ", V" + toHex(y), "color: lightblue");
                break;

            case 0xA000: // Sets I to the address NNN
                this.i = addr;
                console.log("%cLD I, " + toHex(addr), "color: lightblue");
                break;

            case 0xB000: // Jumps to the address NNN plus V0
                this.pc = addr + this.reg[0];
                incr = false;
                console.log("%cJP V" + toHex(x) + ", $#" + toHex(addr), "color: lightblue");
                break;

            case 0xC000: // Sets VX to the result of & on a random number and NN
                const rand = (Math.random() * 256) & 0xFF;
                this.reg[x] = rand & byte;
                console.log("%cRND V" + toHex(x) + ", $#" + toHex(byte), "color: lightblue");
                break;

            case 0xD000: // Draws a sprite at coordinate (VX, VY) that has width 8px and height of N px
                const _x = this.reg[x];
                this.reg[0xF] = 0;
                for (let i = 0; i < nybble; i++) {
                    let bits = this.memory[this.i + i];
                    for (let j = 0; j < 8; j++) {
                        if ((bits & 0x80) > 0) {
                            if (!this.display.flipPixel(this.reg[x] + j, this.reg[y] + i)) {
                                this.reg[0xF] = 1;
                            }
                        }

                        bits <<= 1;
                    }
                }

                console.log("%cDRW V" + toHex(x) + ", V" + toHex(y) + " , " + toHex(nybble), "color: lightblue");
                break;

            case 0xE000:
                switch (opcode & 0xFF) {
                    case 0x9E: // SE if key in VX is pressed
                        if (this.keyState[this.reg[x]]) {
                            this.pc += 2;
                        }
                        console.log("%cSKP V" + toHex(x), "color: lightblue");
                        break;

                    case 0xA1: // SE if key in VX isn't pressed
                        if (!this.keyState[this.reg[x]]) {
                            this.pc += 2;
                        }
                        console.log("%cSKNP V" + toHex(x), "color: lightblue");
                        break;
                    default:
                        console.log("%cUnknown Opcode: " + opcode.toString(16).toUpperCase(), "color: red");
                }
                break;

            case 0xF000:
                switch (opcode & 0xFF) {
                    case 0x07: // Sets VX to the value of the delay timer
                        this.reg[x] = this.delayTimer;
                        console.log("%cLD V" + toHex(x) + " DT", "color: lightblue");
                        break;

                    case 0x0A: // A key press is awaited then stored in VX. Blocking operation.
                        this.awaitingKey = true;
                        this.keyReg = x;
                        console.log("%cLD V" + toHex(x) + " K", "color: lightblue");
                        break;

                    case 0x15: // Sets the delay timer to VX
                        this.delayTimer = this.reg[x];
                        console.log("%cLD DT, V" + toHex(x), "color: lightblue");
                        break;

                    case 0x18: // Sets the sound timer to VX
                        this.soundTimer = this.reg[x];
                        console.log("%cLD ST, V" + toHex(x), "color: lightblue");
                        break;

                    case 0x1E: // Adds VX to I
                        this.i += this.reg[x];
                        console.log("%cADD I, V" + toHex(x), "color: lightblue");
                        break;

                    case 0x29: // Sets I to the loc of the sprite for character in VX. Characters 0-F are represented by a 4x5 font
                        this.i = this.reg[x] * 5;
                        console.log("%cLD F, V" + toHex(x), "color: lightblue");
                        break;

                    case 0x33: // Stores the binary representation of VX with most significant of three digits at the addr in I, the middle digit at I + 1 and the least at I + 2.
                        const vx = this.reg[x];
                        const hundreds = Math.floor(vx / 100);
                        const tens = Math.floor(vx / 10) % 10;
                        const ones = vx % 10;
                        this.memory[this.i] = hundreds;
                        this.memory[this.i + 1] = tens;
                        this.memory[this.i + 2] = ones;

                        console.log("%cLD B, V" + toHex(x), "color: lightblue");
                        break;

                    case 0x55: // Stores V0 to VX (including VX) in memory starting at addr I
                        for (let i = 0; i <= x; i++) {
                            this.memory[i + this.i] = this.reg[i];
                        }
                        console.log("%cLD [I], V" + toHex(x), "color: lightblue");
                        break;

                    case 0x65: // Fills V0 to VX (including VX) with values from memory starting at addr I.
                        for (let i = 0; i <= x; i++) {
                            this.reg[i] = this.memory[i + this.i];
                        }
                        console.log("%cLD V" + toHex(x) + ", [I]", "color: lightblue");
                        break;

                    default:
                        console.log("%cUnknown Opcode: " + opcode.toString(16).toUpperCase(), "color: red");
                }
                break;
            default:
                console.log("%cUnknown Opcode: " + opcode.toString(16).toUpperCase(), "color: red");
        }
        if (incr) {
            this.pc += 2;
        }
    }


    /**
     * Stop the cpu
     *
     * @memberof CPU
     */
    stop() {
        console.log("%c-- Stopping CPU --", "color: orange");
        this.running = false;
        clearTimeout(this.timer);
        this.timer = null;
    }

    /**
     * Load rom into memory
     *
     * @param {*} data ROM as an arraybuffer
     * @memberof CPU
     */
    load(data) {
        this.rom = data;
        for (let i = 0; i < data.length; i++) {
            this.memory[i + 0x200] = data[i];
        }
        console.log("%c-- Rom Loaded --", "color: orange");
    }

    /**
     * Reset the emulator
     *
     * @memberof CPU
     */
    reset() {
        this.memory.fill(0, 0x200, 0x1000);
        this.gfx.fill(0);
        this.reg.fill(0);
        this.pc = 0x200;
        this.i = 0;
        this.sp = 0;
        this.stack.fill(0);
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.keyState.fill(false);
        this.running = false;
        this.awaitingKey = false;
        this.opCode = 0;

        // Load font into memory starting at 0x50 (80)
        for (let i = 0; i < 80; i++) {
            this.memory[i] = this.font[i];
        }

        console.log("%c-- Chip8 Reset --", "color: orange");
    }

    /**
     * Test function for testing
     *
     * @memberof CPU
     */
    test() {
        console.log("%c-- Test --", "color: cyan");
        console.log(this.display.flipPixel(0, 0, true));
        
    }
}


export default CPU;