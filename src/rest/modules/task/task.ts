import { Response, Request } from "express";
import db from "../../../sequelize-client";
const { Task: TaskModel } = db;

export const task = async (req: Request, res: Response) => {
  try {
    const { params: { id } } = req;

    const task = await TaskModel.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
