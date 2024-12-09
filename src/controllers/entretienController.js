import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';

// Créer un entretien
const creerEntretien = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { date, cout, utilisateurId, typeEntretienId, vehiculeId } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;
    if (utilisateurId) {
      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
      });
      if (!utilisateurExiste) {
        return res.status(404).json({ message: `Utilisateur avec ID ${utilisateurId} non trouvé.` });
      }
    }

    // Vérifier si le type d'entretien existe
    if (typeEntretienId) {
      const typeEntretienExiste = await prisma.typeEntretien.findUnique({
        where: { id: typeEntretienId },
      });
      if (!typeEntretienExiste) {
        return res.status(404).json({ message: `Type d'entretien avec ID ${typeEntretienId} non trouvé.` });
      }
    }
    
    // Vérifier si le véhicule existe
    if (vehiculeId) {
      const vehiculeExiste = await prisma.vehicule.findUnique({
        where: { id: vehiculeId },
      });
      if (!vehiculeExiste) {
        return res.status(404).json({ message: `Véhicule avec ID ${vehiculeId} non trouvé.` });
      }
    }

    // Créer l'entretien
    const entretien = await prisma.entretien.create({
      data: {
        date: new Date(date),
        cout,
        utilisateurId: id_user,
        typeEntretienId,
        vehiculeId,
      },
    });

    res.status(201).json({
      message: `Entretien créé avec succès.`,
      entretien,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'entretien. Veuillez réessayer.' });
  }
};

// Récupérer tous les entretiens
const afficherEntretiens = async (req, res) => {
  try {
    const entretiens = await prisma.entretien.findMany({
      include: {
        utilisateur: true,
        typeEntretien: true,
        vehicule: true,
      },
    });
    res.status(200).json({
      message: `${entretiens.length} entretien(s) récupéré(s) avec succès.`,
      entretiens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des entretiens.' });
  }
};

// Récupérer un entretien par ID
const afficherEntretienParId = async (req, res) => {
  const { id } = req.params;

  try {
    const entretien = await prisma.entretien.findUnique({
      where: { id: Number(id) },
      include: {
        utilisateur: true,
        typeEntretien: true,
        vehicule: true,
      },
    });

    if (!entretien) {
      return res.status(404).json({ message: `Entretien avec ID ${id} non trouvé.` });
    }

    res.status(200).json({
      message: `Entretien avec ID ${id} récupéré avec succès.`,
      entretien,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'entretien.' });
  }
};

// Mettre à jour un entretien
const mettreAJourEntretien = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { id } = req.params;
  const { date, cout, utilisateurId, typeEntretienId, vehiculeId } = req.body;
 
 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;
    const entretienExiste = await prisma.entretien.findUnique({
      where: { id: Number(id) },
    });

    if (!entretienExiste) {
      return res.status(404).json({ message: `Entretien avec ID ${id} non trouvé.` });
    }

    // Vérifier si l'utilisateur, le type d'entretien, ou le véhicule existe
    if (utilisateurId) {
      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
      });
      if (!utilisateurExiste) {
        return res.status(404).json({ message: `Utilisateur avec ID ${utilisateurId} non trouvé.` });
      }
    }
    if (typeEntretienId) {
      const typeEntretienExiste = await prisma.typeEntretien.findUnique({
        where: { id: typeEntretienId },
      });
      if (!typeEntretienExiste) {
        return res.status(404).json({ message: `Type d'entretien avec ID ${typeEntretienId} non trouvé.` });
      }
    }
    if (vehiculeId) {
      const vehiculeExiste = await prisma.vehicule.findUnique({
        where: { id: vehiculeId },
      });
      if (!vehiculeExiste) {
        return res.status(404).json({ message: `Véhicule avec ID ${vehiculeId} non trouvé.` });
      }
    }

    const entretienMisAJour = await prisma.entretien.update({
      where: { id: Number(id) },
      data: {
        date: new Date(date),
        cout,
        utilisateurId: id_user,
        typeEntretienId,
        vehiculeId,
      },
    });

    res.status(200).json({
      message: `Entretien avec ID ${id} mis à jour avec succès.`,
      entretien: entretienMisAJour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'entretien.' });
  }
};

// Supprimer un entretien
const supprimerEntretien = async (req, res) => {
  const { id } = req.params;

  try {
    const entretienExiste = await prisma.entretien.findUnique({
      where: { id: Number(id) },
    });

    if (!entretienExiste) {
      return res.status(404).json({ message: `Entretien avec ID ${id} non trouvé.` });
    }

    await prisma.entretien.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Entretien avec ID ${id} supprimé avec succès.`,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Entretien avec ID ${id} non trouvé.` });
    }
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'entretien.' });
  }
};

export {
  creerEntretien,
  afficherEntretiens,
  afficherEntretienParId,
  mettreAJourEntretien,
  supprimerEntretien,
};
