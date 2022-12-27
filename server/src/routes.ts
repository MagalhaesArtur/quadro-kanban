import express from "express";
import { CreateComment } from "./services/createComment";
import { CreateTask } from "./services/createTask";
import { TaskProps } from "./services/createTask";
import { TaskCommentsProps } from "./services/createComment";
import { GetTask } from "./services/getTasks";
import { CreateType, TypeProps } from "./services/createTypeTask";
import { GetTypes } from "./services/getTypes";
import { AttType } from "./services/attType";
import { DeleteTask } from "./services/deleteTask";
import { GetComment } from "./services/getComments";
export const routes = express.Router();

routes.post("/createTask", async (req, res) => {
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
  const task1: any = await task.create(data);

  return res.json(task1).status(201).send();
});

routes.post("/CreateComment", async (req, res) => {
  const { content, taskId }: TaskCommentsProps = req.body;
  if (content.length > 300) {
    return res.status(400).json("too lange content").send();
  }
  const data = {
    content,
    taskId,
  };

  const comment = await new CreateComment().create(data);
  console.log(comment);

  return res.json(comment).status(201).send();
});
routes.post("/createType", async (req, res) => {
  const { type }: TypeProps = req.body;
  if (type.length > 300) {
    return res.status(400).json("too lange content").send();
  }
  const data: any = {
    type,
  };

  const type1 = new CreateType();
  type1.create(data);

  return res.status(201).send();
});

routes.get("/getType", async (req, res) => {
  const types = await new CreateType().get();
  return res.json(types).status(201);
});

routes.get("/types", async (req, res) => {
  const types = await new GetTypes().get();

  return res.json(types).status(201);
});

routes.post("/types", async (req, res) => {
  const data: TypeProps[] = await req.body;
  const attTypes = await new AttType().att(data);
  return res.json(attTypes).status(201);
});

routes.get("/", async (req, res) => {
  const tasks: TypeProps[] = await new GetTask().get();
  return res.json(tasks).status(201);
});

routes.delete("/deleteTask", async (req, res) => {
  const task: TaskProps = await req.body;
  const deletedTask: TaskProps = await new DeleteTask().delete(task);
  const types = await new GetTypes().get();

  return res.json(types).status(201);
});

routes.get("/comments", async (req, res) => {
  const comments: TaskCommentsProps[] = await new GetComment().get();
  return res.json(comments).status(201);
});
