export type VibeType = 'chill' | 'academic' | 'party';

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  vibeTag: string;
  date: string;
}

export interface Roommate {
  id: string;
  name: string;
  age: number;
  occupation: string;
  bio: string;
  traits: string[];
}

export interface Rule {
  id: string;
  title: string;
  description: string;
  clause: string;
}

export interface Listing {
  id: string;
  name: string;
  image: string;
  images: string[];
  rent: number;
  location: string;
  city: string;
  vibe: VibeType;
  vibeScore: number;
  amenities: string[];
  roomTypes: { type: string; price: number; available: boolean }[];
  rules: Rule[];
  reviews: Review[];
  roommates: Roommate[];
  highlights: {
    curfew: string;
    guests: boolean;
    pets: boolean;
    cooking: boolean;
  };
  hiddenCosts: string[];
  vibeAnalysis: {
    badge: string;
    description: string;
  };
}

export const listings: Listing[] = [
  {
    id: '1',
    name: 'GreenNest PG',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60',
    ],
    rent: 8500,
    location: 'Koramangala, 5th Block',
    city: 'Bangalore',
    vibe: 'chill',
    vibeScore: 85,
    amenities: ['WiFi', 'Laundry', 'Kitchen', 'Parking', 'Gym', 'Power Backup'],
    roomTypes: [
      { type: 'Single Occupancy', price: 12000, available: true },
      { type: 'Double Sharing', price: 8500, available: true },
      { type: 'Triple Sharing', price: 6500, available: false },
    ],
    rules: [
      { id: 'r1', title: 'Gate Timing', description: 'Main gate closes at 10:30 PM. Late entry requires prior approval.', clause: 'House Rules – Clause 4' },
      { id: 'r2', title: 'Guests', description: 'Guests allowed till 8 PM in common areas only.', clause: 'House Rules – Clause 7' },
      { id: 'r3', title: 'Quiet Hours', description: 'Maintain silence between 10 PM and 7 AM.', clause: 'House Rules – Clause 12' },
    ],
    reviews: [
      { id: 'rev1', author: 'Priya S.', avatar: '👩‍💻', rating: 4, text: 'Super chill place! The warden is understanding and WiFi is actually fast 🔥', vibeTag: 'Peaceful Vibes', date: '2 weeks ago' },
      { id: 'rev2', author: 'Rahul M.', avatar: '🧑‍🎓', rating: 5, text: 'Best PG in Koramangala. Food is homemade and rooms are spacious.', vibeTag: 'Home Away From Home', date: '1 month ago' },
    ],
    roommates: [
      { id: 'rm1', name: 'Ankit', age: 24, occupation: 'Software Engineer', bio: 'Works from home, loves reading', traits: ['Early Bird', 'Quiet', 'Clean'] },
      { id: 'rm2', name: 'Vikram', age: 22, occupation: 'MBA Student', bio: 'Studying for CAT, needs quiet environment', traits: ['Night Owl', 'Studious', 'Introvert'] },
    ],
    highlights: { curfew: '10:30 PM', guests: true, pets: false, cooking: true },
    hiddenCosts: ['Electricity charged at ₹8/unit above 100 units', 'WiFi charges: ₹500/month extra', 'AC rooms have additional ₹1500/month charge'],
    vibeAnalysis: { badge: 'Chill / Independence', description: 'A relaxed environment where residents enjoy personal freedom while maintaining basic discipline. Great for working professionals who value work-life balance.' },
  },
  {
    id: '2',
    name: 'Scholar\'s Haven',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop&q=60',
    ],
    rent: 6000,
    location: 'Near Allen Career Institute',
    city: 'Kota',
    vibe: 'academic',
    vibeScore: 92,
    amenities: ['WiFi', 'Study Room', 'Library', 'Mess', 'Power Backup', 'CCTV'],
    roomTypes: [
      { type: 'Single Occupancy', price: 9000, available: false },
      { type: 'Double Sharing', price: 6000, available: true },
      { type: 'Triple Sharing', price: 4500, available: true },
    ],
    rules: [
      { id: 'r1', title: 'Study Hours', description: 'Mandatory study hours from 6 PM to 10 PM. Common areas must remain silent.', clause: 'Academic Policy – Clause 1' },
      { id: 'r2', title: 'No Visitors', description: 'No visitors allowed on weekdays. Weekend visits require 24hr notice.', clause: 'House Rules – Clause 3' },
      { id: 'r3', title: 'Curfew', description: 'Strict 9 PM curfew. No exceptions.', clause: 'House Rules – Clause 2' },
    ],
    reviews: [
      { id: 'rev1', author: 'Amit K.', avatar: '📚', rating: 5, text: 'Perfect for JEE prep! Zero distractions and supportive environment.', vibeTag: 'Focus Mode', date: '3 weeks ago' },
      { id: 'rev2', author: 'Sneha R.', avatar: '✨', rating: 4, text: 'Strict but worth it. Cracked NEET because of this place.', vibeTag: 'Academic Excellence', date: '2 months ago' },
    ],
    roommates: [
      { id: 'rm1', name: 'Ravi', age: 18, occupation: 'JEE Aspirant', bio: 'Aiming for IIT Bombay, studies 14+ hours', traits: ['Ultra Focused', 'Disciplined', 'Silent'] },
      { id: 'rm2', name: 'Arjun', age: 19, occupation: 'NEET Aspirant', bio: 'Medical dreams, biology enthusiast', traits: ['Early Riser', 'Organized', 'Helpful'] },
    ],
    highlights: { curfew: '9:00 PM', guests: false, pets: false, cooking: false },
    hiddenCosts: ['Study material room access: ₹200/month', 'Late mess timing: ₹50/meal'],
    vibeAnalysis: { badge: 'Strict / Academic', description: 'A highly disciplined environment designed for serious aspirants. Expect strict rules but maximum focus. Ideal for competitive exam preparation.' },
  },
  {
    id: '3',
    name: 'Urban Tribe Hostel',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&auto=format&fit=crop&q=60',
    ],
    rent: 11000,
    location: 'Indiranagar, 100 Feet Road',
    city: 'Bangalore',
    vibe: 'party',
    vibeScore: 78,
    amenities: ['WiFi', 'Rooftop', 'Game Room', 'Parking', 'Laundry', 'Gym'],
    roomTypes: [
      { type: 'Single Occupancy', price: 15000, available: true },
      { type: 'Double Sharing', price: 11000, available: true },
    ],
    rules: [
      { id: 'r1', title: 'No Curfew', description: '24/7 access. Come and go as you please.', clause: 'House Rules – Clause 1' },
      { id: 'r2', title: 'Guests Welcome', description: 'Overnight guests allowed with prior registration.', clause: 'House Rules – Clause 5' },
      { id: 'r3', title: 'Party Policy', description: 'Rooftop parties allowed on weekends till 11 PM.', clause: 'House Rules – Clause 8' },
    ],
    reviews: [
      { id: 'rev1', author: 'Karan T.', avatar: '🎉', rating: 5, text: 'BEST hostel in Bangalore! Weekend parties are legendary 🙌', vibeTag: 'Party Central', date: '1 week ago' },
      { id: 'rev2', author: 'Megha P.', avatar: '💃', rating: 4, text: 'Great social scene. Made so many friends here!', vibeTag: 'Social Hub', date: '3 weeks ago' },
    ],
    roommates: [
      { id: 'rm1', name: 'Deepak', age: 26, occupation: 'Startup Founder', bio: 'Works hard, parties harder', traits: ['Night Owl', 'Social', 'Energetic'] },
      { id: 'rm2', name: 'Nisha', age: 24, occupation: 'Marketing Manager', bio: 'Loves music and weekend adventures', traits: ['Outgoing', 'Fun', 'Spontaneous'] },
    ],
    highlights: { curfew: 'No Curfew', guests: true, pets: true, cooking: true },
    hiddenCosts: ['Party cleanup fee: ₹500/event', 'Guest registration: ₹200/night'],
    vibeAnalysis: { badge: 'Party / High Energy', description: 'A vibrant community for young professionals who love socializing. Expect late nights, rooftop gatherings, and an active social calendar.' },
  },
  {
    id: '4',
    name: 'Serenity House',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60',
    ],
    rent: 7500,
    location: 'HSR Layout, Sector 2',
    city: 'Bangalore',
    vibe: 'chill',
    vibeScore: 88,
    amenities: ['WiFi', 'Garden', 'Kitchen', 'Laundry', 'Power Backup'],
    roomTypes: [
      { type: 'Single Occupancy', price: 10500, available: true },
      { type: 'Double Sharing', price: 7500, available: true },
      { type: 'Triple Sharing', price: 5500, available: true },
    ],
    rules: [
      { id: 'r1', title: 'Gate Timing', description: 'Main gate closes at 11 PM. Biometric access after hours.', clause: 'House Rules – Clause 4' },
      { id: 'r2', title: 'Guests', description: 'Guests allowed with registration. No overnight stays.', clause: 'House Rules – Clause 6' },
    ],
    reviews: [
      { id: 'rev1', author: 'Pooja N.', avatar: '🌸', rating: 5, text: 'The garden is so peaceful! Perfect after a long day at work.', vibeTag: 'Zen Mode', date: '2 weeks ago' },
      { id: 'rev2', author: 'Sanjay D.', avatar: '🧘', rating: 4, text: 'Clean, quiet, and well-maintained. Highly recommend!', vibeTag: 'Peaceful Retreat', date: '1 month ago' },
    ],
    roommates: [
      { id: 'rm1', name: 'Lakshmi', age: 27, occupation: 'UX Designer', bio: 'Creative soul, loves plants', traits: ['Calm', 'Artistic', 'Organized'] },
    ],
    highlights: { curfew: '11:00 PM', guests: true, pets: false, cooking: true },
    hiddenCosts: ['Maintenance fee: ₹300/month'],
    vibeAnalysis: { badge: 'Peaceful / Balanced', description: 'A calm sanctuary for those who value tranquility. Beautiful garden spaces and a balanced community of working professionals.' },
  },
  {
    id: '5',
    name: 'TechHub Residency',
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=60',
    ],
    rent: 9500,
    location: 'Electronic City, Phase 1',
    city: 'Bangalore',
    vibe: 'chill',
    vibeScore: 82,
    amenities: ['High-Speed WiFi', 'Co-working Space', 'Gym', 'Cafeteria', 'Shuttle Service'],
    roomTypes: [
      { type: 'Single Occupancy', price: 13000, available: true },
      { type: 'Double Sharing', price: 9500, available: true },
    ],
    rules: [
      { id: 'r1', title: 'No Curfew', description: 'Tech professionals often work late. 24/7 access available.', clause: 'House Rules – Clause 1' },
      { id: 'r2', title: 'Work-Friendly', description: 'Co-working space open 24/7. Meetings allowed till 10 PM.', clause: 'Facility Rules – Clause 2' },
    ],
    reviews: [
      { id: 'rev1', author: 'Aditya G.', avatar: '💻', rating: 5, text: 'Perfect for techies! The co-working space is a game-changer.', vibeTag: 'Startup Vibes', date: '1 week ago' },
      { id: 'rev2', author: 'Priyanka M.', avatar: '🚀', rating: 4, text: 'Great internet, great community. Found my co-founder here!', vibeTag: 'Networking Gold', date: '3 weeks ago' },
    ],
    roommates: [
      { id: 'rm1', name: 'Rohit', age: 25, occupation: 'Full Stack Developer', bio: 'Codes at night, debugs at dawn', traits: ['Techie', 'Night Owl', 'Helpful'] },
      { id: 'rm2', name: 'Swati', age: 23, occupation: 'Data Scientist', bio: 'ML enthusiast, coffee addict', traits: ['Analytical', 'Curious', 'Friendly'] },
    ],
    highlights: { curfew: 'No Curfew', guests: true, pets: false, cooking: true },
    hiddenCosts: ['Co-working desk fee: ₹1000/month for reserved spot', 'Shuttle service: ₹800/month'],
    vibeAnalysis: { badge: 'Tech / Professional', description: 'Built for the tech community. Flexible timings, excellent internet, and a network of ambitious professionals. Perfect for remote workers and startup folks.' },
  },
  {
    id: '6',
    name: 'Kota Excellence PG',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop&q=60',
    ],
    rent: 5500,
    location: 'Near Resonance, Talwandi',
    city: 'Kota',
    vibe: 'academic',
    vibeScore: 95,
    amenities: ['WiFi', 'Study Hall', 'Mess', 'Counseling', 'Medical Support'],
    roomTypes: [
      { type: 'Double Sharing', price: 5500, available: true },
      { type: 'Triple Sharing', price: 4000, available: true },
    ],
    rules: [
      { id: 'r1', title: 'Phone Restriction', description: 'Phones collected from 9 AM to 6 PM during study hours.', clause: 'Academic Policy – Clause 5' },
      { id: 'r2', title: 'Strict Curfew', description: '8 PM curfew strictly enforced. No exceptions.', clause: 'House Rules – Clause 1' },
      { id: 'r3', title: 'Weekly Tests', description: 'Mandatory participation in weekly mock tests.', clause: 'Academic Policy – Clause 8' },
    ],
    reviews: [
      { id: 'rev1', author: 'Mohit S.', avatar: '🎯', rating: 5, text: 'Strict but effective. AIR 156 thanks to this discipline!', vibeTag: 'Success Factory', date: '2 months ago' },
      { id: 'rev2', author: 'Ritika P.', avatar: '📖', rating: 4, text: 'Phone restriction is tough but helps focus. Worth it!', vibeTag: 'Focus Fortress', date: '1 month ago' },
    ],
    roommates: [
      { id: 'rm1', name: 'Harsh', age: 17, occupation: 'JEE Aspirant', bio: 'Physics lover, targeting IIT Delhi', traits: ['Focused', 'Competitive', 'Dedicated'] },
    ],
    highlights: { curfew: '8:00 PM', guests: false, pets: false, cooking: false },
    hiddenCosts: ['Counseling sessions: ₹500/session after 2 free sessions', 'Extra study material: ₹300/month'],
    vibeAnalysis: { badge: 'Ultra Strict / Exam-Focused', description: 'The most disciplined environment for serious aspirants. Phone restrictions, mandatory study hours, and complete focus on exam preparation. Not for the faint-hearted.' },
  },
];

