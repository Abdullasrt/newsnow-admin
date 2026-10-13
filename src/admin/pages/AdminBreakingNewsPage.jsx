import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  Zap,
  PlusCircle,
  Trash2,
  Edit3,
  Radio,
  X
} from 'lucide-react';

export const AdminBreakingNewsPage = () => {
  const {
    breakingNews,
    addBreakingNews,
    updateBreakingNews,
    deleteBreakingNews,
    categories,
    articles,
    showToast
  } = useNews();

  // Modal / Form state for Add or Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState('Kerala');
  const [time, setTime] = useState('Just now');
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [priority, setPriority] = useState('Urgent');
  const [expiresIn, setExpiresIn] = useState('4 hours');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setHeadline('');
    setCategory('Kerala');
    setTime('Just now');
    setSelectedArticleId('');
    setPriority('Urgent');
    setExpiresIn('4 hours');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setHeadline(item.title);
    setCategory(item.category || 'Kerala');
    setTime(item.time || 'Just now');
    setSelectedArticleId(item.articleId || '');
    setPriority(item.priority || 'Urgent');
    setExpiresIn(item.expiresIn || '4 hours');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!headline.trim()) {
      showToast('Please enter a breaking news headline.', 'error');
      return;
    }

    if (editingItem) {
      updateBreakingNews(editingItem.id, {
        title: headline.trim(),
        category,
        time,
        articleId: selectedArticleId || null,
        priority,
        expiresIn
      });
    } else {
      addBreakingNews({
        title: headline.trim(),
        category,
        time,
        articleId: selectedArticleId || null,
        priority,
        expiresIn
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header with Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
              Emergency Dispatch Marquee
            </span>
          </div>
          <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Breaking News Ticker
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage high-priority breaking bulletins rotating in real-time across the header of News Now.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Breaking Bulletin</span>
        </button>
      </div>

      {/* 2. Live Ticker Simulation Marquee Preview */}
      <div className="bg-[#0f1115] text-white rounded-2xl p-5 border border-neutral-800 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-rose-400 font-bold">
              Live Preview of Homepage Marquee ({breakingNews.length} Active Bulletins)
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">Broadcasting 24/7</span>
        </div>

        {/* Animated simulation banner */}
        <div className="mt-4 flex items-center overflow-hidden bg-black/40 rounded-xl border border-neutral-800/80 p-2 text-xs">
          <div className="px-3 py-1 rounded bg-rose-600 text-white font-mono uppercase text-[10px] font-black shrink-0 tracking-wider">
            BREAKING
          </div>
          <div className="flex-1 overflow-x-auto whitespace-nowrap px-4 py-1 flex items-center gap-6">
            {breakingNews.map((b) => (
              <span key={b.id} className="inline-flex items-center gap-2 font-serif text-neutral-200">
                <span className="text-rose-400 font-mono text-[10px] uppercase font-bold">
                  [{b.category}]
                </span>
                <span>{b.title}</span>
                <span className="text-neutral-500 text-[10px] font-mono">({b.time})</span>
                <span className="text-neutral-600">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Breaking Items Management List */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
            Current Active Bulletins
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            {breakingNews.length} live bulletins
          </span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {breakingNews.map((item) => {
            const linkedArticle = articles.find(a => String(a.id) === String(item.articleId));
            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-mono text-[10px] font-bold">
                        {item.category} Desk
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {item.time}
                      </span>
                      {linkedArticle && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
                          Linked to: {linkedArticle.title.substring(0, 32)}...
                        </span>
                      )}
                    </div>

                    <p className="font-serif font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-snug">
                      {item.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Edit Bulletin"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        id: item.id,
                        title: item.title
                      })
                    }
                    className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Bulletin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-[#121418] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-600" />
                <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                  {editingItem ? 'Edit Breaking Bulletin' : 'Publish Breaking Bulletin'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Headline Text
                </label>
                <textarea
                  rows={3}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Cochin International Airport achieves 100% solar-hydrogen microgrid autonomy..."
                  className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Desk Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Time Label
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. Just now, 15m ago"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Priority Alert Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="Critical Flash">Critical Flash (Top marquee order)</option>
                    <option value="Urgent">Urgent Alert</option>
                    <option value="High Priority">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Ticker Expiration Timer
                  </label>
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="1 hour">Auto-retract in 1 hour</option>
                    <option value="4 hours">Auto-retract in 4 hours</option>
                    <option value="12 hours">Auto-retract in 12 hours</option>
                    <option value="24 hours">Auto-retract in 24 hours</option>
                    <option value="Indefinite">Indefinite (Manual clear)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Link to Full Story (Optional)
                </label>
                <select
                  value={selectedArticleId}
                  onChange={(e) => setSelectedArticleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                >
                  <option value="">No link (Marquee banner only)</option>
                  {articles.map(a => (
                    <option key={a.id} value={a.id}>
                      #{a.id}: {a.title.substring(0, 48)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs shadow-rose-600/30"
                >
                  {editingItem ? 'Save Changes' : 'Broadcast Bulletin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Remove Breaking Bulletin?"
        message={`Are you sure you want to retract "${deleteModal.title}" from the live marquee ticker?`}
        confirmText="Remove Alert"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteModal.id) {
            deleteBreakingNews(deleteModal.id);
          }
        }}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
      />

    </div>
  );
};
