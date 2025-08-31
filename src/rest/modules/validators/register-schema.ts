import { buildCheckFunction } from 'express-validator';
const checkBody = buildCheckFunction(['body']);

const registerSchema = [
  checkBody('name')
    .notEmpty().withMessage('Name is required')
    .trim(),
  checkBody('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is invalid')
    .trim(),
  checkBody('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password is too short'),
];

export default registerSchema;
