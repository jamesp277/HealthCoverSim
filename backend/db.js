import Database from 'better-sqlite3';
import fs from 'fs';
import { fileURLToPath } from 'url';

const db = new Database(fileURLToPath(new URL('./healthcoversim.db', import.meta.url)));
db.exec(fs.readFileSync(new URL('./init.sql', import.meta.url), 'utf8'));

export default db;
