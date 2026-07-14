export function getPasswordResetEmailHtml(url: string, userName: string = "Usuário") {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet">
        
        <style>
            body, table, td, p, a, h1, h2 {
                font-family: 'Nunito Sans', sans-serif !important;
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Nunito Sans', sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                        <tr>
                            <td align="center" style="padding: 40px 40px 20px 40px;">
                                <h2 style="margin: 0; color: rgba(15, 23, 42, 0.7); font-size: 24px; font-weight: 700;">AiWeb</h2>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 40px 30px 40px; text-align: center;">
                                <h1 style="margin: 0 0 20px 0; color: #0f172a; font-size: 22px; font-weight: 600; line-height: 30px;">Olá, ${userName}!</h1>
                                <p style="margin: 0 0 30px 0; color: #6a6a6a; font-size: 16px; line-height: 24px; font-weight: 500;">
                                    Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para escolher uma nova senha.
                                </p>
                                <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                    <tr>
                                        <td align="center" bgcolor="#0f172a" style="border-radius: 6px;">
                                            <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 30px; font-size: 16px; color: #ffffff; font-weight: bold; text-decoration: none; border-radius: 6px;">
                                                Redefinir senha
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin: 30px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 22px;">
                                    Se você não solicitou essa alteração, pode ignorar este e-mail com segurança. Sua senha atual continuará a mesma.
                                </p>
                            </td>
                        </tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; text-align: center;">
                        <tr>
                            <td style="padding: 30px 20px 0 20px; color: #94a3b8; font-size: 12px; line-height: 18px;">
                                Este é um e-mail automático, por favor não responda.<br>
                                © 2026 AiWeb. Todos os direitos reservados.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
}