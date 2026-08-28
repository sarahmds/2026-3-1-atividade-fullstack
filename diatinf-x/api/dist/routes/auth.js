import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
const router = Router();
const secret = process.env.JWT_SECRET || 'dev-secret';
router.post('/login', async (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password)
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    const result = await query('SELECT id, username, name, password_hash FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
});
export default router;
