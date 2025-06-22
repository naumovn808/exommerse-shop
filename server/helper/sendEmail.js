import { Resend } from 'resend';
import dotenv from 'dotenv';
// Resend.com
dotenv.config();

if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_LEY is missing in .env file')
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            // from: 'Online Blinlin Shop <no-reply@test123.com>',
            // to: sendTo,
            // subject: subject,
            subject: 'Test email',
            from: 'onboarding@resend.dev',
            to: 'naumovn808@gmail.com',
            html: html
        })

        if (error) {
            console.error({ error });
            return null;
        }
    } catch (error) {
        console.error("Error sending email: ", error)
        return null
    }
}

export default sendEmail;