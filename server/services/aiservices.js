require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiApiKey = process.env.GEMINI_API_KEY;
const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeIndexName = process.env.PINECONE_INDEX;

let genAI = null;
let pinecone = null;
let index = null;

// Initialize AI services
if (geminiApiKey) {
    genAI = new GoogleGenerativeAI(geminiApiKey);
} else {
    console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will be limited.");
}

if (pineconeApiKey && pineconeIndexName) {
    const { Pinecone } = require("@pinecone-database/pinecone");
    pinecone = new Pinecone({ apiKey: pineconeApiKey });
    index = pinecone.index(pineconeIndexName);
} else {
    console.warn("WARNING: PINECONE_API_KEY or PINECONE_INDEX is not defined. Vector search will be unavailable.");
}

/**
 * Check AI service status
 */
function checkAIStatus() {
    return {
        gemini: !!geminiApiKey,
        pinecone: !!(pineconeApiKey && pineconeIndexName)
    };
}

/**
 * Helper function to retry API calls with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 5000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (error.status === 429 && i < maxRetries - 1) {
                const delay = initialDelay * Math.pow(2, i);
                console.log(`Rate limited. Retrying in ${delay/1000}s... (attempt ${i + 2}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
    throw lastError;
}

/**
 * Generate embedding for text
 * Using text-embedding-004 which produces 768-dimensional vectors
 * If your Pinecone index is configured for 3072 dimensions, you need to either:
 * 1. Recreate the Pinecone index with dimension 768, or
 * 2. Use a different embedding model that produces 3072 dimensions
 */
