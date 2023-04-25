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

    console.log({ username, email, verificationCode });

    /* const msg = {
        to: email,
        from: FROM_EMAIL,
        subject: `Welcome ${username}!`,
        text: `<h1>Welcome ${username}!</h1>

        <p>
            We're glad to welcome you on Instagram! to finish the registration
            process you'll have to click on the following link, then your
            account will be verified
        </p>

        <a href=${url}/auth/verifyAccount/${verificationCode}>Click Here!</a>`,
    }; */

    const msg = {
        to: "alessandro.stella2004@gmail.com",
        from: "authentication.email.4l3554@gmail.com",
        subject: "Prova email",
        text: "Kidabbukkinemammt",
    };

    sgMail.setApiKey(SENDGRID_KEY);

    sgMail.send(msg).then(
        () => {
            console.log("Email sent!");
        },
        (error) => {
            console.error(error);

            if (error.response) {
                console.error(error.response.body);
            }
        }
    );
}
