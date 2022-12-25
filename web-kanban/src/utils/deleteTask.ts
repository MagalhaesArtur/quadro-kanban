import { useState } from "react";
import { TaskProps, TypeProps } from "./interfaces";

export const deleteTesk = (
  item: TaskProps,
  typesTasks: TypeProps[],
  setTypesTasks: Function
) => {
  let aux2: TypeProps[] = JSON.parse(JSON.stringify(typesTasks));

  fetch("http://localhost:3333/deleteTask", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).then((res) => {
    res.json().then((data: any) => {
      console.log(data);
      return data;
    });
  });
  // return types;
};
