let transactions = [
  { id: '1', date: '2026-10-01', description: 'Payment received', amount: 1200, type: 'Credit' },
  { id: '2', date: '2026-10-02', description: 'Office supplies', amount: 150, type: 'Debit' }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(transactions);
  } else if (req.method === 'POST') {
    const newTransaction = { id: Date.now().toString(), ...req.body };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
