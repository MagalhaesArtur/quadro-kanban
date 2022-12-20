import { Task } from "@prisma/client";
import { prisma } from "../prisma";

export interface TypeProps {
  type: string;
  id: string;
  tasks: Task[];
}

export class AttType {
  async att(data: TypeProps[]) {
    for (let type of data) {
      for (let task of type.tasks) {
        await prisma.task.update({
          where: {
            id: task.id,
          },
          data: task,
        });
      }
    }
  }
}

// public aux: any[] = [];
// async att(data1: any) {
//   let aux2: TypeProps[] = data1.typesTasks;
//   console.log(aux2);
//   for (let type of aux2) {
//     let aux2 = type.tasks;
//     for (let task of aux2) {
//       const attTypes: any = await prisma.typeTask.update({
//         where: {
//           id: type.id,
//         },
//         data: {
//           task: {
//             update: {
//               where: {
//                 id: task.id,
//               },
//               data: {
//                 type: task.type,
//               },
//             },
//           },
//         },
//       });
//       this.aux.push(attTypes);
//     }
//   }
//   return this.aux;
// }
