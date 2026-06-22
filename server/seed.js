const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'dormden';

const listings = [
    {
        name: "GreenNest PG",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60",
        images: [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60"
        ],
        rent: 8500,
        location: "Koramangala, 5th Block",
        city: "Bangalore",
        vibe: "chill",
        vibeScore: 85,
        amenities: ["WiFi", "Laundry", "Kitchen", "Parking", "Gym", "Power Backup"],
        roomTypes: [
            { type: "Single Occupancy", price: 12000, available: true },
            { type: "Double Sharing", price: 8500, available: true }
        ],
        rules: [
            { id: "r1", title: "Gate Timing", description: "Main gate closes at 10:30 PM.", clause: "House Rules – Clause 4" },
            { id: "r2", title: "Guests", description: "Guests allowed till 8 PM in common areas only.", clause: "House Rules – Clause 7" }
        ],
        reviews: [],
        roommates: [],
        highlights: { curfew: "10:30 PM", guests: true, pets: false, cooking: true },
        hiddenCosts: ["Electricity charged at ₹8/unit above 100 units"],
        vibeAnalysis: { badge: "Chill / Independence", description: "A relaxed environment for working professionals." },
        createdAt: new Date()
    },
    {
        name: "Scholar's Haven",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60"
        ],
        rent: 6000,
        location: "Near Allen Career Institute",
        city: "Kota",
        vibe: "academic",
        vibeScore: 92,
        amenities: ["WiFi", "Study Room", "Library", "Mess", "Power Backup", "CCTV"],
        roomTypes: [
            { type: "Double Sharing", price: 6000, available: true },
            { type: "Triple Sharing", price: 4500, available: true }
        ],
        rules: [
            { id: "r1", title: "Study Hours", description: "Mandatory study hours from 6 PM to 10 PM.", clause: "Academic Policy – Clause 1" },
            { id: "r2", title: "Curfew", description: "Strict 9 PM curfew. No exceptions.", clause: "House Rules – Clause 2" }
        ],
        reviews: [],
        roommates: [],
        highlights: { curfew: "9:00 PM", guests: false, pets: false, cooking: false },
        hiddenCosts: ["Study material room access: ₹200/month"],
        vibeAnalysis: { badge: "Strict / Academic", description: "Ideal for competitive exam preparation." },
        createdAt: new Date()
    },
    {
        name: "Urban Tribe Hostel",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60",
        images: [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60"
        ],
        rent: 11000,
        location: "Indiranagar, 100 Feet Road",
        city: "Bangalore",
        vibe: "party",
        vibeScore: 78,
        amenities: ["WiFi", "Rooftop", "Game Room", "Parking", "Laundry", "Gym"],
        roomTypes: [
            { type: "Single Occupancy", price: 15000, available: true },
            { type: "Double Sharing", price: 11000, available: true }
        ],
        rules: [
            { id: "r1", title: "No Curfew", description: "24/7 access. Come and go as you please.", clause: "House Rules – Clause 1" },
            { id: "r2", title: "Guests Welcome", description: "Overnight guests allowed with prior registration.", clause: "House Rules – Clause 5" }
        ],
        reviews: [],
        roommates: [],
        highlights: { curfew: "No Curfew", guests: true, pets: true, cooking: true },
        hiddenCosts: ["Party cleanup fee: ₹500/event"],
        vibeAnalysis: { badge: "Party / High Energy", description: "A vibrant community for young professionals." },
        createdAt: new Date()
    }
];

const seedDB = async () => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected to MongoDB for seeding...');
        const db = client.db(dbName);
        const collection = db.collection('listings');
        await collection.deleteMany({});
        console.log('Cleared existing listings.');
        const result = await collection.insertMany(listings);
        console.log(`${result.insertedCount} listings added successfully.`);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
        console.log('Database connection closed.');
        process.exit();
    }
};

seedDB();
