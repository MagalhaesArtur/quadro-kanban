import { TaskProps, TypeProps } from "./interfaces";

export function isTaskInArray(
  currentTasks: TaskProps[],
  oldTasks: TypeProps[]
) {
  let aux: boolean = false;
  let typesAux: any = JSON.parse(JSON.stringify(oldTasks));
  let typesAux2: any[] = [];

  for (let type in oldTasks) {
    for (let task in oldTasks[type].tasks) {
      typesAux2.push(oldTasks[type].tasks[task]);
    }
  }

  for (let task1 of currentTasks) {
    for (let task of typesAux2) {
      if (task1.id !== task.id) {
        aux = true;
      }
    }
    console.log(aux);
  }

  if (!aux) {
    for (let type in oldTasks) {
      for (let task in oldTasks[type].tasks) {
        for (let task1 of currentTasks) {
          if (task1.id != oldTasks[type].tasks[task].id) {
            typesAux[type].tasks.splice(typesAux[type].tasks.indexOf(task1), 1);
          }
        }
      }
    }
  } else {
    for (let type in oldTasks) {
      if (oldTasks[type].tasks.length != 0) {
        for (let task in oldTasks[type].tasks) {
          for (let task1 of currentTasks) {
            if (
              task1.id != oldTasks[type].tasks[task].id &&
              task1.typeId === oldTasks[type].id
            ) {
              typesAux[2].tasks.push(task1);
            }
          }
        }
      } else {
        for (let task1 of currentTasks) {
          if (task1.typeId === oldTasks[type].id) {
            typesAux[type].tasks.push(task1);
          }
        }
      }
    }
  }

  return typesAux;
}
