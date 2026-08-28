import { useEffect, useState } from 'react';
import {
  Home, Search, Plus, UserRound, MessageCircle, Star, Share2,
  ArrowLeft, Menu, LogOut, Send, Sparkles
} from 'lucide-react';
import { api, type Post, type PostDetail, type UserProfile } from './api';

type Screen = 'feed' | 'new' | 'post' | 'profile' | 'search' | 'login';

const demoPosts: Post[] = [
  { id: 1, content: 'Hoje tivemos uma ótima palestra sobre Programação Orientada a Serviços na DIATINF! 🚀', username: 'joaosilva', name: 'João Silva', rating: 3, comments: 5, created_at: new Date().toISOString() },
  { id: 2, content: 'Dica de estudo: foquem na prática e nos projetos. Isso faz toda a diferença! 💻', username: 'marianacode', name: 'Mariana Code', rating: 2, comments: 3, created_at: new Date().toISOString() },
  { id: 3, content: 'Alguém tem material sobre Docker para indicar? Obrigado!', username: 'carlosteck', name: 'Carlos Teck', rating: 3, comments: 1, created_at: new Date().toISOString() }
];

function Stars({ value, interactive = false, onSelect }: { value: number; interactive?: boolean; onSelect?: (n: number) => void }) {
  return <span className="stars">{[1, 2, 3].map(n =>
    <button key={n} className={n <= value ? 'star active' : 'star'} disabled={!interactive} onClick={() => onSelect?.(n)} aria-label={`${n} estrela${n > 1 ? 's' : ''}`}>
      <Star size={16} fill={n <= value ? 'currentColor' : 'none'} />
    </button>
  )}</span>;
}

function PostCard({ post, onOpen }: { post: Post; onOpen: (id: number) => void }) {
  return <article className="post-card" onClick={() => onOpen(post.id)}>
    <div className="avatar">{post.name.charAt(0)}</div>
    <div className="post-body">
      <div className="post-head"><strong>{post.name}</strong><span>@{post.username}</span><small> · agora</small></div>
      <p>{post.content}</p>
      <div className="post-actions">
        <span><MessageCircle size={17}/> {post.comments}</span>
        <span><Star size={17}/> {post.rating || 0}</span>
        <span><Share2 size={17}/></span>
      </div>
    </div>
  </article>;
}

function Nav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  return <nav className="bottom-nav">
    <button className={screen === 'feed' ? 'selected' : ''} onClick={() => go('feed')}><Home/><small>Feed</small></button>
    <button onClick={() => go('profile')}><UserRound/><small>Perfil</small></button>
    <button className="publish" onClick={() => go('new')}><Plus/><small>Publicar</small></button>
    <button onClick={() => go('search')}><Search/><small>Buscar</small></button>
  </nav>;
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('joaosilva');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await api.login(username, password);
      localStorage.setItem('diatinf_token', result.token);
      localStorage.setItem('diatinf_user', JSON.stringify(result.user));
      onLogin();
    } catch (err) { setError(err instanceof Error ? err.message : 'Falha no login.'); }
  }
  return <main className="login-page"><div className="login-card">
    <div className="brand">DIATINF <b>✕</b></div>
    <p>Conecte-se, compartilhe e aprenda.</p>
    <form onSubmit={submit}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuário" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Senha" />
      {error && <div className="error">{error}</div>}
      <button className="primary">ENTRAR</button>
    </form>
    <small>Demo: joaosilva / 123456</small>
  </div></main>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<PostDetail | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [query, setQuery] = useState('');
  const [logged, setLogged] = useState(Boolean(localStorage.getItem('diatinf_token')));

  async function loadPosts(q = '') {
    try { setPosts(await api.posts(q)); }
    catch { setPosts(demoPosts); }
  }

  useEffect(() => { if (logged) loadPosts(); }, [logged]);

  async function openPost(id: number) {
    try { setSelected(await api.post(id)); } catch {
      const post = posts.find(p => p.id === id) || demoPosts.find(p => p.id === id);
      if (post) setSelected({ ...post, user_id: 1, comments: [] });
    }
    setScreen('post');
  }

  async function openProfile() {
    const username = JSON.parse(localStorage.getItem('diatinf_user') || '{"username":"joaosilva"}').username;
    try { setProfile(await api.user(username)); }
    catch { setProfile({ id: 1, username, name: 'João Silva', bio: 'Estudante de Informática para Internet na DIATINF.', avatar_url: '', posts: posts.slice(0, 2) }); }
    setScreen('profile');
  }

  if (!logged) return <Login onLogin={() => setLogged(true)} />;

  const title = screen === 'feed' ? 'Feed' : screen === 'new' ? 'Nova publicação' : screen === 'post' ? 'Publicação' : screen === 'profile' ? 'Perfil' : 'Pesquisa';

  return <div className="app-shell">
    <header className="topbar">
      {screen !== 'feed' ? <button className="icon-btn" onClick={() => setScreen('feed')}><ArrowLeft/></button> : <button className="icon-btn"><Menu/></button>}
      <div className="brand">DIATINF <b>✕</b></div>
      <button className="icon-btn" onClick={() => { localStorage.removeItem('diatinf_token'); setLogged(false); }}><LogOut/></button>
    </header>

    <main className="content">
      <div className="page-title"><h1>{title}</h1><Sparkles size={20}/></div>

      {screen === 'feed' && <>
        <div className="feed">{posts.map(p => <PostCard key={p.id} post={p} onOpen={openPost}/>)}</div>
        <button className="floating" onClick={() => setScreen('new')}><Plus/></button>
      </>}

      {screen === 'new' && <NewPost onDone={() => { loadPosts(); setScreen('feed'); }} />}
      {screen === 'post' && selected && <PostDetailView post={selected} onRefresh={() => openPost(selected.id)} />}
      {screen === 'profile' && <Profile profile={profile} onOpen={openPost}/>}
      {screen === 'search' && <SearchView query={query} setQuery={setQuery} posts={posts} onSearch={loadPosts} onOpen={openPost}/>}
    </main>

    <Nav screen={screen} go={s => s === 'profile' ? openProfile() : setScreen(s)} />
  </div>;
}

