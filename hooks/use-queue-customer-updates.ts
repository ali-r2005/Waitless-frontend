import { useEffect, useState, useCallback } from 'react';
import { subscribeToQueueCustomerUpdates } from '@/lib/pusher-service';
import { QueueCustomer } from '@/types/queue';

interface QueueCustomerEvent {
  type: 'added' | 'removed' | 'status-changed';
  customer: QueueCustomer;
}

/**
 * Hook for subscribing to real-time queue customer updates
 * @param queueId ID of the queue to subscribe to
 * @returns Object containing queue customer update data and methods
 */
export function useQueueCustomerUpdates(queueId: string | undefined) {
  const [customers, setCustomers] = useState<QueueCustomer[]>([]);
  const [lastEvent, setLastEvent] = useState<QueueCustomerEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with existing customers if provided
  const initializeCustomers = useCallback((initialCustomers: QueueCustomer[]) => {
    setCustomers(initialCustomers);
  }, []);

  // Handle customer added event
  const handleCustomerAdded = useCallback((data: { customer: QueueCustomer }) => {
    setCustomers(prev => {
      // Check if customer already exists
      const exists = prev.some(c => c.id === data.customer.id);
      if (exists) {
        return prev.map(c => c.id === data.customer.id ? data.customer : c);
      } else {
        return [...prev, data.customer];
      }
    });
    setLastEvent({ type: 'added', customer: data.customer });
  }, []);

  // Handle customer removed event
  const handleCustomerRemoved = useCallback((data: { customer: QueueCustomer }) => {
    setCustomers(prev => prev.filter(c => c.id !== data.customer.id));
    setLastEvent({ type: 'removed', customer: data.customer });
  }, []);

  // Handle customer status changed event
  const handleCustomerStatusChanged = useCallback((data: { customer: QueueCustomer }) => {
    setCustomers(prev => prev.map(c => c.id === data.customer.id ? data.customer : c));
    setLastEvent({ type: 'status-changed', customer: data.customer });
  }, []);

  useEffect(() => {
    if (!queueId) {
      setIsConnected(false);
      return;
    }

    try {
      // Subscribe to queue customer updates
      const subscription = subscribeToQueueCustomerUpdates(
        queueId,
        handleCustomerAdded,
        handleCustomerRemoved,
        handleCustomerStatusChanged
      );

      setIsConnected(true);
      setError(null);

      // Clean up subscription when component unmounts or queueId changes
      return () => {
        subscription.unsubscribe();
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Failed to subscribe to queue customer updates:', err);
      setError('Failed to connect to real-time customer updates');
      setIsConnected(false);
      return () => {}; // Return empty cleanup function
    }
  }, [queueId, handleCustomerAdded, handleCustomerRemoved, handleCustomerStatusChanged]);

  return {
    customers,
    lastEvent,
    isConnected,
    error,
    initializeCustomers
  };
}

export default useQueueCustomerUpdates;
