import { prisma } from "../prisma";

export interface TypeProps {
  type: string;
  id?: string;
}

export class CreateType {
  async create(data: TypeProps) {
    await prisma.typeTask.create({
      data: {
        type: data.type,
      },
    });
  }
  async get() {
    let types: any = await prisma.typeTask.findMany();

    return types;
  }
}
