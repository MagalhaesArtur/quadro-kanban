import { TaskProps, TypeProps } from "./interfaces";

export const deleteTesk = (
  item: TaskProps,
  typesTasks: TypeProps[],
  setTypesTasks: Function
) => {
  let aux = JSON.stringify(typesTasks);

  fetch("http://localhost:3333/deleteTask", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).then((res) => {
    res.json().then(async (data) => {
      let aux2: TypeProps[] = JSON.parse(aux);
      for (let type of aux2) {
        for (let task of type.tasks) {
          if (task.id == data.id) {
            type.tasks = type.tasks.splice(type.tasks.indexOf(data), 1);
          }
        }
      }
      setTypesTasks(aux2);
      localStorage.setItem("data", JSON.stringify(aux2));
      typesTasks = aux2;
    });
  });
};
