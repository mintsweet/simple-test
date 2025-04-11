export interface ITask {
  id: string;
  name: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'error';
  retries: number;
  file: File;
}
