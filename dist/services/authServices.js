"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.SignIn = exports.signUp = void 0;
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const bcryptjs_1 = require("bcryptjs");
const user_1 = require("../models/user");
const jsonwebtoken_1 = require("jsonwebtoken");
const signUp = async ({ displayName, email, password, phoneNumber, }) => {
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
            access_token,
            refresh_token,
            status: 201,
        };
    }
    catch (error) {
        console.error(error);
    }
};
exports.signUp = signUp;
const SignIn = async ({ email, password, }) => {
    try {
        const user = await user_1.User.findOne({ email: email });
        if (!user) {
            return {
                message: 'Please check your login credentials',
                name: 'Unauthorized',
                status: 401,
            };
        }
        const IsCorrectPassword = await (0, bcryptjs_1.compare)(password, user.password);
        if (!IsCorrectPassword) {
            return {
                message: 'Please check your login credentials',
                name: 'Unauthorized',
                status: 401,
            };
        }
        const access_token = (0, jwtHelpers_1.generateAccess_Token)({
            _id: user._id.toString(),
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
        const refresh_token = (0, jwtHelpers_1.generateRefresh_Token)({
            _id: user._id.toString(),
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
        return { access_token, refresh_token, user, status: 200 };
    }
    catch (error) {
        console.error(error);
    }
};
exports.SignIn = SignIn;
const refresh = async (token) => {
    try {
        let verifiedUserId;
        let isTokenVerified = undefined;
        await (0, jsonwebtoken_1.verify)(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                return (isTokenVerified = {
                    message: error.message,
                    name: error.name,
                    status: 401,
                });
            }
            const { userId } = decoded;
            console.log(decoded);
            verifiedUserId = userId;
        });
        if (isTokenVerified) {
            return isTokenVerified;
        }
        const user = await user_1.User.findById(verifiedUserId);
        if (!user) {
            return { message: 'No user found', name: 'Not found', status: 404 };
        }
        const access_token = (0, jwtHelpers_1.generateAccess_Token)({
            _id: user._id.toString(),
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
        const refresh_token = (0, jwtHelpers_1.generateRefresh_Token)({
            _id: user._id.toString(),
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
        return { access_token, refresh_token, user, status: 200 };
    }
    catch (error) {
        console.error(error);
    }
};
exports.refresh = refresh;
