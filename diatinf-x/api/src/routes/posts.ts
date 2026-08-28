import { Router } from 'express';
import { auth, type AuthRequest } from '../middleware/auth.js';
import { query } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const search = String(req.query.q ?? '').trim();
  const params: unknown[] = [];
  let where = '';

  if (search) {
    params.push(`%${search}%`);
    where = `WHERE p.content ILIKE $${params.length} OR u.username ILIKE $${params.length} OR u.name ILIKE $${params.length}`;
  }

  const result = await query(
    `SELECT p.id, p.content, p.created_at,
            u.id AS user_id, u.username, u.name, u.avatar_url,
            COALESCE(ROUND(AVG(r.stars), 1), 0) AS rating,
            COUNT(DISTINCT c.id)::int AS comments
     FROM posts p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN ratings r ON r.post_id = p.id
     LEFT JOIN comments c ON c.post_id = p.id
     ${where}
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC`,
    params
  );
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const post = await query(
    `SELECT p.id, p.content, p.created_at, u.id AS user_id, u.username, u.name,
            COALESCE(ROUND(AVG(r.stars), 1), 0) AS rating,
            COUNT(DISTINCT c.id)::int AS comments
     FROM posts p JOIN users u ON u.id = p.user_id
     LEFT JOIN ratings r ON r.post_id = p.id
     LEFT JOIN comments c ON c.post_id = p.id
     WHERE p.id = $1 GROUP BY p.id, u.id`,
    [req.params.id]
  );

  if (!post.rows[0]) return res.status(404).json({ message: 'Publicação não encontrada.' });

  const comments = await query(
    `SELECT c.id, c.content, c.parent_id, c.created_at,
            u.username, u.name
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1 ORDER BY c.created_at ASC`,
    [req.params.id]
  );

  res.json({ ...post.rows[0], comments: comments.rows });
});

router.post('/', auth, async (req: AuthRequest, res) => {
  const content = String(req.body?.content ?? '').trim();
  if (!content) return res.status(400).json({ message: 'A publicação não pode ficar vazia.' });
  if (content.length > 500) return res.status(400).json({ message: 'A publicação deve ter no máximo 500 caracteres.' });

  const result = await query(
    'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING id, content, created_at',
    [req.userId, content]
  );
  res.status(201).json(result.rows[0]);
});

router.post('/:id/comments', auth, async (req: AuthRequest, res) => {
  const content = String(req.body?.content ?? '').trim();
  const parentId = req.body?.parentId ?? null;

  if (!content) return res.status(400).json({ message: 'O comentário não pode ficar vazio.' });

  const result = await query(
    `INSERT INTO comments (post_id, user_id, parent_id, content)
     VALUES ($1, $2, $3, $4) RETURNING id, content, parent_id, created_at`,
    [req.params.id, req.userId, parentId, content]
  );
  res.status(201).json(result.rows[0]);
});

router.post('/:id/rating', auth, async (req: AuthRequest, res) => {
  const stars = Number(req.body?.stars);
  if (![1, 2, 3].includes(stars)) return res.status(400).json({ message: 'A avaliação deve ser de 1 a 3 estrelas.' });

  await query(
    `INSERT INTO ratings (post_id, user_id, stars) VALUES ($1, $2, $3)
     ON CONFLICT (post_id, user_id) DO UPDATE SET stars = EXCLUDED.stars`,
    [req.params.id, req.userId, stars]
  );

  res.json({ message: 'Avaliação registrada.' });
});

export default router;
