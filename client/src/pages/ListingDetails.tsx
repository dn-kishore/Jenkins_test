import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ImageCarousel } from '@/components/ImageCarousel';
import { RoommateCompatibility } from '@/components/RoommateCompatibility';
import { ReviewsList } from '@/components/ReviewsList';
import { WardenBot } from '@/components/WardenBot';
import ComplaintBox from '@/components/ComplaintBox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Wifi,
  Car,
  Dumbbell,
  ChefHat,
  Zap,
  ShieldCheck,
  Clock,
  Users,
  PawPrint,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { Listing, VibeType } from '@/data/mockData';
import { cn } from '@/lib/utils';

const API_URL = 'http://localhost:3001/api';

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  'High-Speed WiFi': Wifi,
  Parking: Car,
  Gym: Dumbbell,
  Kitchen: ChefHat,
  'Power Backup': Zap,
  CCTV: ShieldCheck,
  Laundry: Clock,
  'Study Room': Clock,
  Library: Clock,
  Mess: ChefHat,
  Garden: Clock,
  Rooftop: Clock,
  'Game Room': Clock,
  'Co-working Space': Clock,
  Cafeteria: ChefHat,
  'Shuttle Service': Car,
  'Study Hall': Clock,
  Counseling: Users,
  'Medical Support': ShieldCheck,
};

const amenityColors: Record<string, string> = {
  WiFi: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  'High-Speed WiFi': 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  Parking: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Gym: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Kitchen: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  'Power Backup': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  CCTV: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  Laundry: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Study Room': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  Library: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  Mess: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  Cafeteria: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  'Study Hall': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Co-working Space': 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  'Game Room': 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
};

