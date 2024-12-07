import { body, validationResult } from 'express-validator';

// Validateur pour la création ou la mise à jour d'un véhicule
const validerVehicule = [
  body('marque')
    .isString()
    .withMessage('La marque doit être une chaîne de caractères.')
    .notEmpty()
    .withMessage('La marque est requise.'),
  
  body('modele')
    .isString()
    .withMessage('Le modèle doit être une chaîne de caractères.')
    .notEmpty()
    .withMessage('Le modèle est requis.'),
  
  body('immatriculation')
    .isString()
    .withMessage("L'immatriculation doit être une chaîne de caractères.")
    .notEmpty()
    .withMessage("L'immatriculation est requise."),
  
  body('annee_de_fabrication')
    .isInt({ min: 1886, max: new Date().getFullYear() })
    .withMessage(`L'année de fabrication doit être un entier compris entre 1886 et ${new Date().getFullYear()}.`),
  
  body('type_de_carburant')
    .isString()
    .withMessage('Le type de carburant doit être une chaîne de caractères.')
    .notEmpty()
    .withMessage('Le type de carburant est requis.'),
  
  body('kilometrage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le kilométrage doit être un entier positif.'),
  
  body('statut')
    .isString()
    .withMessage('Le statut doit être une chaîne de caractères.')
    .optional(),
  
  body('utilisateurId')
    .optional()
    .isInt()
    .withMessage("L'ID de l'utilisateur doit être un entier."),
  
  // Middleware pour vérifier les erreurs de validation
  (req, res, next) => {
    const erreurs = validationResult(req);
    if (!erreurs.isEmpty()) {
      return res.status(400).json({ erreurs: erreurs.array() });
    }
    next();
  }
];

export default validerVehicule;
