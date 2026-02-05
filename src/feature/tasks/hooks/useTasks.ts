import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Task, TaskStatus } from "../../../interfaces/tasks";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearTasksError, createTask, fetchTasks, resetTasks, updateTask } from "../tasksSlice";

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
  const [filterText, setFilterText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchTasks());
    } else {
      dispatch(resetTasks());
    }
  }, [dispatch, token]);

  const filteredItems = useMemo(() => {
    const normalized = filterText.trim().toLowerCase();
    if (!normalized) {
      return items;
    }
    return items.filter((task) => {
      const title = task.title.toLowerCase();
      const description = task.description?.toLowerCase() ?? "";
      return title.includes(normalized) || description.includes(normalized);
    });
  }, [items, filterText]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      pending: [],
      in_progress: [],
      done: [],
    };
    filteredItems.forEach((task) => {
      grouped[task.status]?.push(task);
    });
    return grouped;
  }, [filteredItems]);

  const validateTaskForm = (form: typeof taskForm) => {
    if (!form.title.trim()) {
      return "El título es obligatorio.";
    }
    return null;
  };

  const isCreateValid = !validateTaskForm(taskForm);
  const isEditValid = editingTask
    ? !validateTaskForm({
        title: editingTask.title,
        description: editingTask.description ?? "",
        status: editingTask.status,
      })
    : false;

  const handleCreateTask = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {
      return false;
    }
    setTaskFormError(null);
    dispatch(clearTasksError());

    const validationError = validateTaskForm(taskForm);
    if (validationError) {
      setTaskFormError(validationError);
      return false;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(
        createTask({
          title: taskForm.title.trim(),
          description: taskForm.description.trim() || null,
          status: taskForm.status,
        }),
      );

      if (createTask.fulfilled.match(result)) {
        setTaskForm({ title: "", description: "", status: "pending" });
      }
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingTask) {
      return false;
    }
    if (isSubmitting) {
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

    setIsSubmitting(true);
    try {
      const result = await dispatch(updateTask(editingTask));
      if (updateTask.fulfilled.match(result)) {
        setEditingTask(null);
        return true;
      }
      setEditingTask(null);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveTask = async (taskId: Task["id"], nextStatus: TaskStatus) => {
    const target = items.find((item) => String(item.id) === String(taskId));
    if (!target || target.status === nextStatus) {
      return false;
    }

    const result = await dispatch(updateTask({ ...target, status: nextStatus }));
    return updateTask.fulfilled.match(result);
  };

  return {
    items,
    status,
    error,
    taskForm,
    taskFormError,
    editingTask,
    filterText,
    isSubmitting,
    isCreateValid,
    isEditValid,
    tasksByStatus,
    setFilterText,
    setTaskForm,
    setTaskFormError,
    setEditingTask,
    handleCreateTask,
    handleUpdateTask,
    handleMoveTask,
  };
}
