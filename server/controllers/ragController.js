const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { 
    extractRulesFromPDF, 
    generateEmbedding, 
    answerWardenQuestion,
    checkAIStatus,
    generateHostelDescription
} = require('../services/aiservices');

const listingsCollection = () => getDB().collection('listings');
const pdfDocumentsCollection = () => getDB().collection('pdfDocuments');

// @desc    Get AI service status
// @route   GET /api/rag/status
const getStatus = async (req, res) => {
    try {
        const status = checkAIStatus();
        res.json({ success: true, data: status });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Upload PDF and extract rules
// @route   POST /api/rag/upload/:listingId
const uploadAndExtractRules = async (req, res) => {
    try {
        const { listingId } = req.params;
        
        if (!ObjectId.isValid(listingId)) {
            return res.status(400).json({ success: false, error: 'Invalid Listing ID' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No PDF file uploaded' });
        }

        const listing = await listingsCollection().findOne({ _id: new ObjectId(listingId) });
        if (!listing) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        // Store PDF document in database
        const pdfDoc = {
            listingId: new ObjectId(listingId),
            filename: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            data: req.file.buffer,
            uploadedAt: new Date()
        };
        
        // Upsert - replace if exists for this listing
        await pdfDocumentsCollection().updateOne(
            { listingId: new ObjectId(listingId) },
            { $set: pdfDoc },
            { upsert: true }
        );

        // Extract rules from PDF using AI
        const extractedRules = await extractRulesFromPDF(req.file.buffer);

        // Update listing with extracted rules
        await listingsCollection().findOneAndUpdate(
            { _id: new ObjectId(listingId) },
            { 
                $set: { 
                    rules: extractedRules,
                    rulesUpdatedAt: new Date(),
                    hasPdfRules: true
                } 
            }
        );

        res.json({ 
            success: true, 
            data: { 
                extractedRules: extractedRules.length,
                rules: extractedRules,
                pdfStored: true
            } 
        });
    } catch (error) {
        console.error('PDF extraction error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Index listing rules to vector DB
// @route   POST /api/rag/index/:listingId
const indexRules = async (req, res) => {
    try {
        const { listingId } = req.params;
        
        if (!ObjectId.isValid(listingId)) {
            return res.status(400).json({ success: false, error: 'Invalid Listing ID' });
        }

        const listing = await listingsCollection().findOne({ _id: new ObjectId(listingId) });
        if (!listing) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        if (!listing.rules || listing.rules.length === 0) {
            return res.status(400).json({ success: false, error: 'No rules to index' });
        }

        const { Pinecone } = require('@pinecone-database/pinecone');
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const index = pinecone.index(process.env.PINECONE_INDEX);

        // Create vectors for each rule
        const vectors = [];
        for (const rule of listing.rules) {
            const text = `${rule.title}: ${rule.description}. ${rule.clause || ''}`;
            const embedding = await generateEmbedding(text);
            
            vectors.push({
                id: `${listingId}-${rule.id || vectors.length}`,
                values: embedding,
                metadata: {
                    type: 'hostel-rule',
                    listingId: listingId,
                    listingName: listing.name,
                    ruleTitle: rule.title,
                    ruleDescription: rule.description,
                    clause: rule.clause || '',
                    text: text
                }
            });
        }

        console.log(`Attempting to index ${vectors.length} rule vectors with ${vectors[0].values.length} dimensions each`);

        try {
            // Upsert to Pinecone
            await index.upsert(vectors);

            // Mark listing as indexed
            await listingsCollection().findOneAndUpdate(
                { _id: new ObjectId(listingId) },
                { $set: { rulesIndexed: true, indexedAt: new Date() } }
            );

            res.json({ 
                success: true, 
                data: { 
                    rulesIndexed: vectors.length,
                    dimensions: vectors[0].values.length,
                    message: `Successfully indexed ${vectors.length} rules`
                } 
            });
        } catch (pineconeError) {
            console.error('Pinecone indexing failed:', pineconeError);
            
            if (pineconeError.message && pineconeError.message.includes('dimension')) {
                const currentDimensions = vectors[0].values.length;
                return res.status(400).json({ 
                    success: false, 
                    error: "DIMENSION_MISMATCH",
                    message: `Vector dimension mismatch: Generated embeddings have ${currentDimensions} dimensions, but your Pinecone index expects 3072 dimensions.
                    
Solutions:
1. Recreate your Pinecone index with dimension ${currentDimensions} (recommended)
2. Or use a different embedding model that produces 3072 dimensions

Current model: text-embedding-004 (${currentDimensions}D)
Your index expects: 3072D

To fix this:
- Go to your Pinecone dashboard
- Delete the current index
- Create a new index with dimension ${currentDimensions}
- Try indexing again`,
                    currentDimensions,
                    expectedDimensions: 3072
                });
            }
            
            return res.status(500).json({ success: false, error: pineconeError.message });
        }
    } catch (error) {
        console.error('Indexing error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Ask Warden Bot a question
// @route   POST /api/rag/ask
const askWardenBot = async (req, res) => {
    try {
        const { question, listingId, history } = req.body;

        if (!question) {
            return res.status(400).json({ success: false, error: 'Question is required' });
        }

        let listingContext = null;
        if (listingId && ObjectId.isValid(listingId)) {
            listingContext = await listingsCollection().findOne({ _id: new ObjectId(listingId) });
        }

        const answer = await answerWardenQuestion(question, listingId, listingContext, history);

        res.json({ success: true, data: { answer } });
    } catch (error) {
        console.error('Warden Bot error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Generate hostel description using AI
// @route   POST /api/rag/generate-description
const generateDescription = async (req, res) => {
    try {
        const { 
            name, 
            location, 
            city, 
            hostelType, 
            vibe, 
            amenities, 
            curfew, 
            guests, 
            pets, 
            cooking,
            roomTypes,
            rent 
        } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Hostel name is required' });
        }

        const description = await generateHostelDescription({
            name,
            location,
            city,
            hostelType,
            vibe,
            amenities,
            curfew,
            guests,
            pets,
            cooking,
            roomTypes,
            rent
        });

        res.json({ success: true, data: { description } });
    } catch (error) {
        console.error('Description generation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getStatus,
    uploadAndExtractRules,
    indexRules,
    askWardenBot,
    generateDescription
};
