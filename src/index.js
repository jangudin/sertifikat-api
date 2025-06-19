const express = require('express');
const app = express();
const universalCertificate = require('./certificates/universalCertificateController');

// ...setup route dan middleware sesuai kebutuhan...

app.listen(3000, () => {
    console.log('Server running on port 3000');
});