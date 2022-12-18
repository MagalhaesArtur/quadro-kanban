import express from "express";
import { CreateComment } from "./services/createComment";
import { CreateTask } from "./services/createTask";
import { TaskProps } from "./services/createTask";
import { TaskCommentsProps } from "./services/createComment";
import { GetTask } from "./services/getTasks";
import { CreateType, TypeProps } from "./services/createTypeTask";
export const routes = express.Router();

routes.post("/task", async (req, res) => {
  const { content, priority, typeId, type }: TaskProps = req.body;
  if (content.length > 300) {
    return res.status(400).json("too lange content").send();
  }
  const data = {
    content,
    typeId,
    priority,
    type,
  };

  const task = new CreateTask();
  task.create(data);

  return res.status(201).send();
});

routes.post("/comment", async (req, res) => {
  const { content, taskId }: TaskCommentsProps = req.body;
  if (content.length > 300) {
    return res.status(400).json("too lange content").send();
  }
  const data = {
    content,
    taskId,
  };

  const comment = new CreateComment();
  comment.create(data);

  return res.status(201).send();
});

routes.post("/type", async (req, res) => {
  const { type }: TypeProps = req.body;
  if (type.length > 300) {
    return res.status(400).json("too lange content").send();
  }
  const data = {
    type,
  };

  const type1 = new CreateType();
  type1.create(data);

  return res.status(201).send();
});

routes.get("/types", async (req, res) => {
  const types = await new CreateType().get();
  return res.json(types).status(201);
});

routes.get("/", async (req, res) => {
  const tasks = await new GetTask().get();
  return res.json(tasks).status(201);
});
