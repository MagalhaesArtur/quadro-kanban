export interface TaskProps {
  id: string;
  content: string;
  priority: number;
  type: string;
  typeId: string;
}
export interface TaskCommentsProps {
  id?: String;
  content: string;
  taskId: string;
}

export interface TypeProps {
  type: string;
  id: string;
  tasks: Array<TaskProps>;
}
