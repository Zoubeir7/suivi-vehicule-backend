import express from 'express';
import {creerVehicule,afficherVehicules,afficherVehiculeParId,mettreAJourVehicule,supprimerVehicule,} from '../controllers/vehiculeController.js';
import validerVehicule from '../validators/vehiculeValidator.js';
import { authenticateToken, authorizeRole } from '../auth/auth.js';

const routerv = express.Router();

routerv.get('/All/vehicules',authenticateToken, afficherVehicules);

routerv.get('/vehicule/:id',authenticateToken, afficherVehiculeParId);

routerv.post('/vehicule',authenticateToken, validerVehicule, creerVehicule);

routerv.put('/vehicule/:id',authenticateToken, validerVehicule, mettreAJourVehicule);

routerv.delete('/vehicule/:id', authorizeRole, authenticateToken, supprimerVehicule);

export { routerv };
