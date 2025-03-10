const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({ 
    name: String, 
    email: String, 
    balance: Number, 
    invested: Number 
});
const User = mongoose.model('User', UserSchema);

// Register a new user
app.post('/register', async (req, res) => {
    const { name, email } = req.body;
    const user = new User({ name, email, balance: 0, invested: 0 });
    await user.save();
    res.json(user);
});

// Invest money
app.post('/invest', async (req, res) => {
    const { email, amount } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        user.invested += amount;
        user.balance += amount * 0.25; // Simulating daily returns
        await user.save();
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Get user data
app.get('/user/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
