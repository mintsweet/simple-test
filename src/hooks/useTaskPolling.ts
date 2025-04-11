import { useEffect, useRef } from 'react';

import * as API from '../api/mockApi';

const POLL_INTERVAL = 3000;
const MAX_RETRIES = 3;

export function useTaskPolling(
  taskId: string,
  enabled: boolean,
  onStatusChange: (status: 'pending' | 'success' | 'failed' | 'error') => void,
) {
  const retryCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const status = await API.getTaskStatus(taskId);
        if (cancelled) return;

        if (status === 'pending') {
          timerRef.current = setTimeout(poll, POLL_INTERVAL);
        } else {
          onStatusChange(status);
        }
      } catch {
        retryCountRef.current += 1;
        if (retryCountRef.current <= MAX_RETRIES) {
          timerRef.current = setTimeout(poll, POLL_INTERVAL);
        } else {
          onStatusChange('error');
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [taskId, enabled, onStatusChange]);
}