export const wardenBotResponses: Record<string, { answer: string; source: string }> = {
  'late entry': {
    answer: 'The main gate closes at the designated curfew time. Late entry requires prior warden approval via the DormDen app. Emergency situations are handled on a case-by-case basis.',
    source: 'House Rules – Clause 4',
  },
  'guests': {
    answer: 'Guest policies vary by property. Most PGs allow guests in common areas during visiting hours. Overnight guests typically require 24-hour prior registration.',
    source: 'House Rules – Clause 7',
  },
  'cooking': {
    answer: 'Self-cooking is allowed in properties with kitchen facilities. Please follow kitchen timings and maintain cleanliness. Gas cylinder usage may have additional charges.',
    source: 'Facility Rules – Clause 3',
  },
  'wifi': {
    answer: 'WiFi is available in all common areas. Speed varies from 50-100 Mbps depending on the property. Some PGs charge extra for high-speed dedicated connections.',
    source: 'Amenities Guide – Section 2',
  },
  'laundry': {
    answer: 'Laundry services are available on scheduled days. Self-service washing machines may have coin-operated or monthly subscription options.',
    source: 'Facility Rules – Clause 5',
  },
  'default': {
    answer: 'I\'m here to help with any questions about PG rules and policies. Ask me about curfew, guests, cooking, WiFi, or any other facilities!',
    source: 'General Information',
  },
};
