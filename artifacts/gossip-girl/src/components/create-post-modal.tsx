import { useState } from 'react';
import { useCreatePost, getGetMeQueryKey, getListPostsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [text, setText] = useState('');
  
  const queryClient = useQueryClient();
  const createPost = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createPost.mutate(
      { 
        data: { 
          text,
          photoUrl: photoUrl.trim() || null
        } 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          onOpenChange(false);
          setPhotoUrl('');
          setText('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-[#160f1a] border-2 border-[#e8cd6d] max-w-md animate-scale-in"
        data-testid="dialog-create-post"
      >
        <DialogHeader>
          <DialogTitle className="text-[#e8cd6d] text-2xl font-semibold uppercase tracking-wider text-center">
            New Blast
          </DialogTitle>
          <p className="text-[#9b8fa5] text-sm italic text-center mt-2">
            Spread the news
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="photoUrl" className="text-[#f0e8dc] text-sm">
              Photo URL (optional)
            </Label>
            <Input
              id="photoUrl"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="bg-[#0f0a12] border-[#2e1f38] text-[#f0e8dc] focus:border-[#e21f6b] transition-colors"
              data-testid="input-photo-url"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text" className="text-[#f0e8dc] text-sm">
              The Tip
            </Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Spotted: ..."
              rows={6}
              className="bg-[#0f0a12] border-[#2e1f38] text-[#f0e8dc] focus:border-[#e21f6b] transition-colors resize-none"
              required
              data-testid="textarea-post-text"
            />
          </div>
          
          <Button
            type="submit"
            disabled={createPost.isPending || !text.trim()}
            className="w-full bg-[#e21f6b] hover:bg-[#c41a5c] text-[#f0e8dc] font-semibold uppercase tracking-wider transition-all hover:magenta-glow"
            data-testid="button-submit-post"
          >
            {createPost.isPending ? 'Posting...' : 'Post It'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
