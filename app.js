const express = require('express');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
const mongoose = require('mongoose');
const cors = require('cors');
const createError = require('http-errors');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

// Enable CORS
app.use(cors());

// Connect to MongoDB
const uri = process.env.MONGO_URL;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(`Error connecting to MongoDB at ${uri}: ${error.message}. Please check your connection string.`);
});

// Middleware to parse the request body
app.use(express.json());

// Use the routes
app.use('/products', productRoute);
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/carts', cartRoute);
app.use('/orders', orderRoute);
app.use('*', (req, res) => {
    throw new createError.NotFound("Route does not exist");
});
app.use(errorHandler);

// Listen to a port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});