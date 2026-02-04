import { ChevronDown, X } from "lucide-react";
import { type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { Task, TaskStatus } from "../types";

export interface TaskFormState {
  title: string;
  description: string;
  status: TaskStatus;
}

interface TaskFormProps {
  editingTask: Task | null;
  setEditingTask: Dispatch<SetStateAction<Task | null>>;
  taskForm: TaskFormState;
  setTaskForm: Dispatch<SetStateAction<TaskFormState>>;
  taskFormError: string | null;
  tasksError: string | null;
  statusOptions: TaskStatus[];
  statusLabel: Record<TaskStatus, string>;
  isBusy: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

function TaskForm({
  editingTask,
  setEditingTask,
  taskForm,
  setTaskForm,
  taskFormError,
  tasksError,
  statusOptions,
  statusLabel,
  isBusy,
  onSubmit,
  onClose,
}: TaskFormProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1133]/40 p-4 backdrop-blur-[2px]">
      <form
        className="relative flex w-full max-w-lg flex-col gap-6 rounded-[2rem] bg-white p-8 shadow-2xl"
        onSubmit={onSubmit}
      >
        <button
          type="button"
          className="absolute right-6 top-6 text-[#A3AED0] transition-colors hover:text-rose-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#1B2559]">
            {editingTask ? "Editar Tarea" : "Nueva Tarea"}
          </h2>
          <p className="text-sm text-[#A3AED0]">
            {editingTask ? "Modifica los campos para actualizar la tarea" : "Completa los campos para crear una nueva tarea"}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#1B2559]">
              Título <span className="text-rose-500 font-normal">*</span>
            </span>
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#1B2559] placeholder:text-[#A3AED0] focus:border-[#4318FF] focus:outline-none focus:ring-4 focus:ring-[#4318FF]/10 transition"
              placeholder="Escribe el título de la tarea"
              value={editingTask ? editingTask.title : taskForm.title}
              onChange={(event) => {
                const value = event.target.value;
                if (editingTask) {
                  setEditingTask({ ...editingTask, title: value });
                } else {
                  setTaskForm((prev) => ({ ...prev, title: value }));
                }
              }}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#1B2559]">Descripción</span>
            <textarea
              rows={4}
              className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#1B2559] placeholder:text-[#A3AED0] focus:border-[#4318FF] focus:outline-none focus:ring-4 focus:ring-[#4318FF]/10 transition"
              placeholder="Describe la tarea (opcional)"
              value={editingTask ? editingTask.description ?? "" : taskForm.description}
              onChange={(event) => {
                const value = event.target.value;
                if (editingTask) {
                  setEditingTask({
                    ...editingTask,
                    description: value,
                  });
                } else {
                  setTaskForm((prev) => ({ ...prev, description: value }));
                }
              }}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#1B2559]">Estado</span>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#1B2559] focus:border-[#4318FF] focus:outline-none focus:ring-4 focus:ring-[#4318FF]/10 transition"
                value={editingTask ? editingTask.status : taskForm.status}
                onChange={(event) => {
                  const value = event.target.value as TaskStatus;
                  if (!statusOptions.includes(value)) {
                    return;
                  }
                  if (editingTask) {
                    setEditingTask({ ...editingTask, status: value });
                  } else {
                    setTaskForm((prev) => ({ ...prev, status: value }));
                  }
                }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel[status]}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#A3AED0]">
                <ChevronDown size={20} />
              </div>
            </div>
          </label>
        </div>

        {(taskFormError || tasksError) && (
          <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100">
            <p className="text-xs font-bold text-rose-500">
              {taskFormError || tasksError}
            </p>
          </div>
        )}

        <div className="mt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-xl px-6 py-3 text-sm font-bold text-[#1B2559] transition-all hover:bg-slate-50"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="rounded-xl bg-[#4318FF] px-8 py-3 text-sm font-bold text-white shadow-xl shadow-[#4318FF]/20 transition-all hover:bg-[#3311CC] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isBusy}
          >
            {editingTask ? "Guardar Cambios" : "Crear Tarea"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
