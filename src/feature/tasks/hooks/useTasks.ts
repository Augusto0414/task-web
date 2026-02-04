import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    clearTasksError,
    createTask,
    fetchTasks,
    resetTasks,
    updateTask,
    type Task,
    type TaskStatus,
} from "../tasksSlice";

export function useTasks(token: string | null) {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.tasks);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "pending" as TaskStatus,
  });
  const [taskFormError, setTaskFormError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchTasks());
    } else {
      dispatch(resetTasks());
    }
  }, [dispatch, token]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      pending: [],
      in_progress: [],
      done: [],
    };
    items.forEach((task) => {
      grouped[task.status]?.push(task);
    });
    return grouped;
  }, [items]);

  const validateTaskForm = (form: typeof taskForm) => {
    if (!form.title.trim()) {
      return "El título es obligatorio.";
    }
    return null;
  };

  const handleCreateTask = async (event: FormEvent) => {
    event.preventDefault();
    setTaskFormError(null);
    dispatch(clearTasksError());

    const validationError = validateTaskForm(taskForm);
    if (validationError) {
      setTaskFormError(validationError);
      return false;
    }

    const result = await dispatch(
      createTask({
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || null,
        status: taskForm.status,
      }),
    );

    if (createTask.fulfilled.match(result)) {
      setTaskForm({ title: "", description: "", status: "pending" });
      return true;
    }
    return false;
  };

  const handleUpdateTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingTask) {
      return false;
    }
    setTaskFormError(null);
    dispatch(clearTasksError());

    const validationError = validateTaskForm({
      title: editingTask.title,
      description: editingTask.description ?? "",
      status: editingTask.status,
    });
    if (validationError) {
      setTaskFormError(validationError);
      return false;
    }

    const result = await dispatch(updateTask(editingTask));
    if (updateTask.fulfilled.match(result)) {
      setEditingTask(null);
      return true;
    }
    return false;
  };

  return {
    items,
    status,
    error,
    taskForm,
    taskFormError,
    editingTask,
    tasksByStatus,
    setTaskForm,
    setTaskFormError,
    setEditingTask,
    handleCreateTask,
    handleUpdateTask,
  };
}
