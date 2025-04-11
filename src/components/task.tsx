import type { ITask } from '../task.type';

interface Props {
  task: ITask;
  onCancel: (taskId: string) => void;
}

export const Task = ({ task, onCancel }: Props) => {
  return (
    <div
      key={task.id}
      className="flex items-center justify-between p-2 border rounded mb-2"
    >
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
