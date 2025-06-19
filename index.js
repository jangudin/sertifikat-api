const express = require('express');
const bodyParser = require('body-parser');
const certificatesRouter = require('./src/certificates');

const app = express();
app.use(bodyParser.json());
app.use('/api/certificates', certificatesRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
