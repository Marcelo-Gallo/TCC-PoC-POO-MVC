# app/core/email.py
import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

# Instanciando a configuração com as variáveis do .env
conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True") == "True",
    MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False") == "True",
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

async def enviar_email_recuperacao(email_destino: str, token: str):
    """
    Função assíncrona para disparar o e-mail de recuperação de senha.
    """
    link_recuperacao = f"http://localhost:3000/redefinir-senha?token={token}"
    
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Recuperação de Senha</h2>
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta no sistema da <strong>Tríplice Hélice Municipal</strong>.</p>
        <p>Para criar uma nova senha, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{link_recuperacao}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Minha Senha</a>
        </div>
        <p style="color: #7f8c8d; font-size: 14px;">Se você não solicitou esta alteração, por favor, ignore este e-mail. Nenhuma mudança será feita na sua conta.</p>
        <hr style="border: 1px solid #eee; margin-top: 30px;" />
        <p style="color: #bdc3c7; font-size: 12px; text-align: center;">Este é um e-mail automático, não responda.</p>
    </div>
    """

    message = MessageSchema(
        subject="Recuperação de Senha - Tríplice Hélice Municipal",
        recipients=[email_destino],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    print(f"E-mail de recuperação enviado com sucesso para {email_destino}")