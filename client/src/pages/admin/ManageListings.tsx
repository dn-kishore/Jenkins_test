import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Upload, FileText, Loader2, CheckCircle, X, 
  RefreshCw, Sparkles, MapPin, Brain, Trash2, AlertTriangle, Eye 
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface Listing {
  _id: string;
  id?: string;
  name: string;
  location: string;
  city: string;
  rent: number;
  vibe: string;
  image: string;
  rules?: any[];
}

const ManageListings = ({ hideNavbar = false }: { hideNavbar?: boolean }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [indexing, setIndexing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewingRules, setViewingRules] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [aiStatus, setAiStatus] = useState({ gemini: false, pinecone: false });

  useEffect(() => {
    fetchListings();
    checkAIStatus();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch(`${API_URL}/listings`);
      const data = await res.json();
      setListings(data.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch listings' });
    } finally {
      setLoading(false);
    }
  };

  const checkAIStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/rag/status`);
      const data = await res.json();
      setAiStatus(data.data || { gemini: false, pinecone: false });
    } catch {
      // Ignore
    }
  };

  const handlePDFUpload = async (listingId: string, file: File) => {
    setUploading(listingId);
    setMessage(null);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch(`${API_URL}/rag/upload/${listingId}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Extracted ${data.data.extractedRules} rules from PDF!` 
        });
        fetchListings(); // Refresh
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload PDF' });
    } finally {
      setUploading(null);
    }
  };

  const handleIndexRules = async (listingId: string) => {
    setIndexing(listingId);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/rag/index/${listingId}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Indexed ${data.data.rulesIndexed} rules to vector DB!` 
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Indexing failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to index rules' });
    } finally {
      setIndexing(null);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    setDeleting(listingId);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/listings/${listingId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Hostel deleted successfully!' 
        });
        fetchListings(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: data.error || 'Delete failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete hostel' });
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const confirmDelete = (listingId: string) => {
    setDeleteConfirm(listingId);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleViewRules = (listing: Listing) => {
    setSelectedListing(listing);
    setViewingRules(getListingId(listing));
  };

  const closeRulesModal = () => {
    setViewingRules(null);
    setSelectedListing(null);
  };

  const getListingId = (listing: Listing) => listing._id || listing.id || '';

  const content = (
    <div className={`container mx-auto px-4 max-w-6xl relative z-10 ${!hideNavbar ? 'pt-24 md:pt-28' : 'pt-6'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Rules Manager</h1>
              <p className="text-gray-550 dark:text-gray-400 text-sm">Upload PDFs & index rules for RAG-powered Warden Bot</p>
            </div>
          </div>
          <Button onClick={fetchListings} variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold self-start sm:self-auto">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* AI Status */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          <Badge variant={aiStatus.gemini ? 'default' : 'secondary'} className={`rounded-xl px-3 py-1 font-medium border-0 ${aiStatus.gemini ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm' : 'bg-slate-105 dark:bg-slate-900 text-slate-500'}`}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Gemini: {aiStatus.gemini ? 'Connected' : 'Not Configured'}
          </Badge>
          <Badge variant={aiStatus.pinecone ? 'default' : 'secondary'} className={`rounded-xl px-3 py-1 font-medium border-0 ${aiStatus.pinecone ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm' : 'bg-slate-105 dark:bg-slate-900 text-slate-500'}`}>
            <Brain className="w-3.5 h-3.5 mr-1.5" />
            Pinecone: {aiStatus.pinecone ? 'Connected' : 'Not Configured'}
          </Badge>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 shadow-sm border ${
            message.type === 'success' 
              ? 'bg-green-50/80 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-300' 
              : 'bg-red-50/80 dark:bg-red-955/20 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <span className="font-medium text-sm">
              {message.text}
            </span>
          </div>
        )}
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
      ) : listings.length === 0 ? (
        <Card className="border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
          <CardContent className="py-20 text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Listings Found</h3>
            <p className="text-slate-500 dark:text-slate-400">Add some hostels first from the Admin page</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const listingId = getListingId(listing);
            return (
              <Card key={listingId} className="overflow-hidden relative bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl rounded-2xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between">
                {/* Delete Button - Top Right */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 dark:bg-slate-900/90 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-650 dark:hover:text-red-400 transition-all border-slate-200 dark:border-slate-850 text-red-650 dark:text-red-400 shadow-sm rounded-lg"
                  onClick={() => confirmDelete(listingId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div>
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={listing.image} 
                      alt={listing.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-white text-lg truncate drop-shadow-md">{listing.name}</h3>
                      <div className="flex items-center gap-1 text-white/90 text-sm mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="truncate">{listing.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-indigo-100 dark:border-indigo-950/50 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-lg font-semibold">{listing.vibe}</Badge>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {listing.rules?.length || 0} rules
                      </span>
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === listingId ? (
                      <div className="bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                          <AlertTriangle className="w-4 h-4 text-red-550" />
                          <span className="font-semibold text-sm">Delete this hostel?</span>
                        </div>
                        <p className="text-red-650 dark:text-red-305 text-xs leading-relaxed">
                          This action cannot be undone. All rules and reviews will be permanently deleted.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 rounded-xl font-medium"
                            onClick={() => handleDeleteListing(listingId)}
                            disabled={deleting === listingId}
                          >
                            {deleting === listingId ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              'Delete'
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-xl border-slate-200 dark:border-slate-800 font-medium"
                            onClick={cancelDelete}
                            disabled={deleting === listingId}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* PDF Upload */}
                          <label className="block">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              id={`file-${listingId}`}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePDFUpload(listingId, file);
                              }}
                              disabled={uploading === listingId || !aiStatus.gemini}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full gap-2 border-slate-200 dark:border-slate-800 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-750 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors disabled:opacity-50 rounded-xl font-medium"
                              disabled={uploading === listingId || !aiStatus.gemini}
                              asChild
                            >
                              <span onClick={() => document.getElementById(`file-${listingId}`)?.click()} className="cursor-pointer">
                                {uploading === listingId ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                Upload Rules
                              </span>
                            </Button>
                          </label>

                          {/* View Rules */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 border-slate-200 dark:border-slate-800 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-750 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors rounded-xl font-medium"
                            onClick={() => handleViewRules(listing)}
                            disabled={!listing.rules || listing.rules.length === 0}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Rules
                          </Button>
                        </div>

                        {/* Index to Pinecone */}
                        <Button
                          variant="default"
                          className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-750 text-white rounded-xl font-semibold shadow-md shadow-indigo-100/50 dark:shadow-none hover:shadow-indigo-200/50 transition-all duration-300"
                          onClick={() => handleIndexRules(listingId)}
                          disabled={indexing === listingId || !aiStatus.gemini || !aiStatus.pinecone}
                        >
                          {indexing === listingId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Brain className="w-4 h-4" />
                          )}
                          Index for AI Search
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Instructions */}
      <Card className="mt-8 border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            How RAG Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative flex flex-col md:flex-row gap-8 md:gap-4 justify-between mt-8">
            {/* Connecting line */}
            <div className="absolute top-8 left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hidden md:block z-0 opacity-40 dark:opacity-60" />

            {/* Step 1 */}
            <div className="relative z-10 flex-1 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-200/50 dark:shadow-none hover:shadow-indigo-400/50 dark:hover:shadow-none transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 relative border-4 border-[#F8FAFC] dark:border-slate-950">
                <Upload className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold flex items-center justify-center border-2 border-[#F8FAFC] dark:border-slate-950">1</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Upload PDF</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px]">Upload your "House Rules & Agreement" PDF. Gemini AI extracts rules, curfew times, and policies.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex-1 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-purple-200/50 dark:shadow-none hover:shadow-purple-400/50 dark:hover:shadow-none transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-3 relative border-4 border-[#F8FAFC] dark:border-slate-950">
                <Brain className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold flex items-center justify-center border-2 border-[#F8FAFC] dark:border-slate-950">2</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Index Rules</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px]">Rules are converted to embeddings and stored in Pinecone vector database for semantic search.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex-1 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-pink-200/50 dark:shadow-none hover:shadow-pink-400/50 dark:hover:shadow-none transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 relative border-4 border-[#F8FAFC] dark:border-slate-950">
                <Sparkles className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold flex items-center justify-center border-2 border-[#F8FAFC] dark:border-slate-950">3</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Ask Warden Bot</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px]">Users ask questions, relevant rules are retrieved, and Gemini generates accurate answers.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules Modal */}
      {viewingRules && selectedListing && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden backdrop-blur-lg flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800 dark:from-indigo-100 dark:to-purple-200">House Rules</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{selectedListing.name}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={closeRulesModal}
                className="hover:bg-slate-100 dark:hover:bg-slate-805 border-slate-205 dark:border-slate-800 rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[55vh] space-y-4">
              {selectedListing.rules && selectedListing.rules.length > 0 ? (
                <div className="grid gap-4">
                  {selectedListing.rules.map((rule: any, index: number) => (
                    <div key={index} className="bg-white/40 dark:bg-slate-900/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors shadow-sm">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-205 text-lg">
                          {rule.title || `Rule ${index + 1}`}
                        </h3>
                        {rule.clause && (
                          <Badge variant="outline" className="text-xs bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50 rounded-lg whitespace-nowrap">
                            Clause {rule.clause}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
                        {rule.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-305 dark:text-slate-600" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Rules Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Upload a PDF document to extract house rules for this hostel.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {selectedListing.rules?.length || 0} rules extracted
              </div>
              <Button onClick={closeRulesModal} variant="outline" className="border-slate-200 dark:border-slate-800 rounded-xl px-5 font-semibold">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
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

export default ManageListings;