const vibeConfig: Record<VibeType, { label: string; emoji: string; variant: 'chill' | 'academic' | 'party'; color: string }> = {
  chill: { label: 'Chill / Independence', emoji: '🟢', variant: 'chill', color: 'from-vibe-chill to-vibe-chill/60' },
  academic: { label: 'Academic / Quiet', emoji: '🔵', variant: 'academic', color: 'from-vibe-academic to-vibe-academic/60' },
  party: { label: 'Party / High Energy', emoji: '🔴', variant: 'party', color: 'from-vibe-party to-vibe-party/60' },
};

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/listings/${id}`);
        const data = await res.json();
        if (data.success) {
          setListing({ ...data.data, id: data.data._id || data.data.id });
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        setError('Failed to fetch listing');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 relative z-10" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
        </div>
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold mb-4">{error || 'Property Not Found'}</h1>
          <Link to="/search">
            <Button variant="hero" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const vibe = vibeConfig[listing.vibe?.toLowerCase() as VibeType] || vibeConfig.chill;
  const images = (listing.images && listing.images.length > 0)
    ? listing.images
    : (listing.image ? [listing.image] : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60']);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-600 pb-24 md:pb-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
      </div>
      
      <Navbar />

      <div className="container mx-auto px-4 pt-28 relative z-10">
        {/* Enhanced Back Button */}
        <Link 
          to="/search" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/50 dark:border-gray-750 text-muted-foreground hover:text-indigo-600 hover:shadow-md transition-all duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300 text-indigo-600" />
          <span className="font-medium">Back to listings</span>
        </Link>

        {/* Image Carousel */}
        <div className="animate-fade-in">
          <ImageCarousel images={images} name={listing.name} />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 mt-10">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Header */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-slate-900 dark:text-white">{listing.name}</h1>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-lg">
                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>{listing.location}, {listing.city}</span>
                  </div>
                </div>
                <Badge variant={vibe.variant} className="text-base px-5 py-2.5 shadow-lg">
                  {vibe.emoji} {vibe.label}
                </Badge>
              </div>
            </div>

            {/* Enhanced Room Types & Pricing */}
            <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-750 rounded-[2rem] p-8 shadow-premium animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Room Types & Pricing
              </h2>
              <div className="space-y-4">
                {listing.roomTypes?.map((room, index) => (
                  <div
                    key={index}
                    className={`relative group ${
                      room.available ? '' : 'opacity-60'
                    }`}
                  >
                    <div className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${
                      room.available 
                        ? 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-700/30 dark:to-gray-800/30 hover:shadow-md hover:scale-[1.01]' 
                        : 'bg-slate-50/50 dark:bg-gray-800/10'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <Users className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">{room.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">₹{Number(room.price || 0).toLocaleString()}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">/month</span>
                        </div>
                        {room.available ? (
                          <Badge variant="chill" className="ml-2 shadow-sm">✓ Available</Badge>
                        ) : (
                          <Badge variant="secondary" className="ml-2">Full</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Amenities */}
            <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-750 rounded-[2rem] p-8 shadow-premium animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities?.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || Sparkles;
                  const colorClass = amenityColors[amenity] || 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
                  return (
                    <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 hover:shadow-md hover:scale-105 transition-all duration-300 group">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300", colorClass)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Quick Highlights */}
            <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-750 rounded-[2rem] p-8 shadow-premium animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Quick Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Curfew</p>
                    <p className="font-semibold text-lg text-slate-800 dark:text-gray-200">{listing.highlights?.curfew || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", listing.highlights?.guests ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600")}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Guests</p>
                    <p className="font-semibold text-lg flex items-center gap-2 text-slate-800 dark:text-gray-200">
                      {listing.highlights?.guests ? (
                        <><Check className="w-5 h-5 text-emerald-500" /> Allowed</>
                      ) : (
                        <><X className="w-5 h-5 text-rose-500" /> Not Allowed</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", listing.highlights?.pets ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600")}>
                    <PawPrint className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Pets</p>
                    <p className="font-semibold text-lg flex items-center gap-2 text-slate-800 dark:text-gray-200">
                      {listing.highlights?.pets ? (
                        <><Check className="w-5 h-5 text-emerald-500" /> Allowed</>
                      ) : (
                        <><X className="w-5 h-5 text-rose-500" /> Not Allowed</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", listing.highlights?.cooking ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600")}>
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Self Cooking</p>
                    <p className="font-semibold text-lg flex items-center gap-2 text-slate-800 dark:text-gray-200">
                      {listing.highlights?.cooking ? (
                        <><Check className="w-5 h-5 text-emerald-500" /> Allowed</>
                      ) : (
                        <><X className="w-5 h-5 text-rose-500" /> Not Allowed</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Vibe Analysis */}
            {listing.vibeAnalysis && (
              <div className={`relative overflow-hidden bg-gradient-to-br ${vibe.color} rounded-3xl p-8 text-primary-foreground shadow-xl animate-fade-in`} style={{ animationDelay: '0.5s' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Community Vibe</h2>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 text-lg px-5 py-2 mb-5 shadow-lg">
                    {listing.vibeAnalysis.badge}
                  </Badge>
                  <p className="text-white/95 leading-relaxed text-lg">
                    {listing.vibeAnalysis.description}
                  </p>
                </div>
              </div>
            )}

            {/* Enhanced Hidden Costs */}
            {listing.hiddenCosts && listing.hiddenCosts.length > 0 && (
              <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-750 rounded-3xl p-8 shadow-premium animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="absolute top-0 left-0 w-32 h-32 bg-warning/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-warning" />
                    </div>
                    <h2 className="text-2xl font-bold text-warning">Hidden Cost Detector</h2>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                    Our AI detected the following potential additional charges:
                  </p>
                  <ul className="space-y-3">
                    {listing.hiddenCosts.map((cost, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
                        <span className="text-warning font-bold text-xl shrink-0">⚠️</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{cost}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Reviews */}
            {listing.reviews && listing.reviews.length > 0 && (
              <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Reviews & Community</h2>
                <ReviewsList reviews={listing.reviews} />
              </div>
            )}
          </div>

          {/* Right Column - Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Book Now Card */}
            <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-750 rounded-3xl p-8 shadow-premium sticky top-28 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-8">
                <div className="mb-2">
                  <span className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{Number(listing.rent || 0).toLocaleString()}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 text-lg">/month</span>
                <p className="text-sm text-slate-600 dark:text-slate-350 mt-2 px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 inline-block font-semibold">
                  Double Sharing
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-base font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  📅 Book a Visit
                </button>
                <button 
                  className="w-full bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800 hover:scale-[1.02] active:scale-95 transition-all text-base font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  📞 Contact Owner
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-border/30">
                <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-vibe-chill" />
                    <span>Free cancellation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-vibe-chill" />
                    <span>No booking fee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roommate Compatibility */}
            {listing.roommates && listing.roommates.length > 0 && (
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <RoommateCompatibility roommates={listing.roommates} />
              </div>
            )}
          </div>
        </div>
      </div>

      <WardenBot propertyId={id} propertyName={listing.name} />
      <ComplaintBox listingId={id!} listingName={listing.name} />
    </div>
  );
};

export default ListingDetails;
