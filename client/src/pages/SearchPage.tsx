import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ListingCard } from '@/components/ListingCard';
import { FilterSidebar, AdvancedFilters } from '@/components/FilterSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Building2, Loader2 } from 'lucide-react';
import { Listing } from '@/data/mockData';

const API_URL = 'http://localhost:3001/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<AdvancedFilters>({
    // Basic Filters
    accommodationType: [],
    occupancy: [],
    genderAllowed: 'any',
    roomType: [],
    rentRange: [0, 50000],
    depositRange: [0, 100000],
    availability: 'immediate',
    availabilityDate: '',

    // Food & Lifestyle
    foodType: [],
    mealsIncluded: [],
    alcoholAllowed: null,
    smokingAllowed: null,

    // Amenities
    amenities: [],

    // Safety & Trust
    safety: [],

    // Ratings & Reviews
    minimumRating: 0,
    noiseLevel: 'any',
    cleanliness: 'any',
    foodQuality: 'any',
  });

  // Sync search query with URL parameter
  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    if (queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();
        if (data.success) {
          // Map _id to id for compatibility
          const mappedListings = data.data.map((l: Omit<Listing, 'id'> & { _id?: string; id?: string }): Listing => ({
            ...l,
            id: l._id || l.id || '',
          }));
          setListings(mappedListings);
        } else {
          setError('Failed to fetch listings');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    // Filter by search query first
    let baseListings = listings;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      baseListings = listings.filter((listing) => 
        listing.name.toLowerCase().includes(q) ||
        listing.location.toLowerCase().includes(q) ||
        listing.city.toLowerCase().includes(q)
      );
    }
    
    // Then apply filters
    return baseListings.filter((listing) => {
      // Basic Filters
      if (filters.accommodationType.length > 0) {
        // Map listing type to filter format - this should be based on actual listing data
        const listingType = listing.vibe === 'academic' ? 'PG (Male)' : 'Co-Living';
        if (!filters.accommodationType.includes(listingType)) return false;
      }

      if (filters.occupancy.length > 0) {
        // Assume all listings are "Double" for now - this should come from listing data
        if (!filters.occupancy.includes('Double')) return false;
      }

      // Rent Range
      if (listing.rent < filters.rentRange[0] || listing.rent > filters.rentRange[1]) {
        return false;
      }

      // Food & Lifestyle
      if (filters.foodType.length > 0) {
        // This should be based on actual listing data
        // For now, assume all listings support "Both"
        if (!filters.foodType.includes('Both')) return false;
      }

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          listing.amenities?.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Safety & Trust
      if (filters.safety.length > 0) {
        // This should be based on actual listing data
        // For now, assume all listings have basic safety features
        const hasAllSafety = filters.safety.every(safety => 
          safety === 'CCTV' || safety === 'Warden On-Site'
        );
        if (!hasAllSafety) return false;
      }

      // Ratings
      if (filters.minimumRating > 0) {
        // Assume all listings have 4.8 rating for now
        if (4.8 < filters.minimumRating) return false;
      }

      return true;
    });
  }, [listings, searchQuery, filters]);

  const clearAllFilters = () => {
    console.log('Clearing all filters from SearchPage...');
    setSearchQuery('');
    const newFilters = {
      // Basic Filters
      accommodationType: [],
      occupancy: [],
      genderAllowed: 'any',
      roomType: [],
      rentRange: [0, 50000] as [number, number],
      depositRange: [0, 100000] as [number, number],
      availability: 'immediate',
      availabilityDate: '',

      // Food & Lifestyle
      foodType: [],
      mealsIncluded: [],
      alcoholAllowed: null as boolean | null,
      smokingAllowed: null as boolean | null,

      // Amenities
      amenities: [],

      // Safety & Trust
      safety: [],

      // Ratings & Reviews
      minimumRating: 0,
      noiseLevel: 'any',
      cleanliness: 'any',
      foodQuality: 'any',
    };
    console.log('Setting new filters:', newFilters);
    setFilters(newFilters);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
        </div>
        <Navbar />
        <div className="flex items-center justify-center pt-40 relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-600 pb-24 md:pb-8 transition-colors duration-300 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
      </div>

      <Navbar />

      {/* Hero Header Section */}
      <div className="relative pt-24 md:pt-28 pb-8 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/20 rounded-full blur-3xl animate-pulse" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-6">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} available
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Find Your Perfect{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500">
                  PG
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 blur-lg" />
              </span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Discover comfortable living spaces that match your lifestyle and budget
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl rounded-[20px] p-2 flex items-center gap-3 border border-white/50 dark:border-slate-700/50 shadow-2xl transition-all duration-300 focus-within:shadow-[0_0_50px_-10px_rgba(79,70,229,0.2)] focus-within:border-indigo-500/30">
              <div className="flex-1 flex items-center px-4 gap-4">
                <Search className="w-6 h-6 text-indigo-500 shrink-0" />
                <Input
                  type="text"
                  placeholder="Search by name, location, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-lg font-medium"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            {error}. Make sure the server is running at {API_URL}
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Listings Grid */}
          <div className="flex-1 min-w-0">
            {filteredListings.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredListings.length}</span> results
                  </p>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                  {filteredListings.map((listing, index) => (
                    <div
                      key={listing.id}
                      className="animate-fade-in flex"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl" />
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    <Building2 className="w-14 h-14 text-gray-300 dark:text-gray-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No PGs Found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  We couldn't find any properties matching your criteria. Try adjusting your filters.
                </p>
                <Button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 px-8 py-6 text-base rounded-xl shadow-lg shadow-indigo-600/25"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Filter Sidebar */}
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
