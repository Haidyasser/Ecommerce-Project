const express = require('express');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const httpStatus = require('./utilities/httpStatus');
const dotenv = require('dotenv');
dotenv.config();

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
}
).catch((error) => {
    console.log('Error: ', error.message);
});

// Middleware to parse the request body
app.use(express.json());

// Use the routes
app.use('/products', productRoute);
app.use('/users', userRoute);
app.all('*', (req, res) => {
    res.status(httpStatus.NOT_FOUND)
    .json({status: httpStatus.FAIL, message: 'Resource not found'});
});

// Listen to a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});