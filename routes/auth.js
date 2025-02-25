const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Solicitar recuperação de senha
router.post('/forgot-password', async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

// Redefinir senha
router.post('/reset-password', async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).send('Senha inválida');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

// Middleware para verificar o token JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Rota protegida para verificar o perfil do usuário
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json({ email: user.email, name: user.name, telefone: user.telefone });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;