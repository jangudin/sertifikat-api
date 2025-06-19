const express = require('express');
const router = express.Router();

// Define certificate data validation
const validateCertificateData = (data) => {
    const errors = [];
    if (!data.name) errors.push('Name is required');
    if (!data.course) errors.push('Course is required');
    if (!data.organization) errors.push('Organization is required');
    return errors;
};

// Certificate routes
router.post('/generate-certificate', async (req, res) => {
    const certificateData = {
        name: req.body.name,
        course: req.body.course,
        organization: req.body.organization,
        date: req.body.date || new Date().toLocaleDateString('id-ID')
    };

    // Validate input
    const errors = validateCertificateData(certificateData);
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    try {
        const pdfPath = await generateCertificate(certificateData);
        res.json({
            success: true,
            message: 'Certificate generated successfully',
            filePath: pdfPath
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating certificate',
            error: error.message
        });
    }
});

module.exports = router;