async function generateEmbedding(text) {
    if (!genAI) throw new Error("Gemini API not configured");
    
    try {
        // Using text-embedding-004 which produces 768-dimensional vectors
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        
        const embedding = result.embedding.values;
        console.log(`Generated embedding with ${embedding.length} dimensions`);
        
        return embedding;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}

/**
 * Extract rules from PDF using AI (with fallback to basic extraction)
 */
async function extractRulesFromPDF(pdfBuffer) {
    // Convert buffer to base64
    const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    
    console.log("PDF buffer size:", buffer.length, "bytes");

    // Try AI extraction first, fallback to basic extraction if quota exceeded
    if (genAI) {
        try {
            const base64Data = buffer.toString('base64');

            const prompt = `
                You are an expert at extracting structured information from hostel/PG house rules documents.
                
                Analyze the PDF document and extract all rules.
                For each rule, provide:
                - title: A short title for the rule
                - description: The full description of the rule
                - clause: The clause reference if mentioned (e.g., "House Rules - Clause 4")
                
                Return ONLY a JSON array of rules. Example format:
                [
                    {
                        "id": "r1",
                        "title": "Gate Timing",
                        "description": "Main gate closes at 10:30 PM. Late entry requires prior approval.",
                        "clause": "House Rules – Clause 4"
                    }
                ]
                
                Do not include markdown formatting like \`\`\`json.
            `;

            const response = await retryWithBackoff(async () => {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const result = await model.generateContent([
                    {
                        inlineData: {
                            mimeType: "application/pdf",
                            data: base64Data
                        }
                    },
                    { text: prompt }
                ]);
                return await result.response;
            });
            
            const text = response.text().replace(/```json|```/g, '').trim();
            console.log("AI response:", text.substring(0, 200));
            
            const rules = JSON.parse(text);
            
            return rules.map((rule, idx) => ({
                ...rule,
                id: rule.id || `r${idx + 1}`
            }));
        } catch (error) {
            // If quota exceeded (429) or invalid PDF (400), fall back to basic extraction
            if (error.status === 429 || error.status === 400) {
                console.log(`AI error (${error.status}), using basic PDF extraction...`);
                return await extractRulesBasic(buffer);
            }
            throw error;
        }
    } else {
        // No AI configured, use basic extraction
        return await extractRulesBasic(buffer);
    }
}

/**
 * Basic PDF text extraction without AI (fallback)
 */
async function extractRulesBasic(pdfBuffer) {
    try {
        // Try pdf-parse first
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(pdfBuffer);
        const text = pdfData.text;
        
        console.log("Basic extraction - PDF text length:", text.length);
        
        return parseTextToRules(text);
    } catch (error) {
        console.log("pdf-parse failed, trying manual extraction...");
        
        // Fallback: Try to extract text directly from buffer
        const text = pdfBuffer.toString('utf8');
        
        // Look for readable text patterns in the buffer
        const readableText = text.match(/[\x20-\x7E\n\r]+/g);
        if (readableText && readableText.length > 0) {
            const combinedText = readableText
                .filter(t => t.trim().length > 10)
                .join(' ');
            
            if (combinedText.length > 50) {
                console.log("Extracted text from buffer, length:", combinedText.length);
                return parseTextToRules(combinedText);
            }
        }
        
        // If all else fails, return placeholder rules
        console.log("Could not extract text, returning placeholder rules");
        return [
            {
                id: 'r1',
                title: 'PDF Uploaded',
                description: 'PDF document was uploaded successfully. AI extraction will process rules when quota is available.',
                clause: 'Pending AI Processing'
            }
        ];
    }
}

/**
 * Parse text into rules structure
 */
function parseTextToRules(text) {
    const rules = [];
    const lines = text.split(/[\n\r]+/).filter(line => line.trim());
    
    let currentRule = null;
    let ruleCount = 0;
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Look for numbered items, bullet points, or capitalized headers
        const isHeader = /^(\d+[\.\)]\s*|•\s*|[-–]\s*|[A-Z][A-Z\s]+:)/.test(trimmed);
        
        if (isHeader && trimmed.length > 5) {
            if (currentRule) {
                rules.push(currentRule);
            }
            ruleCount++;
            currentRule = {
                id: `r${ruleCount}`,
                title: trimmed.replace(/^(\d+[\.\)]\s*|•\s*|[-–]\s*)/, '').substring(0, 50),
                description: trimmed,
                clause: `Extracted Rule ${ruleCount}`
            };
        } else if (currentRule && trimmed.length > 10) {
            currentRule.description += ' ' + trimmed;
        }
    }
    
    if (currentRule) {
        rules.push(currentRule);
    }
    
    // If no rules found, create a single rule with all text
    if (rules.length === 0 && text.length > 0) {
        rules.push({
            id: 'r1',
            title: 'House Rules',
            description: text.substring(0, 5.00).trim(),
            clause: 'Full Document'
        });
    }
    
    console.log(`Parsed ${rules.length} rules from text`);
    return rules;
}

/**
 * Answer Warden Bot questions using RAG
 */
