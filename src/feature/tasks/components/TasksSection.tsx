import { BarChart2, CheckCircle2, Clock, Zap } from "lucide-react";
import { useState } from "react";
import type { Task, TaskStatus, TasksSectionProps } from "../../../interfaces/tasks";
import KanbanColumn from "./KanbanColumn";
import SummaryCard from "./SummaryCard";
import { SummaryCardSkeleton } from "./SummaryCardSkeleton";
import TaskForm from "./TaskForm";

function TasksSection({
  userName,
  isBusy,
  statusOptions,
  statusLabel,
  editingTask,
  setEditingTask,
  taskForm,
  setTaskForm,
  taskFormError,
  tasksError,
  tasksStatus,
  totalTasks,
  tasksByStatus,
  onCreateTask,
  onUpdateTask,
  onLogout,
}: TasksSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(null);
    setTaskForm((prev) => ({ ...prev, status }));
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-[#1B2559]">Tablero de Tareas</h1>
          <p className="text-sm font-medium text-[#A3AED0]">Gestiona tus proyectos y tareas pendientes</p>
        </div>
        <div className="flex items-center gap-6">
          <p className="hidden text-sm font-bold text-[#1B2559] sm:block">
            {userName}
          </p>
          <button
            className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#1B2559] shadow-sm ring-1 ring-slate-100 transition-all hover:bg-slate-50 active:scale-95"
            type="button"
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tasksStatus === "loading" ? (
          <>
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard 
              label="Total" 
              count={totalTasks} 
              icon={<BarChart2 className="text-[#4318FF]" size={24} />} 
            />
            <SummaryCard 
              label="Pendientes" 
              count={tasksByStatus.pending.length} 
              icon={<Clock className="text-[#FFB800]" size={24} />} 
            />
            <SummaryCard 
              label="En Progreso" 
              count={tasksByStatus.in_progress.length} 
              icon={<Zap className="text-[#3965FF]" size={24} />} 
            />
            <SummaryCard 
              label="Completadas" 
              count={tasksByStatus.done.length} 
              icon={<CheckCircle2 className="text-[#05CD99]" size={24} />} 
            />
          </>
        )}
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {statusOptions.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              label={statusLabel[status]}
              tasks={tasksByStatus[status]}
              isBusy={isBusy}
              isLoading={tasksStatus === "loading"}
              onEdit={handleEdit}
              onAddTask={() => handleAddTask(status)}
            />
          ))}
        </div>

        {isFormOpen && (
          <TaskForm
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            taskFormError={taskFormError}
            tasksError={tasksError}
            statusOptions={statusOptions}
            statusLabel={statusLabel}
            isBusy={isBusy}
            onSubmit={async (e) => {
              const isEdit = !!editingTask;
              const success = isEdit ? await onUpdateTask(e) : await onCreateTask(e);
              if (success) {
                setIsFormOpen(false);
              }
            }}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </section>
  );
}

export default TasksSection;
