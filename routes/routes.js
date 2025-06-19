const express = require('express');
const router = express.Router();
const { generateCertificate } = require('../controllers/certificateController');
const apiKeyAuth = require('../src/middleware/apiKeyAuth');

router.post('/generate-certificate', apiKeyAuth, generateCertificate);

module.exports = router;