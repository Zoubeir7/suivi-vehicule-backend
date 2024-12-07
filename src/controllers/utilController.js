import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import UserService from '../service/UserService.js';

const creerUtilisateur = async (req, res) => {
  const { prenom, nom, telephone, email, password, role, status } = req.body;

  try {
    // Vérifier si l'email est déjà utilisé
    const emailExistant = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (emailExistant) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hash du mot de passe
    const motDePasseHashé = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const utilisateur = await prisma.utilisateur.create({
      data: { prenom, nom, telephone, email, password: motDePasseHashé, role, status },
    });

    res.status(201).json({
      message: `Utilisateur ${prenom} ${nom} créé avec succès.`,
      utilisateur,
    });
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
  }
};

const recupererTousLesUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      orderBy: { id: 'asc' },
    });

    res.status(200).json({
      message: `${utilisateurs.length} utilisateur(s) récupéré(s) avec succès.`,
      utilisateurs,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

const recupererUtilisateurParId = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérification de l'ID valide
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID doit être un nombre valide." });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: Number(id) },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${id} non trouvé.` });
    }

    res.status(200).json({
      message: `Utilisateur avec l'ID ${id} récupéré avec succès.`,
      utilisateur,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur." });
  }
};

const mettreAJourUtilisateur = async (req, res) => {
  const { id } = req.params;
  const { prenom, nom, telephone, email, role, status } = req.body;

  try {
    // Vérification de l'ID valide
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID doit être un nombre valide." });
    }

    // Vérifier si l'utilisateur existe
    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { id: Number(id) },
    });

    if (!utilisateurExistant) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${id} non trouvé.` });
    }

    // Préparation des données à mettre à jour
    const data = { prenom, nom, telephone, email, role, status };
    
    const utilisateurMisAJour = await prisma.utilisateur.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json({
      message: `Utilisateur avec l'ID ${id} mis à jour avec succès.`,
      utilisateur: utilisateurMisAJour,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
  }
};

const supprimerUtilisateur = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérification de l'ID valide
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID doit être un nombre valide." });
    }

    // Vérifier si l'utilisateur existe
    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { id: Number(id) },
    });

    if (!utilisateurExistant) {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${id} non trouvé.` });
    }

    // Suppression de l'utilisateur
    await prisma.utilisateur.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Utilisateur avec l'ID ${id} supprimé avec succès.`,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Utilisateur avec l'ID ${id} non trouvé.` });
    }
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
};

const getCurrentUser = async(req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.utilisateur.findUnique({
      where: { id: userId },
    });

    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

const requestPasswordReset = async(req, res)=>{
  const { email } = req.body;
  try {
    const response = await UserService.sendPasswordResetEmail(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const resetPassword = async(req, res)=> {
  const { token, newPassword } = req.body;
  try {
    const response = await UserService.resetPassword(token, newPassword);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const UserController = {
  creerUtilisateur,
  recupererTousLesUtilisateurs,
  recupererUtilisateurParId,
  mettreAJourUtilisateur,
  supprimerUtilisateur,
  getCurrentUser,
  requestPasswordReset,
  resetPassword
};

export default UserController;
