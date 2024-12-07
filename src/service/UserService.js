import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import prisma from '../config/prisma.js';
import transporter from '../config/transporter.js';
config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const EMAIL_USER = process.env.EMAIL_USER;
class UserService {
  
  
  static async sendPasswordResetEmail(email) {
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    return { message: 'Email de réinitialisation envoyé.' };
  }
  static async resetPassword(token, newPassword) {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.utilisateur.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }
  
}


export default UserService;
