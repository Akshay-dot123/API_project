let nodemailer = require("nodemailer");
const cron = require("node-cron");
const Pdf = require("./pdf-controller");
const ExportToExcel = require("./excel-export-controller");
const EmailSender = async (req, res) => {
  const pdfBuffer = await Pdf();
  console.log("pdfBuffer============================>", pdfBuffer);
  const excelSheetPdf = await ExportToExcel();
  console.log("=======================>excelSheetPdf", excelSheetPdf);

  cron.schedule("* * * * *", async () => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "akshaytest234@gmail.com",
        pass: "pecl ybxa lgbo rvzg",
      },
    });

    let mailOptions = {
      from: "akshaytest234@gmail.com",
      to: "prabhuakshay123@gmail.com",
      subject: "Sending Email using Node.js",
      text: "That was easy!",
      attachments: [
        {
          filename: "user-details.pdf",
          content: pdfBuffer,
          encoding: "base64",
        },
        {
          filename: "dummies_data.xlsx",
          path: excelSheetPdf,
        },
      ],
    };
    transporter.sendMail(mailOptions, function (error, info) {    
      if (error) {
        console.log("===================>", error);
        res.status(500).send("Error sending email: " + error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Email sent");
      }
    });
  });
};
module.exports = EmailSender;
