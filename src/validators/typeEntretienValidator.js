import { body, param } from 'express-validator';

const typeEntretienValidator = {
  // Validator pour la création d'un type d'entretien
  creerTypeEntretien: [
    body('nom')
      .notEmpty().withMessage('Le nom du type d\'entretien est obligatoire.')
      .isString().withMessage('Le nom doit être une chaîne de caractères.')
      .isLength({ min: 3, max: 255 }).withMessage('Le nom doit contenir entre 3 et 255 caractères.'),
    body('status')
      .optional()
      .isBoolean().withMessage('Le statut doit être un booléen.'),
    body('utilisateurId')
      .optional()
      .isInt().withMessage('L\'ID de l\'utilisateur doit être un entier.'),
  ],

  // Validator pour la mise à jour d'un type d'entretien
  mettreAJourTypeEntretien: [
    param('id')
      .notEmpty().withMessage('L\'ID du type d\'entretien est obligatoire.')
      .isInt().withMessage('L\'ID du type d\'entretien doit être un entier.'),
    body('nom')
      .optional()
      .isString().withMessage('Le nom doit être une chaîne de caractères.')
      .isLength({ min: 3, max: 255 }).withMessage('Le nom doit contenir entre 3 et 255 caractères.'),
    body('status')
      .optional()
      .isBoolean().withMessage('Le statut doit être un booléen.'),
   
  ],

  // Validator pour la suppression d'un type d'entretien
  supprimerTypeEntretien: [
    param('id')
      .notEmpty().withMessage('L\'ID du type d\'entretien est obligatoire.')
      .isInt().withMessage('L\'ID du type d\'entretien doit être un entier.'),
  ],
};

export default typeEntretienValidator;
