import { prisma } from "../prisma";

export class GetTask {
  async get() {
    let tasks: any = await prisma.task.findMany();

    return tasks;
  }
}
