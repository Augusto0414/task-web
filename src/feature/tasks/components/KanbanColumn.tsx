import { Plus } from "lucide-react";
import type { Task, TaskStatus } from "../../../interfaces/tasks";
import TaskCard from "./TaskCard";
import { TaskCardSkeleton } from "./TaskCardSkeleton";

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  isBusy: boolean;
  isLoading?: boolean;
  onEdit: (task: Task) => void;
  onAddTask: () => void;
  onMoveTask: (taskId: Task["id"], nextStatus: TaskStatus) => Promise<boolean>;
}

function KanbanColumn({ status, label, tasks, isBusy, isLoading, onEdit, onAddTask, onMoveTask }: KanbanColumnProps) {
  const dotColors = {
    pending: "bg-amber-500",
    in_progress: "bg-blue-500",
    done: "bg-emerald-500",
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className={`h-2.5 w-2.5 rounded-full ${dotColors[status]}`} />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B2559]">{label}</h2>
          <span className="ml-1 text-sm font-bold text-[#A3AED0]">({isLoading ? "..." : tasks.length})</span>
        </div>
      </div>

      <div
        className="flex flex-col gap-4 min-h-37.5"
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          const taskId = event.dataTransfer.getData("text/plain");
          if (taskId) {
            void onMoveTask(taskId, status);
          }
        }}
      >
        {isLoading ? (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onEdit={onEdit} />)
        )}
        {!isLoading && tasks.length === 0 && !isBusy && (
          <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
            <p className="text-xs font-medium text-slate-400 italic">No hay tareas pendientes</p>
          </div>
        )}
      </div>

      <button
        onClick={onAddTask}
        disabled={isLoading}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-50/50 py-3.5 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white border border-transparent hover:border-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={18} />
        Añadir tarea
      </button>
    </div>
  );
}

export default KanbanColumn;
