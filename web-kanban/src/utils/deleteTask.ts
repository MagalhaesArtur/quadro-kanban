import { TaskProps, TypeProps } from "./interfaces";

export const deleteTesk = (task: TaskProps, typeTasksString: string) => {
  let typeTasks: TypeProps[] = JSON.parse(typeTasksString);
  console.log(typeTasks);

  for (let type of typeTasks) {
    for (let task1 of type.tasks) {
      if (task.id == task1.id) {
        console.log(task, task1);
        type.tasks.splice(type.tasks.indexOf(task), 1);
      }
    }
  }
  return typeTasks;
};
