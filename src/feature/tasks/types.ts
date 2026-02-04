export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
  id: string | number;
  title: string;
  description?: string | null;
  status: TaskStatus;
}

export interface TasksState {
  items: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
