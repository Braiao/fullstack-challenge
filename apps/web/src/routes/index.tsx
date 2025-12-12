import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Priority, TaskStatus } from '@repo/types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  deadline: z.string(),
  priority: z.nativeEnum(Priority),
});

function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [page, setPage] = useState(1);

  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm({ resolver: zodResolver(registerSchema) });
  const taskForm = useForm({ resolver: zodResolver(taskSchema) });

  const loginMutation = useMutation({
    mutationFn: api.login.bind(api),
    onSuccess: (data) => {
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
      setAuth({ id: payload.sub, email: payload.email, username: payload.username }, data.accessToken, data.refreshToken);
      setAuthDialogOpen(false);
      toast({ title: 'Success', description: 'Logged in successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Invalid credentials', variant: 'destructive' });
    },
  });

  const registerMutation = useMutation({
    mutationFn: api.register.bind(api),
    onSuccess: (data) => {
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
      setAuth({ id: payload.sub, email: payload.email, username: payload.username }, data.accessToken, data.refreshToken);
      setAuthDialogOpen(false);
      toast({ title: 'Success', description: 'Account created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Registration failed', variant: 'destructive' });
    },
  });

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks', page],
    queryFn: () => api.getTasks(page),
    enabled: isAuthenticated(),
  });

  const createTaskMutation = useMutation({
    mutationFn: api.createTask.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setCreateTaskOpen(false);
      taskForm.reset();
      toast({ title: 'Success', description: 'Task created successfully' });
    },
  });

  const handleAuth = (data: any) => {
    if (authMode === 'login') {
      loginMutation.mutate(data);
    } else {
      registerMutation.mutate(data);
    }
  };

  const handleCreateTask = (data: any) => {
    createTaskMutation.mutate(data);
  };

  const handleLogout = () => {
    clearAuth();
    toast({ title: 'Success', description: 'Logged out successfully' });
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

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Task Management System</CardTitle>
            <CardDescription>Please login or register to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Get Started</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{authMode === 'login' ? 'Login' : 'Register'}</DialogTitle>
                  <DialogDescription>
                    {authMode === 'login' ? 'Login to your account' : 'Create a new account'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={authMode === 'login' ? loginForm.handleSubmit(handleAuth) : registerForm.handleSubmit(handleAuth)}>
                  <div className="space-y-4">
                    {authMode === 'register' && (
                      <div>
                        <Label>Username</Label>
                        <Input {...registerForm.register('username')} />
                      </div>
                    )}
                    <div>
                      <Label>Email</Label>
                      <Input type="email" {...(authMode === 'login' ? loginForm.register('email') : registerForm.register('email'))} />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input type="password" {...(authMode === 'login' ? loginForm.register('password') : registerForm.register('password'))} />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="button" variant="ghost" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                      {authMode === 'login' ? 'Need an account?' : 'Have an account?'}
                    </Button>
                    <Button type="submit">{authMode === 'login' ? 'Login' : 'Register'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Tasks</h2>
          <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button>Create Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={taskForm.handleSubmit(handleCreateTask)}>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input {...taskForm.register('title')} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea {...taskForm.register('description')} />
                  </div>
                  <div>
                    <Label>Deadline</Label>
                    <Input type="datetime-local" {...taskForm.register('deadline')} />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select onValueChange={(value) => taskForm.setValue('priority', value as Priority)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
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
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasksData?.data.map((task: any) => (
                <Card key={task.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: `/tasks/${task.id}` })}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                    </div>
                    <CardDescription>{new Date(task.deadline).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{task.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {tasksData && tasksData.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="flex items-center px-4">Page {page} of {tasksData.totalPages}</span>
                <Button variant="outline" disabled={page === tasksData.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: HomePage,
});
