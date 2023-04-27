import url from "@/utils/url";
import * as sgMail from "@sendgrid/mail";

const { SENDGRID_KEY, FROM_EMAIL } = process.env;

export default async function sendVerificationEmail(
    username: string,
    email: string,
    verificationCode: string
) {
    if (!SENDGRID_KEY || !FROM_EMAIL)
        throw new Error("Missing ENV variables: SENDGRID_KEY or FROM_MAIL");

    const msg = {
        to: email,
        from: FROM_EMAIL,
        subject: `Welcome ${username}!`,
        html: `<h1>Welcome ${username}!</h1>

        <p>
            We're glad to welcome you on Instagram! to finish the registration
            process you'll have to click on the following link, then your
            account will be verified
        </p>

        <a href=${url}/auth/verifyAccount/${verificationCode}>Click Here!</a>`,
    };

    sgMail.setApiKey(SENDGRID_KEY);

    sgMail.send(msg).then(
        () => {
            console.log("Email sent!");
        },
        (error) => {
            console.log("ERROR, Email NOT sent!");

            if (error.response) {
                console.error(error.response.body);
            }
        }
    );
}
