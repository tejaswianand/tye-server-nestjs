export const EmailTemplates = {
    otpVerification: (otp: string, browser: string, os: string, location: any, ip: string, email: string) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Verification</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style="font-family: 'Poppins', sans-serif; background-color: #1e293b; display: flex; justify-content: center; align-items: center; padding: 1rem; margin: 0; height: 100vh;">
        <div style="width: 98%; max-width: 500px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 1.5rem; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: bold; color: #333333; text-align: left;">trackye</div>
          <p style="font-size: 1rem; color: #333333; font-weight: 600; text-align: left;">Your Login Verification Code</p>
          <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px; font-size: 1rem; color: #333333; font-weight: 600;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #9ca3af; text-align: left;">Don't share this code with anyone!</p>
          <div style="padding: 10px; border-radius: 10px; color: #ca8a04; background-color: #fefce8; font-size: 12px; border: 1px solid #ca8a04; margin: 20px auto; text-align: left;">
            <div style="font-size: 14px; font-weight: 600;">Was this request not made by you?</div>
            <p style="font-size: 12px; color: #333333;">
              This code was generated from a request made using ${browser} on ${os} at ${new Date().toLocaleString()} from IP address ${ip} in ${location.city}, ${location.region}, ${location.country}.
              If you did not initiate this request, you can safely ignore this email.
            </p>
          </div>
          <p style="font-size: 12px; color: #9ca3af; text-align: left;">
            This is an automated message sent to ${email}. <span style="font-weight: 600;">Please do not reply.</span>
          </p>
          <p style="font-size: 12px; color: #9ca3af; font-weight: 600; text-align: left;">trackye &copy; 2024</p>
        </div>
      </body>
    </html>
  `,
};
