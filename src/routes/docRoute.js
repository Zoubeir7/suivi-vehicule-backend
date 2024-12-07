import express from 'express';
import { creerDocument, afficherDocuments, afficherDocumentParId, mettreAJourDocument, supprimerDocument } from '../controllers/docController.js';
import { creerDocumentValidator, mettreAJourDocumentValidator, supprimerDocumentValidator } from '../validators/docValidator.js';
import { authenticateToken } from '../auth/auth.js';

const routerd = express.Router();

routerd.post('/document',authenticateToken, creerDocumentValidator, creerDocument);

routerd.get('/All/documents',authenticateToken, afficherDocuments);

routerd.get('/documents/:id',authenticateToken, supprimerDocumentValidator, afficherDocumentParId);

routerd.put('/document/:id',authenticateToken, mettreAJourDocumentValidator, mettreAJourDocument);

routerd.delete('/document/:id',authenticateToken, supprimerDocumentValidator, supprimerDocument);

export default routerd;
