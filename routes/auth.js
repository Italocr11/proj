const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Solicitar recuperação de senha
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).send('Usuário não encontrado');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiration = new Date(Date.now() + 3600000); // 1 hora

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiration,
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperação de Senha',
    text: `Clique no link para redefinir sua senha: ${resetLink}`,
  });

  res.send('E-mail de recuperação de senha enviado');
});

// Redefinir senha
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.expiration < new Date()) {
    return res.status(400).send('Token inválido ou expirado');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.usuario.update({
    where: { id: resetToken.userId },
    data: { senha: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  res.send('Senha atualizada com sucesso');
});

module.exports = router;