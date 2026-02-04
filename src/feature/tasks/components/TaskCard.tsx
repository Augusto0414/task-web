import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

function TaskCard({ task, onEdit }: TaskCardProps) {
  const statusConfig = {
    pending: { label: "Pendiente", color: "text-amber-600 bg-amber-50" },
    in_progress: { label: "En Marcha", color: "text-blue-600 bg-blue-50" },
    done: { label: "Completado", color: "text-emerald-600 bg-emerald-50" },
  };

  const currentStatus = statusConfig[task.status] || statusConfig.pending;

  return (
    <article
      onClick={() => onEdit(task)}
      className="group relative flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100 cursor-pointer"
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-bold text-[#1B2559] uppercase tracking-wide">
          {task.title}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-[#A3AED0]">
          {task.description || "Sin descripción"}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-50 pt-3">
        <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight ${currentStatus.color}`}>
          {currentStatus.label}
        </span>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 border-2 border-white shadow-sm">
            JD
          </div>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
