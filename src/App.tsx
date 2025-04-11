import React, { useState, useRef } from 'react';

import * as API from './api/mockApi';
import { Task } from './components/task';
import type { ITask } from './task.type';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [uploading, setUploading] = useState(false);

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
      setUploading(true);
      const { taskId } = await API.createTask(file);
      const newTask: ITask = {
        id: taskId,
        name: file.name,
        status: 'pending',
        retries: 0,
        file,
      };
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error('Task creation failed', err);
    } finally {
      setUploading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Mock File Upload</h1>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="file-upload"
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer w-full max-w-md hover:border-gray-500 transition"
        >
          <p className="text-sm text-gray-600">
            📎 Click to choose file (PDF / image under 2MB)
          </p>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </label>
        {file && (
          <p className="text-xs text-gray-600 mt-1 truncate">
            Selected: {file.name}
          </p>
        )}
        <button
          className="bg-black text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!file || uploading}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Tasks</h2>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onCancel={(id) => {
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === id ? { ...t, status: 'cancelled' } : t,
                ),
              );
            }}
            onStatusChange={(id, status) => {
              setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, status } : t)),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
