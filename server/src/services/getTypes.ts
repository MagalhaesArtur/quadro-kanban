import { prisma } from "../prisma";
import { TaskProps } from "./createTask";

export interface TypeProps {
  type: string;
  id?: string;
  tasks?: Array<TaskProps>;
}

export class GetTypes {
  public typesReturn: TypeProps[] = [];
  public aux2: any;

  async get() {
    let types: TypeProps[] = await prisma.typeTask.findMany();
    for (let type of types) {
      this.aux2 = await prisma.task.findMany({
        where: {
          typeId: type.id,
        },
      });

      let aux: TypeProps = {
        type: type.type,
        id: type.id,
        tasks: this.aux2,
      };
      this.typesReturn.push(aux);
    }
    return this.typesReturn;
  }
}
