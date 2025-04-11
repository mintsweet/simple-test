import { useTaskPolling } from '../hooks/useTaskPolling';
import type { ITask } from '../task.type';

interface Props {
  task: ITask;
  onCancel: (taskId: string) => void;
  onStatusChange: (taskId: string, status: ITask['status']) => void;
}

const statusColorMap: Record<ITask['status'], string> = {
  pending: 'text-yellow-500',
  success: 'text-green-600',
  failed: 'text-red-600',
  cancelled: 'text-gray-500',
  error: 'text-red-500',
};

const statusLabelMap: Record<ITask['status'], string> = {
  pending: 'Pending...',
  success: '✔ Success',
  failed: '✖ Failed',
  cancelled: 'Cancelled',
  error: '⚠ Error',
};

export const Task = ({ task, onCancel, onStatusChange }: Props) => {
  useTaskPolling(task.id, task.status === 'pending', (status) => {
    onStatusChange(task.id, status);
  });

  return (
    <div className="flex items-center justify-between p-3 border rounded mb-2 shadow-sm bg-white">
      <div className="flex flex-col">
        <p className="font-medium text-sm truncate">{task.name}</p>
        <p className={`text-xs ${statusColorMap[task.status]}`}>
          {statusLabelMap[task.status]}
        </p>
      </div>
      {task.status === 'pending' && (
        <button
          className="text-xs text-red-500 hover:underline"
          onClick={() => onCancel(task.id)}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
