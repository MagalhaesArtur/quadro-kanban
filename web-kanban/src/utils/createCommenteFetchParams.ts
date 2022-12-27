export function CreateComment(content: string, taskId: string): object {
  const options2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      taskId,
    }),
  };
  return options2;
}
