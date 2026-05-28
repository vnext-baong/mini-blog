import { start } from 'repl';

export const CONFIRM_REGISTER = (
  language: string,
  fullName: string,
  confirm_url: string,
) => {
  const titles: Record<string, string> = {
    vi: 'Xác thực tài khoản',
    en: 'Account Verification',
    ja: 'アカウント認証',
  };

  const getTemplate = (
    title: string,
    greeting: string,
    intro: string,
    instruction: string,
    btnText: string,
    warning: string,
    successMsg: string,
    footer: string,
  ) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f8fa;">
      <div style="background-color: #f5f8fa; padding: 40px 20px; font-family: 'ABeeZee', sans-serif; color: #333333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="background-color: #ffffff; padding: 25px 40px; text-align: center; border-bottom: 1px solid rgba(0, 0, 0, 0.05);">
            <h1 style="color: #000080; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Mini Blog</h1>
          </div>
          
          <div style="padding: 40px;">
            <h2 style="margin-top: 0; color: #000080; font-size: 22px;">${title}</h2>
            
            <p style="font-size: 16px; color: #444444; margin-bottom: 20px;">
              ${greeting} <strong>${fullName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #444444; margin-bottom: 20px;">
              ${intro}
            </p>
            
            <p style="font-size: 16px; color: #444444; margin-bottom: 30px;">
              ${instruction}
            </p>
            
            <div style="text-align: center; margin-bottom: 35px;">
              <a href="${confirm_url}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #000080; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0, 0, 128, 0.2);">
                ${btnText}
              </a>
            </div>
            
            <div style="font-size: 14.5px; color: #555555; margin-bottom: 25px; border-left: 4px solid #000080; background-color: #f0f4f8; padding: 15px; border-radius: 4px;">
              ${warning}
            </div>
            
            <p style="font-size: 16px; color: #444444; margin-bottom: 0;">
              ${successMsg}
            </p>
          </div>
          
          <div style="background-color: #f5f8fa; padding: 25px 40px; border-top: 1px solid #eaeaea; text-align: center; font-size: 14px; color: #555555;">
            ${footer}
          </div>
          
        </div>
      </div>
    </body>
    </html>
  `;

  const content: Record<string, string> = {
    vi: getTemplate(
      titles['vi'],
      'Xin chào',
      'Cảm ơn bạn đã quan tâm và đăng ký tài khoản sử dụng <strong>Mini Blog</strong>.',
      'Để hoàn tất việc đăng ký và xác minh địa chỉ email của bạn, vui lòng nhấn vào nút bên dưới:',
      'Xác thực Email',
      '<strong>Lưu ý:</strong> Liên kết này chỉ có hiệu lực trong vòng 15 phút. Nếu bạn không nhấn vào liên kết trong thời gian này, bạn sẽ phải yêu cầu gửi lại email xác thực.',
      'Sau khi xác thực thành công, tài khoản của bạn sẽ được kích hoạt và có thể bắt đầu sử dụng.',
      MAIL_FOOTER('vi'),
    ),
    en: getTemplate(
      titles['en'],
      'Hello',
      'Thank you for your interest and registering an account with <strong>Mini Blog</strong>.',
      'To complete your registration and verify your email address, please click the button below:',
      'Verify Email',
      '<strong>Note:</strong> This link is valid for 15 minutes. If you do not click the link within this time, you will need to request verification again.',
      'After successful verification, your account will be activated and ready to use.',
      MAIL_FOOTER('en'),
    ),
    ja: getTemplate(
      titles['ja'],
      'こんにちは',
      '<strong>Mini Blog</strong>へのご登録ありがとうございます。',
      '登録を完了し、メールアドレスを確認するには、以下のボタンをクリックしてください:',
      'メールを確認',
      '<strong>注意:</strong> このリンクは15分間有効です。この時間内にリンクをクリックしない場合は、再度確認をリクエストする必要があります。',
      '確認が完了すると、アカウントが有効になり、使用を開始できます。',
      MAIL_FOOTER('ja'),
    ),
  };

  return {
    titles: titles[language] || titles['en'],
    content: content[language] || content['en'],
  };
};

export const CONFIRM_REGISTER_GOOGLE = (
  language: string,
  email: string,
  name: string,
) => {
  const titles: Record<string, string> = {
    vi: 'Thông tin tài khoản Mini Blog',
    en: 'Mini Blog Account Information',
    ja: 'Mini Blogアカウント情報',
  };

  const getTemplate = (
    title: string,
    greeting: string,
    intro: string,
    message: string,
    footer: string,
  ) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f8fa;">
      <div style="background-color: #f5f8fa; padding: 40px 20px; font-family: 'ABeeZee', sans-serif; color: #333333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="background-color: #ffffff; padding: 25px 40px; text-align: center; border-bottom: 1px solid rgba(0, 0, 0, 0.05);">
            <h1 style="color: #000080; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Mini Blog</h1>
          </div>
          
          <div style="padding: 40px;">
            <h2 style="margin-top: 0; color: #000080; font-size: 22px;">${title}</h2>
            
            <p style="font-size: 16px; color: #444444; margin-bottom: 20px;">
              ${greeting} <strong>${name}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #444444; margin-bottom: 20px;">
              ${intro}
            </p>

            <p style="font-size: 16px; color: #444444; margin-bottom: 20px;">
              ${message}
            </p>
            
            <div style="text-align: center; margin-bottom: 35px;">
              <p>Email: <strong>${email}</strong></p>
              <p>Tên: <strong>${name}</strong></p>
            </div>
        
          </div>
          
          <div style="background-color: #f5f8fa; padding: 25px 40px; border-top: 1px solid #eaeaea; text-align: center; font-size: 14px; color: #555555;">
            ${footer}
          </div>
          
        </div>
      </div>
    </body>
    </html>
  `;

  const content: Record<string, string> = {
    vi: getTemplate(
      titles['vi'],
      'Xin chào',
      'Chào mừng bạn đến với <strong>Mini Blog</strong>.',
      'Chúng tôi xin thông báo rằng quá trình đăng ký tài khoản của bạn đã hoàn tất thành công! Bây giờ bạn đã trở thành một phần trong ứng dụng của chúng tôi và có thể trải nghiệm toàn bộ các tính năng và dịch vụ mà chúng tôi cung cấp.<br><br>Bạn có thể sử dụng tài khoản của mình để truy cập vào ứng dụng của chúng tôi và khám phá những tính năng hữu ích mà chúng tôi đã dành cho bạn.<br><br>  Thông tin chi tiết về tài khoản Google của bạn đã được chúng tôi ghi nhận như sau:',
      MAIL_FOOTER('vi'),
    ),
    en: getTemplate(
      titles['en'],
      'Hello',
      'Welcome to <strong>Mini Blog</strong>.',
      'We are pleased to inform you that your account registration process has been successfully completed! You are now part of our application and can experience all the features and services we provide.<br><br>You can use your account to access our application and discover the useful features we have reserved for you.<br><br>  Details about your Google account have been recorded as follows:',
      MAIL_FOOTER('en'),
    ),
    ja: getTemplate(
      titles['ja'],
      'こんにちは',
      '<strong>Mini Blog</strong>へようこそ。',
      'アカウント登録プロセスが正常に完了したことをお知らせいたします！ これであなたは私たちのアプリケーションの一部となり、提供するすべての機能やサービスを体験することができます。<br><br>アカウントを使用してアプリケーションにアクセスし、用意された便利な機能を探索することができます。<br><br>Googleアカウントの詳細は以下のように記録されています：',
      MAIL_FOOTER('ja'),
    ),
  };

  return {
    titles: titles[language] || titles['en'],
    content: content[language] || content['en'],
  };
};

export const MAIL_FOOTER = (language: string) => {
  const footers: Record<string, string> = {
    vi: `Trân trọng,<br><strong style="color: #000080; font-size: 16px; display: inline-block; margin-top: 8px;">Mini Blog</strong>`,
    en: `Best regards,<br><strong style="color: #000080; font-size: 16px; display: inline-block; margin-top: 8px;">Mini Blog</strong>`,
    ja: `敬具,<br><strong style="color: #000080; font-size: 16px; display: inline-block; margin-top: 8px;">Mini Blog</strong>`,
  };

  return footers[language] || footers['en'];
};
export const NOTI_MAINTENANCE = (language: string, start: Date) => {
  const titles: Record<string, string> = {
    vi: 'Thông báo bảo trì',
    en: 'Maintenance Notification',
    ja: 'メンテナンス通知',
  };
  const contents: Record<string, string> = {
    vi: `Xin chào, <br><br>
Chúng tôi muốn thông báo rằng hệ thống sẽ được bảo trì vào lúc <strong>${start.toLocaleString()}</strong>. Trong thời gian này, dịch vụ sẽ không khả dụng. Chúng tôi xin lỗi vì sự bất tiện này và cảm ơn bạn đã thông cảm.<br><br>
${MAIL_FOOTER('vi')}`,
    en: `Hello, <br><br>
We would like to inform you that the system will undergo maintenance at <strong>${start.toLocaleString()}</strong>. During this time, the service will be unavailable. We apologize for any inconvenience this may cause and thank you for your understanding.<br><br>
${MAIL_FOOTER('en')}`,
    ja: `こんにちは、<br><br>
システムは<strong>${start.toLocaleString()}</strong>にメンテナンスを行います。この期間中、サービスは利用できません。ご不便をおかけして申し訳ありませんが、ご理解いただきありがとうございます。<br><br>
${MAIL_FOOTER('ja')}`,
  };

  return { title: titles[language] || '', content: contents[language] || '' };
};