async function answerWardenQuestion(question, listingId, listingContext, history = []) {
    try {
        let contextText = '';
        
        // Add listing-specific context if available
        if (listingContext) {
            console.log("Adding listing context for:", listingContext.name);
            const listingInfo = `
                Hostel: ${listingContext.name}
                Location: ${listingContext.location}, ${listingContext.city}
                Curfew: ${listingContext.highlights?.curfew || 'Not specified'}
                Guests Allowed: ${listingContext.highlights?.guests ? 'Yes' : 'No'}
                Pets Allowed: ${listingContext.highlights?.pets ? 'Yes' : 'No'}
                Self Cooking: ${listingContext.highlights?.cooking ? 'Yes' : 'No'}
                Amenities: ${listingContext.amenities?.join(', ') || 'Not specified'}
                Hidden Costs: ${listingContext.hiddenCosts && listingContext.hiddenCosts.length > 0 ? listingContext.hiddenCosts.join(', ') : 'None mentioned'}
            `;
            contextText = listingInfo;
            
            // Add rules from listing if available
            if (listingContext.rules && listingContext.rules.length > 0) {
                const rulesText = listingContext.rules.map(r => 
                    `${r.title}: ${r.description}`
                ).join("\n");
                contextText += "\n\nHouse Rules:\n" + rulesText;
            }
        }

        // Try AI first, fallback to rule-based responses
        if (genAI) {
            try {
                console.log("Attempting AI response...");
                
                const prompt = `
                    You are the Warden Bot for DormDen, a helpful assistant that answers questions about hostel/PG rules and policies.
                    
                    Be friendly, helpful, and concise. If you don't have specific information, provide general guidance about typical hostel policies.
                    
                    ${contextText ? `Context about this hostel:\n${contextText}\n\n` : ''}
                    
                    User Question: ${question}
                    
                    Provide a helpful answer:
                `;

                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const result = await model.generateContent(prompt);
                const response = await result.response;

                console.log("AI response generated successfully");
                return response.text();
            } catch (aiError) {
                console.log("AI failed, using fallback response:", aiError.message);
                // Fall through to rule-based response
            }
        }

        // Fallback: Rule-based responses
        console.log("Using rule-based response");
        return generateRuleBasedResponse(question, listingContext);

    } catch (error) {
        console.error("Error answering warden question:", error);
        return generateRuleBasedResponse(question, listingContext);
    }
}

/**
 * Generate rule-based responses when AI is not available
 */
