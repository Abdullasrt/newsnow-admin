import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import {
  FileCheck2,
  CheckCircle2,
  Edit3,
  Search,
  MessageSquare,
  User,
  X,
  ShieldCheck,
  Send
} from 'lucide-react';

export const AdminReviewQueuePage = () => {
  const {
    articles,
    approveArticle,
    rejectArticle,
    currentRole,
    rolePermissions,
    showToast
  } = useNews();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesk, setSelectedDesk] = useState('All');

  // Request Changes Modal
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    articleId: null,
    title: '',
    feedbackNotes: ''
  });

  // Story Quick Read Modal
  const [previewArticle, setPreviewArticle] = useState(null);

  // Filter only articles that are in review (or draft with reviewNotes)
  const reviewQueueArticles = useMemo(() => {
    return articles.filter(a => a.status === 'in_review');
  }, [articles]);

  const filteredQueue = useMemo(() => {
    return reviewQueueArticles.filter(article => {
      if (selectedDesk !== 'All' && !article.category?.toLowerCase().includes(selectedDesk.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return article.title?.toLowerCase().includes(q) || article.author?.name?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [reviewQueueArticles, selectedDesk, searchQuery]);

  const handleApprove = (articleId) => {
    if (!rolePermissions.canApproveReviews) {
      showToast(`Role "${currentRole}" lacks permission to approve live dispatches. Switch to Chief Editor or Desk Editor.`, 'error');
      return;
    }
    approveArticle(articleId);
  };

  const handleOpenFeedback = (article) => {
    setFeedbackModal({
      isOpen: true,
      articleId: article.id,
      title: article.title,
      feedbackNotes: 'Please refine the third paragraph regarding foreign semiconductor supply chains and verify dateline.'
    });
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackModal.feedbackNotes.trim()) {
      showToast('Please provide editorial feedback notes.', 'error');
      return;
    }
    rejectArticle(feedbackModal.articleId, feedbackModal.feedbackNotes.trim());
    setFeedbackModal({ isOpen: false, articleId: null, title: '', feedbackNotes: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Masthead & Review Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
              Editorial Workflow Stage 2
            </span>
          </div>
          <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Editorial Review Queue
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Dispatches submitted by staff reporters and bureau correspondents awaiting Desk Editor verification and fact-checking.
          </p>
        </div>

        {/* Current Role status indicator */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-[#111317] border border-neutral-200 dark:border-neutral-800 text-xs flex items-center gap-2 self-start sm:self-auto shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-rose-500" />
          <span className="text-neutral-500">Active Reviewer Role:</span>
          <span className="font-bold text-neutral-900 dark:text-white">{currentRole}</span>
          {!rolePermissions.canApproveReviews && (
            <span className="text-[10px] text-amber-500 font-mono">(Read-only)</span>
          )}
        </div>
      </div>

      {/* 2. Search & Desk Filter */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queue by dispatch headline or reporter..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['All', 'Tech', 'Kerala', 'Business', 'Politics', 'Science'].map(desk => (
            <button
              key={desk}
              onClick={() => setSelectedDesk(desk)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                selectedDesk === desk
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {desk} Desk
            </button>
          ))}
        </div>
      </div>

      {/* 3. Review Queue Stories List */}
      <div className="space-y-4">
        {filteredQueue.map((article) => (
          <div
            key={article.id}
            className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            {/* Story Summary Left Column */}
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <img
                src={article.imageUrl || '/cover-story.jpg'}
                alt=""
                className="w-20 h-20 rounded-xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-800 shrink-0 hidden sm:block"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                    Awaiting Desk Review
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] font-semibold">
                    {article.category} Desk
                  </span>
                  <span className="text-neutral-400 text-[11px] font-mono">
                    Dateline: {article.dateline || 'Kochi Bureau'}
                  </span>
                </div>

                <h3 className="mt-1.5 font-serif font-bold text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {article.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="mt-2.5 flex items-center gap-3 text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {article.author?.name || 'Staff Reporter'}
                    </span>
                    <span className="text-neutral-400 text-[11px]">({article.author?.bureau || 'Reporter'})</span>
                  </div>
                  <span>•</span>
                  <span className="font-mono text-[11px]">{article.readTime || '4 min read'}</span>
                  {article.reviewNotes && (
                    <>
                      <span>•</span>
                      <span className="text-rose-500 font-mono text-[11px]">
                        Reporter Note: {article.reviewNotes}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Editorial Action Buttons Right Column */}
            <div className="flex items-center gap-2 lg:flex-col lg:items-end shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setPreviewArticle(article)}
                  className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors"
                  title="Read full dispatch draft"
                >
                  Quick Review
                </button>

                <Link
                  to={`/admin/articles/edit/${article.id}`}
                  className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors"
                  title="Open in full broadsheet editor"
                >
                  <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                  Edit
                </Link>

                <button
                  onClick={() => handleOpenFeedback(article)}
                  className="px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 text-xs font-semibold transition-colors"
                  title="Send feedback notes back to reporter"
                >
                  Request Changes
                </button>

                <button
                  onClick={() => handleApprove(article.id, article.title)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs shadow-emerald-600/20 transition-all hover:scale-102 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Publish Live</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQueue.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <FileCheck2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
          <h3 className="font-serif font-bold text-base text-neutral-800 dark:text-neutral-200">
            Review Queue All Clear!
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            All submitted reporter dispatches have been verified and published. New submissions will appear here automatically.
          </p>
          <div className="mt-4">
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
            >
              Compose a new story draft →
            </Link>
          </div>
        </div>
      )}

      {/* 4. Request Changes Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121418] rounded-2xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                  Request Editorial Changes
                </h3>
              </div>
              <button
                onClick={() => setFeedbackModal({ isOpen: false, articleId: null, title: '', feedbackNotes: '' })}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-[11px] font-mono text-neutral-400">Story:</span>
              <p className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
                {feedbackModal.title}
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Desk Editor Notes & Instructions for Reporter *
                </label>
                <textarea
                  value={feedbackModal.feedbackNotes}
                  onChange={(e) => setFeedbackModal(prev => ({ ...prev, feedbackNotes: e.target.value }))}
                  rows={4}
                  className="w-full p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  placeholder="Specify factual clarifications, photo replacements, or tone adjustments..."
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackModal({ isOpen: false, articleId: null, title: '', feedbackNotes: '' })}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notes Back to Reporter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Quick Preview Story Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121418] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-mono text-[10px] font-bold uppercase">
                  Proofing Mode
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  By {previewArticle.author?.name || 'Reporter'}
                </span>
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <h2 className="font-serif font-black text-2xl text-neutral-900 dark:text-white">
                {previewArticle.title}
              </h2>
              <p className="text-sm italic text-neutral-600 dark:text-neutral-300 font-serif border-l-2 border-rose-500 pl-3">
                {previewArticle.excerpt}
              </p>
              {previewArticle.imageUrl && (
                <img
                  src={previewArticle.imageUrl}
                  alt=""
                  className="w-full max-h-72 object-cover rounded-xl"
                />
              )}
              <div
                className="text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 space-y-3 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: previewArticle.content || '<p>No content preview available.</p>' }}
              />
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-neutral-400">
                Desk: {previewArticle.category} • Read: {previewArticle.readTime}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenFeedback(previewArticle);
                    setPreviewArticle(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-amber-400 text-amber-600 text-xs font-semibold"
                >
                  Request Changes
                </button>
                <button
                  onClick={() => {
                    handleApprove(previewArticle.id, previewArticle.title);
                    setPreviewArticle(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs"
                >
                  Approve & Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
