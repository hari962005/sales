let consignments = [
  { id: '1', trackingId: 'TRK-1001', dealer: 'Alpha Dealership', status: 'In Transit', date: '2026-10-01' },
  { id: '2', trackingId: 'TRK-1002', dealer: 'Beta Motors', status: 'Delivered', date: '2026-10-02' }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(consignments);
  } else if (req.method === 'POST') {
    const newConsignment = { id: Date.now().toString(), ...req.body };
    consignments.push(newConsignment);
    res.status(201).json(newConsignment);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
