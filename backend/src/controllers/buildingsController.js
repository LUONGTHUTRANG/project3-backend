import db from '../db.js';

async function list(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM buildings');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function get(req, res) {
  const id = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM buildings WHERE building_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function create(req, res) {
  const { building_name, building_gender, address, descriptions } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO buildings (building_name, building_gender, address, descriptions) VALUES (?, ?, ?, ?)',
      [building_name, building_gender, address, descriptions]
    );
    res.status(201).json({ building_id: result.insertId, building_name, building_gender, address, descriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function update(req, res) {
  const id = req.params.id;
  const { building_name, building_gender, address, descriptions } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE buildings SET building_name = ?, building_gender = ?, address = ?, descriptions = ? WHERE building_id = ?',
      [building_name, building_gender, address, descriptions, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ building_id: Number(id), building_name, building_gender, address, descriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function remove(req, res) {
  const id = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM buildings WHERE building_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

export default { list, get, create, update, remove };
