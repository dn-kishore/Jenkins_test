import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ManageListings from './ManageListings';
import ManagerDashboard from './ManagerDashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Trash2, Building2, Save, Loader2, CheckCircle, X, Upload, Sparkles,
  Wifi, Clock, ChefHat, Car, Dumbbell, Zap, ShieldCheck, BookOpen, Coffee, Tv, Wind 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const amenityIconMap: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Laundry: Clock,
  Kitchen: ChefHat,
  Parking: Car,
  Gym: Dumbbell,
  'Power Backup': Zap,
  CCTV: ShieldCheck,
  Garden: Building2,
  Rooftop: Building2,
  'Study Room': BookOpen,
  Library: BookOpen,
  Mess: ChefHat,
  Cafeteria: Coffee,
  'Shuttle Service': Car,
  'Co-working Space': Building2,
  'Game Room': Tv,
  AC: Wind,
};

import { cn } from '@/lib/utils';

// Popular Indian cities for autocomplete - All AP cities + Major cities from other states
const INDIAN_CITIES = [
  // Major Metro Cities (All India)
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  
  // Karnataka Cities (Top 5)
  'Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum',
  
  // Tamil Nadu Cities (Top 5)
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  
  // Kerala Cities (Top 5)
  'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam',
  
  // Telangana Cities (Top 5)
  'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar',
  
  // Maharashtra Cities (Top 5)
  'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad',
  
  // Gujarat Cities (Top 5)
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
  
  // Rajasthan Cities (Top 5)
  'Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner',
  
  // Uttar Pradesh Cities (Top 5)
  'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad',
  
  // West Bengal Cities (Top 5)
  'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri',
  
  // Other Major Cities (Top 4-5 each)
  'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', // Madhya Pradesh
  'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', // Bihar
  'Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', // Punjab
  'Dehradun', 'Haridwar', 'Roorkee', 'Nainital', // Uttarakhand
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', // Odisha
  'Guwahati', 'Dibrugarh', 'Jorhat', 'Silchar', // Assam
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', // Jharkhand
  'Raipur', 'Bhilai', 'Bilaspur', 'Korba', // Chhattisgarh
  
  // ANDHRA PRADESH - ALL CITIES (Complete List)
  // Major Cities
  'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kakinada', 'Tirupati',
  'Anantapur', 'Kadapa', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Chittoor', 'Hindupur',
  'Proddatur', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram', 'Gudivada', 'Narasaraopet', 'Tadipatri',
  'Mangalagiri', 'Chilakaluripet', 'Yemmiganur', 'Kadiri', 'Chirala', 'Anakapalle', 'Kavali', 'Palacole',
  
  // West Godavari District Cities
  'Tadepalligudem', 'Bhimavaram', 'Eluru', 'Narasapuram', 'Tanuku', 'Palakollu', 'Akividu', 'Nidadavole',
  'Kovvur', 'Polavaram', 'Jangareddygudem', 'Chintalapudi', 'Kamavarapukota', 'Pentapadu', 'Undrajavaram',
  'Dwaraka Tirumala', 'Veeravasaram', 'Attili', 'Ganapavaram', 'Iragavaram', 'Peravali', 'Penugonda',
  
  // East Godavari District Cities  
  'Kakinada', 'Rajahmundry', 'Amalapuram', 'Peddapuram', 'Tuni', 'Ramachandrapuram', 'Mandapeta', 'Razole',
  'Samalkota', 'Pithapuram', 'Prathipadu', 'Korukonda', 'Alamuru', 'Uppada', 'Yanam', 'Kotananduru',
  'Gollaprolu', 'Thallarevu', 'Sakhinetipalli', 'Gangavaram', 'Kothapeta', 'Ravulapalem', 'Addateegala',
  
  // Krishna District Cities
  'Machilipatnam', 'Gudivada', 'Vijayawada', 'Tenali', 'Repalle', 'Bapatla', 'Chirala', 'Ponnur',
  'Pedana', 'Avanigadda', 'Nagayalanka', 'Bantumilli', 'Vuyyuru', 'Hanuman Junction', 'Mylavaram',
  
  // Guntur District Cities
  'Guntur', 'Narasaraopet', 'Chilakaluripet', 'Mangalagiri', 'Sattenapalli', 'Vinukonda', 'Bapatla',
  'Piduguralla', 'Macherla', 'Gurazala', 'Repalle', 'Tenali', 'Ponnur', 'Amaravati',
  
  // Prakasam District Cities
  'Ongole', 'Chirala', 'Kandukur', 'Markapur', 'Addanki', 'Podili', 'Giddalur', 'Kanigiri',
  
  // Nellore District Cities
  'Nellore', 'Gudur', 'Kavali', 'Atmakur', 'Venkatagiri', 'Sullurpeta', 'Buchireddipalem',
  
  // Chittoor District Cities
  'Chittoor', 'Tirupati', 'Madanapalle', 'Hindupur', 'Srikalahasti', 'Puttur', 'Palamaner', 'Nagari',
  
  // Anantapur District Cities
  'Anantapur', 'Hindupur', 'Guntakal', 'Dharmavaram', 'Tadpatri', 'Kadiri', 'Kalyanadurgam', 'Rayadurg',
  
  // Kurnool District Cities
  'Kurnool', 'Nandyal', 'Adoni', 'Yemmiganur', 'Alur', 'Pathikonda', 'Mantralayam', 'Atmakur',
  
  // Kadapa District Cities
  'Kadapa', 'Proddatur', 'Jammalamadugu', 'Rayachoty', 'Mydukur', 'Badvel', 'Rajampet',
  
  // Visakhapatnam District Cities
  'Visakhapatnam', 'Anakapalle', 'Narsipatnam', 'Yelamanchili', 'Pendurthi', 'Bheemunipatnam', 'Araku Valley',
  
  // Vizianagaram District Cities
  'Vizianagaram', 'Bobbili', 'Parvathipuram', 'Salur', 'Cheepurupalli', 'Gajapathinagaram',
  
  // Srikakulam District Cities
  'Srikakulam', 'Amadalavalasa', 'Palasa', 'Narasannapeta', 'Ichapuram', 'Tekkali'
];
interface RoomType {
  type: string;
  price: number;
  available: boolean;
}
const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'add';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Basic Info
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [pincode, setPincode] = useState('');
  const [rent, setRent] = useState('');
  const [hostelType, setHostelType] = useState<'boys' | 'girls' | 'coed'>('boys');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [vibe, setVibe] = useState<'chill' | 'academic' | 'party'>('chill');
  const [vibeScore, setVibeScore] = useState('80');

  // Highlights
  const [curfew, setCurfew] = useState('No Curfew');
  const [guests, setGuests] = useState(false);
  const [pets, setPets] = useState(false);
  const [cooking, setCooking] = useState(false);

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([]);
  const amenityOptions = ['WiFi', 'Laundry', 'Kitchen', 'Parking', 'Gym', 'Power Backup', 'CCTV', 'Garden', 'Rooftop', 'Study Room', 'Library', 'Mess', 'Cafeteria', 'Shuttle Service', 'Co-working Space', 'Game Room', 'AC'];

  // Room Types
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    { type: 'Single Occupancy', price: 0, available: true },
  ]);

  // New sections replacing house rules
  const [security, setSecurity] = useState('');
  const [medication, setMedication] = useState('');
  const [hostelDescription, setHostelDescription] = useState('');
  const [generatingDescription, setGeneratingDescription] = useState(false);

  // Hidden Costs
  const [hiddenCosts, setHiddenCosts] = useState<string[]>(['']);

  // Vibe Analysis
  const [vibeBadge, setVibeBadge] = useState('');
  const [vibeDescription, setVibeDescription] = useState('');

  // City autocomplete functionality
  const handleCityChange = (value: string) => {
    setCity(value);
    setSelectedSuggestionIndex(-1); // Reset selection when typing
    
    if (value.length > 1) { // Start showing after 2 characters
      const filtered = INDIAN_CITIES.filter(cityName => {
        const cityLower = cityName.toLowerCase();
        const valueLower = value.toLowerCase();
        // Match from beginning of city name or after a space
        return cityLower.startsWith(valueLower) || 
               cityLower.includes(' ' + valueLower) ||
               cityLower.includes(valueLower);
      }).slice(0, 8); // Show max 8 suggestions
      
      setCitySuggestions(filtered);
      setShowCitySuggestions(true); // Always show dropdown when typing
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const selectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setShowCitySuggestions(false);
    setCitySuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showCitySuggestions || citySuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < citySuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : citySuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectCity(citySuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowCitySuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // File upload functions
  const addAdditionalImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setAdditionalImages(prev => [...prev, file]);
      }
    };
    input.click();
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const getImagePreviewUrl = (file: File) => {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Error creating object URL:', error);
      return '';
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // AI Description Generation
  const generateDescription = async () => {
    if (!name) {
      setError('Please enter a hostel name first');
      return;
    }

    setGeneratingDescription(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/rag/generate-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          roomTypes: roomTypes.filter(rt => rt.type),
          rent
        })
      });

      const data = await response.json();

      if (data.success) {
        setHostelDescription(data.data.description);
      } else {
        setError(data.error || 'Failed to generate description');
      }
    } catch (err) {
      setError('Failed to generate description. Make sure the server is running.');
    } finally {
      setGeneratingDescription(false);
    }
  };

  const addRoomType = () => {
    setRoomTypes([...roomTypes, { type: '', price: 0, available: true }]);
  };

  const removeRoomType = (index: number) => {
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const updateRoomType = <K extends keyof RoomType>(index: number, field: K, value: RoomType[K]) => {
    const updated = [...roomTypes];
    updated[index] = { ...updated[index], [field]: value };
    setRoomTypes(updated);
  };

  const addHiddenCost = () => {
    setHiddenCosts([...hiddenCosts, '']);
  };

  const removeHiddenCost = (index: number) => {
    setHiddenCosts(hiddenCosts.filter((_, i) => i !== index));
  };

  const updateHiddenCost = (index: number, value: string) => {
    const updated = [...hiddenCosts];
    updated[index] = value;
    setHiddenCosts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add basic data
    formData.append('name', name);
    formData.append('location', location);
    formData.append('city', city);
    formData.append('pincode', pincode);
    formData.append('rent', rent);
    formData.append('hostelType', hostelType);
    formData.append('vibe', vibe);
    formData.append('vibeScore', vibeScore);
    
    // Add main image
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }
    
    // Add additional images
    additionalImages.forEach((image) => {
      formData.append('additionalImages', image);
    });
    
    // Add other data as JSON strings
    formData.append('amenities', JSON.stringify(amenities));
    formData.append('roomTypes', JSON.stringify(roomTypes.filter(rt => rt.type && rt.price > 0)));
    formData.append('highlights', JSON.stringify({ curfew, guests, pets, cooking }));
    formData.append('hiddenCosts', JSON.stringify(hiddenCosts.filter(hc => hc.trim() !== '')));
    formData.append('vibeAnalysis', JSON.stringify({ badge: vibeBadge, description: vibeDescription }));
    formData.append('security', security);
    formData.append('medication', medication);
    formData.append('hostelDescription', hostelDescription);

    try {
      const response = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setName('');
        setLocation('');
        setCity('');
        setPincode('');
        setRent('');
        setHostelType('boys');
        setMainImage(null);
        setAdditionalImages([]);
        setVibe('chill');
        setVibeScore('80');
        setCurfew('No Curfew');
        setGuests(false);
        setPets(false);
        setCooking(false);
        setAmenities([]);
        setRoomTypes([{ type: 'Single Occupancy', price: 0, available: true }]);
        setSecurity('');
        setMedication('');
        setHostelDescription('');
        setHiddenCosts(['']);
        setVibeBadge('');
        setVibeDescription('');
      } else {
        setError(data.error || 'Failed to create listing');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-600 pb-12 transition-colors duration-300 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
      </div>

      {/* Admin Dashboard Page Header Title */}
      <div className="w-full flex flex-col items-center pt-12 pb-4 relative z-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 pb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-505 dark:text-slate-400 text-sm md:text-base font-semibold max-w-lg">
          Unifying listings management, Warden Bot knowledgebases, and PG support complaints.
        </p>
      </div>

      {/* Tab Selector Capsule */}
      <div className="w-full flex justify-center pb-4 relative z-20">
        <div className="flex bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-1.5 shadow-xl gap-1.5">
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'add' })}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95 flex items-center gap-2",
              activeTab === 'add'
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-none font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/55 dark:hover:bg-slate-800/50"
            )}
          >
            <Building2 className="w-4 h-4" />
            Add Hotel
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'ai' })}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95 flex items-center gap-2",
              activeTab === 'ai'
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-none font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/55 dark:hover:bg-slate-800/50"
            )}
          >
            <Sparkles className="w-4 h-4" />
            AI Manager
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'pg' })}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95 flex items-center gap-2",
              activeTab === 'pg'
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-none font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/55 dark:hover:bg-slate-800/50"
            )}
          >
            <Clock className="w-4 h-4" />
            PG Manager
          </button>
        </div>
      </div>

      {activeTab === 'add' && (
        <div className="container mx-auto px-4 pt-6 max-w-4xl relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Hostel</h1>
              <p className="text-gray-500 dark:text-gray-400">Fill in the details to list a new PG/Hostel</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">Hostel added successfully!</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <X className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Hostel Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., GreenNest PG"
                    className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent" className="text-slate-700 dark:text-slate-300 font-medium">Base Rent (₹/month) *</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    placeholder="e.g., 8500"
                    className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700 dark:text-slate-300 font-medium">Location *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Koramangala, 5th Block"
                    className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-700 dark:text-slate-300 font-medium">City *</Label>
                  <div className="relative" ref={cityInputRef}>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Start typing city name..."
                      className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl"
                      required
                      autoComplete="off"
                    />
                    {showCitySuggestions && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 backdrop-blur-md">
                        {citySuggestions.length > 0 ? (
                          citySuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className={`px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors border-b border-slate-100 dark:border-slate-800 last:border-b-0 ${
                                index === selectedSuggestionIndex 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-805 hover:text-indigo-600 dark:hover:text-indigo-400'
                              }`}
                              onClick={() => selectCity(suggestion)}
                              onMouseEnter={() => setSelectedSuggestionIndex(index)}
                            >
                              {suggestion}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                            No cities found. You can still type your own city name.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-slate-700 dark:text-slate-300 font-medium">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g., 560034"
                    className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostelType" className="text-slate-700 dark:text-slate-300 font-medium">Hostel Type *</Label>
                  <Select value={hostelType} onValueChange={(v: 'boys' | 'girls' | 'coed') => setHostelType(v)}>
                    <SelectTrigger className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl backdrop-blur-md">
                      <SelectItem value="boys">🚹 Boys Hostel</SelectItem>
                      <SelectItem value="girls">👩 Girls Hostel</SelectItem>
                      <SelectItem value="coed">👫 Coed Hostel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vibe" className="text-slate-700 dark:text-slate-300 font-medium">Vibe Type *</Label>
                  <Select value={vibe} onValueChange={(v: 'chill' | 'academic' | 'party') => setVibe(v)}>
                    <SelectTrigger className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl backdrop-blur-md">
                      <SelectItem value="chill">✨ Chill</SelectItem>
                      <SelectItem value="academic">📚 Academic</SelectItem>
                      <SelectItem value="party">🎉 Party</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vibeScore" className="text-slate-700 dark:text-slate-300 font-medium">Vibe Score (0-100)</Label>
                  <Input
                    id="vibeScore"
                    type="number"
                    min="0"
                    max="100"
                    value={vibeScore}
                    onChange={(e) => setVibeScore(e.target.value)}
                    className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Main Image *</Label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-450 dark:hover:border-indigo-500/50 rounded-xl p-6 text-center transition-all bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-900/50 relative overflow-hidden group">
                  {mainImage ? (
                    <div className="space-y-3 relative z-10">
                      {getImagePreviewUrl(mainImage) && (
                        <img 
                          src={getImagePreviewUrl(mainImage)} 
                          alt="Main preview" 
                          className="w-32 h-24 object-cover rounded-xl mx-auto border border-slate-200 dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{mainImage.name}</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:hover:bg-red-905/20 dark:hover:border-red-600 dark:hover:text-red-405 border-slate-200 dark:border-slate-800 transition-colors rounded-xl font-medium"
                        onClick={() => setMainImage(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                        <Upload className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">Click to upload main image</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="mainImage"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setMainImage(file);
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 dark:hover:bg-indigo-900/20 dark:hover:border-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-xl font-medium"
                        onClick={() => document.getElementById('mainImage')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Additional Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {additionalImages.map((image, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 transition-all bg-white/30 dark:bg-slate-900/30">
                      {getImagePreviewUrl(image) && (
                        <img 
                          src={getImagePreviewUrl(image)} 
                          alt={`Additional ${index + 1}`}
                          className="w-full h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-655 text-white border-2 border-white dark:border-slate-900 shadow-lg rounded-full"
                        onClick={() => removeAdditionalImage(index)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <div 
                    className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl h-24 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:border-indigo-600/30 dark:hover:bg-indigo-900/20 transition-all group bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm"
                    onClick={addAdditionalImage}
                  >
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-650 group-hover:scale-110 transition-all" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Highlights & Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="curfew" className="text-slate-700 dark:text-slate-300 font-medium">Curfew Time</Label>
                <Select value={curfew} onValueChange={setCurfew}>
                  <SelectTrigger className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl backdrop-blur-md">
                    <SelectItem value="No Curfew">No Curfew</SelectItem>
                    <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                    <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                    <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                    <SelectItem value="10:30 PM">10:30 PM</SelectItem>
                    <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 px-4 py-3 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
                  <Checkbox 
                    id="guests" 
                    checked={guests} 
                    onCheckedChange={(c) => setGuests(!!c)} 
                    className="border-slate-300 dark:border-slate-700 text-indigo-650 focus-visible:ring-indigo-500 rounded"
                  />
                  <Label htmlFor="guests" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Guests Allowed</Label>
                </div>
                <div className="flex items-center gap-3 bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 px-4 py-3 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
                  <Checkbox 
                    id="pets" 
                    checked={pets} 
                    onCheckedChange={(c) => setPets(!!c)} 
                    className="border-slate-300 dark:border-slate-700 text-indigo-650 focus-visible:ring-indigo-500 rounded"
                  />
                  <Label htmlFor="pets" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Pet Friendly</Label>
                </div>
                <div className="flex items-center gap-3 bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 px-4 py-3 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
                  <Checkbox 
                    id="cooking" 
                    checked={cooking} 
                    onCheckedChange={(c) => setCooking(!!c)} 
                    className="border-slate-300 dark:border-slate-700 text-indigo-650 focus-visible:ring-indigo-500 rounded"
                  />
                  <Label htmlFor="cooking" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Self Cooking</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {amenityOptions.map((amenity) => {
                  const IconComponent = amenityIconMap[amenity] || Building2;
                  const isSelected = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-300 transform active:scale-95 group",
                        isSelected
                          ? "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-600 dark:border-indigo-500 shadow-md shadow-indigo-100/50 dark:shadow-none"
                          : "bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                        isSelected
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200/50 dark:shadow-none scale-110 rotate-3 group-hover:rotate-12"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:scale-105 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                      )}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        "font-medium text-sm transition-colors duration-300",
                        isSelected 
                          ? "text-indigo-950 dark:text-indigo-200" 
                          : "text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                      )}>
                        {amenity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Room Types */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Room Types & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roomTypes.map((room, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end bg-white/30 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850 p-4 rounded-xl relative group">
                  <div className="flex-1 w-full space-y-2">
                    <Label className="text-slate-705 dark:text-slate-300 font-medium">Room Type</Label>
                    <Select value={room.type} onValueChange={(v) => updateRoomType(index, 'type', v)}>
                      <SelectTrigger className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl backdrop-blur-md">
                        <SelectItem value="Single Occupancy">Single Occupancy</SelectItem>
                        <SelectItem value="Double Sharing">Double Sharing</SelectItem>
                        <SelectItem value="Triple Sharing">Triple Sharing</SelectItem>
                        <SelectItem value="Four Sharing">Four Sharing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-36 space-y-2">
                    <Label className="text-slate-705 dark:text-slate-300 font-medium">Price (₹)</Label>
                    <Input
                      type="number"
                      value={room.price || ''}
                      onChange={(e) => updateRoomType(index, 'price', parseInt(e.target.value) || 0)}
                      placeholder="Price"
                      className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pb-2 h-10">
                    <Checkbox
                      id={`avail-${index}`}
                      checked={room.available}
                      onCheckedChange={(c) => updateRoomType(index, 'available', !!c)}
                      className="border-slate-300 dark:border-slate-700 text-indigo-650 focus-visible:ring-indigo-500 rounded"
                    />
                    <Label htmlFor={`avail-${index}`} className="text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Available</Label>
                  </div>
                  {roomTypes.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-xl"
                      onClick={() => removeRoomType(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-950/25 hover:text-indigo-700 rounded-xl font-medium"
                onClick={addRoomType}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Room Type
              </Button>
            </CardContent>
          </Card>

          {/* Security, Medication & Description */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Security, Medication & Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="security" className="text-slate-700 dark:text-slate-300 font-medium">Security Information</Label>
                <Textarea
                  id="security"
                  value={security}
                  onChange={(e) => setSecurity(e.target.value)}
                  placeholder="Describe security measures, CCTV coverage, guards, access control, etc."
                  className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl resize-none"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medication" className="text-slate-700 dark:text-slate-300 font-medium">Medication & Health Facilities</Label>
                <Textarea
                  id="medication"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  placeholder="Describe medical facilities, first aid, nearby hospitals, pharmacy access, etc."
                  className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl resize-none"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hostelDescription" className="text-slate-700 dark:text-slate-300 font-medium">Hostel Description</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
                    disabled={generatingDescription || !name}
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 hover:opacity-95 disabled:opacity-50 transition-all shadow-md shadow-indigo-100 dark:shadow-none rounded-xl font-medium"
                  >
                    {generatingDescription ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="hostelDescription"
                  value={hostelDescription}
                  onChange={(e) => setHostelDescription(e.target.value)}
                  placeholder="Provide a detailed description of the hostel, its atmosphere, facilities, and what makes it special... Or click 'Generate with AI' to auto-generate!"
                  className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl resize-none"
                  rows={4}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                  <span>💡</span> Fill in the hostel details above, then click "Generate with AI" to create a professional description automatically.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hidden Costs */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Hidden Costs (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hiddenCosts.map((cost, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={cost}
                    onChange={(e) => updateHiddenCost(index, e.target.value)}
                    placeholder="e.g., Electricity charged at ₹8/unit above 100 units"
                    className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl"
                  />
                  {hiddenCosts.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-xl"
                      onClick={() => removeHiddenCost(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-indigo-950/25 hover:text-indigo-700 rounded-xl font-medium"
                onClick={addHiddenCost}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Hidden Cost
              </Button>
            </CardContent>
          </Card>

          {/* Vibe Analysis */}
          <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Vibe Analysis (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Vibe Badge</Label>
                <Input
                  value={vibeBadge}
                  onChange={(e) => setVibeBadge(e.target.value)}
                  placeholder="e.g., Chill / Independence"
                  className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Vibe Description</Label>
                <Textarea
                  value={vibeDescription}
                  onChange={(e) => setVibeDescription(e.target.value)}
                  placeholder="Describe the overall vibe of this place..."
                  className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none hover:shadow-indigo-300/50 dark:hover:shadow-none transition-all duration-300 rounded-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Adding Hostel...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Add Hostel
              </>
            )}
          </Button>
        </form>
      </div>
      )}

      {activeTab === 'ai' && (
        <ManageListings hideNavbar={true} />
      )}

      {activeTab === 'pg' && (
        <ManagerDashboard hideNavbar={true} />
      )}
    </div>
  );
};

export default AdminPage;
