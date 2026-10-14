let complaints = [
  { id: '1', customer: 'Alice Johnson', issue: 'Late delivery', status: 'Open', priority: 'High' },
  { id: '2', customer: 'Bob Smith', issue: 'Damaged item', status: 'Resolved', priority: 'Medium' }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(complaints);
  } else if (req.method === 'POST') {
    const newComplaint = { id: Date.now().toString(), ...req.body };
    complaints.push(newComplaint);
    res.status(201).json(newComplaint);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
