import bcrypt from 'bcryptjs';
import { pool } from './db.js';
const passwordHash = await bcrypt.hash('123', 10);
await pool.query(`UPDATE users SET username = $1, name = $2, password_hash = $3
   WHERE username = $4 AND NOT EXISTS (SELECT 1 FROM users WHERE username = $1)`, ['Sarah', 'Sarah', passwordHash, 'joaosilva']);
const user = await pool.query(`INSERT INTO users (username, name, password_hash, bio)
   VALUES ($1, $2, $3, $4)
  ON CONFLICT (username) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, bio = EXCLUDED.bio
   RETURNING id`, ['Sarah', 'Sarah', passwordHash, 'Estudante de Informática para Internet da DIATINF.']);
const userId = user.rows[0].id;
const existing = await pool.query('SELECT COUNT(*)::int AS count FROM posts');
if (existing.rows[0].count === 0) {
    await pool.query(`INSERT INTO posts (user_id, content) VALUES
      ($1, 'Hoje tivemos uma ótima palestra sobre Programação Orientada a Serviços na DIATINF! 🚀'),
      ($1, 'Muito aprendizado e troca de experiências.'),
      ($1, 'Alguém tem material sobre Docker para indicar? Obrigado!')`, [userId]);
}
console.log('Seed concluído. Login: Sarah / 123');
await pool.end();
