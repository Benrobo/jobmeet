
const SMTP_TOKEN = "3871433c-6091-4ec2-a099-be182d5e6e29"

export function sendMail(to = "", body = "", subject?: string) {
    (window as any)?.Email.send({
        SecureToken: SMTP_TOKEN,
        To: to,
        From: "jobmeet@gmail.com",
        Subject: subject || "JobMeet.",
        Body: body
    }).then((message: any) => {
        console.log(message);
    }).catch((err: any) => {
        console.log(err);
    })
}