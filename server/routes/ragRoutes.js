const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    getStatus,
    uploadAndExtractRules,
    indexRules,
    askWardenBot,
    generateDescription
} = require('../controllers/ragController');

// Configure multer for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/status', getStatus);
router.post('/upload/:listingId', upload.single('document'), uploadAndExtractRules);
router.post('/index/:listingId', indexRules);
router.post('/ask', askWardenBot);
router.post('/generate-description', generateDescription);

module.exports = router;
