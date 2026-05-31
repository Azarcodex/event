'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Trash2, 
  ShieldAlert,
  ShieldCheck,
  Search,
  Plus
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface PdfDocument {
  _id: string;
  title: string;
  publicId: string;
  isEnabled: boolean;
  uploadedBy: { name: string; email: string };
  createdAt: string;
}

export function PdfManagementClient({ currentAdmin }: { currentAdmin: any }) {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/pdfs');
      setPdfs(data);
    } catch (error) {
      toast.error('Failed to load PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      toast.error('Please provide a file and a title');
      return;
    }

    try {
      setIsUploading(true);

      // Upload directly to Vercel Blob using client token
      // Dynamically import to avoid SSR issues if any
      const { upload } = await import('@vercel/blob/client');
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/pdfs/upload',
      });

      // 3. Save the returned Vercel Blob URL to our database
      await axios.post('/api/admin/pdfs', {
        title,
        blobUrl: blob.url,
      });
      
      toast.success('PDF uploaded securely');
      setShowUploadModal(false);
      setFile(null);
      setTitle('');
      fetchPdfs();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      await axios.patch(`/api/admin/pdfs/${id}`, { isEnabled: !currentStatus });
      toast.success(`PDF ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      setPdfs(pdfs.map(p => p._id === id ? { ...p, isEnabled: !currentStatus } : p));
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this PDF? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`/api/admin/pdfs/${id}`);
      toast.success('PDF deleted successfully');
      setPdfs(pdfs.filter(p => p._id !== id));
    } catch (error) {
      toast.error('Failed to delete PDF');
    }
  };

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/file/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard!');
  };

  const filteredPdfs = pdfs.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-indigo-500" />
            Secure PDF Sharing
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage authenticated PDFs and generate shareable links.
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="gap-2">
          <Upload size={16} /> Upload PDF
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search PDFs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Uploaded By</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="text-xs text-gray-400">Loading PDFs...</div>
                    </div>
                  </td>
                </tr>
              ) : filteredPdfs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No PDFs found.
                  </td>
                </tr>
              ) : (
                filteredPdfs.map((pdf) => (
                  <tr key={pdf._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {pdf.title}
                    </td>
                    <td className="px-6 py-4">
                      {pdf.isEnabled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <ShieldCheck size={14} /> Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
                          <ShieldAlert size={14} /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{pdf.uploadedBy?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{pdf.uploadedBy?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(pdf.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyShareLink(pdf._id)}
                          title="Copy Share Link"
                          className="h-8 w-8 !p-0 rounded"
                        >
                          <LinkIcon size={14} />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => toggleStatus(pdf._id, pdf.isEnabled)}
                          disabled={togglingId === pdf._id}
                          title={pdf.isEnabled ? "Disable Link" : "Enable Link"}
                          className={pdf.isEnabled ? "!bg-rose-500 hover:!bg-rose-600 !text-white h-8 !px-3 rounded" : "h-8 !px-3 rounded"}
                        >
                          {togglingId === pdf._id ? (
                            <span className="flex items-center gap-1.5">
                              <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                              {pdf.isEnabled ? "Disabling..." : "Enabling..."}
                            </span>
                          ) : (
                            pdf.isEnabled ? "Disable" : "Enable"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="!text-rose-500 hover:!text-rose-700 hover:!bg-rose-50 !border-transparent h-8 w-8 !p-0 rounded"
                          onClick={() => handleDelete(pdf._id)}
                          title="Delete PDF"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Upload Secure PDF</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Confidential Report 2026"
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PDF File</label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:placeholder:text-gray-400 cursor-pointer file:cursor-pointer"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" className="!border-transparent hover:!bg-gray-100" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Securely'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
