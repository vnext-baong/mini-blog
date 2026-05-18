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
  const content: Record<string, string> = {
    vi: `
      Xin chào <strong>${fullName},</strong><br><br>
      Cảm ơn bạn đã quan tâm và đăng ký tài khoản sử dụng <strong> Mini Blog.</strong><br>
      Để xác minh địa chỉ email của bạn, vui lòng nhấn vào liên kết sau đây:<br>
      <a href="${confirm_url}" target="_blank">Link xác thực</a><br><br>
      Liên kết này có hiệu lực trong vòng 15 phút. Nếu bạn không nhấn vào liên kết trong thời gian này, bạn sẽ phải yêu cầu xác thực lại.<br><br>
      Sau khi nhấn vào liên kết trên, tài khoản của bạn sẽ được xác thực và bạn có thể bắt đầu sử dụng.<br><br>
      ${MAIL_FOOTER(language)}
    `,
    en: `
        Hello <strong>${fullName},</strong><br><br>
        Thank you for your interest and registering an account with <strong>Mini Blog.</strong><br>
        To verify your email address, please click the following link:<br>
        <a href="${confirm_url}" target="_blank">Verification Link</a><br><br>
        This link is valid for 15 minutes. If you do not click the link within this time, you will need to request verification again.<br><br>
        After clicking the link above, your account will be verified and you can start using it.<br><br>
        ${MAIL_FOOTER(language)}
      `,
    ja: `
        こんにちは <strong>${fullName},</strong><br><br>
        <strong>Mini Blog</strong>へのご登録ありがとうございます。<br>
        メールアドレスを確認するには、以下のリンクをクリックしてください:<br>
        <a href="${confirm_url}" target="_blank">確認リンク</a><br><br>
        このリンクは15分間有効です。この時間内にリンクをクリックしない場合は、再度確認をリクエストする必要があります。<br><br>
        上記のリンクをクリックすると、アカウントが確認され、使用を開始できます。<br><br>
        ${MAIL_FOOTER(language)}
        `,
  };

  return { titles: titles[language] || '', content: content[language] || '' };
};
export const MAIL_FOOTER = (language: string) => {
  const footers: Record<string, string> = {
    vi: `
      Trân trọng, <br><br>
        MiniBlog <br>`,
    en: `
      Best regards, <br><br>
      MiniBlog <br>`,
    ja: `
      敬具, <br><br>
      MiniBlog <br>`,
  };

  return footers[language] || '';
};
