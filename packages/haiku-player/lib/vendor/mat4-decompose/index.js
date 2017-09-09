"use strict";
exports.__esModule = true;
var normalize_1 = require("./normalize");
var create_1 = require("./../gl-mat4/create");
var clone_1 = require("./../gl-mat4/clone");
var determinant_1 = require("./../gl-mat4/determinant");
var invert_1 = require("./../gl-mat4/invert");
var transpose_1 = require("./../gl-mat4/transpose");
var length_1 = require("./../gl-vec3/length");
var normalize_2 = require("./../gl-vec3/normalize");
var dot_1 = require("./../gl-vec3/dot");
var cross_1 = require("./../gl-vec3/cross");
var vec3 = {
    length: length_1["default"],
    normalize: normalize_2["default"],
    dot: dot_1["default"],
    cross: cross_1["default"]
};
var tmp = create_1["default"]();
var perspectiveMatrix = create_1["default"]();
var tmpVec4 = [0, 0, 0, 0];
var row = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var pdum3 = [0, 0, 0];
function decomposeMat4(matrix, translation, scale, skew, perspective, quaternion) {
    if (!translation)
        translation = [0, 0, 0];
    if (!scale)
        scale = [0, 0, 0];
    if (!skew)
        skew = [0, 0, 0];
    if (!perspective)
        perspective = [0, 0, 0, 1];
    if (!quaternion)
        quaternion = [0, 0, 0, 1];
    if (!normalize_1["default"](tmp, matrix))
        return false;
    clone_1["default"](perspectiveMatrix);
    perspectiveMatrix[3] = 0;
    perspectiveMatrix[7] = 0;
    perspectiveMatrix[11] = 0;
    perspectiveMatrix[15] = 1;
    if (Math.abs(Number(determinant_1["default"](perspectiveMatrix) < 1e-8)))
        return false;
    var a03 = tmp[3];
    var a13 = tmp[7];
    var a23 = tmp[11];
    var a30 = tmp[12];
    var a31 = tmp[13];
    var a32 = tmp[14];
    var a33 = tmp[15];
    if (a03 !== 0 || a13 !== 0 || a23 !== 0) {
        tmpVec4[0] = a03;
        tmpVec4[1] = a13;
        tmpVec4[2] = a23;
        tmpVec4[3] = a33;
        var ret = invert_1["default"](perspectiveMatrix, perspectiveMatrix);
        if (!ret)
            return false;
        transpose_1["default"](perspectiveMatrix, perspectiveMatrix);
        vec4multMat4(perspective, tmpVec4, perspectiveMatrix);
    }
    else {
        perspective[0] = perspective[1] = perspective[2] = 0;
        perspective[3] = 1;
    }
    translation[0] = a30;
    translation[1] = a31;
    translation[2] = a32;
    mat3from4(row, tmp);
    scale[0] = vec3.length(row[0]);
    vec3.normalize(row[0], row[0]);
    skew[0] = vec3.dot(row[0], row[1]);
    combine(row[1], row[1], row[0], 1.0, -skew[0]);
    scale[1] = vec3.length(row[1]);
    vec3.normalize(row[1], row[1]);
    skew[0] /= scale[1];
    skew[1] = vec3.dot(row[0], row[2]);
    combine(row[2], row[2], row[0], 1.0, -skew[1]);
    skew[2] = vec3.dot(row[1], row[2]);
    combine(row[2], row[2], row[1], 1.0, -skew[2]);
    scale[2] = vec3.length(row[2]);
    vec3.normalize(row[2], row[2]);
    skew[1] /= scale[2];
    skew[2] /= scale[2];
    vec3.cross(pdum3, row[1], row[2]);
    if (vec3.dot(row[0], pdum3) < 0) {
        for (var i = 0; i < 3; i++) {
            scale[i] *= -1;
            row[i][0] *= -1;
            row[i][1] *= -1;
            row[i][2] *= -1;
        }
    }
    quaternion[0] =
        0.5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0));
    quaternion[1] =
        0.5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0));
    quaternion[2] =
        0.5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0));
    quaternion[3] =
        0.5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0));
    if (row[2][1] > row[1][2])
        quaternion[0] = -quaternion[0];
    if (row[0][2] > row[2][0])
        quaternion[1] = -quaternion[1];
    if (row[1][0] > row[0][1])
        quaternion[2] = -quaternion[2];
    return true;
}
exports["default"] = decomposeMat4;
function vec4multMat4(out, a, m) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
}
function mat3from4(out, mat4x4) {
    out[0][0] = mat4x4[0];
    out[0][1] = mat4x4[1];
    out[0][2] = mat4x4[2];
    out[1][0] = mat4x4[4];
    out[1][1] = mat4x4[5];
    out[1][2] = mat4x4[6];
    out[2][0] = mat4x4[8];
    out[2][1] = mat4x4[9];
    out[2][2] = mat4x4[10];
}
function combine(out, a, b, scale1, scale2) {
    out[0] = a[0] * scale1 + b[0] * scale2;
    out[1] = a[1] * scale1 + b[1] * scale2;
    out[2] = a[2] * scale1 + b[2] * scale2;
}
//# sourceMappingURL=index.js.map