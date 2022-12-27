import { TypeProps } from "./interfaces";

export function updateTask(typesTasks: Array<TypeProps>): object {
  const options2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(typesTasks),
  };
  return options2;
}
