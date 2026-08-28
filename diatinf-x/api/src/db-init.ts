import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const path = fileURLToPath(new URL('../sql/schema.sql', import.meta.url));
const sql = await readFile(path, 'utf8');
await pool.query(sql);
console.log('Banco inicializado.');
await pool.end();
