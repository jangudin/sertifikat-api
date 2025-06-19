const apiKeyAuth = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    const validApiKey = process.env.API_KEY || 'your-secret-api-key';

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is missing'
        });
    }

    if (apiKey !== validApiKey) {
        return res.status(401).json({
            success: false,
            message: 'Invalid API key'
        });
    }

    next();
};

module.exports = apiKeyAuth;
