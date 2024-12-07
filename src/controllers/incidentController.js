import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';

// Créer un incident
const creerIncident = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { date_incident, description, gravite, entretien_requis, statut, vehiculeId } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;

    // Vérifier si le véhicule existe
    if (vehiculeId) {
      const vehiculeExiste = await prisma.vehicule.findUnique({
        where: { id: vehiculeId },
      });

      if (!vehiculeExiste) {
        return res.status(404).json({ message: `Véhicule avec ID ${vehiculeId} non trouvé.` });
      }
    }

    // Créer l'incident
    const incident = await prisma.incident.create({
      data: {
        date_incident: new Date(date_incident),
        description,
        gravite,
        entretien_requis,
        statut,
        vehiculeId,
        utilisateurId: id_user,
      },
    });

    res.status(201).json({
      message: `Incident créé avec succès.`,
      incident,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'incident. Veuillez réessayer.' });
  }
};

// Récupérer tous les incidents
const afficherIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        utilisateur: true,
        vehicule: true,
      },
    });
    res.status(200).json({
      message: `${incidents.length} incident(s) récupéré(s) avec succès.`,
      incidents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des incidents.' });
  }
};

// Récupérer un incident par ID
const afficherIncidentParId = async (req, res) => {
  const { id } = req.params;

  try {
    const incident = await prisma.incident.findUnique({
      where: { id: Number(id) },
      include: {
        utilisateur: true,
        vehicule: true,
      },
    });

    if (!incident) {
      return res.status(404).json({ message: `Incident avec ID ${id} non trouvé.` });
    }

    res.status(200).json({
      message: `Incident avec ID ${id} récupéré avec succès.`,
      incident,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'incident.' });
  }
};

// Mettre à jour un incident
const mettreAJourIncident = async (req, res) => {
  const { id } = req.params;
  const { date_incident, description, gravite, entretien_requis, statut, vehiculeId } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;

    const incidentExiste = await prisma.incident.findUnique({
      where: { id: Number(id) },
    });

    if (!incidentExiste) {
      return res.status(404).json({ message: `Incident avec ID ${id} non trouvé.` });
    }

    if (vehiculeId) {
      const vehiculeExiste = await prisma.vehicule.findUnique({
        where: { id: vehiculeId },
      });

      if (!vehiculeExiste) {
        return res.status(404).json({ message: `Véhicule avec ID ${vehiculeId} non trouvé.` });
      }
    }

    const incidentMisAJour = await prisma.incident.update({
      where: { id: Number(id) },
      data: {
        date_incident: date_incident ? new Date(date_incident) : undefined,
        description,
        gravite,
        entretien_requis,
        statut,
        vehiculeId,
        utilisateurId: id_user, 
      },
    });

    res.status(200).json({
      message: `Incident avec ID ${id} mis à jour avec succès.`,
      incident: incidentMisAJour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'incident.' });
  }
};

// Supprimer un incident
const supprimerIncident = async (req, res) => {
  const { id } = req.params;

  try {
    const incidentExiste = await prisma.incident.findUnique({
      where: { id: Number(id) },
    });

    if (!incidentExiste) {
      return res.status(404).json({ message: `Incident avec ID ${id} non trouvé.` });
    }

    await prisma.incident.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Incident avec ID ${id} supprimé avec succès.`,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Incident avec ID ${id} non trouvé.` });
    }
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'incident.' });
  }
};

export { creerIncident, afficherIncidents, afficherIncidentParId, mettreAJourIncident, supprimerIncident };
