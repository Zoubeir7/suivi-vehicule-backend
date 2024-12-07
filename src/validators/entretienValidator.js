import { body, param } from 'express-validator';

const entretienValidator = {
  creerEntretien: [
    body('date')
      .notEmpty().withMessage('La date de l\'entretien est obligatoire.')
      .isISO8601().withMessage('La date doit être au format ISO 8601.'),
    body('cout')
      .notEmpty().withMessage('Le coût est obligatoire.')
      .isDecimal({ decimal_digits: '0,2' }).withMessage('Le coût doit être un nombre décimal avec jusqu\'à deux décimales.'),
    body('utilisateurId')
      .optional()
      .isInt().withMessage('L\'ID de l\'utilisateur doit être un entier.'),
    body('typeEntretienId')
      .optional()
      .isInt().withMessage('L\'ID du type d\'entretien doit être un entier.'),
    body('vehiculeId')
      .optional()
      .isInt().withMessage('L\'ID du véhicule doit être un entier.'),
  ],

  mettreAJourEntretien: [
    param('id')
      .notEmpty().withMessage('L\'ID de l\'entretien est obligatoire.')
      .isInt().withMessage('L\'ID de l\'entretien doit être un entier.'),
    body('date')
      .optional()
      .isISO8601().withMessage('La date doit être au format ISO 8601.'),
    body('cout')
      .optional()
      .isDecimal({ decimal_digits: '0,2' }).withMessage('Le coût doit être un nombre décimal avec jusqu\'à deux décimales.'),
    body('utilisateurId')
      .optional()
      .isInt().withMessage('L\'ID de l\'utilisateur doit être un entier.'),
    body('typeEntretienId')
      .optional()
      .isInt().withMessage('L\'ID du type d\'entretien doit être un entier.'),
    body('vehiculeId')
      .optional()
      .isInt().withMessage('L\'ID du véhicule doit être un entier.'),
  ],
};

export default entretienValidator;
