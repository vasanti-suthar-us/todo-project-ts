import { buildCheckFunction } from 'express-validator';
const checkBody = buildCheckFunction(['body']);

const setReminderSchema = [
  checkBody('reminderTime')
    .notEmpty().withMessage('Reminder Time is required')
    .trim()
    .isISO8601()
    .withMessage('Reminder Time must be a valid date-time')
    .toDate(),
];

export default setReminderSchema;
