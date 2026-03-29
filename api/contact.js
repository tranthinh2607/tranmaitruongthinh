const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Chỉ cho phép nhận thông tin qua phương thức POST thay vì bị người ngoài truy cập bừa
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ. Vui lòng gửi bằng Form.' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Vui lòng điền đủ Tên, Email và Nội dung.' });
  }

  try {
    // Khởi tạo cầu nối NodeMailer sử dụng GMAIL SMTP
    // Cần phải có 2 biến GMAIL_USER và GMAIL_APP_PASSWORD gắn trên Vercel mới hoạt động
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Blogge Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Bắn thẳng về email hộp thư của bạn
      replyTo: email, // Khi bạn bấm Reply Gmail, nó sẽ rep thẳng cho khách 
      subject: `[Web Contact] Tin nhắn mới từ ${name}`,
      text: `Bạn vừa nhận được 1 contact form.\n\nTên: ${name}\nEmail: ${email}\nNội dung: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">🎉 Bạn có thông báo liên hệ mới từ Website</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; width: 100px;"><strong>Người gửi</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
          <h3 style="margin-top: 20px;">Nội dung tin nhắn:</h3>
          <div style="padding: 15px; background-color: #f9f9f9; border-left: 5px solid #111; font-style: italic; white-space: pre-wrap;">
            ${message}
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #888;">Gửi tự động từ hệ thống Vercel Serverless Function & Nodemailer.</p>
        </div>
      `,
    };

    // Yêu cầu thư viện thực hiện gửi Mail
    await transporter.sendMail(mailOptions);
    
    // Gửi tín hiệu thành công cho Client báo xanh lá
    return res.status(200).json({ success: true, message: 'Đã gửi thành công qua hệ thống Email Vercel Serverless!' });
  } catch (error) {
    console.error('Lỗi khi bắn mail qua Serverless:', error);
    return res.status(500).json({ error: 'Lỗi cấu hình Cổng Vercel ở biến môi trường hoặc mất mạng.' });
  }
}
