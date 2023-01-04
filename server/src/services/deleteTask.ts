import { prisma } from "../prisma";
import { TaskProps } from "./createTask";

export class DeleteTask {
  async delete(task: TaskProps) {
    let id = task.id;
    await prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
