// app.js — posts storage using localStorage
(function(){
  const LS_POSTS = 'gg_posts_v1';
  function loadPosts(){
    try{ return JSON.parse(localStorage.getItem(LS_POSTS) || '[]') }catch(e){return[]}
  }
  function savePosts(p){ localStorage.setItem(LS_POSTS, JSON.stringify(p)) }

  function render(){
    const list = document.getElementById('posts-list');
    const posts = loadPosts().slice().reverse();
    if(!posts.length) list.innerHTML = '<div class="small">No posts yet.</div>';
    else list.innerHTML = posts.map(p=>`<article class="post"><h3>${escapeHtml(p.title)}</h3><div class="meta">by ${escapeHtml(p.author)} • ${new Date(p.ts).toLocaleString()}</div><div style="margin-top:8px">${escapeHtml(p.content).replace(/\n/g,'<br>')}</div></article>`).join('\n');
  }

  function escapeHtml(s){ return String(s).replace(/[&<>\"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])) }

  document.addEventListener('DOMContentLoaded', ()=>{
    render();
    const form = document.getElementById('post-form');
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const user = window.Auth && window.Auth.currentUser ? window.Auth.currentUser() : null;
      if(!user){ alert('Sign in first'); return }
      const t = document.getElementById('post-title').value.trim();
      const c = document.getElementById('post-content').value.trim();
      if(!t||!c) return;
      const posts = loadPosts();
      posts.push({ title:t, content:c, author:user, ts: Date.now() });
      savePosts(posts);
      form.reset();
      render();
    });

    // simple live check of auth state
    setInterval(()=>{
      const u = window.Auth && window.Auth.currentUser && window.Auth.currentUser();
      const who = document.getElementById('who');
      const btnLogin = document.getElementById('btn-login');
      const btnLogout = document.getElementById('btn-logout');
      const postForm = document.getElementById('post-form');
      const authWarning = document.getElementById('auth-warning');
      const currentUserEl = document.getElementById('current-user');
      if(u){ who.textContent = u; btnLogin.style.display='none'; btnLogout.style.display='inline-block'; postForm.style.display=''; authWarning.style.display='none'; currentUserEl.textContent = u; }
      else { who.textContent='Not signed in'; btnLogin.style.display='inline-block'; btnLogout.style.display='none'; postForm.style.display='none'; authWarning.style.display=''; currentUserEl.textContent=''; }
    },400);

    // show login modal when the global login button clicked
    window.Auth = window.Auth || window.auth; // ensure available
  });
})();
