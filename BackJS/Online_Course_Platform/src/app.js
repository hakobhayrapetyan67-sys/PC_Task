const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ success: true, data: 'API is running' });
});

app.use('/api', require('./routes/index'));

app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Route not found'
    });
});

app.use(require('./middlewares/errorHandler'));

module.exports = app;