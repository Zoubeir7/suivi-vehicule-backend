import { body, param, validationResult } from 'express-validator';

// Valider les données pour la création d'un document
const creerDocumentValidator = [
  body('nom')
    .notEmpty().withMessage("Le nom est requis.")
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/).withMessage("Le nom ne doit contenir que des lettres."),
  body('debut_validite').isISO8601().withMessage("La date de début est invalide."),
  body('fin_validite').isISO8601().withMessage("La date de fin est invalide."),
  body('cout').isFloat().withMessage("Le coût doit être un nombre."),
  body('renouvellement').isISO8601().withMessage("La date de renouvellement est invalide."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Valider les données pour la mise à jour d'un document
const mettreAJourDocumentValidator = [
  param('id').isInt().withMessage("L'ID doit être un entier valide."),
  body('nom')
    .optional()
    .notEmpty().withMessage("Le nom est requis.")
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/).withMessage("Le nom ne doit contenir que des lettres."),
  body('debut_validite').optional().isISO8601().withMessage("La date de début est invalide."),
  body('fin_validite').optional().isISO8601().withMessage("La date de fin est invalide."),
  body('cout').optional().isFloat().withMessage("Le coût doit être un nombre."),
  body('renouvellement').optional().isISO8601().withMessage("La date de renouvellement est invalide."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Valider l'ID pour la suppression
const supprimerDocumentValidator = [
  param('id').isInt().withMessage("L'ID doit être un entier valide."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { creerDocumentValidator, mettreAJourDocumentValidator, supprimerDocumentValidator };
