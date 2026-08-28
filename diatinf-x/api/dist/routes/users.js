import { Router } from 'express';
import { query } from '../db.js';
const router = Router();
router.get('/:username', async (req, res) => {
    const user = await query(`SELECT id, username, name, bio, avatar_url, created_at
     FROM users WHERE username = $1`, [req.params.username]);
    if (!user.rows[0])
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    const posts = await query(`SELECT p.id, p.content, p.created_at,
            u.username, u.name, u.avatar_url,
            COALESCE(ROUND(AVG(r.stars), 1), 0) AS rating,
            COUNT(DISTINCT c.id)::int AS comments
     FROM posts p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN ratings r ON r.post_id = p.id
     LEFT JOIN comments c ON c.post_id = p.id
     WHERE p.user_id = $1
     GROUP BY p.id, u.id ORDER BY p.created_at DESC`, [user.rows[0].id]);
    res.json({ ...user.rows[0], posts: posts.rows });
});
export default router;
