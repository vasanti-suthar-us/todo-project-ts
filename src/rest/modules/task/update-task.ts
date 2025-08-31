import { Response } from "express";
import moment from "moment";
import db from "../../../sequelize-client";
import { AuthenticatedRequest } from "../../middlewares/authenticate";
import { Op } from "sequelize";

const { Task: TaskModel } = db;

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { params: { id }, body: { title, description, dueDate } } = req;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    if (moment(dueDate).isBefore(moment())) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    const task = await TaskModel.findOne({
      where: {
        id,
        createdBy: req.user.id,
        dueDate: { [Op.between]: [todayStart, todayEnd] },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found for today" });
    }
    await task.update({
      title, description, dueDate
    });

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error from updateTask:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
