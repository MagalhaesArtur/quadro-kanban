import { prisma } from "../prisma";
import { TaskCommentsProps } from "./createComment";
import { TaskProps } from "./createTask";

export class DeleteComment {
  async delete(comment: TaskProps) {
    let id = comment.id;
    await prisma.commentTask.delete({
      where: {
        id,
      },
    });
  }
  async deleteMany(task: TaskProps) {
    let comments: any = await prisma.commentTask.deleteMany({
      where: {
        taskId: task.id,
      },
    });
    console.log(comments, "ASDASDIAISJD");
  }
}
