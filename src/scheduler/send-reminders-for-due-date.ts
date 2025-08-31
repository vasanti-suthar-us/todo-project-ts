import moment from "moment";
import db from "../sequelize-client";
import { Op } from "sequelize";
import { get } from "lodash";
import { sendEmail } from "../utils/providers/email/send-email";
const { Task: TaskModel, User: UserModel, TaskReminder: TaskReminderModel } = db;

export const sendRemindersForDueDate = async () => {
  try {
    const startOfTomorrow = moment().add(1, "day").startOf("day");
    const endOfTomorrow = moment().add(1, "day").endOf("day");

    const upcomingTasks = await TaskModel.findAll({
      where: {
        dueDate: { [Op.between]: [startOfTomorrow, endOfTomorrow] }
      },
      include: [{
        model: UserModel,
        as: 'creator',
        attributes: ['email'],
      }]
    })

    if (upcomingTasks && upcomingTasks.length) {
      for (const task of upcomingTasks) {
        const { title, dueDate } = task;
        const user = get(task, 'creator');

        if (user) {
          const { email } = user;
          console.log('Sending reminder for due tasks to user', email)
          await sendEmail({
            to: email,
            subject: 'Reminder for upcoming due task',
            text: `This is to remind you that the due of the task: ${title} is on ${dueDate}`
          })
          console.log(`Email sent successfully to user: ${email}`)
        }
      }
    }
  } catch (error) {
    console.log(`Error from sendRemindersForDueDate: ${error}`)
  }
}
