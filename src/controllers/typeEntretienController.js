import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';/////////////

// Créer un type d'entretien
const creerTypeEntretien = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];//////////////

  const { nom, status, utilisateurId } = req.body;

  try {
    // Vérifier si l'utilisateur existe (si utilisateurId est fourni)
    if (utilisateurId) {
      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
      });
      if (!utilisateurExiste) {
        return res.status(404).json({ message: `Utilisateur avec ID ${utilisateurId} non trouvé.` });
      }
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);/////////////////
    const id_user = decoded.userId;/////////////////////
    // Créer le type d'entretien
    const typeEntretien = await prisma.typeEntretien.create({
      data: {
        nom,
        status: status, // valeur par défaut de status si non spécifiée
        utilisateurId: id_user,
      },
    });

    res.status(201).json({
      message: `Type d'entretien créé avec succès.`,
      typeEntretien,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du type d\'entretien.' });
  }
};

// Récupérer tous les types d'entretien
const afficherTypesEntretien = async (req, res) => {
  try {
    const typesEntretien = await prisma.typeEntretien.findMany({
      include: {
        utilisateur: true, // Inclure l'utilisateur associé (si applicable)
        entretiens: true, // Inclure les entretiens associés
      },
    });

    res.status(200).json({
      message: `${typesEntretien.length} type(s) d'entretien récupéré(s) avec succès.`,
      typesEntretien,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des types d\'entretien.' });
  }
};

// Récupérer un type d'entretien par ID
const afficherTypeEntretienParId = async (req, res) => {
  const { id } = req.params;

  try {
    const typeEntretien = await prisma.typeEntretien.findUnique({
      where: { id: Number(id) },
      include: {
        utilisateur: true,
        entretiens: true,
      },
    });

    if (!typeEntretien) {
      return res.status(404).json({ message: `Type d'entretien avec ID ${id} non trouvé.` });
    }

    res.status(200).json({
      message: `Type d'entretien avec ID ${id} récupéré avec succès.`,
      typeEntretien,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du type d\'entretien.' });
  }
};
const mettreAJourTypeEntretien = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];  // Authentification

  const { id } = req.params;
  const { nom, status, utilisateurId } = req.body;

  try {
    // Vérification du JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;

    // Vérification si le type d'entretien existe
    const typeEntretienExiste = await prisma.typeEntretien.findUnique({
      where: { id: Number(id) },
    });

    if (!typeEntretienExiste) {
      return res.status(404).json({ message: `Type d'entretien avec ID ${id} non trouvé.` });
    }

    // Vérification si l'utilisateur existe (si utilisateurId est fourni)
    if (utilisateurId) {
      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
      });
      if (!utilisateurExiste) {
        return res.status(404).json({ message: `Utilisateur avec ID ${utilisateurId} non trouvé.` });
      }
    }

    // Conversion du statut en booléen (si nécessaire)
    const statusBool = status === 'true' ? true : status === 'false' ? false : undefined;

    // Si le statut n'est ni "true" ni "false", renvoyer une erreur
    if (statusBool === undefined) {
      return res.status(400).json({ message: 'Le statut doit être "true" ou "false".' });
    }

    // Mise à jour du type d'entretien
    const typeEntretienMisAJour = await prisma.typeEntretien.update({
      where: { id: Number(id) },
      data: {
        nom,
        status: statusBool,  // Mise à jour avec le statut correctement converti
        utilisateurId: id_user,
      },
    });

    res.status(200).json({
      message: `Type d'entretien avec ID ${id} mis à jour avec succès.`,
      typeEntretien: typeEntretienMisAJour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du type d\'entretien.' });
  }
};
    

// Supprimer un type d'entretien
const supprimerTypeEntretien = async (req, res) => {
  const { id } = req.params;

  try {
    const typeEntretienExiste = await prisma.typeEntretien.findUnique({
      where: { id: Number(id) },
    });

    if (!typeEntretienExiste) {
      return res.status(404).json({ message: `Type d'entretien avec ID ${id} non trouvé.` });
    }

    await prisma.typeEntretien.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Type d'entretien avec ID ${id} supprimé avec succès.`,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Type d'entretien avec ID ${id} non trouvé.` });
    }
    res.status(500).json({ error: 'Erreur lors de la suppression du type d\'entretien.' });
  }
};

export {
  creerTypeEntretien,
  afficherTypesEntretien,
  afficherTypeEntretienParId,
  mettreAJourTypeEntretien,
  supprimerTypeEntretien,
};
