let logEntries = [
  { id: '1', date: '2026-10-01', entry: 'Site inspection completed.', author: 'John Doe' },
  { id: '2', date: '2026-10-02', entry: 'Inventory audit finished.', author: 'Jane Smith' }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(logEntries);
  } else if (req.method === 'POST') {
    const newEntry = { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], ...req.body };
    logEntries.push(newEntry);
    res.status(201).json(newEntry);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
