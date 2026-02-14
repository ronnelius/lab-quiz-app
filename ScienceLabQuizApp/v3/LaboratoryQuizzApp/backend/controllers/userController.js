import mongoose from "mongoose";
import User from '../models/userModel.js';
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const TOKEN_EXPIRES_IN = '24h';
const JWT_SECRET = 'your_jwt_secret_here';

//register
export async function register(req, res) {
    try {
        const {name, email, password, course, year, section} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: 'All Fields are Required.'
            })
        }
        if (!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: 'Invalid email'
            })
        }

        const exists = await User.findOne({email}).lean();
        if(exists) return res.status(409).json({
            success: false,
            message: 'User Already Exists'
        })

        const newId = new mongoose.Types.ObjectId();
        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
            _id: newId,
            name,
            email,
            password: hashPassword,
            course,
            year,
            section
        })
        await user.save();

        if(!JWT_SECRET) throw new Error('JWT SECRET is not found on server');

        const token = jwt.sign({id: newId.toString()}, JWT_SECRET, {expiresIn: TOKEN_EXPIRES_IN})
        return res.status(201).json({
            success: true,
            message: 'Account Created Successfully!',
            token,
            user: {id:user._id.toString(), name: user.name, email: user.email}
        });



    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}

//login
export async function login(req, res) {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'All Fields are Required.'
            })
        }
        const user = await User.findOne({email}).lean();    
        if(!user) return res.status(404).json({
            success: false,
            message: 'User Not Found'
        })

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({
            success: false,
            message: 'Invalid Credentials'
        })

        if(!JWT_SECRET) throw new Error('JWT SECRET is not found on server');

        const token = jwt.sign({id: user._id.toString()}, JWT_SECRET, {expiresIn: TOKEN_EXPIRES_IN})
        
        return res.status(200).json({
            
            success: true,
            message: 'Login Successful!',
            token,
            user: {id:user._id.toString(), name: user.name, email: user.email}
              console.log('Login request body:', req.body);
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}
