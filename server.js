const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();


connectDB();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST' ],
}));

app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});


app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
