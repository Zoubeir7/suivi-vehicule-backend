import express from 'express';
import { incidentValidator, idValidator, validate } from '../validators/incidentValidator.js';
import { creerIncident, afficherIncidents, afficherIncidentParId, mettreAJourIncident, supprimerIncident } from '../controllers/incidentController.js';
import { authenticateToken } from '../auth/auth.js';

const routeri = express.Router();

routeri.post('/incident',authenticateToken ,incidentValidator, validate, creerIncident);
routeri.get('/All/incidents',authenticateToken, afficherIncidents);
routeri.get('/incidents/:id',authenticateToken, idValidator, validate, afficherIncidentParId);
routeri.put('/incident/:id',authenticateToken, idValidator, incidentValidator, validate, mettreAJourIncident);
routeri.delete('/incident/:id',authenticateToken, idValidator, validate, supprimerIncident);

export {routeri};
