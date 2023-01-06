import { TaskProps, TypeProps } from "./interfaces";
function shallowEqual(objA: any, objB: any) {
  // P1
  if (Object.is(objA, objB)) {
    return true;
  }

  // P2
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  // P3
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (var i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
export function isTaskInArray(
  currentTasks: TaskProps[],
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
  for (let type in oldTasks) {
    if (oldTasks[type].tasks.length != 0) {
      for (let task in oldTasks[type].tasks) {
        for (let task1 of currentTasks) {
          let alredyExistis: boolean = false;
          let typesAuxCopy1 = JSON.parse(JSON.stringify(typesAux2));

          for (let task3 of oldTasks[type].tasks) {
            if (task3.id === task1.id) {
              alredyExistis = true;
            }
          }

          if (
            task1.id != oldTasks[type].tasks[task].id &&
            task1.typeId === oldTasks[type].id &&
            !alredyExistis
          ) {
            console.log(typesAux[type].tasks.includes(task1));
            typesAux[type].tasks.push(task1);
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

  return typesAux;
}
