import aws from "aws-sdk";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const sesConfig = {
    accessKeyId: process.env.AMAZON_ACCESS_KEY,
    secretAccessKey: process.env.AMAZON_SECRET_KEY,
    region: process.env.SES_REGION
};

const aws_ses = new aws.SES(sesConfig);

const sendEmail = async (sendTo: string, message: string) => {
    console.log('first');
    const emailSource = process.env.EMAIL || 'default@example.com'; // Provide a default value if process.env.EMAIL is undefined

    const params = {
        Source: emailSource,
        Destination: {
            ToAddresses: [
                sendTo
            ],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: message
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: `Confirmation mail`
            }
        }
    };

    try {
        const res = await aws_ses.sendEmail(params).promise();
        console.log("Email sent successfully");
        console.log(res);
    } catch (error) {
        console.log(error);
    }
};
export default sendEmail;
