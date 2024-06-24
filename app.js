const express = require('express');
const connectDB = require('./db/mongoose')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));


app.use('/users', userRoutes);
app.use('/posts', postRoutes);








const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;










