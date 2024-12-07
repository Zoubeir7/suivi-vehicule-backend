import express from 'express';
import UserController from '../controllers/utilController.js';
import {  creerUtilisateurValidator,mettreAjourUtilisateurValidator,supprimerUtilisateurValidator,} from '../validators/utilValidator.js';
import { authenticateToken } from '../auth/auth.js';


const router = express.Router();

router.post('/',  creerUtilisateurValidator, UserController.creerUtilisateur);

router.get('/',authenticateToken ,UserController.recupererTousLesUtilisateurs); 
router.get('/utilisateur',authenticateToken ,UserController.getCurrentUser); 
router.get('/role',authenticateToken ,UserController.getCurrentUser); 

router.get('/:id',authenticateToken, UserController.recupererUtilisateurParId);

router.put('/:id',authenticateToken, mettreAjourUtilisateurValidator, UserController.mettreAJourUtilisateur);

router.delete('/:id',authenticateToken, supprimerUtilisateurValidator, UserController.supprimerUtilisateur);

router.post('/request-password-reset', UserController.requestPasswordReset);
router.post('/reset-password', UserController.resetPassword);
export  {router};
