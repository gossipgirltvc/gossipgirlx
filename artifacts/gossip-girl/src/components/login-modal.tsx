import { useState } from 'react';
import { useLogin, getGetMeQueryKey, getListPostsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    login.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          onOpenChange(false);
          setUsername('');
          setPassword('');
        },
        onError: (err: any) => {
          setError(err?.message || 'Invalid credentials');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-[#160f1a] border-2 border-[#e8cd6d] max-w-md animate-scale-in"
        data-testid="dialog-login"
      >
        <DialogHeader>
          <DialogTitle className="text-[#e8cd6d] text-2xl font-semibold uppercase tracking-wider text-center">
            Sign In
          </DialogTitle>
          <p className="text-[#9b8fa5] text-sm italic text-center mt-2">
            Only Gossip Girl gets past this door
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[#f0e8dc] text-sm">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#0f0a12] border-[#2e1f38] text-[#f0e8dc] focus:border-[#e21f6b] transition-colors"
              required
              data-testid="input-username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#f0e8dc] text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0f0a12] border-[#2e1f38] text-[#f0e8dc] focus:border-[#e21f6b] transition-colors"
              required
              data-testid="input-password"
            />
          </div>
          
          {error && (
            <p className="text-[#e21f6b] text-sm text-center" data-testid="text-error">
              {error}
            </p>
          )}
          
          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-[#e21f6b] hover:bg-[#c41a5c] text-[#f0e8dc] font-semibold uppercase tracking-wider transition-all hover:magenta-glow"
            data-testid="button-submit-login"
          >
            {login.isPending ? 'Entering...' : 'Enter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
