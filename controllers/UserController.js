import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const errs = validationResult(req);
        if (!errs.isEmpty()){
            return res.status(400).json(errs.array())
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const bcryptedPassword = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: bcryptedPassword,
        });

        const user = await doc.save();
        const { passwordHash, __v, ...userData } = user._doc;

        const token = jwt.sign({
            _id: user._id,
        }, 'secret', {
            expiresIn: '30d',
        });

        res.json({...userData, token});
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'an error occurred while registering the user'
        });
    }
}

export const login = async (req, res)=>{
    try {
        const user = await UserModel.findOne({
            email: req.body.email
        });

        if (!user){
            return res.status(404).json({
                message: 'user not found'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass){
            return res.status(404).json({
                message: 'wrong login or password'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret',
            {
                expiresIn: '30d',
            }
        )

        const { passwordHash, __v, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'an error occurred while trying to login'
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user){
            return res.status(404).json({
                message: 'user not found'
            });
        }

        const { passwordHash, __v, ...userData } = user._doc;

        res.json({...userData});
    } catch (e) {

    }
}