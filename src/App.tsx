import React, { useState, useRef, useEffect } from 'react';

import * as API from './api/mockApi';

interface ITask {
  id: string;
  name: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'error';
  retries: number;
  file: File;
}

const MAX_RETRIES = 3;
const POLL_INTERVAL = 3000;

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const pollingRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isPdfOrImage = /image\/.+|application\/pdf/.test(selected.type);
    const isSmall = selected.size < 2 * 1024 * 1024;

    if (!isPdfOrImage || !isSmall) {
      alert('Only PDFs or images under 2MB are allowed');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) return;
    try {
      const { taskId } = await API.createTask(file);
      const newTask: ITask = {
        id: taskId,
        name: file.name,
        status: 'pending',
        retries: 0,
        file,
      };
      setTasks((prev) => [...prev, newTask]);
      startPolling(taskId);
    } catch (err) {
      console.error('Task creation failed', err);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setFile(null);
  };

  const startPolling = (taskId: string) => {
    let retryCount = 0;

    const poll = async () => {
      try {
        const status = await API.getTaskStatus(taskId);
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, status } : task)),
        );

        if (status === 'pending') {
          pollingRefs.current[taskId] = setTimeout(poll, POLL_INTERVAL);
        } else {
          clearTimeout(pollingRefs.current[taskId]);
        }
      } catch {
        retryCount++;
        if (retryCount <= MAX_RETRIES) {
          pollingRefs.current[taskId] = setTimeout(poll, POLL_INTERVAL);
        } else {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId ? { ...task, status: 'error' } : task,
            ),
          );
        }
      }
    };

    poll();
  };

  const cancelTask = (taskId: string) => {
    clearTimeout(pollingRefs.current[taskId]);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: 'cancelled' } : task,
      ),
    );
  };

  useEffect(() => {
    return () => {
      // Cancel all polling on unmount
      Object.values(pollingRefs.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Mock File Upload</h1>

      <div className="flex flex-col gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} />
        <button
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!file}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Tasks</h2>
        {tasks.map((task) => (
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
                onClick={() => cancelTask(task.id)}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
