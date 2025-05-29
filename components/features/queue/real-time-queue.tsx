import { useEffect, useState } from 'react';
import { useQueueUpdates } from '@/hooks/use-queue-updates';
import { useQueueCustomerUpdates } from '@/hooks/use-queue-customer-updates';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { queueService } from '@/lib/queue-service';
import { QueueCustomer } from '@/types/queue';
import { toast } from '@/components/ui/use-toast';

interface RealTimeQueueProps {
  queueId: string;
  initialCustomers?: QueueCustomer[];
}

export function RealTimeQueue({ queueId, initialCustomers = [] }: RealTimeQueueProps) {
  // Use our custom hooks for real-time updates
  const { queueData, isLoading: isQueueLoading, error: queueError } = useQueueUpdates(queueId);
  const { 
    customers, 
    lastEvent, 
    isConnected, 
    error: customerError,
    initializeCustomers
  } = useQueueCustomerUpdates(queueId);
  
  const [isPaused, setIsPaused] = useState(false);
  
  // Initialize customers with any provided initial data
  useEffect(() => {
    if (initialCustomers.length > 0) {
      initializeCustomers(initialCustomers);
    } else {
      // Fetch customers if none provided
      const fetchCustomers = async () => {
        try {
          const response = await queueService.getQueueCustomers(queueId);
          if (response.data?.data) {
            initializeCustomers(response.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch queue customers:', error);
        }
      };
      
      fetchCustomers();
    }
  }, [queueId, initialCustomers, initializeCustomers]);
  
  // Update paused state when queue data changes
  useEffect(() => {
    if (queueData?.queue) {
      setIsPaused(!!queueData.queue.is_paused);
    }
  }, [queueData]);
  
  // Show toast notification when events occur
  useEffect(() => {
    if (lastEvent) {
      const { type, customer } = lastEvent;
      
      switch (type) {
        case 'added':
          toast({
            title: 'New customer added',
            description: `${customer.name} has joined the queue with ticket #${customer.ticket_number}`,
          });
          break;
        case 'removed':
          toast({
            title: 'Customer removed',
            description: `${customer.name} has been removed from the queue`,
          });
          break;
        case 'status-changed':
          toast({
            title: 'Customer status changed',
            description: `${customer.name}'s status is now ${customer.status}`,
          });
          break;
      }
    }
  }, [lastEvent]);
  
  // Handle pause/resume queue
  const handlePauseResumeQueue = async () => {
    try {
      if (isPaused) {
        await queueService.resumeQueue(queueId);
        toast({
          title: 'Queue resumed',
          description: 'The queue is now accepting new customers',
        });
      } else {
        await queueService.pauseQueue(queueId, 'Paused by staff');
        toast({
          title: 'Queue paused',
          description: 'The queue has been temporarily paused',
        });
      }
      // State will be updated via real-time update
    } catch (error) {
      console.error('Failed to pause/resume queue:', error);
      toast({
        title: 'Action failed',
        description: 'Failed to pause/resume the queue',
        variant: 'destructive',
      });
    }
  };
  
  // Handle calling next customer
  const handleCallNext = async () => {
    try {
      const response = await queueService.callNextCustomer(queueId);
      if (response.data?.data) {
        const { user, ticket_number } = response.data.data;
        toast({
          title: 'Next customer called',
          description: `Now serving ${user.name} with ticket #${ticket_number}`,
        });
      }
    } catch (error) {
      console.error('Failed to call next customer:', error);
      toast({
        title: 'Action failed',
        description: 'Failed to call the next customer',
        variant: 'destructive',
      });
    }
  };
  
  // Show loading state
  if (isQueueLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show error state
  if (queueError || customerError) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle>Connection Error</CardTitle>
          <CardDescription>
            {queueError || customerError}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Unable to establish real-time connection. Please refresh the page or try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Determine queue status badge
  const getStatusBadge = () => {
    if (!queueData?.queue.is_active) {
      return <Badge variant="outline">Inactive</Badge>;
    }
    
    if (isPaused) {
      return <Badge variant="secondary">Paused</Badge>;
    }
    
    return <Badge variant="success">Active</Badge>;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{queueData?.queue.name || 'Queue'}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          {isConnected ? 
            <span className="text-green-500">● Live updates connected</span> : 
            <span className="text-amber-500">○ Connecting to live updates...</span>
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Currently serving</h3>
            <span className="text-lg font-bold">
              {queueData?.current_serving.ticket_number || 'None'}
            </span>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Waiting customers ({customers.filter(c => c.status === 'waiting').length})</h3>
            <div className="space-y-2">
              {customers
                .filter(customer => customer.status === 'waiting')
                .sort((a, b) => a.position - b.position)
                .map(customer => (
                  <div 
                    key={customer.id} 
                    className="flex justify-between items-center p-2 bg-muted rounded-md"
                  >
                    <div>
                      <span className="font-medium">{customer.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {customer.estimatedWait ? `Est. wait: ${customer.estimatedWait}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{customer.ticket_number}</Badge>
                      <Badge variant="outline">#{customer.position}</Badge>
                    </div>
                  </div>
                ))}
              
              {customers.filter(c => c.status === 'waiting').length === 0 && (
                <p className="text-sm text-muted-foreground">No customers waiting</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant={isPaused ? "default" : "secondary"}
          onClick={handlePauseResumeQueue}
          disabled={!queueData?.queue.is_active}
        >
          {isPaused ? 'Resume Queue' : 'Pause Queue'}
        </Button>
        
        <Button 
          onClick={handleCallNext}
          disabled={
            !queueData?.queue.is_active || 
            isPaused || 
            customers.filter(c => c.status === 'waiting').length === 0
          }
        >
          Call Next Customer
        </Button>
      </CardFooter>
    </Card>
  );
}
