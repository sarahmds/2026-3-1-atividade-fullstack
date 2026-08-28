const API_URL = '/api';
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('diatinf_token');
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está rodando em localhost:3333.');
  }

  const responseText = await response.text();
  let data: { message?: string } & T = {} as { message?: string } & T;
  try {
    data = responseText ? JSON.parse(responseText) : data;
  } catch {
    data = {} as { message?: string } & T;
  }
  if (!response.ok) throw new Error(data.message || 'Erro na requisição.');
  return data;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token: string; user: { username: string; name: string } }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ username, password })
    }),
  posts: (q = '') => request<Post[]>(`/posts${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  post: (id: number) => request<PostDetail>(`/posts/${id}`),
  createPost: (content: string) =>
    request('/posts', { method: 'POST', body: JSON.stringify({ content }) }),
  comment: (id: number, content: string, parentId?: number) =>
    request(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ content, parentId }) }),
  rate: (id: number, stars: number) =>
    request(`/posts/${id}/rating`, { method: 'POST', body: JSON.stringify({ stars }) }),
  user: (username: string) => request<UserProfile>(`/users/${username}`)
};

export interface Post {
  id: number; content: string; created_at: string;
  username: string; name: string; rating: number; comments: number;
}
export interface Comment {
  id: number; content: string; parent_id: number | null; created_at: string; username: string; name: string;
}
export interface PostDetail extends Post { user_id: number; comments: Comment[]; }
export interface UserProfile {
  id: number; username: string; name: string; bio: string; avatar_url: string; posts: Post[];
}
