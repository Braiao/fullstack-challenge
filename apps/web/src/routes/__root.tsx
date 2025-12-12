import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/toaster';
import { useWebSocket } from '@/hooks/use-websocket';
import { useToast } from '@/components/ui/use-toast';

function RootComponent() {
  const { toast } = useToast();

  useWebSocket((event, data) => {
    if (event === 'task:created') {
      toast({
        title: 'New Task Assigned',
        description: 'You have been assigned to a new task',
      });
    } else if (event === 'task:updated') {
      toast({
        title: 'Task Updated',
        description: 'A task you are assigned to has been updated',
      });
    } else if (event === 'comment:new') {
      toast({
        title: 'New Comment',
        description: 'New comment on your task',
      });
    }
  });

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
