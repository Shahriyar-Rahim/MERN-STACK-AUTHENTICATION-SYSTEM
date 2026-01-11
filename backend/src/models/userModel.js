import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: {
        type: String,
        minLength: [8, "Password must be at least 8 characters long"],
        maxLength: [32, "Password must be at most 32 characters long"],
        select: false
    },
    phone: String,
    accountVerified: {
        type: Boolean,
        default: false
    },
    verificationMethod: String,
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// hash password
userSchema.pre('save', async function () {
    const user = this;
    if (!user.isModified('password')) return;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
});

// compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// GENERate verification code
userSchema.methods.generateVerificationCode = function(){
    function generateRandomFiveDIgitNumber(){
     const firstDigit = Math.floor(Math.random() * 9) + 1;
     const remainingDigits = Math.floor(Math.random() * 10000)
     .toString()
     .padStart(4, 0);

     return parseInt(firstDigit + remainingDigits);
    }
    const verificationCode = generateRandomFiveDIgitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 5 * 60 * 1000;

    return verificationCode;
}

// generate token
userSchema.methods.generateToken = function(){
    const user = this;
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// generate reset password token
userSchema.methods.generateResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

export const User = model("User", userSchema);
