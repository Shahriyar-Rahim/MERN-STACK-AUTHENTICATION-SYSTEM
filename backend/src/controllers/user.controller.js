import ErrorHandler from "../middleware/error.js";
import {catchAsyncError} from "../middleware/catchAsyncError.js";
import {User} from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const register = catchAsyncError(async (req, res, next) => {
    try {
        const {name, email, phone,  password, verificationMethod } = req.body;

        if(!name || !email || !phone || !password || !verificationMethod) {
            return next(new ErrorHandler("Please enter all fields", 400));
        }

        function validatePhoneNumber(phone){
            ///^\+8801[3-9]\d{8}$/
            const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
            return phoneRegex.test(phone);
        }

        if(!validatePhoneNumber(phone)){
            return next(new ErrorHandler("Please enter a valid phone number", 400));
        }

        const existingUser = await User.findOne({
            $or: [
                {email,
                accountVerified: true},
                {
                    phone,
                    accountVerified: true
                }
            ]
        })

        if(existingUser){
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const registerationAttemptsByUser = await User.countDocuments({
            $or: [
                {
                    phone,
                    accountVerified: false
                },
                {
                    email,
                    accountVerified: false
                }
            ]
        })

        if(registerationAttemptsByUser >= 3){
            return next(new ErrorHandler("You have exceeded the limit of maximum registration attempts (3). Please try again after an hour", 400));
        }
        if(verificationMethod !== "email" && verificationMethod !== "phone") {
            return next(new ErrorHandler("Invalid verification method", 400));
        }
        const userData = {
            name,
            email,
            phone,
            password,
        }

        const user = await User.create(userData);
        const verificationCode = await user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationMethod, verificationCode, email, phone, res);
    
    } catch (error) {
        console.log("Error in register controller", error);
        next(error);
    }
})

async function sendVerificationCode(verificationMethod, verificationCode, email, phone, res) {
    try {
        if(verificationMethod === "email") {
        // send verification code via email
        const message = generateEmailTemplate(verificationCode);
        sendEmail({email, subject: "Your Verification Code", message});
        res.status(200).json({success: true,
            message: "Verification code sent to your email"});
    } else if(verificationMethod === "phone") {
        // send verification code via phone
        // const verificationCodeWithSpace = verificationCode.toString().split("").join(" ");
        // await client.calls.create({
        //     twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}</Say></Response>`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: phone,
        // })
        
        const message = generateEmailTemplate(verificationCode);
        sendEmail({email, subject: "Your Verification Code", message});
        res.status(200).json({success: true,
            message: "OTP verification is not available yet switching to email verification, please check your email for the verification code"});
    } else {
        return res.status(500).json({success: false, message: "Invalid verification method"});
    }
    } catch (error) {
        console.log("Error sending verification code", error)
        return res.status(500).json({success: false, message: "Failed to send verification code"});
    }
}

function generateEmailTemplate(verificationCode) {
    return `
<div style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f9fc; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    
                    <tr>
                        <td align="center" style="padding: 40px 0 20px 0; background-color: #ffffff;">
                            <h1 style="margin: 0; color: #333333; font-size: 24px; font-weight: 700;">Your App Name</h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 20px; font-weight: 600;">Account Verification</h2>
                            <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">
                                Please use the following one-time password (OTP) to complete your registration. This code is valid for <b>5 minutes</b>.
                            </p>
                            
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                                <span style="display: block; font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">
                                    ${verificationCode}
                                </span>
                            </div>

                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                                If you did not request this, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8fafc; text-align: center;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                                &copy; 2026 Your Company Name. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
    `;
}

// verify otp
export const verifyOtp = catchAsyncError(async(req, res, next) => {
    const {email, phone, otp} = req.body;
    // console.log(req.body)
    function validatePhoneNumber(phone){
            ///^\+8801[3-9]\d{8}$/
            const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
            return phoneRegex.test(phone);
        }

        if(!validatePhoneNumber(phone)){
            return next(new ErrorHandler("Please enter a valid phone number", 400));
        }
        try {
            const userALlEntries = await User.find({
                $or: [
                    {email, accountVerified: false},
                    {phone, accountVerified: false}
                ],
            }).sort({createdAt: -1});

            if(!userALlEntries){
                return next(new ErrorHandler("User not found", 404));
            }

            let user;
            if(userALlEntries.length > 1){
                user = userALlEntries[0];

                await User.deleteMany({
                    _id: {$ne: user._id},
                    $or: [
                        {email, accountVerified: false},
                        {phone, accountVerified: false}
                    ]
                })
            } else {
                user = userALlEntries[0];
            }

            if(user.verificationCode !== Number(otp)){
                return next(new ErrorHandler("Invalid OTP", 400));
            }
            // if otp expires
            const currentTime = Date.now();
            const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();
            // console.log(currentTime)
            // console.log(verificationCodeExpire)
            if(currentTime > verificationCodeExpire){
                return next(new ErrorHandler("OTP has expired", 400));
            }

            user.accountVerified = true;
            user.verificationCode = null;
            user.verificationCodeExpire = null;
            await user.save({validateModifiedOnly: true});

            sendToken(user, 200, "Account verified successfully", res);

        } catch (error) {
            // console.log("Error in verify otp controller", error);
            return next(new ErrorHandler(error.message, 500));
        }
})

// login controller
export const login = catchAsyncError(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await User.findOne({email, accountVerified: true}).select("+password");

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, "User logged in Successfull", res);
})

// logout controller
export const logout = catchAsyncError(async(req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }).json({success: true, message: "User logged out successfully"});
});

// get user
export const getUser = catchAsyncError(async(req, res, next) => {
    const user = req.user;
    res.status(200).json({success: true, user});
});

// forgot password
export const forgotPassword = catchAsyncError(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email, accountVerified: true});
    if(!user){
        return next(new ErrorHandler("User not found", 404));
    };

    const resetToken = user.generateResetPasswordToken();
    
    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

    const message = `Your password reset token is - \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        sendEmail({email: user.email, subject:"MERN Authentication reset password", message});
        res.status(200).json({success: true, message: `Email send to ${user.email} successfully`});
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});

        // console.log("Error reseting pass function")
        return next(new ErrorHandler(error.message ? error.message : "Failed to send reset password token", 500));
    }
})

// reset password
export const resetPassword = catchAsyncError(async(req, res, next) => {
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, "Password reset successfully", res);
});