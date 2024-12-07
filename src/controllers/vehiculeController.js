import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';

const creerVehicule = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Récupération du token
  const { marque, modele, immatriculation, annee_de_fabrication, type_de_carburant, kilometrage, statut, utilisateurId } = req.body;

  try {
    // Validation de l'année de fabrication
    const year = parseInt(annee_de_fabrication, 10);
    if (isNaN(year) || year < 1886 || year > new Date().getFullYear()) {
      return res.status(400).json({ message: 'L\'année de fabrication est invalide.' });
    }

    if (utilisateurId) {
      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
      });

      if (!utilisateurExiste) {
        return res.status(404).json({ message: `Utilisateur avec ID ${utilisateurId} non trouvé.` });
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;

    const vehicule = await prisma.vehicule.create({
      data: {
        marque,
        modele,
        immatriculation,
        annee_de_fabrication: year, // Utilisation explicite de year
        type_de_carburant,
        kilometrage,
        statut,
        utilisateurId: id_user,
      },
    });

    res.status(201).json({
      message: `Véhicule ${marque} ${modele} créé avec succès.`,
      vehicule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du véhicule. Veuillez réessayer.' });
  }
};

// Récupérer tous les véhicules
const afficherVehicules = async (req, res) => {
  try {
    const vehicules = await prisma.vehicule.findMany({
      include: {
        utilisateur: true,
        incidents: false,
        documents: false,
        entretiens: false,
      },
    });
    res.status(200).json({
      message: `${vehicules.length} véhicule(s) récupéré(s) avec succès.`,
      vehicules,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
  }
};

const afficherVehiculeParId = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicule = await prisma.vehicule.findUnique({
      where: { id: Number(id) },
      include: {
        utilisateur: true,
        incidents: false,
        documents: false,
        entretiens: false,
      },
    });

    if (!vehicule) {
      return res.status(404).json({ message: `Véhicule avec ID ${id} non trouvé.` });
    }

    res.status(200).json({
      message: `Véhicule avec ID ${id} récupéré avec succès.`,
      vehicule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du véhicule.' });
  }
};

const mettreAJourVehicule = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Récupération du token
  const { id } = req.params;
  const { marque, modele, immatriculation, annee_de_fabrication, type_de_carburant, kilometrage, statut, utilisateurId } = req.body;

  try {
    const vehiculeExiste = await prisma.vehicule.findUnique({
      where: { id: Number(id) },
    });

    if (!vehiculeExiste) {
      return res.status(404).json({ message: `Véhicule avec ID ${id} non trouvé.` });
    }

    // Validation de l'année de fabrication
    const year = parseInt(annee_de_fabrication, 10);
    if (isNaN(year) || year < 1886 || year > new Date().getFullYear()) {
      return res.status(400).json({ message: 'L\'année de fabrication est invalide.' });
    }

    if (utilisateurId) {
      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
      });

      if (!utilisateurExiste) {
        return res.status(404).json({ message: `Utilisateur avec ID ${utilisateurId} non trouvé.` });
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;

    const vehiculeMisAJour = await prisma.vehicule.update({
      where: { id: Number(id) },
      data: {
        marque,
        modele,
        immatriculation,
        annee_de_fabrication: year, // Utilisation explicite de year
        type_de_carburant,
        kilometrage,
        statut,
        utilisateurId: id_user,
      },
    });

    res.status(200).json({
      message: `Véhicule avec ID ${id} mis à jour avec succès.`,
      vehicule: vehiculeMisAJour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du véhicule.' });
  }
};

const supprimerVehicule = async (req, res) => {
  const { id } = req.params;

  try {
    const vehiculeExiste = await prisma.vehicule.findUnique({
      where: { id: Number(id) },
    });

    if (!vehiculeExiste) {
      return res.status(404).json({ message: `Véhicule avec ID ${id} non trouvé.` });
    }

    await prisma.vehicule.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Véhicule avec ID ${id} supprimé avec succès.`,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Véhicule avec ID ${id} non trouvé.` });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression du véhicule.' });
  }
};

export { creerVehicule, afficherVehicules, afficherVehiculeParId, mettreAJourVehicule, supprimerVehicule };
