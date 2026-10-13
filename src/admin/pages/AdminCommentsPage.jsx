import React, { useState, useMemo } from 'react';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  MessageSquare,
  CheckCircle2,
  Pin,
  Ban,
  Trash2,
  Search,
  ShieldAlert,
  X
} from 'lucide-react';

export const AdminCommentsPage = () => {
  const {
    comments,
    approveComment,
    rejectComment,
    togglePinComment,
    toggleBanUser,
    showToast
  } = useNews();

  // Active Tab: 'all' | 'pending' | 'approved' | 'flagged'
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Profanity Blocklist state
  const [blocklist, setBlocklist] = useState(['crypto', 'free-coins', 'viagra', 'click-here', 'scam', 'airdrop']);
  const [newKeyword, setNewKeyword] = useState('');

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const filteredComments = useMemo(() => {
    return comments.filter(c => {
      if (activeTab !== 'all' && c.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.comment.toLowerCase().includes(q) ||
          c.author.toLowerCase().includes(q) ||
          c.articleTitle?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [comments, activeTab, searchQuery]);

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    const clean = newKeyword.trim().toLowerCase();
    if (blocklist.includes(clean)) {
      showToast('Keyword already in blocklist', 'error');
      return;
    }
    setBlocklist(prev => [...prev, clean]);
    setNewKeyword('');
    showToast(`Keyword "${clean}" added to automatic spam filter! 🛡️`, 'success');
  };

  const handleRemoveKeyword = (word) => {
    setBlocklist(prev => prev.filter(w => w !== word));
    showToast(`Keyword "${word}" removed from blocklist`, 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              Reader Discourse Moderation
            </span>
          </div>
          <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Comments & Reader Moderation
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit reader dialogue, filter automated spam, pin expert insights, and enforce editorial community guidelines.
          </p>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111317] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs text-neutral-500 font-mono">Total Comments</span>
          <div className="mt-1 font-serif font-black text-2xl text-neutral-900 dark:text-white">
            {comments.length}
          </div>
        </div>
        <div className="bg-white dark:bg-[#111317] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs text-amber-500 font-mono font-bold">Pending Review</span>
          <div className="mt-1 font-serif font-black text-2xl text-neutral-900 dark:text-white">
            {comments.filter(c => c.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white dark:bg-[#111317] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs text-emerald-500 font-mono font-bold">Approved Live</span>
          <div className="mt-1 font-serif font-black text-2xl text-neutral-900 dark:text-white">
            {comments.filter(c => c.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white dark:bg-[#111317] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs text-rose-500 font-mono font-bold">Flagged as Spam</span>
          <div className="mt-1 font-serif font-black text-2xl text-neutral-900 dark:text-white">
            {comments.filter(c => c.status === 'flagged').length}
          </div>
        </div>
      </div>

      {/* 3. Main Two Columns: Queue and Profanity Blocklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Comments Queue */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Tabs */}
          <div className="bg-white dark:bg-[#111317] rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comments by reader, text, or article title..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
              {[
                { id: 'all', label: 'All Comments' },
                { id: 'pending', label: 'Pending Queue' },
                { id: 'approved', label: 'Approved Live' },
                { id: 'flagged', label: 'Spam & Flagged' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {filteredComments.map((c) => (
              <div
                key={c.id}
                className={`bg-white dark:bg-[#111317] rounded-2xl p-4 border shadow-xs transition-all ${
                  c.pinned
                    ? 'border-amber-400/80 dark:border-amber-500/50 bg-amber-500/5'
                    : (c.status === 'flagged' ? 'border-rose-400/40 bg-rose-500/5' : 'border-neutral-200/80 dark:border-neutral-800/80')
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={c.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{c.author}</span>
                        {c.pinned && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                            <Pin className="w-3 h-3 fill-amber-500" />
                            Pinned
                          </span>
                        )}
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                          c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' : (c.status === 'flagged' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600')
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">{c.email} • {c.timestamp}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePinComment(c.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        c.pinned
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-amber-500'
                      }`}
                      title={c.pinned ? 'Unpin Comment' : 'Pin Comment to Top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    {c.status !== 'approved' && (
                      <button
                        onClick={() => approveComment(c.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs transition-colors"
                        title="Approve Comment"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => toggleBanUser(c.email)}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-600 text-xs transition-colors"
                      title="Ban User from Commenting"
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: c.id })}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-600 text-xs transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed pl-10">
                  {c.comment}
                </p>

                <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400 pl-10">
                  <span className="truncate max-w-md">On: {c.articleTitle}</span>
                  <span>👍 {c.likes || 0} reader upvotes</span>
                </div>
              </div>
            ))}
          </div>

          {filteredComments.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <MessageSquare className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
              <p className="text-xs text-neutral-500">No comments found matching this filter.</p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Profanity & Spam Blocklist Manager */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <h3 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                Automated Spam Blocklist
              </h3>
            </div>

            <p className="text-xs text-neutral-500">
              Comments containing any of these keywords will be automatically routed to the Flagged / Spam queue.
            </p>

            <form onSubmit={handleAddKeyword} className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add spam trigger word..."
                className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shrink-0"
              >
                Add Word
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {blocklist.map(word => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 text-[11px] font-mono border border-rose-500/20"
                >
                  <span>{word}</span>
                  <button
                    onClick={() => handleRemoveKeyword(word)}
                    className="hover:text-rose-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Reader Comment?"
        message="Are you sure you want to permanently delete this comment from the story thread?"
        confirmText="Delete Comment"
        confirmVariant="danger"
        onConfirm={() => {
          rejectComment(deleteModal.id);
          setDeleteModal({ isOpen: false, id: null });
        }}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
};
