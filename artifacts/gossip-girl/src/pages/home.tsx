import { useState } from 'react';
import { useGetMe, useListPosts, useLogout, useDeletePost, getGetMeQueryKey, getListPostsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { LoginModal } from '@/components/login-modal';
import { CreatePostModal } from '@/components/create-post-modal';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, List, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { data: authStatus, isLoading: authLoading } = useGetMe({ 
    query: { queryKey: getGetMeQueryKey() } 
  });
  const { data: posts, isLoading: postsLoading } = useListPosts({ 
    query: { queryKey: getListPostsQueryKey() } 
  });
  
  const logout = useLogout();
  const deletePost = useDeletePost();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
      },
    });
  };

  const handleDeletePost = (id: number) => {
    deletePost.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
        },
      }
    );
  };

  const isLoggedIn = authStatus?.loggedIn || false;

  return (
    <>
      <div className="min-h-[100dvh] bg-[#1a0e24] text-[#f0e8dc]">
        {/* Top bar */}
        <div className="fixed top-0 right-0 z-50 p-4 flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-[#9b8fa5] text-sm" data-testid="text-signed-in">Signed in</span>
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-[#e21f6b] hover:bg-[#c41a5c] text-[#f0e8dc] font-medium px-4 py-2 transition-all hover:magenta-glow"
                data-testid="button-create"
              >
                Create
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-[#e8cd6d] text-[#e8cd6d] hover:bg-[#e8cd6d]/10 font-medium px-4 py-2 transition-all"
                data-testid="button-logout"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setLoginOpen(true)}
              className="bg-[#e8cd6d] hover:bg-[#d4ba5f] text-[#2a2420] font-semibold px-5 py-2 transition-all"
              data-testid="button-login"
            >
              Login
            </Button>
          )}
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto px-6 py-12">
          {/* Left sidebar - vertical nav blocks */}
          <aside className="lg:w-[200px] flex lg:flex-col gap-6 flex-wrap lg:flex-nowrap" data-testid="sidebar-left">
            <div className="space-y-2">
              <h3 className="text-[#4fd8e8] text-sm lowercase font-semibold tracking-wide">
                welcome
              </h3>
              <p className="text-[#9b8fa5] text-xs leading-relaxed">
                The secret lives of Manhattan's elite
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-[#e21f6b] text-sm lowercase font-semibold tracking-wide">
                gossip
              </h3>
              <p className="text-[#9b8fa5] text-xs leading-relaxed">
                Who's dating who? Who's fighting?
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-[#7ed957] text-sm lowercase font-semibold tracking-wide">
                pics
              </h3>
              <p className="text-[#9b8fa5] text-xs leading-relaxed">
                Caught on camera
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-[#ff8a3d] text-sm lowercase font-semibold tracking-wide">
                parties
              </h3>
              <p className="text-[#9b8fa5] text-xs leading-relaxed">
                Where the action is
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-[#5c8dff] text-sm lowercase font-semibold tracking-wide">
                links
              </h3>
              <p className="text-[#9b8fa5] text-xs leading-relaxed">
                Around the web
              </p>
            </div>
          </aside>

          {/* Center feed */}
          <main className="flex-1 max-w-[700px] mx-auto lg:mx-0" data-testid="main-feed">
            {/* Header */}
            <header className="mb-12 text-center">
              <h1 
                className="text-[#e8cd6d] font-bold tracking-tight gold-glow mb-2"
                style={{ fontSize: '64px', lineHeight: '1.1' }}
                data-testid="text-title"
              >
                GOSSIP GIRL
              </h1>
              <p 
                className="text-[#9b8fa5] uppercase tracking-[0.3em] text-xs mb-6"
                data-testid="text-tagline"
              >
                you know you love me
              </p>
              <p className="text-[#f0e8dc] text-base" data-testid="text-catchphrase">
                Spotted: <b className="text-[#e8cd6d]">someone</b> reading this. XOXO.
              </p>
            </header>

            {/* Posts feed */}
            <div className="space-y-8">
              {postsLoading ? (
                <div 
                  className="bg-[#faf7f2] rounded-[10px] p-8 text-center text-[#2a2420]"
                  data-testid="text-loading"
                >
                  Loading the latest tips...
                </div>
              ) : !posts || posts.length === 0 ? (
                <div 
                  className="bg-[#faf7f2] rounded-[10px] p-8 text-center text-[#2a2420]"
                  data-testid="text-empty"
                >
                  No tips yet. The city is quiet... for now.
                </div>
              ) : (
                posts
                  .slice()
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      canDelete={isLoggedIn}
                      onDelete={handleDeletePost}
                    />
                  ))
              )}
            </div>
          </main>

          {/* Right sidebar - icon nav */}
          <aside className="lg:w-[120px] flex lg:flex-col gap-4 justify-center lg:justify-start" data-testid="sidebar-right">
            <button
              className="w-16 h-16 rounded-full border-2 border-[#e8cd6d] flex items-center justify-center transition-all hover:border-[#e21f6b] hover:magenta-glow"
              style={{ background: 'radial-gradient(circle, #2e1f38 0%, #1a0e24 100%)' }}
              data-testid="button-nav-home"
            >
              <HomeIcon className="w-6 h-6 text-[#e8cd6d]" />
            </button>
            
            <button
              className="w-16 h-16 rounded-full border-2 border-[#e8cd6d] flex items-center justify-center transition-all hover:border-[#e21f6b] hover:magenta-glow"
              style={{ background: 'radial-gradient(circle, #2e1f38 0%, #1a0e24 100%)' }}
              data-testid="button-nav-posts"
            >
              <List className="w-6 h-6 text-[#e8cd6d]" />
            </button>
            
            <button
              className="w-16 h-16 rounded-full border-2 border-[#e8cd6d] flex items-center justify-center transition-all hover:border-[#e21f6b] hover:magenta-glow"
              style={{ background: 'radial-gradient(circle, #2e1f38 0%, #1a0e24 100%)' }}
              data-testid="button-nav-pics"
            >
              <ImageIcon className="w-6 h-6 text-[#e8cd6d]" />
            </button>
            
            <button
              className="w-16 h-16 rounded-full border-2 border-[#e8cd6d] flex items-center justify-center transition-all hover:border-[#e21f6b] hover:magenta-glow"
              style={{ background: 'radial-gradient(circle, #2e1f38 0%, #1a0e24 100%)' }}
              data-testid="button-nav-links"
            >
              <LinkIcon className="w-6 h-6 text-[#e8cd6d]" />
            </button>
          </aside>
        </div>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <CreatePostModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
