// /api/login.js
export default function handler(req, res) {
    const users = [
      { username: 'admin', password: '12345' } // Example user
    ];
    
    const { username, password } = req.body;
  
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      res.json({ success: true, message: 'Login successful', token: 'dummyToken' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  }
  