import { buildCheckFunction } from 'express-validator';
const checkBody = buildCheckFunction(['body']);

const createTaskSchema = [
  checkBody('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  checkBody('description')
    .notEmpty().withMessage('Description is required')
    .trim(),
  checkBody('dueDate')
    .notEmpty().withMessage('Due date is required')
];

export default createTaskSchema;
