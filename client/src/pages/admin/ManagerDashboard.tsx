import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MessageSquareWarning, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Trash2,
  RefreshCw,
  BarChart3,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Loader2,
  X,
  Send
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface Complaint {
  _id: string;
  listingId: string;
  listingName: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  response?: string;
  responseDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  byStatus: Array<{ _id: string; count: number }>;
  byPriority: Array<{ _id: string; count: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  recent: Complaint[];
  total: Array<{ _id: null; count: number }>;
}

const ManagerDashboard = ({ hideNavbar = false }: { hideNavbar?: boolean }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);
  const [updatingComplaint, setUpdatingComplaint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, [currentPage, statusFilter, priorityFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const res = await fetch(`${API_URL}/complaints?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setComplaints(data.data.complaints);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/complaints/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateComplaint = async (complaintId: string, status: string, responseText?: string) => {
    try {
      setUpdatingComplaint(complaintId);
      const res = await fetch(`${API_URL}/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          response: responseText
        })
      });

      const data = await res.json();
      if (data.success) {
        fetchComplaints();
        fetchStats();
        setSelectedComplaint(null);
        setResponse('');
      } else {
        console.error('Update failed:', data.error);
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
    } finally {
      setUpdatingComplaint(null);
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;
    
    try {
      const res = await fetch(`${API_URL}/complaints/${complaintId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (data.success) {
        fetchComplaints();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-orange-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <X className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.listingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter by active tab
  const tabFilteredComplaints = filteredComplaints.filter(complaint => {
    if (activeTab === 'active') {
      return complaint.status !== 'resolved' && complaint.status !== 'closed';
    } else {
      return complaint.status === 'resolved' || complaint.status === 'closed';
    }
  });

  const content = (
    <>
      <div className={`container mx-auto px-4 max-w-7xl relative z-10 ${!hideNavbar ? 'pt-24 md:pt-28' : 'pt-6'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
                <MessageSquareWarning className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PG/Hostel Manager Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage complaints and monitor hostel operations</p>
              </div>
            </div>
            <Button onClick={fetchComplaints} variant="outline" className="gap-2 border-slate-205 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold self-start sm:self-auto">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border border-blue-105/70 dark:border-blue-950/30 bg-gradient-to-br from-blue-50/40 to-white/70 dark:from-blue-950/10 dark:to-slate-900/40 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-blue-100/20 dark:hover:shadow-none rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-650 dark:text-blue-400 mb-1">Active Complaints</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white transition-transform duration-300 group-hover:scale-105 origin-left">
                      {(stats.byStatus.find(s => s._id === 'open')?.count || 0) + 
                       (stats.byStatus.find(s => s._id === 'in-progress')?.count || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-400/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                    <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-rose-105/70 dark:border-rose-955/30 bg-gradient-to-br from-rose-50/40 to-white/70 dark:from-rose-950/10 dark:to-slate-900/40 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-rose-100/20 dark:hover:shadow-none rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-rose-650 dark:text-rose-450 mb-1">Open Issues</p>
                    <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 transition-transform duration-300 group-hover:scale-105 origin-left">
                      {stats.byStatus.find(s => s._id === 'open')?.count || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 dark:bg-rose-400/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                    <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-amber-105/70 dark:border-amber-955/30 bg-gradient-to-br from-amber-50/40 to-white/70 dark:from-amber-955/10 dark:to-slate-900/40 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-amber-100/20 dark:hover:shadow-none rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-650 dark:text-amber-400 mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-450 transition-transform duration-300 group-hover:scale-105 origin-left">
                      {stats.byStatus.find(s => s._id === 'in-progress')?.count || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-450" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-105/70 dark:border-emerald-955/30 bg-gradient-to-br from-emerald-50/40 to-white/70 dark:from-emerald-955/10 dark:to-slate-900/40 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-emerald-100/20 dark:hover:shadow-none rounded-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-650 dark:text-emerald-450 mb-1">Resolved</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-105 origin-left">
                      {(stats.byStatus.find(s => s._id === 'resolved')?.count || 0) + 
                       (stats.byStatus.find(s => s._id === 'closed')?.count || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-450" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6 border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[280px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                  <Input
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 transition-all text-sm hover:border-indigo-300 cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">All Status</option>
                <option value="open" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Open</option>
                <option value="in-progress" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">In Progress</option>
                <option value="resolved" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Resolved</option>
                <option value="closed" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 transition-all text-sm hover:border-indigo-300 cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">All Priority</option>
                <option value="high" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">High</option>
                <option value="medium" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Medium</option>
                <option value="low" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 transition-all text-sm hover:border-indigo-300 cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">All Categories</option>
                <option value="Maintenance Issues" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Maintenance Issues</option>
                <option value="Cleanliness" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Cleanliness</option>
                <option value="Noise Complaints" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Noise Complaints</option>
                <option value="Security Concerns" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Security Concerns</option>
                <option value="Facility Problems" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Facility Problems</option>
                <option value="Staff Behavior" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Staff Behavior</option>
                <option value="Billing Issues" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Billing Issues</option>
                <option value="Food Quality" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Food Quality</option>
                <option value="Internet/WiFi" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Internet/WiFi</option>
                <option value="Other" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Other</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">
                <MessageSquareWarning className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Complaints Management
              </CardTitle>
              
              {/* Tab System */}
              <div className="flex bg-slate-100 dark:bg-slate-805 rounded-xl p-1 self-start sm:self-auto shadow-inner border border-slate-200/50 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'active'
                      ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Active ({filteredComplaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length})
                </button>
                <button
                  onClick={() => setActiveTab('resolved')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'resolved'
                      ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Resolved ({filteredComplaints.filter(c => c.status === 'resolved' || c.status === 'closed').length})
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : tabFilteredComplaints.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquareWarning className="w-16 h-16 mx-auto mb-4 text-slate-305 dark:text-slate-700" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Complaints Found</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {activeTab === 'active' 
                    ? 'No active complaints match your current filters' 
                    : 'No resolved complaints match your current filters'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tabFilteredComplaints.map((complaint) => (
                  <div key={complaint._id} className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all duration-305 bg-white/40 dark:bg-slate-900/40">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{complaint.listingName}</h3>
                          <Badge className={`${getPriorityColor(complaint.priority)} rounded-lg font-semibold px-2 py-0.5 text-xs border-0`}>
                            {complaint.priority.toUpperCase()}
                          </Badge>
                          <Badge className={`${getStatusColor(complaint.status)} rounded-lg font-semibold px-2 py-0.5 text-xs flex items-center gap-1.5 border-0`}>
                            {getStatusIcon(complaint.status)}
                            {complaint.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-indigo-500" />
                            {complaint.name}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-purple-500" />
                            {complaint.email}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-emerald-500" />
                            {complaint.phone}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-amber-500" />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-3.5 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg">
                          {complaint.category}
                        </Badge>
                        <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed font-medium bg-white/20 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-100/50 dark:border-slate-850">{complaint.description}</p>
                        
                        {complaint.response && (
                          <div className="bg-emerald-50/50 dark:bg-emerald-955/10 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 mb-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageCircle className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-450" />
                              <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Management Response</span>
                              {complaint.responseDate && (
                                <span className="text-xs text-emerald-600 dark:text-emerald-450 font-medium">
                                  on {new Date(complaint.responseDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed font-medium">{complaint.response}</p>
                          </div>
                        )}
                        
                        {/* Show resolution date for resolved complaints */}
                        {(complaint.status === 'resolved' || complaint.status === 'closed') && (
                          <div className="bg-indigo-55/40 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 mb-4 shadow-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-405" />
                              <span className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">
                                Resolved on {new Date(complaint.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex lg:flex-col gap-2 shrink-0 self-end lg:self-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedComplaint(complaint)}
                          className="border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850"
                        >
                          <Eye className="w-4 h-4 mr-1.5" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteComplaint(complaint._id)}
                          className="text-red-500 hover:text-red-600 border-slate-205 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                        </Button>
                      </div>
                    </div>
                    
                    {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-600 hover:text-amber-700 border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 dark:hover:bg-amber-955/20 rounded-xl font-medium"
                          onClick={() => handleUpdateComplaint(complaint._id, 'in-progress')}
                          disabled={updatingComplaint === complaint._id}
                        >
                          {updatingComplaint === complaint._id ? (
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4 mr-1.5" />
                          )}
                          Mark In Progress
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm shadow-emerald-100/50 dark:shadow-none transition-all"
                          onClick={() => handleUpdateComplaint(complaint._id, 'resolved')}
                          disabled={updatingComplaint === complaint._id}
                        >
                          {updatingComplaint === complaint._id ? (
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                          )}
                          Mark Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-200 dark:border-slate-800 rounded-xl font-medium"
                >
                  Previous
                </Button>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-slate-205 dark:border-slate-805 rounded-xl font-medium"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden backdrop-blur-lg flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">Respond to Complaint</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Draft your official management response</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedComplaint(null)}
                className="hover:bg-slate-100 dark:hover:bg-slate-805 border-slate-205 dark:border-slate-805 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-850 dark:text-slate-200">{selectedComplaint.listingName}</h3>
                  <Badge className="bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50 rounded-lg">{selectedComplaint.category}</Badge>
                </div>
                <div className="bg-white/45 dark:bg-slate-900/45 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-inner">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">{selectedComplaint.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Response Message
                </label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response to the complaint..."
                  rows={4}
                  className="focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-1 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 focus-visible:border-indigo-500 transition-all duration-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 gap-4">
              <Button
                variant="outline"
                className="flex-1 border-slate-200 dark:border-slate-800 rounded-xl font-semibold h-11"
                onClick={() => setSelectedComplaint(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-750 hover:to-purple-750 text-white rounded-xl font-bold shadow-md shadow-indigo-100/50 dark:shadow-none hover:shadow-indigo-200/50 transition-all h-11"
                onClick={() => handleUpdateComplaint(selectedComplaint._id, 'resolved', response)}
                disabled={responseLoading || !response.trim()}
              >
                {responseLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Response & Resolve
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (hideNavbar) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-955 font-sans selection:bg-indigo-100 selection:text-indigo-600 pb-12 transition-colors duration-300 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05)_0%,transparent_50%)] animate-mesh-float" />
      </div>

      <Navbar />
      {content}
    </div>
  );
};

export default ManagerDashboard;