const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { indexListingLocations, searchHostelsByLocation } = require('../services/aiservices');

const collectionName = 'listings';

// Helper to get collection
const getCollection = () => getDB().collection(collectionName);

// @desc    Fetch all listings
// @route   GET /api/listings
const getListings = async (req, res) => {
    try {
        const { search, city, vibe, minRent, maxRent } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        if (city) {
            query.city = city;
        }

        if (vibe) {
            query.vibe = vibe;
        }

        if (minRent || maxRent) {
            query.rent = {};
            if (minRent) query.rent.$gte = parseInt(minRent);
            if (maxRent) query.rent.$lte = parseInt(maxRent);
        }

        const listings = await getCollection().find(query).toArray();
        res.json({ success: true, data: listings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Fetch single listing
// @route   GET /api/listings/:id
const getListingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid Listing ID' });
        }

        const listing = await getCollection().findOne({ _id: new ObjectId(id) });

        if (!listing) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        res.json({ success: true, data: listing });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create a listing
// @route   POST /api/listings
const createListing = async (req, res) => {
    try {
        // Handle both JSON and FormData requests
        let data;
        
        if (req.is('multipart/form-data')) {
            // FormData request with file uploads
            data = {
                name: req.body.name,
                location: req.body.location,
                city: req.body.city,
                pincode: req.body.pincode,
                rent: Number(req.body.rent),
                hostelType: req.body.hostelType || 'boys',
                vibe: req.body.vibe || 'chill',
                vibeScore: Number(req.body.vibeScore) || 80,
                amenities: JSON.parse(req.body.amenities || '[]'),
                roomTypes: JSON.parse(req.body.roomTypes || '[]'),
                highlights: JSON.parse(req.body.highlights || '{}'),
                hiddenCosts: JSON.parse(req.body.hiddenCosts || '[]'),
                vibeAnalysis: JSON.parse(req.body.vibeAnalysis || '{}'),
                security: req.body.security || '',
                medication: req.body.medication || '',
                hostelDescription: req.body.hostelDescription || ''
            };
            
            // Handle uploaded files
            if (req.files) {
                if (req.files.mainImage && req.files.mainImage[0]) {
                    // Store the file path for the main image
                    data.image = `http://localhost:3001/uploads/${req.files.mainImage[0].filename}`;
                }
                
                if (req.files.additionalImages) {
                    data.images = req.files.additionalImages.map(file => 
                        `http://localhost:3001/uploads/${file.filename}`
                    );
                }
            }
        } else {
            // JSON request (backward compatibility)
            data = req.body;
        }

        // Basic Validation
        if (!data.name || !data.location || !data.city || !data.rent) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please fill in all required fields (name, location, city, rent)' 
            });
        }

        const newListing = {
            name: data.name,
            location: data.location,
            city: data.city,
            pincode: data.pincode || '',
            rent: Number(data.rent),
            hostelType: data.hostelType || 'boys',
            image: data.image || '',
            images: data.images || [],
            vibe: data.vibe || 'chill',
            vibeScore: Number(data.vibeScore) || 80,
            amenities: data.amenities || [],
            roomTypes: data.roomTypes || [],
            highlights: data.highlights || {
                curfew: 'No Curfew',
                guests: false,
                pets: false,
                cooking: false
            },
            hiddenCosts: data.hiddenCosts || [],
            vibeAnalysis: data.vibeAnalysis || { badge: '', description: '' },
            security: data.security || '',
            medication: data.medication || '',
            hostelDescription: data.hostelDescription || '',
            reviews: [],
            roommates: [],
            createdAt: new Date()
        };

        const result = await getCollection().insertOne(newListing);
        const createdListing = await getCollection().findOne({ _id: result.insertedId });

        res.status(201).json({ success: true, data: createdListing });
    } catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid Listing ID' });
        }

        const updates = { ...req.body };
        if (updates.rent) updates.rent = Number(updates.rent);
        if (updates.vibeScore) updates.vibeScore = Number(updates.vibeScore);
        delete updates._id;
        updates.updatedAt = new Date();

        const result = await getCollection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid Listing ID' });
        }

        const result = await getCollection().deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        res.json({ success: true, message: 'Listing removed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Add a review to a listing
// @route   POST /api/listings/:id/reviews
const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { author, avatar, rating, text, vibeTag } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid Listing ID' });
        }

        const review = {
            id: new ObjectId().toString(),
            author,
            avatar: avatar || '👤',
            rating: Number(rating),
            text,
            vibeTag: vibeTag || '',
            date: 'Just now'
        };

        const result = await getCollection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $push: { reviews: review } },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update rules for a listing (used after PDF extraction)
