"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const bcryptjs_1 = require("bcryptjs");
const user_1 = require("../models/user");
const signUp = async (data) => {
    const { displayName, email, password, phoneNumber } = data;
    try {
        let user = await user_1.User.findOne({ email: email });
        const userPhoneCheck = await user_1.User.findOne({ phoneNumber: phoneNumber });
        if (user) {
            return {
                message: 'A User with this email already exists',
                name: 'Already Exists',
                status: 403,
            };
        }
        if (userPhoneCheck) {
            return {
                message: 'A user with this phoneNumber already exists',
                name: 'Already Exists',
                status: 403,
            };
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 12);
        user = new user_1.User({
            email,
            password: hashedPassword,
            displayName,
            phoneNumber,
        });
        const result = await user.save();
        const access_token = (0, jwtHelpers_1.generateAccess_Token)({
            _id: result._id.toString(),
            displayName: result.displayName,
            email: result.email,
            phoneNumber: result.phoneNumber,
        });
        const refresh_token = (0, jwtHelpers_1.generateRefresh_Token)({
            _id: result._id.toString(),
            displayName: result.displayName,
            email: result.email,
            phoneNumber: result.phoneNumber,
        });
        return {
            user: result,
            access_token: access_token,
            refresh_token: refresh_token,
            status: 201,
        };
    }
    catch (error) {
        console.error(error);
    }
};
exports.signUp = signUp;
