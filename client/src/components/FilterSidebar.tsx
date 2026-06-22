import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Clock, Users, PawPrint, ChefHat, Volume2, PartyPopper, X, Filter, 
  Sparkles, Building2, MapPin, Utensils, Shield, Wifi, Car, Dumbbell,
  Camera, Star, Home, Calendar, UserCheck, Coffee, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdvancedFilters {
  // Basic Filters
  accommodationType: string[];
  occupancy: string[];
  genderAllowed: string;
  roomType: string[];
  rentRange: [number, number];
  depositRange: [number, number];
  availability: string;
  availabilityDate: string;

  // Food & Lifestyle
  foodType: string[];
  mealsIncluded: string[];
  alcoholAllowed: boolean | null;
  smokingAllowed: boolean | null;

  // Amenities
  amenities: string[];

  // Safety & Trust
  safety: string[];

  // Ratings & Reviews
  minimumRating: number;
  noiseLevel: string;
  cleanliness: string;
  foodQuality: string;
}

interface FilterSidebarProps {
  filters: AdvancedFilters;
  onFilterChange: (filters: AdvancedFilters) => void;
}

export const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof AdvancedFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    console.log('Clearing all filters...');
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
    console.log('New filters:', newFilters);
    onFilterChange(newFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'rentRange' && Array.isArray(value)) {
      return value[0] > 0 || value[1] < 50000;
    }
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value !== null;
    if (typeof value === 'string') {
      return value !== '' && value !== 'any' && value !== 'immediate' && value !== 'none' && value !== '1-month' && value !== 'moderate';
    }
    if (typeof value === 'number') {
      if (key === 'minimumRating') return value > 0;
      return false;
    }
    return false;
  }).length;

  const FilterSection = ({ title, icon: Icon, children, sectionKey }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    sectionKey: string;
  }) => (
    <div className={cn(
      "border rounded-2xl overflow-hidden transition-all duration-350 backdrop-blur-md shadow-sm",
      activeSection === sectionKey
        ? "bg-white/70 dark:bg-gray-800/80 border-indigo-200 dark:border-indigo-850 shadow-lg shadow-indigo-500/5"
        : "bg-white/30 dark:bg-gray-800/30 border-gray-200/40 dark:border-gray-700/40 hover:bg-white/50 dark:hover:bg-gray-800/50"
    )}>
      <button
        onClick={() => setActiveSection(activeSection === sectionKey ? null : sectionKey)}
        className="w-full flex items-center justify-between p-4 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        </div>
        <div className={`transform transition-transform duration-300 ${activeSection === sectionKey ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {activeSection === sectionKey && (
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-4 bg-white/20 dark:bg-gray-800/20">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        className="lg:hidden fixed bottom-24 right-6 z-40 shadow-2xl rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
        size="lg"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="w-5 h-5" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 w-6 h-6 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed lg:sticky top-20 lg:top-28 right-0 lg:right-auto h-[calc(100vh-5rem)] lg:h-auto w-96 lg:w-80 bg-gray-50 dark:bg-gray-900 lg:bg-transparent dark:lg:bg-transparent p-6 lg:p-0 z-50 lg:z-auto transition-transform duration-300 lg:transform-none overflow-y-auto shadow-2xl lg:shadow-none border-l lg:border-0 border-gray-200 dark:border-gray-700',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div className="lg:sticky lg:top-28 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Filter className="w-5 h-5 text-indigo-600" />
              Advanced Filters
            </h3>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    console.log('Clear all button clicked');
                    clearAllFilters();
                  }} 
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Clear all ({activeFiltersCount})
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* 1️⃣ Basic Filters */}
          <FilterSection title="Basic Filters" icon={Building2} sectionKey="basic">
            {/* Accommodation Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Accommodation Type</Label>
              <div className="space-y-2">
                {['PG (Male)', 'PG (Female)', 'Co-Living', 'Hostel'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.accommodationType.includes(type)}
                      onCheckedChange={() => toggleArrayFilter('accommodationType', type)}
                    />
                    <Label htmlFor={type} className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Occupancy */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Occupancy</Label>
              <div className="space-y-2">
                {['Single', 'Double', 'Triple+'].map((occ) => (
                  <div key={occ} className="flex items-center space-x-2">
                    <Checkbox
                      id={occ}
                      checked={filters.occupancy.includes(occ)}
                      onCheckedChange={() => toggleArrayFilter('occupancy', occ)}
                    />
                    <Label htmlFor={occ} className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer">{occ}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Allowed */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender Allowed</Label>
              <RadioGroup value={filters.genderAllowed} onValueChange={(value) => updateFilter('genderAllowed', value)}>
                {['Male', 'Female', 'Any'].map((gender) => (
                  <div key={gender} className="flex items-center space-x-2">
                    <RadioGroupItem value={gender.toLowerCase()} id={gender} />
                    <Label htmlFor={gender} className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer">{gender}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Rent Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rent Range: ₹{filters.rentRange[0].toLocaleString()} - ₹{filters.rentRange[1].toLocaleString()}
              </Label>
              <div className="px-2">
                <Slider
                  value={filters.rentRange}
                  onValueChange={(value) => {
                    console.log('Rent range changed:', value);
                    updateFilter('rentRange', value as [number, number]);
                  }}
                  max={50000}
                  min={0}
                  step={1000}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>₹0</span>
                <span>₹50,000</span>
              </div>
            </div>
          </FilterSection>

          {/* 2️⃣ Food & Lifestyle */}
          <FilterSection title="Food & Lifestyle" icon={Utensils} sectionKey="food">
            <div className="space-y-4">
              {/* Food Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Food Type</Label>
                <div className="space-y-2">
                  {['Veg', 'Non-Veg', 'Both'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={filters.foodType.includes(type)}
                        onCheckedChange={() => toggleArrayFilter('foodType', type)}
                      />
                      <Label htmlFor={type} className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meals Included */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meals Included</Label>
                <div className="space-y-2">
                  {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                    <div key={meal} className="flex items-center space-x-2">
                      <Checkbox
                        id={meal}
                        checked={filters.mealsIncluded.includes(meal)}
                        onCheckedChange={() => toggleArrayFilter('mealsIncluded', meal)}
                      />
                      <Label htmlFor={meal} className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer">{meal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alcohol Allowed</Label>
                  <Select value={filters.alcoholAllowed?.toString() || 'null'} onValueChange={(value) => updateFilter('alcoholAllowed', value === 'null' ? null : value === 'true')}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Any</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Smoking Allowed</Label>
                  <Select value={filters.smokingAllowed?.toString() || 'null'} onValueChange={(value) => updateFilter('smokingAllowed', value === 'null' ? null : value === 'true')}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Any</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </FilterSection>

          {/* 3️⃣ Amenities */}
          <FilterSection title="Amenities" icon={Wifi} sectionKey="amenities">
            <div className="grid grid-cols-2 gap-2">
              {[
                'Wi-Fi', 'Power Backup', 'AC', 'Washing Machine', 
                'Housekeeping', 'Parking', 'Gym', 'Study Room', 'Lift'
              ].map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={() => toggleArrayFilter('amenities', amenity)}
                  />
                  <Label htmlFor={amenity} className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer">{amenity}</Label>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* 4️⃣ Safety & Trust */}
          <FilterSection title="Safety & Trust" icon={Camera} sectionKey="safety">
            <div className="space-y-2">
              {['CCTV', 'Warden On-Site', 'Security Guard', 'Biometric Access'].map((safety) => (
                <div key={safety} className="flex items-center space-x-2">
                  <Checkbox
                    id={safety}
                    checked={filters.safety.includes(safety)}
                    onCheckedChange={() => toggleArrayFilter('safety', safety)}
                  />
                  <Label htmlFor={safety} className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer">{safety}</Label>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* 5️⃣ Ratings & Reviews */}
          <FilterSection title="Ratings & Reviews" icon={Star} sectionKey="ratings">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum Rating: {filters.minimumRating}⭐
                </Label>
                <Slider
                  value={[filters.minimumRating]}
                  onValueChange={(value) => updateFilter('minimumRating', value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Noise Level</Label>
                <Select value={filters.noiseLevel} onValueChange={(value) => updateFilter('noiseLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="quiet">Quiet</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="lively">Lively</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FilterSection>
        </div>
      </div>
    </>
  );
};
