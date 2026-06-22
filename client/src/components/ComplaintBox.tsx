
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquareWarning, 
  Send, 
  Loader2, 
  CheckCircle, 
  X,
  AlertTriangle,
  User,
  Phone,
  Mail
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface ComplaintBoxProps {
  listingId: string;
  listingName: string;
}

const ComplaintBox = ({ listingId, listingName }: ComplaintBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const categories = [
    'Maintenance Issues',
    'Cleanliness',
    'Noise Complaints',
    'Security Concerns',
    'Facility Problems',
    'Staff Behavior',
    'Billing Issues',
    'Food Quality',
    'Internet/WiFi',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          listingName,
          name,
          email,
          phone,
          category,
          description,
          priority,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setCategory('');
        setDescription('');
        setPriority('medium');
        
        // Auto close after 3 seconds
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit complaint');
      }
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Floating Complaint Button */}
      <Button
        className="fixed bottom-40 md:bottom-24 right-4 z-40 shadow-2xl shadow-purple-500/25 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 px-6 text-white font-semibold border-2 border-white/20"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquareWarning className="w-5 h-5 mr-2" />
        <span className="hidden sm:inline">Report Issue</span>
      </Button>

      {/* Complaint Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50">
            <Card className="h-full md:h-auto max-h-[90vh] overflow-hidden shadow-2xl border-2">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <MessageSquareWarning className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Report an Issue</CardTitle>
                      <p className="text-white/80 text-sm">{listingName}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-700 mb-2">Complaint Submitted!</h3>
                    <p className="text-gray-600">
                      Your complaint has been forwarded to the hostel management. 
                      You'll receive updates via email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700">{error}</span>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-600 pb-2">
                        <User className="w-5 h-5 text-purple-600" />
                        Contact Information
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-semibold text-gray-800 dark:text-gray-200">Full Name *</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-800 dark:text-gray-200">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Your phone number"
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-800 dark:text-gray-200">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Complaint Details */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-600 pb-2">
                        <MessageSquareWarning className="w-5 h-5 text-purple-600" />
                        Complaint Details
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-semibold text-gray-800 dark:text-gray-200">Category *</Label>
                          <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                            required
                          >
                            <option value="" className="text-gray-500 dark:text-gray-400">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">{cat}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="priority" className="text-sm font-semibold text-gray-800 dark:text-gray-200">Priority Level *</Label>
                          <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                            required
                          >
                            <option value="low" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Low Priority</option>
                            <option value="medium" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Medium Priority</option>
                            <option value="high" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">High Priority</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-gray-800 dark:text-gray-200">Detailed Description *</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Please describe the issue in detail. Include when it occurred, what happened, and any other relevant information..."
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                          rows={5}
                          required
                        />
                      </div>
                    </div>

                    {/* Priority Preview */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Selected Priority:</span>
                      <Badge className={`${getPriorityColor(priority)} text-white font-medium`}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                      </Badge>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsOpen(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Complaint
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default ComplaintBox;