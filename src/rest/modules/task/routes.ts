import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createTask } from "./create-task";
import { updateTask } from "./update-task";
import { tasks } from "./tasks";
import validate from '../validators';

import createTaskSchema from "../validators/create-task-schema";
import { deleteTask } from "./delete-task";
import { updateTaskStatus } from "./update-task-status";
import { setReminder } from "./set-reminder";
import setReminderSchema from "../validators/set-reminder-schema";
import { task } from "./task";

const taskRouter = Router();

taskRouter.post("/task", createTaskSchema, validate, authenticate, createTask);
taskRouter.put("/tasks/:id", authenticate, updateTask);
taskRouter.get("/tasks/:id", authenticate, task);
taskRouter.get("/tasks", authenticate, tasks);
taskRouter.delete("/tasks/:id", authenticate, deleteTask);
taskRouter.patch("/tasks/:id", authenticate, updateTaskStatus);
taskRouter.post("/tasks/:id/reminder", setReminderSchema, validate, authenticate, setReminder);

export default taskRouter;
