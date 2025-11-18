/**
 * Email templates for user notifications
 */

interface PasswordEmailParams {
  recipientName: string;
  recipientEmail: string;
  tempPassword: string;
  companyName: string;
  loginUrl: string;
}

export function generatePasswordEmail(params: PasswordEmailParams): { subject: string; html: string; text: string } {
  const { recipientName, tempPassword, companyName, loginUrl } = params;
  
  const subject = `Bem-vindo ao ${companyName} - Suas credenciais de acesso`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5; }
    .password-box { background: #EEF2FF; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 18px; font-weight: bold; text-align: center; margin: 10px 0; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 4px; margin: 20px 0; }
    .footer { text-align: center; color: #6B7280; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Bem-vindo ao ${companyName}!</h1>
    </div>
    <div class="content">
      <p>Olá <strong>${recipientName}</strong>,</p>
      
      <p>Sua conta foi criada com sucesso! Use as credenciais abaixo para fazer login:</p>
      
      <div class="credentials">
        <p><strong>📧 Email:</strong><br>${params.recipientEmail}</p>
        <p><strong>🔐 Senha Temporária:</strong></p>
        <div class="password-box">${tempPassword}</div>
      </div>
      
      <div class="warning">
        <strong>⚠️ IMPORTANTE - Segurança da sua Conta</strong>
        <p style="margin: 10px 0 0 0;">Esta é uma senha temporária. Por segurança, você será solicitado a alterar sua senha no primeiro login.</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${loginUrl}" class="button">Fazer Login Agora</a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p><strong>📱 Dicas de Segurança:</strong></p>
        <ul style="color: #6B7280;">
          <li>Não compartilhe suas credenciais com ninguém</li>
          <li>Use uma senha forte e única</li>
          <li>Ative a autenticação de dois fatores quando disponível</li>
          <li>Faça logout ao usar computadores compartilhados</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>Este é um email automático. Por favor, não responda.</p>
      <p>© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  const text = `
Bem-vindo ao ${companyName}!

Olá ${recipientName},

Sua conta foi criada com sucesso! Use as credenciais abaixo para fazer login:

📧 Email: ${params.recipientEmail}
🔐 Senha Temporária: ${tempPassword}

⚠️ IMPORTANTE - Segurança da sua Conta
Esta é uma senha temporária. Por segurança, você será solicitado a alterar sua senha no primeiro login.

Acesse: ${loginUrl}

📱 Dicas de Segurança:
- Não compartilhe suas credenciais com ninguém
- Use uma senha forte e única
- Ative a autenticação de dois fatores quando disponível
- Faça logout ao usar computadores compartilhados

Este é um email automático. Por favor, não responda.
© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.
  `;
  
  return { subject, html, text };
}
