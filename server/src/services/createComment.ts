import { prisma } from "../prisma";

export interface TaskCommentsProps {
  id?: String;
  content: string;
  taskId: string;
}

export class CreateComment {
  async create(data: TaskCommentsProps) {
    const comment: TaskCommentsProps = await prisma.commentTask.create({
      data: {
        content: data.content,
        taskId: data.taskId,
      },
    });
    return comment;
  }
}
