import { useState, useEffect, useRef } from 'react';
import { ProcessingStatus } from '../lib/api';

interface UseRealtimeStatusProps {
  taskId?: string;
  enabled?: boolean;
  onComplete?: (result: { logId?: number }) => void;
  onError?: (error: Error) => void;
}

interface UseRealtimeStatusReturn {
  status: ProcessingStatus | null;
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
}

export const useRealtimeStatus = ({
  taskId,
  enabled = true,
  onComplete,
  onError
}: UseRealtimeStatusProps): UseRealtimeStatusReturn => {
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (!taskId || !enabled) return;

    try {
      // WebSocket URL for real-time status updates
      const wsUrl = `ws://localhost:8000/api/v1/pdf/status/${taskId}/ws`;
      const token = localStorage.getItem('token');
      
      // Add token as query parameter since WebSocket doesn't support headers easily
      const wsUrlWithAuth = token ? `${wsUrl}?token=${token}` : wsUrl;
      
      wsRef.current = new WebSocket(wsUrlWithAuth);
      setIsLoading(true);
      setError(null);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected for task:', taskId);
        setIsConnected(true);
        setIsLoading(false);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'status_update') {
            setStatus(data.status);
          } else if (data.type === 'completion') {
            setStatus(data.status);
            onComplete?.(data);
            disconnect();
          } else if (data.type === 'error') {
            const error = new Error(data.message || 'Processing failed');
            setError(error);
            onError?.(error);
            disconnect();
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setIsLoading(false);

        // Attempt to reconnect if not a normal closure and we haven't exceeded max attempts
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts && enabled) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        const error = new Error('WebSocket connection failed');
        setError(error);
        setIsLoading(false);
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError(err instanceof Error ? err : new Error('Connection failed'));
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setIsLoading(false);
  };

  // Connect when taskId changes or component mounts
  useEffect(() => {
    if (taskId && enabled) {
      connect();
    } else {
      disconnect();
      setStatus(null);
      setError(null);
    }

    return () => {
      disconnect();
    };
  }, [taskId, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    status,
    isLoading,
    error,
    isConnected
  };
}; 