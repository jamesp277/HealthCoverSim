import express from 'express';
import db from './db.js';
import { calculateQuote } from './calc.js';
import { validateQuote } from './validate.js';

const app = express();
app.use(express.json());

const fields = [
  'customer_name', 'cover_type', 'applicant1_age', 'applicant1_cover_history',
  'applicant2_age', 'applicant2_cover_history', 'hospital_cover', 'extras_cover',
  'payment_frequency', 'annual_discount', 'notes',
];

const getAll = db.prepare('SELECT * FROM quotes ORDER BY id DESC');
const getOne = db.prepare('SELECT * FROM quotes WHERE id = ?');
const insert = db.prepare(
  `INSERT INTO quotes (${fields.join(', ')}) VALUES (${fields.map((f) => '@' + f).join(', ')})`
);
const update = db.prepare(
  `UPDATE quotes SET ${fields.map((f) => `${f} = @${f}`).join(', ')} WHERE id = @id`
);
const remove = db.prepare('DELETE FROM quotes WHERE id = ?');

function withCalculation(row) {
  try {
    return { ...row, calculation: calculateQuote(row), calculationError: null };
  } catch (err) {
    return { ...row, calculation: null, calculationError: err.message };
  }
}

app.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'Invalid quote id' });
  next();
});

app.get('/api/quotes', (req, res) => {
  res.json(getAll.all().map(withCalculation));
});

app.get('/api/quotes/:id', (req, res) => {
  const row = getOne.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'Quote not found' });
  res.json(withCalculation(row));
});

app.post('/api/quotes', (req, res) => {
  const { errors, data } = validateQuote(req.body);
  if (!data) return res.status(400).json({ error: 'Please fix the errors and try again', errors });
  const result = insert.run(data);
  res.status(201).json(withCalculation(getOne.get(result.lastInsertRowid)));
});

app.put('/api/quotes/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!getOne.get(id)) return res.status(404).json({ error: 'Quote not found' });
  const { errors, data } = validateQuote(req.body);
  if (!data) return res.status(400).json({ error: 'Please fix the errors and try again', errors });
  update.run({ ...data, id });
  res.json(withCalculation(getOne.get(id)));
});

app.delete('/api/quotes/:id', (req, res) => {
  const result = remove.run(Number(req.params.id));
  if (result.changes === 0) return res.status(404).json({ error: 'Quote not found' });
  res.status(204).end();
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
