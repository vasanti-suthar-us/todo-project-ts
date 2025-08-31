import { Request, Response } from "express";
import moment from "moment";
import db from "../../../sequelize-client";
import { AuthenticatedRequest } from "../../middlewares/authenticate";
import { Op } from "sequelize";

const { Task: TaskModel } = db;

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { params: { id }, user: { id: userId } } = req;

    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    const task = await TaskModel.findOne({
      where: {
        id,
        createdBy: userId,
        dueDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found for today" });
    }

    await task.destroy();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error from deleteTask api:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
