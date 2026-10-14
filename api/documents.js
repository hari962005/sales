let documents = [
  { id: '1', title: 'Q3 Sales Report', type: 'PDF', uploadDate: '2026-09-30', size: '2.4 MB' },
  { id: '2', title: 'Dealer Agreement 2026', type: 'DOCX', uploadDate: '2026-10-01', size: '1.1 MB' }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(documents);
  } else if (req.method === 'POST') {
    const newDoc = { id: Date.now().toString(), uploadDate: new Date().toISOString().split('T')[0], ...req.body };
    documents.push(newDoc);
    res.status(201).json(newDoc);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
