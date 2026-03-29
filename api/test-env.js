module.exports = function handler(req, res) {
  res.status(200).json({
    message: "Kiểm tra biến số Vercel Environment",
    has_gmail_user: !!process.env.GMAIL_USER,
    has_gmail_pass: !!process.env.GMAIL_APP_PASSWORD,
    user_length: process.env.GMAIL_USER ? process.env.GMAIL_USER.length : 0,
    pass_length: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0
  });
}
