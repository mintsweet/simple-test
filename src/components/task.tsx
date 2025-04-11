import { useTaskPolling } from '../hooks/useTaskPolling';
import type { ITask } from '../task.type';

interface Props {
  task: ITask;
  onCancel: (taskId: string) => void;
  onStatusChange: (taskId: string, status: ITask['status']) => void;
}

export const Task = ({ task, onCancel, onStatusChange }: Props) => {
  useTaskPolling(task.id, task.status === 'pending', (status) => {
    onStatusChange(task.id, status);
  });

  return (
    <div className="flex items-center justify-between p-2 border rounded mb-2">
      <div>
        <p className="font-medium">{task.name}</p>
        <p className="text-sm text-gray-600">Status: {task.status}</p>
      </div>
      {task.status === 'pending' && (
        <button
          className="text-red-500 text-sm"
          onClick={() => onCancel(task.id)}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
