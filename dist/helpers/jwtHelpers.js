"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefresh_Token = exports.generateAccess_Token = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateAccess_Token = ({ _id, email, displayName, phoneNumber, }) => {
    return (0, jsonwebtoken_1.sign)({
        userId: _id,
        email: email,
        displayName: displayName,
        phoneNumber: phoneNumber,
    }, process.env.SECRET, { expiresIn: '1h' });
};
exports.generateAccess_Token = generateAccess_Token;
const generateRefresh_Token = ({ _id, email, displayName, phoneNumber, }) => {
    return (0, jsonwebtoken_1.sign)({
        userId: _id,
        email: email,
        displayName: displayName,
        phoneNumber: phoneNumber,
    }, process.env.SECRET, {
        expiresIn: '365d',
    });
};
exports.generateRefresh_Token = generateRefresh_Token;
