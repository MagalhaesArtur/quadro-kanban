export interface TaskProps {
  id: string;
  content: string;
  priority: number;
  type: string;
  typeId: string;
  comments: TaskCommentsProps[];
}

export interface TaskCommentsProps {
  id: string;
  content: string;
  taskId: string;
}

export interface TypeProps {
  type: string;
  id: string;
  tasks: Array<TaskProps>;
}
