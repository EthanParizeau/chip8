// Converts a number to its hexadecimal representation.
// With optional leading 0 padding.
// Eg.:
//
//   hex(255) => 'FF'
//   hex(255, 4) => '00FF'
//
function toHex(num, pad) {
    num = num.toString(16).toUpperCase();
    if (pad) {
        var s = num + "";
        while (s.length < pad) {
            s = "0" + s;
        }
        return s;
    }
    return num;
}


/**
 * Function to output color to chrome console
 *
 * @param {*} text The text to output
 * @param {*} color The color of the text
 */
function debugColor(text, color) {
    let textColor = "color: " + color;
    console.log(text, textColor);
}

export { toHex };