function NewPost({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  async function publish() {
    if (!text.trim()) return;
    try { await api.createPost(text); onDone(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível publicar.'); }
  }
  return <section className="compose">
    <textarea maxLength={500} value={text} onChange={e => setText(e.target.value)} placeholder="O que você quer compartilhar?" />
    <div className="counter">{text.length}/500</div>
    {error && <div className="error">{error}</div>}
    <button className="primary" onClick={publish}>PUBLICAR</button>
  </section>;
}

function PostDetailView({ post, onRefresh }: { post: PostDetail; onRefresh: () => void }) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(Math.round(Number(post.rating)) || 0);
  async function addComment() {
    if (!comment.trim()) return;
    await api.comment(post.id, comment);
    setComment('');
    onRefresh();
  }
  async function rate(n: number) {
    setRating(n);
    try { await api.rate(post.id, n); } catch {}
  }
  return <section>
    <article className="detail-card">
      <div className="avatar">{post.name.charAt(0)}</div>
      <div><div className="post-head"><strong>{post.name}</strong><span>@{post.username}</span></div><p>{post.content}</p><Stars value={rating} interactive onSelect={rate}/></div>
    </article>
    <h2 className="section-title">Comentários</h2>
    <div className="comments">{post.comments.map(c => <div className="comment" key={c.id}><div className="avatar small">{c.name.charAt(0)}</div><div><strong>{c.name}</strong><span className="muted"> @{c.username}</span><p>{c.content}</p><button>Responder</button></div></div>)}</div>
    <div className="comment-box"><input value={comment} onChange={e => setComment(e.target.value)} placeholder="Escreva um comentário..." /><button onClick={addComment}><Send/></button></div>
  </section>;
}

function Profile({ profile, onOpen }: { profile: UserProfile | null; onOpen: (id: number) => void }) {
  if (!profile) return <div className="empty">Carregando perfil...</div>;
  return <section><div className="profile-hero"><div className="avatar profile-avatar">{profile.name.charAt(0)}</div><h2>{profile.name}</h2><p>@{profile.username}</p><span>{profile.bio}</span><div className="profile-stats"><b>{profile.posts.length}<small>Publicações</small></b><b>56<small>Seguidores</small></b><b>38<small>Seguindo</small></b></div></div><h2 className="section-title">Publicações</h2>{profile.posts.map(p => <PostCard key={p.id} post={p} onOpen={onOpen}/>)}</section>;
}

function SearchView({ query, setQuery, posts, onSearch, onOpen }: { query: string; setQuery: (v: string) => void; posts: Post[]; onSearch: (q: string) => void; onOpen: (id: number) => void }) {
  return <section><div className="search-box large"><Search/><input autoFocus value={query} onChange={e => { setQuery(e.target.value); onSearch(e.target.value); }} placeholder="Pesquisar..." /></div>{posts.map(p => <PostCard key={p.id} post={p} onOpen={onOpen}/>)}</section>;
}
