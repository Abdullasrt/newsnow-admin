import React, { useState, useMemo } from 'react';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  FileText,
  ShieldCheck,
  Eye,
  X
} from 'lucide-react';

const LICENSE_OPTIONS = [
  'Staff Wire Photography',
  'Licensed / Associated Press',
  'Creative Commons BY-SA',
  'Exclusive Newsroom Copyright',
  'Editorial Fair Use',
  'Public Domain / Open Data'
];

export const AdminMediaPage = () => {
  const { mediaAssets, addMediaAsset, deleteMediaAsset, showToast } = useNews();

  // Search & Type Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'image' | 'infographic' | 'document' | 'video'
  const [selectedLicense, setSelectedLicense] = useState('all');

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadType, setUploadType] = useState('image');
  const [uploadCredit, setUploadCredit] = useState('');
  const [uploadLicense, setUploadLicense] = useState('Staff Wire Photography');
  const [uploadTags, setUploadTags] = useState('Newsroom, Breaking');
  const [uploadDimensions] = useState('1920 x 1080');

  // Preview Asset Modal State
  const [previewAsset, setPreviewAsset] = useState(null);

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: '' });

  // Clipboard Copied State
  const [copiedId, setCopiedId] = useState(null);

  const filteredAssets = useMemo(() => {
    return mediaAssets.filter(asset => {
      // Type match
      if (selectedType !== 'all' && asset.type !== selectedType) return false;
      // License match
      if (selectedLicense !== 'all' && asset.license !== selectedLicense) return false;
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = asset.title.toLowerCase().includes(q);
        const matchCredit = (asset.credit || '').toLowerCase().includes(q);
        const matchTags = (asset.tags || []).some(t => t.toLowerCase().includes(q));
        return matchTitle || matchCredit || matchTags;
      }
      return true;
    });
  }, [mediaAssets, selectedType, selectedLicense, searchQuery]);

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Asset CDN URL copied to clipboard! 📋', 'success');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      showToast('Please enter an asset title.', 'error');
      return;
    }
    const finalUrl = uploadUrl.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';

    addMediaAsset({
      title: uploadTitle.trim(),
      type: uploadType,
      url: finalUrl,
      thumbnail: finalUrl,
      size: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
      dimensions: uploadDimensions || '1920 x 1080',
      credit: uploadCredit.trim() || 'News Now Staff Archive',
      license: uploadLicense,
      tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadUrl('');
    setUploadCredit('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header with Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">
              Newsroom Digital Asset Repository
            </span>
          </div>
          <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Media & Asset Library
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Centralized newsroom storage for high-resolution wire photography, vector infographics, whitepapers, and videos.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by headline, photo credit, or tag..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Type selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter media by asset type"
              className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            >
              <option value="all">All Media Types</option>
              <option value="image">Photography</option>
              <option value="infographic">Infographics</option>
              <option value="document">PDF Documents</option>
              <option value="video">B-Roll Videos</option>
            </select>

            {/* License selector */}
            <select
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              aria-label="Filter media by licensing disclosure"
              className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            >
              <option value="all">All Licensing Types</option>
              {LICENSE_OPTIONS.map(lic => (
                <option key={lic} value={lic}>{lic}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] font-mono text-neutral-400 uppercase mr-1">Filter:</span>
          {[
            { id: 'all', label: 'All Assets', count: mediaAssets.length },
            { id: 'image', label: 'Photos', count: mediaAssets.filter(m => m.type === 'image').length },
            { id: 'infographic', label: 'Infographics', count: mediaAssets.filter(m => m.type === 'infographic').length },
            { id: 'document', label: 'PDFs & Docs', count: mediaAssets.filter(m => m.type === 'document').length },
            { id: 'video', label: 'Videos', count: mediaAssets.filter(m => m.type === 'video').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedType === tab.id
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* 3. Media Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((asset) => {
          const isDoc = asset.type === 'document';
          const isCopied = copiedId === asset.id;

          return (
            <div
              key={asset.id}
              className="group bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col"
            >
              {/* Media Thumbnail or Document Icon Box */}
              <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                {isDoc ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800">
                    <FileText className="w-12 h-12 text-rose-500 mb-2" />
                    <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                      {asset.dimensions}
                    </span>
                  </div>
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                )}

                {/* Type & License Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono uppercase font-bold tracking-wider">
                    {asset.type}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-mono font-semibold">
                    {asset.size}
                  </span>
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="p-2 rounded-xl bg-white/90 text-neutral-900 hover:bg-white text-xs font-medium transition-transform hover:scale-105"
                    title="View Full Metadata"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(asset.url, asset.id)}
                    className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-medium transition-transform hover:scale-105"
                    title="Copy CDN URL"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Asset Info Card */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {asset.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{asset.license}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] font-mono text-neutral-400 line-clamp-1">
                    Credit: {asset.credit}
                  </div>
                </div>

                {/* Footer with Tags and Delete */}
                <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {asset.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopyUrl(asset.url, asset.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      title="Copy URL"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: asset.id, title: asset.title })}
                      className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <ImageIcon className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            No media assets found
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Try adjusting your search query or upload a new photo / document.
          </p>
        </div>
      )}

      {/* 4. Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121418] rounded-2xl max-w-lg w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                  Upload Newsroom Asset
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Asset Title / Description *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Cochin Shipyard Drydock Vessel Fabrication"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Asset Type
                  </label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    <option value="image">Photography (JPEG/PNG/WEBP)</option>
                    <option value="infographic">Infographic / Graphic Data</option>
                    <option value="document">PDF Document / Whitepaper</option>
                    <option value="video">Video B-Roll</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Licensing Disclosure
                  </label>
                  <select
                    value={uploadLicense}
                    onChange={(e) => setUploadLicense(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    {LICENSE_OPTIONS.map(lic => (
                      <option key={lic} value={lic}>{lic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Image or CDN URL (Optional, defaults to Unsplash preview)
                </label>
                <input
                  type="url"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Photo Credit / Attribution
                  </label>
                  <input
                    type="text"
                    value={uploadCredit}
                    onChange={(e) => setUploadCredit(e.target.value)}
                    placeholder="e.g. Photo by Arun Varma / News Now"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                    placeholder="Tech, Cleanroom, Hardware"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
                >
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Preview Full Asset Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121418] rounded-2xl max-w-2xl w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white line-clamp-1">
                  {previewAsset.title}
                </h3>
                <span className="text-[10px] font-mono text-neutral-400">
                  Uploaded: {previewAsset.uploadedAt} • {previewAsset.dimensions} • {previewAsset.size}
                </span>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden aspect-video bg-neutral-900 flex items-center justify-center">
              {previewAsset.type === 'document' ? (
                <div className="text-center p-8 text-white">
                  <FileText className="w-16 h-16 mx-auto text-rose-500 mb-2" />
                  <p className="font-bold">{previewAsset.dimensions}</p>
                </div>
              ) : (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="space-y-2 text-xs bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="flex justify-between">
                <span className="text-neutral-500">Photo Credit:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{previewAsset.credit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Licensing Rights:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{previewAsset.license}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Public CDN URL:</span>
                <span className="font-mono text-neutral-500 truncate max-w-xs">{previewAsset.url}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleCopyUrl(previewAsset.url, previewAsset.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy URL for Article</span>
              </button>

              <button
                onClick={() => setPreviewAsset(null)}
                className="px-4 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Media Asset?"
        message={`Are you sure you want to delete "${deleteModal.title}" from the newsroom repository?`}
        confirmText="Delete Asset"
        confirmVariant="danger"
        onConfirm={() => {
          deleteMediaAsset(deleteModal.id);
          setDeleteModal({ isOpen: false, id: null, title: '' });
        }}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
      />
    </div>
  );
};
