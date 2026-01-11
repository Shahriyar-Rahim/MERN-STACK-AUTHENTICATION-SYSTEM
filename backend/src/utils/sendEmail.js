import nodeMailer from "nodemailer";


export const sendEmail= async ({email, subject, message})=>{
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        service: process.env.SMPT_SERVICE,
        port: process.env.SMPT_PORT,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    });

    const options = {
        from: process.env.SMPT_USER,
        to: email,
        subject,
        html: message,
    };

    await transporter.sendMail(options);
}