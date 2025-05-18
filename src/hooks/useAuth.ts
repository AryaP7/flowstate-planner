import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/components/ui/use-toast';

export function useAuth() {
  const navigate = useNavigate();
  const { setState } = useAppContext();

  const signinMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.signin(email, password),
    onSuccess: (response) => {
      const { token, ...user } = response.data;
      localStorage.setItem('token', token);
      setState(prev => ({ ...prev, currentUser: user }));
      toast({ title: 'Welcome back!', description: `Signed in as ${user.name}` });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Error signing in',
        description: error.response?.data?.error || 'Please check your credentials',
        variant: 'destructive',
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      auth.signup(name, email, password),
    onSuccess: (response) => {
      const { token, ...user } = response.data;
      localStorage.setItem('token', token);
      setState(prev => ({ ...prev, currentUser: user }));
      toast({ title: 'Welcome!', description: 'Your account has been created' });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Error signing up',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const signout = () => {
    localStorage.removeItem('token');
    setState(prev => ({ ...prev, currentUser: null }));
    navigate('/auth');
  };

  return {
    signin: signinMutation.mutate,
    signup: signupMutation.mutate,
    signout,
    isLoading: signinMutation.isPending || signupMutation.isPending,
  };
} 