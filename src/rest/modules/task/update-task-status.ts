import { Response, Request } from "express";
import db from "../../../sequelize-client";
const { Task: TaskModel } = db;

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { body: { isCompleted }, params: { id } } = req;

    const task = await TaskModel.findOne({
      where: {
        id,
        createdBy: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (isCompleted === false && task.isCompleted === false) {
      return res.status(404).json({ message: "Task must be completed to unmark" })
    }

    await task.update({
      isCompleted,
    });

    return res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Error from updateTaskStatus api:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
