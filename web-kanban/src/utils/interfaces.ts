export interface TasksProps {
  id: string;
  content: string;
  priority: number;
  type: string;
  comments?: TaskCommentsProps[];
}

export interface TaskCommentsProps {
  id?: String;
  content: string;
  taskId: string;
}

export interface TypeProps {
  type: string;
  id?: string;
}

export interface idn {
  type: TypeProps;
  task: TasksProps;
}
