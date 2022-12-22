import express from "express";
import { CreateComment } from "./services/createComment";
import { CreateTask } from "./services/createTask";
import { TaskProps } from "./services/createTask";
import { TaskCommentsProps } from "./services/createComment";
import { GetTask } from "./services/getTasks";
import { CreateType, TypeProps } from "./services/createTypeTask";
import { GetTypes } from "./services/getTypes";
import { AttType } from "./services/attType";
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
  console.log(attTypes, "sdas");
  return res.json(attTypes).status(201);
});

routes.get("/", async (req, res) => {
  const tasks: TypeProps[] = await new GetTask().get();
  return res.json(tasks).status(201);
});
