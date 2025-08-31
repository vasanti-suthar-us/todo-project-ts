import { Response, Request } from "express";
import moment from "moment";
import db from "../../../sequelize-client";
import { Op } from "sequelize";

const { Task: TaskModel } = db;

export const tasks = async (req: Request, res: Response) => {
  try {
    const { query: { date, skip, limit }, user: { id: userId } } = req;
    
    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "Date query param is required (YYYY-MM-DD)" });
    }

    const startOfDay = moment(date, "YYYY-MM-DD").startOf("day").toDate();
    const endOfDay = moment(date, "YYYY-MM-DD").endOf("day").toDate();

    const tasks = await TaskModel.findAll({
      where: {
        createdBy: userId,
        dueDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [["createdBy", "desc"]],
      limit: parseInt(limit as string, 10) || 10,
      offset: parseInt(skip as string, 10) || 0,
    });

    const count = await TaskModel.count({
      where: {
        createdBy: userId,
        dueDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    return res.status(200).json({
      date,
      count,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
