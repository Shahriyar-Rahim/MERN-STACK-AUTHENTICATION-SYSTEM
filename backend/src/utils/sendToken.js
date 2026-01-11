export const sendToken = (user, statuseCode, message, res) => {
    const token = user.generateToken();
    // console.log(token)
    res.status(statuseCode).cookie("token", token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }).json({
        success: true,
        message,
        token,
        user,
    });
};