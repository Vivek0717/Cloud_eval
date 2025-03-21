// Load Environment Variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve frontend files

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Schema
const FormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false }, // Optional
    address: { type: String, required: false }, // Optional
    message: { type: String, required: false } // Optional
});

const FormData = mongoose.model('FormData', FormSchema);

// POST Data (Write to Cloud)
app.post('/api/form', async (req, res) => {
    const { name, email, phone, address, message } = req.body;
    try {
        const newEntry = new FormData({ name, email, phone, address, message });
        await newEntry.save();
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Data (Read from Cloud)
app.get('/api/form', async (req, res) => {
    try {
        const data = await FormData.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
