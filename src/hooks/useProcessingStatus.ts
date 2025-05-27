import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pdfApi, ProcessingStatus } from '../lib/api';

interface UseProcessingStatusOptions {
  taskId: string | null;
  enabled?: boolean;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  pollingInterval?: number;
}

export const useProcessingStatus = ({
  taskId,
  enabled = true,
  onComplete,
  onError,
  pollingInterval = 2000, // Poll every 2 seconds
}: UseProcessingStatusOptions) => {
  const [isPolling, setIsPolling] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  }, [onComplete, onError]);

  const {
    data: status,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['processing-status', taskId],
    queryFn: () => pdfApi.getProcessingStatus(taskId!),
    enabled: enabled && !!taskId,
    refetchInterval: isPolling ? pollingInterval : false,
    retry: (failureCount, error: any) => {
      // Don't retry if task not found (404)
      if (error?.response?.status === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });

  // Handle status changes
  useEffect(() => {
    if (status) {
      if (status.status === 'SUCCESS' && status.result) {
        setIsPolling(false);
        onCompleteRef.current?.(status.result);
      } else if (status.status === 'FAILURE') {
        setIsPolling(false);
        onErrorRef.current?.(status.error || 'Processing failed');
      }
    }
  }, [status]);

  // Start polling when taskId is provided
  useEffect(() => {
    if (taskId && enabled) {
      setIsPolling(true);
    } else {
      setIsPolling(false);
    }
  }, [taskId, enabled]);

  const startPolling = () => {
    if (taskId) {
      setIsPolling(true);
      refetch();
    }
  };

  const stopPolling = () => {
    setIsPolling(false);
  };

  return {
    status: status as ProcessingStatus | null,
    isLoading,
    error,
    isPolling,
    startPolling,
    stopPolling,
    refetch,
  };
}; 