function generateRuleBasedResponse(question, listingContext) {
    const q = question.toLowerCase();
    
    // Curfew questions
    if (q.includes('curfew') || q.includes('time') || q.includes('gate')) {
        if (listingContext?.highlights?.curfew) {
            return `The curfew time for ${listingContext.name} is ${listingContext.highlights.curfew}. Please make sure to return before this time to avoid any inconvenience.`;
        }
        return "Curfew times vary by hostel. Please check with the hostel management for specific timing. Generally, most hostels have curfew between 10 PM to 11 PM.";
    }
    
    // Pet questions (check before guest questions to avoid conflicts)
    if (q.includes('pet') || q.includes('dog') || q.includes('cat') || q.includes('animal') || q.includes('pet-friendly') || q.includes('eco') || q.includes('ecofriendly')) {
        if (listingContext?.highlights?.pets !== undefined) {
            const allowed = listingContext.highlights.pets;
            return allowed 
                ? `Yes, pets are allowed at ${listingContext.name}. Please ensure your pet is well-behaved and doesn't disturb other residents.`
                : `Sorry, pets are not allowed at ${listingContext.name}. This policy helps maintain cleanliness and comfort for all residents.`;
        }
        return "Pet policies vary by hostel. Many hostels don't allow pets due to hygiene and allergy concerns. Please check with the hostel management for specific pet policies.";
    }
    
    // Guest questions
    if (q.includes('guest') || q.includes('visitor') || q.includes('friend')) {
        if (listingContext?.highlights?.guests !== undefined) {
            const allowed = listingContext.highlights.guests;
            return allowed 
                ? `Yes, guests are allowed at ${listingContext.name}. Please check with management for any specific guest policies or timing restrictions.`
                : `Sorry, guests are not allowed at ${listingContext.name}. This policy helps maintain security and privacy for all residents.`;
        }
        return "Guest policies vary by hostel. Some allow guests during specific hours while others may have restrictions. Please check with the hostel management.";
    }
    
    // Cooking questions
    if (q.includes('cook') || q.includes('kitchen') || q.includes('food') || q.includes('meal')) {
        if (listingContext?.highlights?.cooking !== undefined) {
            const allowed = listingContext.highlights.cooking;
            return allowed 
                ? `Yes, self-cooking is allowed at ${listingContext.name}. You can use the kitchen facilities to prepare your meals.`
                : `Self-cooking is not allowed at ${listingContext.name}. However, meals are typically provided or there may be a mess facility available.`;
        }
        return "Cooking policies vary by hostel. Some provide kitchen facilities while others have mess services. Please check with the hostel management.";
    }
    
    // Amenities questions
    if (q.includes('wifi') || q.includes('internet') || q.includes('gym') || q.includes('laundry') || q.includes('amenities')) {
        if (listingContext?.amenities && listingContext.amenities.length > 0) {
            return `${listingContext.name} offers the following amenities: ${listingContext.amenities.join(', ')}. These facilities are available for all residents.`;
        }
        return "Amenities vary by hostel. Common amenities include WiFi, laundry, security, and common areas. Please check the hostel details for specific amenities.";
    }
    
    // Hidden costs questions
    if (q.includes('hidden') || q.includes('extra') || q.includes('additional') || q.includes('cost') || q.includes('charge') || q.includes('fee') || q.includes('electricity') || q.includes('maintenance') || q.includes('deposit')) {
        if (listingContext?.hiddenCosts && listingContext.hiddenCosts.length > 0) {
            const costs = listingContext.hiddenCosts.map(cost => `• ${cost}`).join('\n');
            return `Here are the additional costs for ${listingContext.name}:\n\n${costs}\n\nPlease factor these into your budget when considering this hostel. It's always recommended to clarify all charges with the management before booking.`;
        }
        return `Great news! ${listingContext ? listingContext.name + ' has' : 'This hostel has'} no hidden costs mentioned. The rent price should cover most basic amenities, but it's always good to confirm with management about electricity, water, and maintenance charges.`;
    }
    
    // Rules questions
    if (q.includes('rule') || q.includes('policy') || q.includes('regulation')) {
        if (listingContext?.rules && listingContext.rules.length > 0) {
            const rules = listingContext.rules.slice(0, 3).map(r => `• ${r.title}: ${r.description}`).join('\n');
            return `Here are some key rules for ${listingContext.name}:\n\n${rules}\n\nFor complete rules, please refer to the hostel handbook or contact management.`;
        }
        return "Every hostel has specific rules for the safety and comfort of all residents. Common rules include maintaining cleanliness, respecting quiet hours, and following security protocols. Please check with the hostel management for detailed rules.";
    }
    
    // Default response
    if (listingContext) {
        return `Hi! I'm here to help with questions about ${listingContext.name}. You can ask me about curfew times, guest policies, amenities, cooking facilities, or any other hostel rules. What would you like to know?`;
    }
    
    return "Hi! I'm the Warden Bot. I can help you with questions about hostel rules, policies, curfew times, guest policies, and amenities. Please select a specific hostel to get detailed information, or ask me general questions about PG living!";
}

/**
 * Generate hostel description using AI
 */
async function generateHostelDescription(hostelData) {
    if (!genAI) throw new Error("Gemini API not configured");
    
    const { 
        name, 
        location, 
        city, 
        hostelType, 
        vibe, 
        amenities = [], 
        curfew, 
        guests, 
        pets, 
        cooking,
        roomTypes = [],
        rent 
    } = hostelData;
    
    const hostelTypeText = hostelType === 'boys' ? 'Boys Hostel' : hostelType === 'girls' ? 'Girls Hostel' : 'Co-ed Hostel';
    const vibeText = vibe === 'chill' ? 'relaxed and chill' : vibe === 'academic' ? 'study-focused and academic' : 'vibrant and social';
    
    const highlights = [];
    if (curfew && curfew !== 'No Curfew') highlights.push(`Curfew at ${curfew}`);
    if (curfew === 'No Curfew') highlights.push('No curfew restrictions');
    if (guests) highlights.push('Guests allowed');
    if (pets) highlights.push('Pet-friendly');
    if (cooking) highlights.push('Self-cooking facilities');
    
    const roomTypesText = roomTypes.length > 0 
        ? roomTypes.map(rt => rt.type).filter(Boolean).join(', ')
        : 'Various room options';
    
    const prompt = `
        You are an expert at writing compelling, professional hostel/PG descriptions for a real estate listing platform.
        
        Write an engaging, SEO-friendly description (150-200 words) for this hostel:
        
        Name: ${name}
        Location: ${location || 'Prime location'}${city ? `, ${city}` : ''}
        Type: ${hostelTypeText}
        Vibe: ${vibeText}
        Starting Rent: ₹${rent || 'Affordable'}/month
        Room Types: ${roomTypesText}
        Amenities: ${amenities.length > 0 ? amenities.join(', ') : 'Modern amenities'}
        Highlights: ${highlights.length > 0 ? highlights.join(', ') : 'Comfortable living'}
        
        Guidelines:
        - Start with an attention-grabbing opening line
        - Highlight the unique selling points
        - Mention the vibe and atmosphere
        - Include key amenities naturally
        - End with a call-to-action
        - Use a warm, welcoming tone
        - Make it sound professional yet friendly
        - Don't use generic phrases like "Welcome to" at the start
        
        Write ONLY the description, no headers or labels.
    `;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error generating description:", error);
        throw new Error("Failed to generate description. Please try again.");
    }
}

