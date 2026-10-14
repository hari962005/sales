let auditLogs = [
  { id: '1', timestamp: '2026-10-05T09:00:00Z', user: 'Admin', action: 'User login', details: 'Successful login from IP 192.168.1.1' },
  { id: '2', timestamp: '2026-10-05T09:15:00Z', user: 'Admin', action: 'Update configuration', details: 'Changed system settings' }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(auditLogs);
  } else if (req.method === 'POST') {
    const newLog = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...req.body };
    auditLogs.push(newLog);
    res.status(201).json(newLog);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
