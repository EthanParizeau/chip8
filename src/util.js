// Converts a number to its hexadecimal representation.
// With optional leading 0 padding.
// Eg.:
//
//   hex(255) => 'FF'
//   hex(255, 4) => '00FF'
//
function toHex(num) {
    let result = num.toString(16).toUpperCase();
    return result;
}

export { toHex };