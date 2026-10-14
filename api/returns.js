let returns = [
  { id: '1', orderId: 'ORD-501', reason: 'Defective product', status: 'Processing', amount: 150 },
  { id: '2', orderId: 'ORD-502', reason: 'Wrong item shipped', status: 'Completed', amount: 80 }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(returns);
  } else if (req.method === 'POST') {
    const newReturn = { id: Date.now().toString(), ...req.body };
    returns.push(newReturn);
    res.status(201).json(newReturn);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
