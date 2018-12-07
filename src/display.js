/**
 * Class to manage the p5.js display
 * @param {A} screen 
 */
class Display {

    attachCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.height = 32;
        this.width = 64;
        this.xScale = this.canvas.width / this.width;
        this.yScale = this.canvas.height / this.height;
        this.pixels = Array(64).fill(0).map(() => Array(32).fill(0));
    }
    
    /**
     * XOR pixel
     *
     * @param {*} x - x position
     * @param {*} y - y position
     * @returns - True if pixel was turned on
     * @memberof Display
     */
    flipPixel(x, y) {

        // Wrap around vertically
        if (x > this.width) {
            x -= this.width;
        } else if (x < 0) {
            x += this.width;
        }

        // Wrap around horizontally
        if (y > this.height) {
            y -= this.height;
        } else if (y < 0) {
            y += this.height;
        }

        // Set the pixel state
        var active = this.pixels[x][y] ? 0 : 1;

        if (active) {
            // Draw pixel
            this.ctx.fillStyle = 'green';
        } else {
            // Erase pixel
            this.ctx.fillStyle = 'red';
        }
        this.ctx.fillRect(x * this.xScale, y * this.yScale, this.xScale, this.yScale);

        // Return pixel state
        return active;
    }

    // Fill the pixel array with 0's
    clear() {
        this.pixels.fill(0);
    }

    test() {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(10, 10, 150, 100);
    }
}

export default Display;