import { Response } from "express";
import db from "../../../sequelize-client";
import { AuthenticatedRequest } from "../../middlewares/authenticate";
import moment from "moment";
const { Task: TaskModel } = db;

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { body: { title, description, dueDate } } = req;

    if (moment(dueDate).isBefore(moment().startOf('day'))) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    const task = await TaskModel.create({
      title,
      description,
      dueDate,
      createdBy: req.user.id
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
