import { TaskProps, TypeProps } from "./interfaces";

export function isTaskInArray(
  currentTasks: TaskProps[],
  setNum: Function,
  num: number,
  oldTasks: TypeProps[]
) {
  let aux: boolean = false;
  let typesAux: any = JSON.parse(JSON.stringify(oldTasks));
  let typesAux2: TaskProps[] = [];

  for (let type in oldTasks) {
    for (let task in oldTasks[type].tasks) {
      typesAux2.push(oldTasks[type].tasks[task]);
    }
  }

  let typesAuxCopy = JSON.parse(JSON.stringify(typesAux2));

  for (let task in typesAux2) {
    for (let task1 in currentTasks) {
      if (typesAux2[task].id === currentTasks[task1].id) {
        typesAuxCopy.splice(typesAux2.indexOf(currentTasks[task1]), 1);
      }
    }
  }

  if (typesAuxCopy.length != 0) {
    for (let type in oldTasks) {
      for (let task in oldTasks[type].tasks) {
        for (let task1 of currentTasks) {
          if (task1.id != oldTasks[type].tasks[task].id) {
            typesAux[type].tasks.splice(typesAux[type].tasks.indexOf(task1), 1);
          }
        }
      }
    }
  }
  for (let type in typesAux) {
    console.log(typesAux);
    if (typesAux[type].tasks.length != 0) {
      for (let task in typesAux[type].tasks) {
        for (let task1 of currentTasks) {
          let typesAuxCopy1 = JSON.parse(JSON.stringify(typesAux2));
          let alredyExistis: boolean = false;
          for (let task3 of typesAux[type].tasks) {
            if (task1.id === task3.id) {
              alredyExistis = true;
            }
          }

          if (
            task1.id != typesAux[type].tasks[task].id &&
            task1.typeId === typesAux[type].id &&
            alredyExistis == false
          ) {
            typesAux[type].tasks.push(task1);
          }
        }
      }
    } else {
      for (let task1 of currentTasks) {
        if (task1.typeId === typesAux[type].id) {
          typesAux[type].tasks.push(task1);
        }
      }
    }
  }

  return typesAux;
}
