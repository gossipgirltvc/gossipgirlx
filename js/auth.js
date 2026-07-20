// auth.js — simple client-side auth using hashed password stored in localStorage
// NOTE: This is a purely client-side demo. For real secrets and hidden credentials you need a backend (Firebase/Netlify functions).

const Auth = (function(){
  const LS_KEY = 'gg_users'; // stores { username: hexHash }
  const CURRENT = 'gg_current_user';

  async function hash(password){
    const enc = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  function loadUsers(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY) || '{}') }catch(e){return{}}
  }
  function saveUsers(u){ localStorage.setItem(LS_KEY, JSON.stringify(u)) }

  async function register(username,password){
    const users = loadUsers();
    if(users[username]) throw new Error('User exists');
    users[username] = await hash(password);
    saveUsers(users);
    localStorage.setItem(CURRENT, username);
    return true;
  }

  async function login(username,password){
    const users = loadUsers();
    if(!users[username]) throw new Error('No such user');
    const h = await hash(password);
    if(h === users[username]){
      localStorage.setItem(CURRENT, username);
      return true;
    } else throw new Error('Invalid password');
  }

  function logout(){ localStorage.removeItem(CURRENT) }
  function currentUser(){ return localStorage.getItem(CURRENT) }
  function existsAnyUser(){ return Object.keys(loadUsers()).length>0 }

  return { register, login, logout, currentUser, existsAnyUser }
})();

// wire up modal controls
window.addEventListener('DOMContentLoaded', ()=>{
  const loginBtn = document.getElementById('btn-login');
  const logoutBtn = document.getElementById('btn-logout');
  const modal = document.getElementById('login-modal');
  const form = document.getElementById('login-form');
  const cancel = document.getElementById('login-cancel');
  const who = document.getElementById('who');
  const postForm = document.getElementById('post-form');
  const authWarning = document.getElementById('auth-warning');
  const currentUserEl = document.getElementById('current-user');

  function updateUI(){
    const u = Auth.currentUser();
    if(u){
      who.textContent = u;
      loginBtn.style.display = 'none';
      logoutBtn.style.display = '';
      postForm.style.display = '';
      authWarning.style.display = 'none';
      currentUserEl.textContent = u;
    } else {
      who.textContent = 'Not signed in';
      loginBtn.style.display = '';
      logoutBtn.style.display = 'none';
      postForm.style.display = 'none';
      authWarning.style.display = '';
      currentUserEl.textContent = '';
    }
  }

  loginBtn.addEventListener('click', ()=>{ modal.style.display = 'flex'; });
  cancel.addEventListener('click', ()=>{ modal.style.display = 'none'; });

  logoutBtn.addEventListener('click', ()=>{ Auth.logout(); updateUI(); });

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    try{
      if(!Auth.existsAnyUser()){
        // first run: create admin
        await Auth.register(u,p);
        alert('Account created and signed in as ' + u + '.');
      } else {
        await Auth.login(u,p);
        alert('Signed in as ' + u + '.');
      }
      modal.style.display = 'none';
      updateUI();
    }catch(err){ alert(err.message) }
  });

  updateUI();
});
