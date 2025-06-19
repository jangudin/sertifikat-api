const express = require('express');
const router = express.Router();
const universalCertificateController = require('./universalCertificateController');

// Endpoint universal untuk semua lembaga
router.post('/generate', universalCertificateController.generateUniversalCertificate);

module.exports = router;