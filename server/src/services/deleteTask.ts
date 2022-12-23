import { prisma } from "../prisma";
import { TaskProps } from "./createTask";

export class DeleteTask {
  async delete(task: TaskProps) {
    const deletedTask: TaskProps = await prisma.task.delete({
      where: {
        id: task.id,
      },
    });

    return deletedTask;
  }
}
