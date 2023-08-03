import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

export const sendEmail = async (
  email: string,
  subject: string,
  payload: Record<string, any>,
  template: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    const source = fs.readFileSync(
      path.join(__dirname, `./template/${template}.handlebars`),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: process.env.GMAIL_ACCOUNT,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    const info = await transporter.sendMail(options());
    console.log(info);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
