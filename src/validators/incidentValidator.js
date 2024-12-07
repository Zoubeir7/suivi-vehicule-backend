import { body, param, validationResult } from 'express-validator';

// Validator pour la création et la mise à jour d'un incident
const incidentValidator = [
  body('date_incident')
    .isISO8601()
    .withMessage('Le champ date_incident doit être une date valide (ISO 8601).'),
  body('description')
    .isString()
    .isLength({ min: 5 })
    .withMessage('Le champ description doit contenir au moins 5 caractères.'),
  body('gravite')
    .isString()
    .isIn(['mineure', 'critique', 'majeure'])
    .withMessage('Le champ gravite doit être "mineur", "critique", ou "majeur".'),
  body('entretien_requis')
    .isBoolean()
    .withMessage('Le champ entretien_requis doit être un booléen.'),
  body('statut')
    .isString()
    .isIn(['ouvert', 'en cours', 'fermé'])
    .withMessage('Le champ statut doit être "ouvert", "en cours" ou "fermé".'),
  body('vehiculeId')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Le champ vehiculeId doit être un entier positif.'),
  body('utilisateurId')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Le champ utilisateurId doit être un entier positif.'),
];

// Validator pour l'ID dans les routes qui nécessitent un paramètre d'identifiant
const idValidator = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('L\'ID doit être un entier positif.'),
];

// Middleware pour gérer les erreurs de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { incidentValidator, idValidator, validate };
