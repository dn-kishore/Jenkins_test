import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Clock, PawPrint, ChefHat, ArrowRight, Star } from 'lucide-react';
import { Listing, VibeType } from '@/data/mockData';

interface ListingCardProps {
  listing: Listing;
}

const vibeConfig: Record<VibeType, { label: string; emoji: string; bgColor: string; textColor: string; borderColor: string }> = {
  chill: { 
    label: 'Chill', 
    emoji: '✨', 
    bgColor: 'bg-emerald-500 dark:bg-emerald-600', 
    textColor: 'text-white dark:text-white', 
    borderColor: 'border-emerald-500 dark:border-emerald-600' 
  },
  academic: { 
    label: 'Academic', 
    emoji: '📚', 
    bgColor: 'bg-blue-500 dark:bg-blue-600', 
    textColor: 'text-white dark:text-white', 
    borderColor: 'border-blue-500 dark:border-blue-600' 
  },
  party: { 
    label: 'Party', 
    emoji: '🎉', 
    bgColor: 'bg-orange-500 dark:bg-orange-600', 
    textColor: 'text-white dark:text-white', 
    borderColor: 'border-orange-500 dark:border-orange-600' 
  },
};

export const ListingCard = ({ listing }: ListingCardProps) => {
  const vibe = vibeConfig[listing.vibe];

  return (
    <Link to={`/listing/${listing.id}`} className="group block h-full w-full">
      <div className="relative h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-[2rem] overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-premium hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.15)] transition-all duration-500 hover:-translate-y-3 flex flex-col">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
          <img
            src={listing.image}
            alt={listing.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Vibe Badge */}
          <div className="absolute top-4 right-4">
            <Badge className={`${vibe.bgColor} ${vibe.textColor} ${vibe.borderColor} border backdrop-blur-sm font-semibold px-3 py-1.5 shadow-lg`}>
              {vibe.emoji} {vibe.label}
            </Badge>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 transition-transform group-hover:rotate-[360deg] duration-1000" />
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">4.8</span>
            </div>
          </div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-200 transition-colors">
              {listing.name}
            </h3>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{listing.location}, {listing.city}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4 flex-1 flex flex-col">
          {/* Price Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{listing.rent.toLocaleString()}</span>
              <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">/month</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50/50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-100 dark:border-indigo-800">
              <Users className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Double</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-medium text-gray-600 dark:text-gray-300">{listing.highlights.curfew === 'No Curfew' ? 'No Curfew' : listing.highlights.curfew}</span>
            </div>
            {listing.highlights.guests && (
              <div className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                <span className="font-medium text-gray-600 dark:text-gray-300">Guests</span>
              </div>
            )}
            {listing.highlights.pets && (
              <div className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                <PawPrint className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium text-gray-600 dark:text-gray-300">Pets</span>
              </div>
            )}
            {listing.highlights.cooking && (
              <div className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                <ChefHat className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium text-gray-600 dark:text-gray-300">Cooking</span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/20 text-white rounded-xl h-12 font-semibold group/btn transition-all duration-300 active:scale-98 mt-auto border-0">
            View Details
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
};
