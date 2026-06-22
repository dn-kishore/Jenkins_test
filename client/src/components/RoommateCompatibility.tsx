import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Users, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Roommate } from '@/data/mockData';

interface RoommateCompatibilityProps {
  roommates: Roommate[];
}

interface CompatibilityResult {
  score: number;
  level: 'low' | 'medium' | 'high';
  reason: string;
}

export const RoommateCompatibility = ({ roommates }: RoommateCompatibilityProps) => {
  const [description, setDescription] = useState('Early riser, hates loud music, likes quiet evenings reading books');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = () => {
    setIsAnalyzing(true);
    
    // Mock AI analysis
    setTimeout(() => {
      const lowerDesc = description.toLowerCase();
      let score = 50;
      let reasons: string[] = [];

      // Simple keyword matching for demo
      if (lowerDesc.includes('early') || lowerDesc.includes('morning')) {
        if (roommates.some(r => r.traits.includes('Night Owl'))) {
          score -= 25;
          reasons.push('Current roommates are night owls');
        } else if (roommates.some(r => r.traits.includes('Early Bird') || r.traits.includes('Early Riser'))) {
          score += 20;
          reasons.push('Matches early riser roommates');
        }
      }

      if (lowerDesc.includes('quiet') || lowerDesc.includes('silent') || lowerDesc.includes('peace')) {
        if (roommates.some(r => r.traits.includes('Social') || r.traits.includes('Energetic'))) {
          score -= 20;
          reasons.push('Roommates tend to be social and energetic');
        } else if (roommates.some(r => r.traits.includes('Quiet') || r.traits.includes('Calm'))) {
          score += 25;
          reasons.push('Matches quiet, calm roommates');
        }
      }

      if (lowerDesc.includes('music') || lowerDesc.includes('game') || lowerDesc.includes('party')) {
        if (roommates.some(r => r.traits.includes('Studious') || r.traits.includes('Focused'))) {
          score -= 15;
          reasons.push('Roommates prefer focused study environment');
        }
      }

      if (lowerDesc.includes('study') || lowerDesc.includes('work') || lowerDesc.includes('focused')) {
        if (roommates.some(r => r.traits.includes('Studious') || r.traits.includes('Focused') || r.traits.includes('Dedicated'))) {
          score += 20;
          reasons.push('Great match with focused, studious roommates');
        }
      }

      // Clamp score
      score = Math.max(15, Math.min(95, score));

      const level: 'low' | 'medium' | 'high' = score < 40 ? 'low' : score < 70 ? 'medium' : 'high';
      const reason = reasons.length > 0 
        ? reasons.join('. ') + '.'
        : 'Based on general personality analysis, you may have varying compatibility.';

      setResult({ score, level, reason });
      setIsAnalyzing(false);
    }, 1500);
  };

  const levelConfig = {
    low: { color: 'text-vibe-party', bg: 'bg-vibe-party-bg', label: 'Low Match', icon: AlertCircle },
    medium: { color: 'text-warning', bg: 'bg-warning-bg', label: 'Moderate Match', icon: Sparkles },
    high: { color: 'text-vibe-chill', bg: 'bg-vibe-chill-bg', label: 'Great Match!', icon: CheckCircle },
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-[2rem] p-8 shadow-premium space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
          <Users className="w-6 h-6 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Roommate Compatibility</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI-powered matching</p>
        </div>
      </div>

      {/* Current Roommates */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Roommates:</p>
        <div className="flex flex-wrap gap-2">
          {roommates.map((roommate) => (
            <div key={roommate.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl px-3 py-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm text-slate-800 dark:text-slate-200">
                {roommate.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{roommate.name}, {roommate.age}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{roommate.occupation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Describe yourself:</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g., Early riser, loves cooking, prefers quiet evenings..."
          className="min-h-[100px] rounded-xl resize-none"
        />
        <Button
          variant="hero"
          className="w-full"
          onClick={analyze}
          disabled={isAnalyzing || !description.trim()}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Check Compatibility
            </>
          )}
        </Button>
      </div>

      {/* Result */}
      {result && (
        <div className={`${levelConfig[result.level].bg} rounded-xl p-4 space-y-3 animate-fade-in`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = levelConfig[result.level].icon;
                return <Icon className={`w-5 h-5 ${levelConfig[result.level].color}`} />;
              })()}
              <span className={`font-bold ${levelConfig[result.level].color}`}>
                {levelConfig[result.level].label}
              </span>
            </div>
            <div className={`text-2xl font-bold ${levelConfig[result.level].color}`}>
              {result.score}%
            </div>
          </div>
          <p className="text-sm text-foreground/80">{result.reason}</p>
        </div>
      )}
    </div>
  );
};
