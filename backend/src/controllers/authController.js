import asyncWrapper from "../middleware/async.js";
import User from '../models/User.js';

const register = asyncWrapper(async (req, res) => {
    const {name, email, password} = req.body;
    // check perist user with same email?
    const emailExist = await User.findOne({email});
    if (emailExist) {
        return res.status(400).json({message: 'Email already in use'});
    }

    const newUser = await User.create({
        name,
        email,
        password
    });

    const token = newUser.createJWT();

    res.cookie('notes_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    res.status(201).json({id: newUser._id, name: newUser.name, email: newUser.email});
});

const login = asyncWrapper(async (req, res) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Provide email and password' });
    }
    
    // find user
    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = user.createJWT();
    
    res.cookie('notes_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    res.status(200).json({id: user._id, name: user.name, email: user.email});

});

const logout = asyncWrapper(async (req, res) => {
    res.clearCookie('notes_token');
    res.status(200).json({message: 'log out'});
});

const getCurrentUser = asyncWrapper(async (req, res) => {
    /* 
    example of req.user;
    
    req.user = {
        "id": "6900d5b73f09681a51b798d6",
        "name": "tim",
        "email": "email@email.ru",
        "iat": 1761662391,
        "exp": 1762267191
    }
    */
    
    if (req.user) {
        const {id, name, email} = req.user;
        res.status(200).json({id, name, email});
    }
    
});

export {register, login, logout, getCurrentUser};