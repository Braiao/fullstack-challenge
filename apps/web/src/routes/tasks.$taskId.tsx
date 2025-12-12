import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Priority, TaskStatus } from '@repo/types';
import { ArrowLeft } from 'lucide-react';

const commentSchema = z.object({
  content: z.string().min(1),
});

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
});

function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentPage, setCommentPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);

  const commentForm = useForm({ resolver: zodResolver(commentSchema) });
  const updateForm = useForm({ resolver: zodResolver(updateTaskSchema) });

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => api.getTask(taskId),
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', taskId, commentPage],
    queryFn: () => api.getComments(taskId, commentPage),
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: any) => api.createComment(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      commentForm.reset();
      toast({ title: 'Success', description: 'Comment added' });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: any) => api.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditOpen(false);
      toast({ title: 'Success', description: 'Task updated' });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => api.deleteTask(taskId),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Task deleted' });
      navigate({ to: '/' });
    },
  });

  const handleComment = (data: any) => {
    createCommentMutation.mutate(data);
  };

  const handleUpdate = (data: any) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null && v !== '')
    );
    if (Object.keys(filteredData).length > 0) {
      updateTaskMutation.mutate(filteredData);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW: return 'bg-blue-500';
      case Priority.MEDIUM: return 'bg-yellow-500';
      case Priority.HIGH: return 'bg-orange-500';
      case Priority.URGENT: return 'bg-red-500';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO: return 'bg-gray-500';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-500';
      case TaskStatus.REVIEW: return 'bg-purple-500';
      case TaskStatus.DONE: return 'bg-green-500';
    }
  };

  if (taskLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">{task.title}</CardTitle>
                <CardDescription className="mt-2">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{task.description}</p>

            <div className="flex gap-2">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button>Edit Task</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={updateForm.handleSubmit(handleUpdate)}>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input defaultValue={task.title} {...updateForm.register('title')} />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea defaultValue={task.description} {...updateForm.register('description')} />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select onValueChange={(value) => updateForm.setValue('status', value as TaskStatus)}>
                          <SelectTrigger>
                            <SelectValue placeholder={task.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                            <SelectItem value={TaskStatus.REVIEW}>Review</SelectItem>
                            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select onValueChange={(value) => updateForm.setValue('priority', value as Priority)}>
                          <SelectTrigger>
                            <SelectValue placeholder={task.priority} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Priority.LOW}>Low</SelectItem>
                            <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                            <SelectItem value={Priority.HIGH}>High</SelectItem>
                            <SelectItem value={Priority.URGENT}>Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit">Update</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="destructive" onClick={() => deleteTaskMutation.mutate()}>
                Delete Task
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={commentForm.handleSubmit(handleComment)} className="mb-6">
              <div className="flex gap-2">
                <Textarea placeholder="Add a comment..." {...commentForm.register('content')} />
                <Button type="submit" className="self-end">Post</Button>
              </div>
            </form>

            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {commentsData?.data.map((comment: any) => (
                  <div key={comment.id} className="border-l-4 border-gray-300 pl-4">
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p>{comment.content}</p>
                  </div>
                ))}

                {commentsData && commentsData.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled={commentPage === 1} onClick={() => setCommentPage(commentPage - 1)}>
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                      Page {commentPage} of {commentsData.totalPages}
                    </span>
                    <Button variant="outline" size="sm" disabled={commentPage === commentsData.totalPages} onClick={() => setCommentPage(commentPage + 1)}>
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export const Route = createFileRoute('/tasks/$taskId')({
  component: TaskDetailPage,
});
