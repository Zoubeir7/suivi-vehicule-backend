import { check, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import prisma from '../config/prisma.js';

const registerValidator = [
  check('prenom')
    .notEmpty()
    .withMessage('Le prénom ne peut pas être vide !')
    .isLength({ min: 2 })
    .withMessage('Le prénom doit comporter au moins 2 caractères !'),

  check('nom')
    .notEmpty()
    .withMessage('Le nom ne peut pas être vide !')
    .isLength({ min: 2 })
    .withMessage('Le nom doit comporter au moins 2 caractères !'),

  check('telephone')
    .notEmpty()
    .withMessage('Le numéro de téléphone ne peut pas être vide !')
    .isMobilePhone('any')
    .withMessage('Doit être un numéro de téléphone valide !'),

  check('email')
    .notEmpty()
    .withMessage('L\'email ne peut pas être vide !')
    .isEmail()
    .withMessage('Doit être une adresse email valide !')
    .custom(async (value) => {
      const user = await prisma.utilisateur.findUnique({ where: { email: value } });
      if (user) {
        throw new Error('L\'email est déjà utilisé !');
      }
      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('Le mot de passe ne peut pas être vide !')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit comporter au moins 6 caractères !'),

  check('role')
    .optional()
    .isIn(['ADMIN', 'GESTIONNAIRE'])
    .withMessage('Rôle invalide. Les rôles valides sont ADMIN et GESTIONNAIRE.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  },
];

const loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('L\'email ne peut pas être vide !')
    .isEmail()
    .withMessage('Doit être une adresse email valide !'),

  check('password')
    .notEmpty()
    .withMessage('Le mot de passe ne peut pas être vide !'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  },
];

export { registerValidator, loginValidator };
