let dealers = [
  { id: '1', name: 'Alpha Dealership', contact: 'John Doe', location: 'New York', status: 'Active' },
  { id: '2', name: 'Beta Motors', contact: 'Jane Smith', location: 'Los Angeles', status: 'Inactive' }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(dealers);
  } else if (req.method === 'POST') {
    const newDealer = { id: Date.now().toString(), ...req.body };
    dealers.push(newDealer);
    res.status(201).json(newDealer);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
