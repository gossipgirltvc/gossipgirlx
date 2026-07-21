import { useState } from 'react';
import { useCreatePost, getListPostsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const createPost = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('The tip needs some words, darling.');
      return;
    }
    setError('');
    createPost.mutate(
      { data: { text: text.trim(), photoUrl: photoUrl.trim() || null } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          onOpenChange(false);
          setPhotoUrl('');
          setText('');
          setError('');
        },
        onError: () => {
          setError('Something went wrong. Try again.');
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
        <h2>New Blast</h2>
        <div className="sub">Spread the news</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Photo URL</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="field">
            <label>The Tip</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Spotted: ..."
            />
          </div>
          <div className="err">{error}</div>
          <div className="modal-actions">
            <button type="submit" className="pill-btn primary" disabled={createPost.isPending}>
              {createPost.isPending ? 'Posting…' : 'Post It'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
