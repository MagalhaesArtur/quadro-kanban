import { prisma } from "../prisma";

export interface TaskCommentsProps {
  id?: String;
  content: string;
  taskId: string;
}

export class GetComment {
  async get() {
    const TaskCommentsProps: TaskCommentsProps[] =
      await prisma.commentTask.findMany();

    return TaskCommentsProps;
  }
}
