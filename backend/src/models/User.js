import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

// https://mongoosejs.com/docs/schematypes.html#all-schema-types
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxLength: 50,
        minLength: 3
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6
    }
});

// https://mongoosejs.com/docs/api/schema.html#Schema.prototype.pre()
// https://mongoosejs.com/docs/middleware.html#pre
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// about schema methods - https://mongoosejs.com/docs/guide.html#methods
userSchema.methods.createJWT = function () {
    console.log('jwt will be send with this: ');
    console.log(this);
    return jwt.sign({
        id: this._id,
        name: this.name,
        email: this.email
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
};

userSchema.methods.comparePassword = async function (password) {
    const isPasswordMatch = await bcrypt.compare(password, this.password);
    return isPasswordMatch;
};

export default mongoose.model('User', userSchema)