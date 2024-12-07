import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';/////////////

// Créer un document
const creerDocument = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];//////////////
  const { nom, debut_validite, fin_validite, cout, renouvellement, vehiculeId, utilisateurId } = req.body;

  try {
    if (utilisateurId) {
      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
      });

      if (!utilisateurExiste) {
        return res.status(404).json({ message: `Utilisateur avec ID ${utilisateurId} non trouvé.` });
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);/////////////////
    const id_user = decoded.userId;/////////////////////

    const document = await prisma.document.create({
      data: {
        nom,
        debut_validite: new Date(debut_validite),
        fin_validite: new Date(fin_validite),
        cout: parseFloat(cout),
        renouvellement: new Date(renouvellement),
        vehiculeId,
        utilisateurId: id_user,
      },
    });

    res.status(201).json({
      message: `Document '${nom}' créé avec succès.`,
      document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du document.' });
  }
};

// Récupérer tous les documents
const afficherDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      include: {
        utilisateur: true,
        vehicule: true,
      },
    });

    res.status(200).json({
      message: `${documents.length} document(s) récupéré(s) avec succès.`,
      documents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des documents.' });
  }
};

// Récupérer un document par son ID
const afficherDocumentParId = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await prisma.document.findUnique({
      where: { id: Number(id) },
      include: {
        utilisateur: true,
        vehicule: true,
      },
    });

    if (!document) {
      return res.status(404).json({ message: `Document avec ID ${id} non trouvé.` });
    }

    res.status(200).json({
      message: `Document avec ID ${id} récupéré avec succès.`,
      document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du document.' });
  }
};

// Mettre à jour un document
const mettreAJourDocument = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];//////////////

  const { id } = req.params;
  const { nom, debut_validite, fin_validite, cout, renouvellement, vehiculeId, utilisateurId } = req.body;

  try {
    // Vérification de l'existence du document
    const documentExiste = await prisma.document.findUnique({
      where: { id: Number(id) },
    });

    if (!documentExiste) {
      return res.status(404).json({ message: `Document avec ID ${id} non trouvé.` });
    }

    if (utilisateurId) {
      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
      });

      if (!utilisateurExiste) {
        return res.status(404).json({ message: `Utilisateur avec ID ${utilisateurId} non trouvé.` });
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
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);/////////////////
    const id_user = decoded.userId;/////////////////////
    const documentMisAJour = await prisma.document.update({
      where: { id: Number(id) },
      data: {
        nom,
        debut_validite: debut_validite ? new Date(debut_validite) : undefined,
        fin_validite: fin_validite ? new Date(fin_validite) : undefined,
        cout: cout ? parseFloat(cout) : undefined,
        renouvellement: renouvellement ? new Date(renouvellement) : undefined,
        vehiculeId,
        utilisateurId: id_user,
      },
    });

    res.status(200).json({
      message: `Document avec ID ${id} mis à jour avec succès.`,
      document: documentMisAJour,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du document.' });
  }
};

// Supprimer un document
const supprimerDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const documentExiste = await prisma.document.findUnique({
      where: { id: Number(id) },
    });

    if (!documentExiste) {
      return res.status(404).json({ message: `Document avec ID ${id} non trouvé.` });
    }

    await prisma.document.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: `Document avec ID ${id} supprimé avec succès.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du document.' });
  }
};

export { creerDocument, afficherDocuments, afficherDocumentParId, mettreAJourDocument, supprimerDocument };
