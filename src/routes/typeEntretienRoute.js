import express from 'express';
import typeEntretienValidator from '../validators/typeEntretienValidator.js';
import { validate } from '../validators/incidentValidator.js'; 
import {  creerTypeEntretien, afficherTypesEntretien, afficherTypeEntretienParId,  mettreAJourTypeEntretien, supprimerTypeEntretien } from '../controllers/typeEntretienController.js';
import { authenticateToken } from '../auth/auth.js';

const routert = express.Router();

routert.post('/type-entretien',authenticateToken, typeEntretienValidator.creerTypeEntretien, validate, creerTypeEntretien);

routert.get('/All/type-entretiens',authenticateToken, afficherTypesEntretien);

routert.get('/type-entretien/:id',authenticateToken, afficherTypeEntretienParId);

routert.put('/type-entretien/:id',authenticateToken, typeEntretienValidator.mettreAJourTypeEntretien, validate, mettreAJourTypeEntretien);

routert.delete('/type-entretien/:id',authenticateToken, typeEntretienValidator.supprimerTypeEntretien, validate, supprimerTypeEntretien);

export { routert };
