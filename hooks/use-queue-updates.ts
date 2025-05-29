import { useEffect, useState } from 'react';
import { subscribeToQueueUpdates } from '@/lib/pusher-service';
import { QueueUpdate } from '@/types/queue';

/**
 * Hook for subscribing to real-time queue updates
 * @param queueId ID of the queue to subscribe to
 * @returns Object containing queue update data and loading state
 */
export function useQueueUpdates(queueId: string | undefined) {
  const [queueData, setQueueData] = useState<QueueUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!queueId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create a subscription to queue updates
    try {
      const subscription = subscribeToQueueUpdates(queueId, (data) => {
        setQueueData(data);
        setIsLoading(false);
      });

      // Clean up subscription when component unmounts or queueId changes
      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error('Failed to subscribe to queue updates:', err);
      setError('Failed to connect to real-time updates');
      setIsLoading(false);
      return () => {}; // Return empty cleanup function
    }
  }, [queueId]);

  return {
    queueData,
    isLoading,
    error
  };
}

export default useQueueUpdates;
