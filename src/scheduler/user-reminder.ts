import moment from "moment";
import db from "../sequelize-client";
import { Op } from "sequelize";
import { get } from "lodash";
import { sendEmail } from "../utils/providers/email/send-email";
const { Task: TaskModel, User: UserModel, TaskReminder: TaskReminderModel } = db;

export const sendUserReminders = async () => {
  try {
    const startOfTomorrow = moment().add(1, "day").startOf("day");
    const endOfTomorrow = moment().add(1, "day").endOf("day");

    const upcomingTaskReminder = await TaskReminderModel.findAll({
      where: {
        reminderTime: { [Op.between]: [startOfTomorrow, endOfTomorrow] }
      },
      include: [{
        model: UserModel,
        as: 'user',
        attributes: ['email'],
      },
      {
        model: TaskModel,
        as: 'task',
        attributes: ['title'],
      }]
    })

    if (upcomingTaskReminder && upcomingTaskReminder.length) {
      for (const reminder of upcomingTaskReminder) {
        const task = get(reminder, 'task');
        const user = get(reminder, 'user');

        if (user && task) {
          const { email } = user;
          const { title } = task;
          console.log('Sending user set reminders', email)
          await sendEmail({
            to: email,
            subject: 'Reminder for your task',
            text: `Your upcoming reminder for task ${title}`
          })
          console.log(`Email sent successfully to user: ${email}`)
        }
        await TaskReminderModel.update({ sentOn: moment() }, { where: { id: reminder.id } })
      }
    }
  } catch (error) {
    console.log(`Error from sendUserReminders: ${error}`)
  }
}
