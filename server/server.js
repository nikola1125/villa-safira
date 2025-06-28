require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Review Model
const reviewSchema = new mongoose.Schema({
    name: {type: String, required: true},
    country: {type: String, required: true},
    comment: {type: String, required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    date: {type: Date, default: Date.now}
});
const Review = mongoose.model('Review', reviewSchema);

// Routes
app.post('/api/reviews', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({date: -1});
        res.json(reviews);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
//
// const app = express();
//
// // Security Middleware
// app.use(helmet());
// app.use(express.json({limit: '10kb'}));
//
// // Enhanced CORS Configuration
// const corsOptions = {
//     origin: process.env.NODE_ENV === 'production'
//         ? ['https://your-frontend-domain.com']
//         : ['http://localhost:3000'],
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type']
// };
// app.use(cors(corsOptions));
//
// // Rate Limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use('/api', limiter);
//
// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB connection error:', err));
//
// // Review Model (unchanged)
// const reviewSchema = new mongoose.Schema({
//     name: {type: String, required: true},
//     country: {type: String, required: true},
//     comment: {type: String, required: true},
//     rating: {type: Number, required: true, min: 1, max: 5},
//     date: {type: Date, default: Date.now}
// });
// const Review = mongoose.model('Review', reviewSchema);
//
// // Enhanced Routes
// app.post('/api/reviews', async (req, res) => {
//     try {
//         // Input validation
//         if (!req.body.name || !req.body.country || !req.body.comment || !req.body.rating) {
//             return res.status(400).json({error: 'Missing required fields'});
//         }
//
//         const review = new Review(req.body);
//         await review.save();
//         res.status(201).json(review);
//     } catch (err) {
//         res.status(400).json({error: err.message});
//     }
// });
//
// app.get('/api/reviews', async (req, res) => {
//     try {
//         const reviews = await Review.find().sort({date: -1});
//         res.json(reviews);
//     } catch (err) {
//         res.status(500).json({error: err.message});
//     }
// });
//
// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({error: 'Something went wrong!'});
// });
//
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));