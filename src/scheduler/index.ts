import cron from "node-cron";
import config from "../config/config";
import { sendUserReminders } from "./user-reminder";
import { sendRemindersForDueDate } from "./send-reminders-for-due-date";

export const startReminderJob = () => {
  cron.schedule((config.DAILY_TASK_REMINDER_CRON_EXPRESSION) as string, async () => {
    console.log('Checking upcoming due tasks')
    await sendRemindersForDueDate();
  });

  cron.schedule((config.DAILY_TASK_REMINDER_CRON_EXPRESSION) as string, async () => {
    console.log('Checking user set reminders')
    await sendUserReminders();
  });
};
