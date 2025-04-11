import { v4 as uuidv4 } from 'uuid';

const taskStore: Record<
  string,
  {
    startTime: number;
    duration: number;
    finalStatus: 'success' | 'failed';
  }
> = {};

export async function createTask(file: File): Promise<{ taskId: string }> {
  console.log(file);
  return new Promise((resolve) => {
    const taskId = uuidv4();
    const duration = 5000 + Math.random() * 5000;
    const finalStatus = Math.random() > 0.2 ? 'success' : 'failed';

    taskStore[taskId] = {
      startTime: Date.now(),
      duration,
      finalStatus,
    };

    setTimeout(() => resolve({ taskId }), 500);
  });
}

export async function getTaskStatus(
  taskId: string,
): Promise<'pending' | 'success' | 'failed'> {
  return new Promise((resolve, reject) => {
    const task = taskStore[taskId];

    if (!task) {
      return setTimeout(() => reject(new Error('Task not found')), 300);
    }

    const now = Date.now();
    const elapsed = now - task.startTime;

    setTimeout(() => {
      if (elapsed >= task.duration) {
        resolve(task.finalStatus);
      } else {
        resolve('pending');
      }
    }, 500);
  });
}
