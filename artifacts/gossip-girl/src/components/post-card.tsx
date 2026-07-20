import { useState } from 'react';
import { Post } from '@workspace/api-client-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PostCardProps {
  post: Post;
  canDelete: boolean;
  onDelete: (id: number) => void;
}

export function PostCard({ post, canDelete, onDelete }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const formattedDate = format(new Date(post.timestamp), 'MMMM d, yyyy');

  return (
    <article 
      className="bg-[#faf7f2] rounded-[10px] overflow-hidden relative animate-fade-in-up"
      style={{ 
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 16px 48px rgba(0, 0, 0, 0.3)'
      }}
      data-testid={`card-post-${post.id}`}
    >
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(post.id)}
          className="absolute top-3 right-3 z-10 bg-[#2a2420]/80 hover:bg-[#e21f6b] text-[#faf7f2] w-8 h-8 rounded-full transition-all"
          data-testid={`button-delete-${post.id}`}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      
      {post.photoUrl && !imageError && (
        <div className="w-full" style={{ maxHeight: '460px' }}>
          <img
            src={post.photoUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ maxHeight: '460px' }}
            onError={() => setImageError(true)}
            data-testid={`img-post-photo-${post.id}`}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3 text-sm text-[#9b8fa5]">
          <span className="font-medium" data-testid={`text-spotted-${post.id}`}>Spotted</span>
          <span className="text-[#2a2420]/40">•</span>
          <time dateTime={new Date(post.timestamp).toISOString()} data-testid={`text-date-${post.id}`}>
            {formattedDate}
          </time>
        </div>
        
        <p 
          className="text-[#2a2420] leading-relaxed whitespace-pre-wrap"
          style={{ fontSize: '20px' }}
          data-testid={`text-content-${post.id}`}
        >
          {post.text}
        </p>
      </div>
    </article>
  );
}
