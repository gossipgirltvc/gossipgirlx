import { useState, useRef, useEffect } from 'react';
import { useLogin, getGetMeQueryKey, getListPostsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

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
        onError: () => {
          setError("That's not it. Try again.");
        },
      }
    );
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  return (
    <div className={`overlay${open ? ' show' : ''}`} onClick={handleOverlayClick}>
      <div className="modal">
        <button className="close-x" onClick={() => onOpenChange(false)}>✕</button>
        <h2>Sign In</h2>
        <div className="sub">Only Gossip Girl gets past this door</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="err">{error}</div>
          <div className="modal-actions">
            <button type="submit" className="pill-btn primary" disabled={login.isPending}>
              {login.isPending ? 'Entering…' : 'Enter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
