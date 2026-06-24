const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const listingRoutes = require('./routes/listingRoutes');
const ragRoutes = require('./routes/ragRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// --------------------
// Create uploads folder if not exists
// --------------------
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

// --------------------
// Middleware
// --------------------
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------
// Routes
// --------------------
app.use('/api/listings', listingRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/complaints', complaintRoutes);

// --------------------
// Health check route
// --------------------
app.get('/', (req, res) => {
    res.json({
        message: 'DormDen API is running...',
        version: '1.0.0',
        endpoints: {
            listings: '/api/listings',
            rag: '/api/rag',
            complaints: '/api/complaints'
        }
    });
});

// --------------------
// Error handling middleware
// --------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Something went wrong!'
    });
});

// --------------------
// Connect DB (non-blocking) + Start server
// --------------------
connectDB()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

// IMPORTANT: Railway requires 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DormDen Server running on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}`);
});
