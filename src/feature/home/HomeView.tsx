import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuthError, loginUser, logout, logoutUser, registerUser } from "../auth/authSlice";
import AuthSection from "../auth/components/AuthSection";
import TasksSection from "../tasks/components/TasksSection";
import {
  clearTasksError,
  createTask,
  fetchTasks,
  resetTasks,
  updateTask,
  type Task,
  type TaskStatus,
} from "../tasks/tasksSlice";

const statusOptions: TaskStatus[] = ["pending", "in_progress", "done"];

const statusLabel: Record<TaskStatus, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  done: "Finalizada",
};

function HomeView() {
  const dispatch = useAppDispatch();
  const { token, user, status: authStatus, error: authError } = useAppSelector((state) => state.auth);
  const { items, status: tasksStatus, error: tasksError } = useAppSelector((state) => state.tasks);

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [registerNotice, setRegisterNotice] = useState<string | null>(null);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authFormError, setAuthFormError] = useState<string | null>(null);

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

  const handleAuthModeChange = (mode: "login" | "register") => {
    setAuthMode(mode);
    if (mode === "login") {
      setRegisterNotice(null);
    }
  };

  const isBusy = authStatus === "loading" || tasksStatus === "loading";
  const totalTasks = items.length;

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

  const validateAuthForm = () => {
    if (!authForm.email.trim() || !authForm.password.trim()) {
      return "El correo y la contraseña son obligatorios.";
    }
    if (authMode === "register" && !authForm.name.trim()) {
      return "El nombre es obligatorio para el registro.";
    }
    return null;
  };

  const validateTaskForm = (form: typeof taskForm) => {
    if (!form.title.trim()) {
      return "El título es obligatorio.";
    }
    if (!statusOptions.includes(form.status)) {
      return "El estado de la tarea no es válido.";
    }
    return null;
  };

  const handleAuthSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAuthFormError(null);
    dispatch(clearAuthError());
    const error = validateAuthForm();
    if (error) {
      setAuthFormError(error);
      return;
    }

    if (authMode === "register") {
      const result = await dispatch(
        registerUser({
          name: authForm.name.trim(),
          email: authForm.email.trim(),
          password: authForm.password,
        }),
      );
      if (registerUser.fulfilled.match(result)) {
        setRegisterNotice("¡Registro completado con éxito! Por favor, inicia sesión.");
        setAuthMode("login");
        setAuthForm((prev) => ({ ...prev, password: "" }));
      }
      return;
    }

    await dispatch(
      loginUser({
        email: authForm.email.trim(),
        password: authForm.password,
      }),
    );
  };

  const handleCreateTask = async (event: FormEvent) => {
    event.preventDefault();
    setTaskFormError(null);
    dispatch(clearTasksError());

    const error = validateTaskForm(taskForm);
    if (error) {
      setTaskFormError(error);
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

    const error = validateTaskForm({
      title: editingTask.title,
      description: editingTask.description ?? "",
      status: editingTask.status,
    });
    if (error) {
      setTaskFormError(error);
      return false;
    }

    const result = await dispatch(updateTask(editingTask));
    if (updateTask.fulfilled.match(result)) {
      setEditingTask(null);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(logout());
    dispatch(resetTasks());
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${!token ? "bg-[#f8f9fd]" : "bg-[#F4F7FE] text-[#1B2559]"}`}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-10 lg:px-12">
        {!token ? (
          <AuthSection
            authMode={authMode}
            onModeChange={handleAuthModeChange}
            authForm={authForm}
            setAuthForm={setAuthForm}
            authFormError={authFormError}
            authError={authError}
            registerNotice={registerNotice}
            authStatus={authStatus}
            onSubmit={handleAuthSubmit}
          />
        ) : (
          <TasksSection
            userName={user?.name || "N/A"}
            isBusy={isBusy}
            statusOptions={statusOptions}
            statusLabel={statusLabel}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            taskFormError={taskFormError}
            tasksError={tasksError}
            tasksStatus={tasksStatus}
            totalTasks={totalTasks}
            tasksByStatus={tasksByStatus}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

export default HomeView;
