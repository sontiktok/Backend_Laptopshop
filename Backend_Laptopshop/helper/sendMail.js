const nodemailer = require("nodemailer");
require("dotenv").config();

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

// Định nghĩa hàm sendMail
const sendMail = async (email, url) => {
  const mailOptions = {
    from: {
      name: "The Son IT",
      address: process.env.USER,
    },
    to: email,
    subject: "Yêu cầu đặt lại mật khẩu",
    html: `<a href="${url}">Click vào đây để đổi mật khẩu</a>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = sendMail;
