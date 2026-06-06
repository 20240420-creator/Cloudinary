const HTMLVerificationEmail = (code, name) => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f4ff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2c3e50; font-size: 26px; margin-bottom: 10px;">Verificación de Cuenta</h1>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        Hola <strong>${name}</strong>, gracias por registrarte.<br>
        Usa el siguiente código para verificar tu cuenta:
      </p>
      <div style="display: inline-block; padding: 14px 28px; margin: 20px 0; font-size: 28px; font-weight: bold; color: #fff; background-color: #3a86ff; border-radius: 8px; letter-spacing: 4px;">
        ${code}
      </div>
      <p style="font-size: 14px; color: #777;">
        Este código expira en <strong>15 minutos</strong>.<br>
        Si no creaste esta cuenta, puedes ignorar este correo.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <footer style="font-size: 12px; color: #aaa;">
        Si necesitas ayuda, contáctanos en 
        <a href="mailto:soporte@ejemplo.com" style="color: #3a86ff; text-decoration: none;">soporte@ejemplo.com</a>
      </footer>
    </div>
  `;
};

export default HTMLVerificationEmail;
