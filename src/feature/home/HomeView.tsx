import type { TaskStatus } from "../../interfaces/tasks";
import AuthSection from "../auth/components/AuthSection";
import { useAuth } from "../auth/hooks/useAuth";
import TasksSection from "../tasks/components/TasksSection";
import { useTasks } from "../tasks/hooks/useTasks";

const statusOptions: TaskStatus[] = ["pending", "in_progress", "done"];

const statusLabel: Record<TaskStatus, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  done: "Finalizada",
};

function HomeView() {
  const {
    token,
    user,
    status: authStatus,
    error: authError,
    authMode,
    registerNotice,
    authForm,
    authFormError,
    setAuthForm,
    handleAuthModeChange,
    handleAuthSubmit,
    handleLogout,
  } = useAuth();

  const {
    status: tasksStatus,
    error: tasksError,
    taskForm,
    taskFormError,
    editingTask,
    tasksByStatus,
    setTaskForm,
    setEditingTask,
    handleCreateTask,
    handleUpdateTask,
  } = useTasks(token);

  const isBusy = authStatus === "loading" || tasksStatus === "loading";
  const totalTasks = (tasksByStatus.pending.length + tasksByStatus.in_progress.length + tasksByStatus.done.length);

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
