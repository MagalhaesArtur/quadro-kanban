import { prisma } from "../prisma";
import { TaskCommentsProps } from "./createComment";

export interface TaskProps {
  id?: string;
  content: string;
  priority: number;
  type: string;
  typeId: string;
  comments?: TaskCommentsProps[];
}

export class CreateTask {
  async create(data: TaskProps) {
    const task: TaskProps = await prisma.task.create({
      data: {
        typeId: data.typeId,
        content: data.content,
        priority: data.priority,
        type: data.type,
      },
    });
    return task;
  }
}
