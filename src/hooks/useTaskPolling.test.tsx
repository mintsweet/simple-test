import { render } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import * as API from '../api/mockApi';

import { useTaskPolling } from './useTaskPolling';

describe('useTaskPolling (via wrapper component)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllTimers();
  });

  const Wrapper = ({
    taskId,
    enabled,
    onStatusChange,
  }: {
    taskId: string;
    enabled: boolean;
    onStatusChange: (status: string) => void;
  }) => {
    useTaskPolling(taskId, enabled, onStatusChange);
    return <div data-testid="wrapper" />;
  };

  it('calls onStatusChange with success after polling', async () => {
    const taskId = 'test-task';
    const onStatusChange = vi.fn();

    vi.spyOn(API, 'getTaskStatus')
      .mockResolvedValueOnce('pending')
      .mockResolvedValueOnce('success');

    render(
      <Wrapper
        taskId={taskId}
        enabled={true}
        onStatusChange={onStatusChange}
      />,
    );

    await vi.advanceTimersByTimeAsync(3000); // pending
    await vi.advanceTimersByTimeAsync(3000); // success

    expect(onStatusChange).toHaveBeenCalledWith('success');
  });

  it('retries on failure and eventually calls error', async () => {
    const taskId = 'retry-task';
    const onStatusChange = vi.fn();

    vi.spyOn(API, 'getTaskStatus').mockRejectedValue(new Error('network'));

    render(
      <Wrapper
        taskId={taskId}
        enabled={true}
        onStatusChange={onStatusChange}
      />,
    );

    await vi.runAllTimersAsync();

    expect(onStatusChange).toHaveBeenCalledWith('error');
  });
});
