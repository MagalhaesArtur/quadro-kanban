import { Task } from "@prisma/client";
import { prisma } from "../prisma";

export interface TypeProps {
  type: string;
  id: string;
  tasks: Task[];
}

export class AttType {
  public listTypes: any[] = [];

  async att(data: TypeProps[]) {
    for (let type of data) {
      let listTasks: Task[] = [];
      for (let task of type.tasks) {
        let taskUp: Task = await prisma.task.update({
          where: {
            id: task.id,
          },
          data: task,
        });
        listTasks.push(taskUp);
      }
      this.listTypes.push({ type: type.type, id: type.id, tasks: listTasks });
    }
    return this.listTypes;
  }
}
