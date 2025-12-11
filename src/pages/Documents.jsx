import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadDocument, searchDocuments } from '../api/documents';
import Upload from '../components/documents/Upload';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileText, Search, Trash2, Download, File, Sparkles, Image, FileType, Filter, Grid, List as ListIcon, Clock, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { cn } from '../utils';

export default function Documents() {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        const storedDocs = localStorage.getItem(`documents_${user.userId}`);
        if (storedDocs) {
            setDocuments(JSON.parse(storedDocs));
        }
    }, [user.userId]);

    const saveDocuments = (newDocs) => {
        setDocuments(newDocs);
        localStorage.setItem(`documents_${user.userId}`, JSON.stringify(newDocs));
    };

    const handleUpload = async (files) => {
        setUploading(true);
        const newDocs = [];

        for (const file of files) {
            try {
                // Simulate upload delay for realism
                await new Promise(resolve => setTimeout(resolve, 800));

                const response = await uploadDocument(user.userId, file);
                newDocs.push(response);
                toast.success(`Uploaded ${file.name}`);
            } catch (error) {
                console.error(error);
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        if (newDocs.length > 0) {
            saveDocuments([...newDocs, ...documents]);
        }
        setUploading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await searchDocuments(user.userId, searchQuery);
            setSearchResults(response);
        } catch (error) {
            console.error(error);
            toast.error('Search failed');
        } finally {
            setSearching(false);
        }
    };

    const handleDelete = (fileId) => {
        const newDocs = documents.filter(d => d.fileId !== fileId);
        saveDocuments(newDocs);
        toast.success('Document removed');
    };

    const getFileIcon = (fileName) => {
        if (fileName.endsWith('.pdf')) return <FileText className="text-red-500" size={24} />;
        if (fileName.endsWith('.docx')) return <FileType className="text-blue-500" size={24} />;
        if (fileName.match(/\.(jpg|jpeg|png)$/)) return <Image className="text-purple-500" size={24} />;
        return <File className="text-gray-400" size={24} />;
    };

    const totalSize = documents.reduce((acc, doc) => acc + (doc.size || 0), 0);

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-12 px-4 sm:px-6">

            {/* Header / Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl">
                {/* Abstract Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-10%] w-[80%] h-[150%] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl opacity-60"></div>
                </div>

                <div className="relative z-10 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                            <Sparkles className="text-indigo-400" size={14} />
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">AI Knowledge Base</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-4">
                            Unlock insights from your documents
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                            Upload your files and ask complex questions using our advanced semantic search engine.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-6">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl min-w-[140px]">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <File size={16} /> Total Files
                            </div>
                            <div className="text-2xl font-bold text-white">{documents.length}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl min-w-[140px]">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <HardDrive size={16} /> Used Storage
                            </div>
                            <div className="text-2xl font-bold text-white">{(totalSize / 1024 / 1024).toFixed(1)} MB</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Search Bar - Floating Overlap */}
            <div className="relative -mt-16 mx-4 md:mx-12 lg:mx-20 z-20">
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl flex items-center p-2 shadow-xl">
                        <Search className="text-gray-400 ml-4 mr-3" size={24} />
                        <input
                            type="text"
                            placeholder="Ask a question about your documents... (e.g., 'Summarize the Q3 financial report')"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 text-lg h-12"
                        />
                        <button
                            type="submit"
                            disabled={searching}
                            className="ml-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                        >
                            {searching ? <Sparkles className="animate-spin" size={20} /> : (
                                <>
                                    <span>Ask AI</span>
                                    <Sparkles size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* AI Answer Section */}
            {searchResults && (
                <div className="mx-4 md:mx-12 lg:mx-20 animate-fade-in-up">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                        <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center">
                            <Sparkles size={18} className="mr-2 text-indigo-500" /> AI Response
                        </h3>
                        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                            {searchResults.answer}
                        </div>

                        {searchResults.sources && searchResults.sources.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sources</h4>
                                <div className="flex flex-wrap gap-2">
                                    {searchResults.sources.map((source, idx) => (
                                        <div key={idx} className="flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                                            <FileText size={14} className="mr-2 text-gray-400" />
                                            <span className="font-medium">{source.fileName}</span>
                                            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">
                                                {(source.relevanceScore * 100).toFixed(0)}% relevant
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Sidebar: Upload & Actions (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-8">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mr-3">
                                    <CloudUpload size={20} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                Upload Files
                            </h2>
                            <Upload onUpload={handleUpload} isUploading={uploading} />
                        </div>

                        <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-purple-100 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pro Tip</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Upload PDFs, Word docs, or Text files. Our AI will automatically index them for instant semantic search.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main: Library (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Library</h2>
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "p-1.5 rounded-md transition-all",
                                    viewMode === 'grid' ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-1.5 rounded-md transition-all",
                                    viewMode === 'list' ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>

                    {documents.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="text-gray-300 dark:text-gray-600" size={40} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Library is empty</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                Upload your first document to get started. You can upload multiple files at once.
                            </p>
                        </div>
                    ) : (
                        <div className={cn(
                            "grid gap-4",
                            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                        )}>
                            {documents.map((doc) => (
                                <div
                                    key={doc.fileId}
                                    className={cn(
                                        "group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 relative overflow-hidden",
                                        viewMode === 'list' ? "p-4 flex items-center gap-4" : "p-5"
                                    )}
                                >
                                    {/* Action Button */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(doc.fileId); }}
                                            className="p-2 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            title="Delete file"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Icon Container */}
                                    <div className={cn(
                                        "rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center",
                                        viewMode === 'list' ? "w-12 h-12" : "w-14 h-14 mb-4"
                                    )}>
                                        {getFileIcon(doc.name)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-[15px] mb-1">
                                            {doc.name}
                                        </h3>

                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <HardDrive size={12} />
                                                {(doc.size / 1024).toFixed(0)} KB
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {doc.uploadDate ? format(new Date(doc.uploadDate), 'MMM d, yyyy') : 'Just now'}
                                            </span>
                                        </div>

                                        {viewMode === 'list' && (
                                            <div className="hidden sm:inline-flex ml-auto items-center px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-medium uppercase tracking-wider">
                                                Analyzed
                                            </div>
                                        )}
                                    </div>

                                    {viewMode === 'grid' && (
                                        <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-medium uppercase tracking-wider">
                                                Analyzed
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Icon helper
function CloudUpload({ className, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
        </svg>
    );
}
