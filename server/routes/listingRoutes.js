const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    addReview,
    updateRules,
    semanticSearch,
    indexLocations
} = require('../controllers/listingController');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Configure upload fields
const uploadFields = upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
]);

router.route('/')
    .get(getListings)
    .post(uploadFields, createListing);

// Semantic search routes
router.post('/search/semantic', semanticSearch);
router.post('/index/locations', indexLocations);

router.route('/:id')
    .get(getListingById)
    .put(updateListing)
    .delete(deleteListing);

router.post('/:id/reviews', addReview);
router.put('/:id/rules', updateRules);

module.exports = router;
