/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */



const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/data', (req: any, res: { json: (arg0: { message: string; }) => void; }) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
