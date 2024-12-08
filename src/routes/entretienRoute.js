import express from 'express';
import entretienValidator from '../validators/entretienValidator.js';
import { validate } from '../validators/incidentValidator.js';
import { creerEntretien, afficherEntretiens, afficherEntretienParId,  mettreAJourEntretien,  supprimerEntretien } from '../controllers/entretienController.js';
import { authenticateToken } from '../auth/auth.js';

const routere = express.Router();

routere.post('/entretien',authenticateToken, entretienValidator.creerEntretien, validate, creerEntretien);

routere.get('/All/entretiens',authenticateToken, afficherEntretiens);

routere.get('/entretien/:id',authenticateToken, afficherEntretienParId);

routere.put('/entretien/:id',authenticateToken, entretienValidator.mettreAJourEntretien, validate, mettreAJourEntretien);

routere.delete('/entretien/:id',authenticateToken, supprimerEntretien);

export { routere };
