import { Response } from "express";
import db from "../../../sequelize-client";
import { AuthenticatedRequest } from "../../middlewares/authenticate";
import moment from "moment";
const { Task: TaskModel, TaskReminder: TaskReminderModel } = db;

export const setReminder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { params: { id }, body: { reminderTime } } = req;

    if (moment(reminderTime).isBefore(moment().startOf('day'))) {
      return res.status(400).json({ message: "Invalid reminder time" });
    }

    const task = await TaskModel.findByPk(id);
    if (!task) {
      return res.status(400).json({ message: "Task not found" })
    }

    await TaskReminderModel.create({
      userId: req.user.id,
      taskId: id,
      reminderTime,
    })

    return res.status(201).json({
      message: "Task reminder set successfully",
      task,
    });
  } catch (error) {
    console.error("Error from setReminder:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
