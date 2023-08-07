import { parentPort } from "worker_threads";
import { sendEmail } from "../../utils/email/sendMail";
parentPort?.on("message", async (data) => {
  try {
    const { email, subject, templateData, templateName } = data;
    await sendEmail(email, subject, templateData, templateName);
    parentPort?.postMessage({
      success: true,
    });
  } catch (err: any) {
    parentPort?.postMessage({
      success: false,
      error: err.message,
    });
  }
});
