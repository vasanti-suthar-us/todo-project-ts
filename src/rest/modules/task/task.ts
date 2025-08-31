import { Response } from "express";
import moment from "moment";
import db from "../../../sequelize-client";
import { AuthenticatedRequest } from "../../middlewares/authenticate";
import { Op } from "sequelize";

const { Task: TaskModel } = db;

export const task = async (req: AuthenticatedRequest, res: Response) => {
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
