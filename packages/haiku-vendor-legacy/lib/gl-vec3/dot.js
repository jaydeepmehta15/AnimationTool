"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
exports.default = dot;
//# sourceMappingURL=dot.js.map