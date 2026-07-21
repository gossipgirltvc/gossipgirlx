import { useState, useEffect, useRef } from 'react';
import {
  useGetMe,
  useListPosts,
  useLogout,
  useDeletePost,
  getGetMeQueryKey,
  getListPostsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { LoginModal } from '@/components/login-modal';
import { CreatePostModal } from '@/components/create-post-modal';

function fmtDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: authStatus } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: posts, isLoading: postsLoading } = useListPosts({ query: { queryKey: getListPostsQueryKey() } });
  const logout = useLogout();
  const deletePost = useDeletePost();

  const isLoggedIn = authStatus?.loggedIn ?? false;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
      },
    });
  };

  const handleDelete = (id: number) => {
    deletePost.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
      },
    });
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar" id="topbar">
        {isLoggedIn ? (
          <>
            <span className="who">Signed in</span>
            <button className="pill-btn primary" onClick={() => setCreateOpen(true)}>Create</button>
            <button className="pill-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button className="pill-btn" onClick={() => setLoginOpen(true)}>Login</button>
        )}
      </div>

      {/* PAGE GRID */}
      <div className="page">

        {/* LEFT SIDEBAR */}
        <aside className="side-left">
          <div className="nav-block welcome">
            <h3>welcome</h3>
            <p>to Gossip Girl. The site ABOUT the Upper East Side, FOR the Upper East Side, and BY the Upper East Side.</p>
          </div>
          <div className="nav-block gossip">
            <h3>gossip</h3>
            <p>The latest &ldquo;411&rdquo; on all the in people.</p>
          </div>
          <div className="nav-block pics">
            <h3>pics</h3>
            <p>See what the fashionistas of the UES are wearing.<br /><a href="#">current photo gallery</a></p>
          </div>
          <div className="nav-block parties">
            <h3>parties</h3>
            <p>Your invitation was probably lost in the mail.<br /><a href="#">click here</a> to see what you missed.</p>
          </div>
          <div className="nav-block links">
            <h3>links</h3>
            <p>Every site worth stalking, all in one place.</p>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main className="center wrap">
          <header>
            <img className="logo-img" src="/logo.png" alt="gossip girl" />
          </header>

          <div className="feed">
            {postsLoading ? (
              <div className="loading">Loading the latest tips&hellip;</div>
            ) : !posts || posts.length === 0 ? (
              <div className="empty">
                No tips yet. <b>The city is quiet</b>&hellip; for now.
              </div>
            ) : (
              posts.map((post) => (
                <article className="post" key={post.id}>
                  {isLoggedIn && (
                    <button
                      className="post-delete"
                      onClick={() => handleDelete(post.id)}
                      title="Delete post"
                    >
                      ✕
                    </button>
                  )}
                  {post.photoUrl && (
                    <img
                      className="post-img"
                      src={post.photoUrl}
                      alt=""
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="post-body">
                    <div className="post-meta">
                      <span>Spotted</span>
                      <span>{fmtDate(post.timestamp)}</span>
                    </div>
                    <div className="post-text">{post.text}</div>
                  </div>
                </article>
              ))
            )}
          </div>

          <footer>xoxo, gossip girl</footer>
        </main>

        {/* RIGHT CIRCLE NAV */}
        <aside className="side-right">
          <button className="circle-nav">
            <span className="circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
              </svg>
            </span>
            <span>home</span>
          </button>
          <button className="circle-nav">
            <span className="circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h16M4 12h16M4 19h10" />
              </svg>
            </span>
            <span>posts</span>
          </button>
          <button className="circle-nav">
            <span className="circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="1.5" />
                <circle cx="9" cy="10" r="2" />
                <path d="M21 16l-5-5-9 9" />
              </svg>
            </span>
            <span>pics</span>
          </button>
          <button className="circle-nav">
            <span className="circle">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a4 4 0 005.66 0l3-3a4 4 0 10-5.66-5.66l-1.5 1.5" />
                <path d="M14 11a4 4 0 00-5.66 0l-3 3a4 4 0 105.66 5.66l1.5-1.5" />
              </svg>
            </span>
            <span>links</span>
          </button>
        </aside>

      </div>

      {/* MODALS */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <CreatePostModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