/**
 * Index listing location data for semantic search
 */
async function indexListingLocations(listings) {
    if (!index) {
        console.log("Pinecone not configured, skipping location indexing");
        return { success: false, message: "Vector database not configured" };
    }

    try {
        const vectors = [];
        
        for (const listing of listings) {
            // Create comprehensive location text for better semantic matching
            const locationText = `
                ${listing.name} 
                ${listing.location} 
                ${listing.city}
                ${listing.amenities?.join(' ') || ''}
                ${listing.vibe} hostel PG accommodation
                near ${listing.location} in ${listing.city}
            `.trim();

            if (genAI) {
                try {
                    const embedding = await generateEmbedding(locationText);
                    
                    vectors.push({
                        id: `location-${listing._id || listing.id}`,
                        values: embedding,
                        metadata: {
                            type: 'hostel-location',
                            listingId: listing._id || listing.id,
                            name: listing.name,
                            location: listing.location,
                            city: listing.city,
                            rent: listing.rent,
                            vibe: listing.vibe,
                            amenities: listing.amenities ? listing.amenities.join(', ') : '',
                            curfew: listing.highlights?.curfew || '',
                            guests: listing.highlights?.guests ? 'allowed' : 'not-allowed',
                            pets: listing.highlights?.pets ? 'allowed' : 'not-allowed',
                            cooking: listing.highlights?.cooking ? 'allowed' : 'not-allowed',
                            text: locationText
                        }
                    });
                } catch (embeddingError) {
                    console.log(`Failed to generate embedding for ${listing.name}:`, embeddingError.message);
                }
            }
        }

        if (vectors.length > 0) {
            try {
                console.log(`Attempting to upsert ${vectors.length} vectors with ${vectors[0].values.length} dimensions each`);
                
                // Upsert to Pinecone
                await index.upsert(vectors);
                console.log(`Successfully indexed ${vectors.length} location vectors`);
                return { 
                    success: true, 
                    indexed: vectors.length,
                    dimensions: vectors[0].values.length,
                    message: `Successfully indexed ${vectors.length} listings`
                };
            } catch (pineconeError) {
                console.error("Pinecone indexing failed:", pineconeError);
                
                if (pineconeError.message && pineconeError.message.includes('dimension')) {
                    const currentDimensions = vectors[0].values.length;
                    return { 
                        success: false, 
                        error: "DIMENSION_MISMATCH",
                        message: `Vector dimension mismatch: Generated embeddings have ${currentDimensions} dimensions, but your Pinecone index expects 3072 dimensions. 
                        
Solutions:
1. Recreate your Pinecone index with dimension ${currentDimensions} (recommended)
2. Or use a different embedding model that produces 3072 dimensions

Current model: text-embedding-004 (${currentDimensions}D)
Your index expects: 3072D`,
                        currentDimensions,
                        expectedDimensions: 3072
                    };
                }
                return { success: false, error: pineconeError.message };
            }
        } else {
            return { success: false, message: "No vectors generated - check if Gemini API is working" };
        }
    } catch (error) {
        console.error('Location indexing error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Simple in-memory semantic search using text similarity
 */
function simpleSemanticSearch(query, listings, limit = 10) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    const scoredListings = listings.map(listing => {
        const searchText = `
            ${listing.name} 
            ${listing.location} 
            ${listing.city}
            ${listing.amenities?.join(' ') || ''}
            ${listing.vibe}
        `.toLowerCase();
        
        let score = 0;
        
        // Exact phrase match (highest score)
        if (searchText.includes(queryLower)) {
            score += 100;
        }
        
        // Word matches
        queryWords.forEach(word => {
            if (searchText.includes(word)) {
                score += 10;
            }
        });
        
        // Location-specific bonuses
        if (queryWords.some(word => 
            ['near', 'close', 'around', 'vicinity', 'area'].includes(word)
        )) {
            if (listing.location.toLowerCase().includes(queryLower.replace(/near|close|around|vicinity|area/g, '').trim())) {
                score += 50;
            }
        }
        
        // City matches get higher score
        if (listing.city.toLowerCase().includes(queryLower)) {
            score += 30;
        }
        
        // Location matches
        if (listing.location.toLowerCase().includes(queryLower)) {
            score += 40;
        }
        
        return {
            ...listing,
            semanticScore: score / 100,
            relevance: Math.min(Math.round(score), 100)
        };
    });
    
    // Filter and sort by score
    const results = scoredListings
        .filter(listing => listing.semanticScore > 0)
        .sort((a, b) => b.semanticScore - a.semanticScore)
        .slice(0, limit);
    
    return {
        success: true,
        results: results.map(r => ({
            listingId: r._id || r.id,
            name: r.name,
            location: r.location,
            city: r.city,
            rent: r.rent,
            vibe: r.vibe,
            amenities: r.amenities,
            highlights: r.highlights,
            score: r.semanticScore,
            relevance: r.relevance
        })),
        count: results.length,
        fallback: true
    };
}

/**
 * Enhanced semantic search with fallback
 */
async function searchHostelsByLocation(query, limit = 10, listings = null) {
    // Try Pinecone first if available
    if (index && genAI) {
        try {
            const queryEmbedding = await generateEmbedding(query);
            
            const searchResults = await index.query({
                vector: queryEmbedding,
                topK: limit,
                includeMetadata: true,
                filter: { type: 'hostel-location' }
            });

            const results = searchResults.matches?.map(match => ({
                listingId: match.metadata.listingId,
                name: match.metadata.name,
                location: match.metadata.location,
                city: match.metadata.city,
                rent: match.metadata.rent,
                vibe: match.metadata.vibe,
                amenities: match.metadata.amenities ? match.metadata.amenities.split(', ') : [],
                highlights: {
                    curfew: match.metadata.curfew,
                    guests: match.metadata.guests === 'allowed',
                    pets: match.metadata.pets === 'allowed',
                    cooking: match.metadata.cooking === 'allowed'
                },
                score: match.score,
                relevance: Math.round(match.score * 100)
            })) || [];

            return { success: true, results, count: results.length, semantic: true };
        } catch (error) {
            console.log('Pinecone search failed, using fallback:', error.message);
        }
    }
    
    // Fallback to simple semantic search
    if (listings) {
        return simpleSemanticSearch(query, listings, limit);
    }
    
    return { success: false, message: "No search method available" };
}

module.exports = {
    checkAIStatus,
    generateEmbedding,
    extractRulesFromPDF,
    answerWardenQuestion,
    generateHostelDescription,
    indexListingLocations,
    searchHostelsByLocation
};
