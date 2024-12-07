import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// Fonction pour générer le token d'accès
const generateAccessToken = (user) => {
  return jwt.sign(
    { name: user.nom, prenom: user.prenom, userId: user.id, role: user.role, status: user.status },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Fonction pour générer le token de renouvellement
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

// Enregistrement d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    const { prenom, nom, telephone, email, password, role } = req.body;
    const validRoles = ['ADMIN', 'GESTIONNAIRE'];

    // Vérification du rôle
    if (role && !validRoles.includes(role)) {
      return res.status(400).send('Rôle invalide.');
    }

    // Vérification de l'existence de l'utilisateur
    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).send('L\'utilisateur existe déjà.');
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    await prisma.utilisateur.create({
      data: { prenom, nom, telephone, email, password: hashedPassword, role, status: true },
    });

    res.status(201).send('Utilisateur enregistré avec succès.');
  } catch (error) {
    res.status(500).send('Échec de l\'enregistrement.');
  }
};

// Connexion de l'utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email et mot de passe requis.');
    }

    const user = await prisma.utilisateur.findUnique({ where: { email } });

    if (!user || !user.status) {
      return res.status(400).send('Identifiants invalides ou compte inactif.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Identifiants invalides.');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: 'Connexion réussie.',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).send('Échec de la connexion.');
  }
};

// Renouvellement de l'accessToken
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send('Refresh token manquant.');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await prisma.utilisateur.findUnique({
      where: { id: decoded.userId, status: true },
    });

    if (!user) {
      return res.status(403).send('Utilisateur non trouvé ou inactif.');
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Échec de la vérification du refresh token:', error);
    res.status(403).send('Refresh token invalide.');
  }
};

export default {
  register,
  login,
  refreshAccessToken,
};