// @route   PUT /api/listings/:id/rules
const updateRules = async (req, res) => {
    try {
        const { id } = req.params;
        const { rules } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid Listing ID' });
        }

        const result = await getCollection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { rules, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Semantic search for hostels by location
// @route   POST /api/listings/search/semantic
const semanticSearch = async (req, res) => {
    try {
        const { query, limit = 10 } = req.body;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Search query is required' 
            });
        }

        // Get all listings for fallback search
        const allListings = await getCollection().find({}).toArray();

        // Perform semantic search with fallback
        const searchResult = await searchHostelsByLocation(query, limit, allListings);

        if (!searchResult.success) {
            // Final fallback to regular search
            const fallbackQuery = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { location: { $regex: query, $options: 'i' } },
                    { city: { $regex: query, $options: 'i' } }
                ]
            };

            const listings = await getCollection().find(fallbackQuery).limit(limit).toArray();
            
            return res.json({ 
                success: true, 
                data: listings,
                semantic: false,
                fallback: 'basic',
                message: 'Used basic text search'
            });
        }

        // Get full listing details for semantic search results
        const listingIds = searchResult.results.map(r => new ObjectId(r.listingId));
        const fullListings = await getCollection().find({ 
            _id: { $in: listingIds } 
        }).toArray();

        // Merge semantic search scores with full listing data
        const enrichedResults = fullListings.map(listing => {
            const searchMatch = searchResult.results.find(r => r.listingId === listing._id.toString());
            return {
                ...listing,
                semanticScore: searchMatch?.score || 0,
                relevance: searchMatch?.relevance || 0
            };
        });

        // Sort by semantic score (highest first)
        enrichedResults.sort((a, b) => b.semanticScore - a.semanticScore);

        res.json({ 
            success: true, 
            data: enrichedResults,
            semantic: searchResult.semantic || false,
            fallback: searchResult.fallback ? 'simple' : false,
            count: enrichedResults.length,
            query: query
        });

    } catch (error) {
        console.error('Semantic search error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Index all listings for semantic search
// @route   POST /api/listings/index/locations
const indexLocations = async (req, res) => {
    try {
        // Get all listings
        const listings = await getCollection().find({}).toArray();
        
        if (listings.length === 0) {
            return res.json({ 
                success: false, 
                message: 'No listings found to index' 
            });
        }

        console.log(`Starting to index ${listings.length} listings for semantic search...`);

        // Index locations
        const result = await indexListingLocations(listings);
        
        if (result.success) {
            res.json({ 
                success: true, 
                message: result.message || `Successfully indexed ${result.indexed} listings for semantic search`,
                indexed: result.indexed,
                total: listings.length,
                dimensions: result.dimensions
            });
        } else {
            // Handle dimension mismatch specifically
            if (result.error === "DIMENSION_MISMATCH") {
                return res.status(400).json({ 
                    success: false, 
                    error: result.error,
                    message: result.message,
                    currentDimensions: result.currentDimensions,
                    expectedDimensions: result.expectedDimensions,
                    solution: "Please recreate your Pinecone index with the correct dimensions"
                });
            }
            
            res.status(500).json({ 
                success: false, 
                error: result.message || result.error,
                details: result
            });
        }

    } catch (error) {
        console.error('Location indexing error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    addReview,
    updateRules,
    semanticSearch,
    indexLocations
};
