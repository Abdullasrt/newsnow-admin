import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  Search,
  PlusCircle,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  Eye,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  AlertCircle,
  FileText,
  Zap,
  TrendingUp,
  Filter
} from 'lucide-react';
import { getLiveSiteUrl } from '../../utils/siteUrl';

const CORE_DESKS = [
  'All',
  'Tech',
  'Kerala / Regional',
  'Business',
  'Politics',
  'Science',
  'Culture'
];

export const AdminArticlesPage = () => {
  const {
    articles,
    categories,
    deleteArticle,
    duplicateArticle,
    toggleArticleFeatured,
    updateArticle,
    showToast
  } = useNews();

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesk, setSelectedDesk] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Published' | 'Drafts' | 'Featured'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'views' | 'title'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Selection & Bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    articleId: null,
    articleTitle: '',
    isBulk: false
  });

  // Calculate high level stats
  const publishedCount = useMemo(() => articles.filter(a => a.status !== 'draft').length, [articles]);
  const draftsCount = useMemo(() => articles.filter(a => a.status === 'draft').length, [articles]);
  const coverCount = useMemo(() => articles.filter(a => a.featured).length, [articles]);
  const breakingCount = useMemo(() => articles.filter(a => a.isBreaking).length, [articles]);

  // Combined Desks list
  const combinedDesks = useMemo(() => {
    const list = [...CORE_DESKS];
    categories.forEach(c => {
      if (c !== 'All' && !list.includes(c) && !list.some(d => d.toLowerCase() === c.toLowerCase())) {
        list.push(c);
      }
    });
    return list;
  }, [categories]);

  // Filter & Sort computation
  const filteredList = useMemo(() => {
    return articles.filter(article => {
      // Desk match
      if (selectedDesk !== 'All') {
        const catA = (article.category || '').toLowerCase();
        const catB = selectedDesk.toLowerCase();
        const isKeralaMatch = (catA.includes('kerala') || catA.includes('regional')) && (catB.includes('kerala') || catB.includes('regional'));
        if (catA !== catB && !isKeralaMatch) {
          return false;
        }
      }
      // Status match
      if (statusFilter === 'Featured' && !article.featured) return false;
      if (statusFilter === 'Published' && article.status === 'draft') return false;
      if (statusFilter === 'Drafts' && article.status !== 'draft') return false;

      // Search match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = article.title?.toLowerCase().includes(query);
        const matchExcerpt = article.excerpt?.toLowerCase().includes(query);
        const matchAuthor = article.author?.name?.toLowerCase().includes(query);
        const matchTags = article.tags?.some(t => t.toLowerCase().includes(query));
        return matchTitle || matchExcerpt || matchAuthor || matchTags;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'views') {
        const parseV = (v) => {
          if (!v) return 0;
          if (typeof v === 'number') return v;
          if (v.includes('k')) return parseFloat(v) * 1000;
          return parseFloat(v) || 0;
        };
        return parseV(b.views) - parseV(a.views);
      }
      return Number(b.id) - Number(a.id);
    });
  }, [articles, selectedDesk, statusFilter, searchTerm, sortBy]);

  // Bulk select handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map(a => a.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteConfirm = () => {
    selectedIds.forEach(id => deleteArticle(id));
    setSelectedIds([]);
    showToast(`${selectedIds.length} dispatches deleted.`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Newsroom Dispatches
            </span>
            <span className="text-xs font-mono text-neutral-400">
              {articles.length} dispatches total
            </span>
          </div>
          <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Editorial Articles Manager
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create, edit, organize, and monitor all dispatches across regional and global bureaus.
          </p>
        </div>

        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-rose-900/20 transition-all hover:scale-102 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Compose New Dispatch</span>
        </Link>
      </div>

      {/* 2. Quick Newsroom Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Live Published</div>
            <div className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white mt-0.5">
              {publishedCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">In Draft</div>
            <div className="font-serif font-bold text-xl sm:text-2xl text-amber-600 dark:text-amber-400 mt-0.5">
              {draftsCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Cover Stories</div>
            <div className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white mt-0.5">
              {coverCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Breaking Wire</div>
            <div className="font-serif font-bold text-xl sm:text-2xl text-rose-600 dark:text-rose-400 mt-0.5">
              {breakingCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50">
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Search, Filter & View Controls */}
      <div className="bg-white dark:bg-[#111317] rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        
        {/* Top: Search bar & Sort/View controls */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by headline, journalist, excerpt, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Status & Sort Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-rose-500 transition-colors font-medium"
            >
              <option value="All">All Stories ({articles.length})</option>
              <option value="Published">Live Published ({publishedCount})</option>
              <option value="Drafts">Drafts Only ({draftsCount})</option>
              <option value="Featured">Cover Stories ⭐ ({coverCount})</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-rose-500 transition-colors font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="views">Most Views</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Interactive Desk Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-neutral-100 dark:border-neutral-800/80 scrollbar-none">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-rose-500" />
            <span>Desks:</span>
          </span>
          {combinedDesks.map(d => {
            const isSelected = selectedDesk.toLowerCase() === d.toLowerCase();
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDesk(d)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {d === 'All' ? 'All Desks' : `${d} Desk`}
              </button>
            );
          })}
        </div>

        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs animate-in fade-in">
            <span className="font-semibold text-rose-800 dark:text-rose-300">
              {selectedIds.length} dispatches selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({
                    isOpen: true,
                    articleId: null,
                    articleTitle: `${selectedIds.length} selected articles`,
                    isBulk: true
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Dispatches List: Table vs Grid */}
      {filteredList.length === 0 ? (
        <div className="p-14 text-center bg-white dark:bg-[#111317] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-neutral-800 dark:text-neutral-200">
            No matching dispatches found
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, desk filter, or compose a new story.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedDesk('All');
              setStatusFilter('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white dark:bg-[#111317] rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800/80 text-neutral-500 dark:text-neutral-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-3.5 w-8">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      {selectedIds.length === filteredList.length ? (
                        <CheckSquare className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Story Dispatch</th>
                  <th className="py-3.5 px-3">Desk Beat</th>
                  <th className="py-3.5 px-3">Journalist</th>
                  <th className="py-3.5 px-3">Readership</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filteredList.map((article) => {
                  const isSelected = selectedIds.includes(article.id);
                  const isDraft = article.status === 'draft';
                  return (
                    <tr
                      key={article.id}
                      className={`hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors ${
                        isSelected ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(article.id)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3.5 max-w-lg">
                          <img
                            src={article.imageUrl || '/cover-story.jpg'}
                            alt=""
                            className="w-14 h-14 rounded-2xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-800 shrink-0 shadow-xs"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/admin/articles/edit/${article.id}`}
                              className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-rose-600 dark:hover:text-rose-400 line-clamp-1 text-sm font-serif"
                            >
                              {article.title}
                            </Link>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                              {article.excerpt}
                            </p>
                            <div className="text-[10px] font-mono text-neutral-400 mt-1 flex items-center gap-2">
                              <span>{article.publishedAt || 'Recent'}</span>
                              <span>•</span>
                              <span>{article.readTime || '4 min read'}</span>
                              {article.isBreaking && (
                                <span className="text-rose-500 font-bold flex items-center gap-0.5">
                                  <Zap className="w-3 h-3" /> Live Wire
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] font-semibold">
                            {article.category}
                          </span>
                          {article.tags && article.tags.length > 0 && (
                            <div className="text-[10px] text-neutral-400 font-mono line-clamp-1">
                              #{article.tags.slice(0, 2).join(' #')}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-neutral-300 dark:ring-neutral-700"
                          />
                          <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[120px]">
                            {article.author?.name || 'Staff Editor'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{article.views || '1.2k'}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5 font-sans">
                          {article.readTime || '4 min'} read
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {isDraft ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-[10px] border border-amber-300 dark:border-amber-800">
                              Draft 📝
                            </span>
                            <button
                              type="button"
                              onClick={() => updateArticle(article.id, { status: 'published' })}
                              className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-xs transition-colors"
                              title="Publish this draft live immediately"
                            >
                              Publish
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleArticleFeatured(article.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                              article.featured
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 shadow-xs'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border-transparent hover:text-neutral-700 dark:hover:text-neutral-200'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${article.featured ? 'fill-amber-400 text-amber-500' : ''}`} />
                            <span>{article.featured ? 'Cover Lead' : 'Live 🟢'}</span>
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Edit dispatch"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => duplicateArticle(article.id)}
                            className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Duplicate as new draft"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={getLiveSiteUrl(`/article/${article.id}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Preview on live reader broadsheet"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                articleId: article.id,
                                articleTitle: article.title,
                                isBulk: false
                              })
                            }
                            className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-[#111317] rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs flex flex-col group hover:border-neutral-400 dark:hover:border-neutral-700 transition-all"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <img
                  src={article.imageUrl || '/cover-story.jpg'}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white font-mono text-[10px] font-bold">
                    {article.category}
                  </span>
                  {article.status === 'draft' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px] shadow-xs">
                      Draft 📝
                    </span>
                  ) : article.featured ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-black" />
                      Cover
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link
                    to={`/admin/articles/edit/${article.id}`}
                    className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 line-clamp-2 leading-snug transition-colors"
                  >
                    {article.title}
                  </Link>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] font-mono text-neutral-400">
                    {article.views || '1.2k'} views • {article.readTime || '4 min'}
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/articles/edit/${article.id}`}
                      className="p-1.5 text-neutral-500 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <a
                      href={getLiveSiteUrl(`/article/${article.id}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Preview on live reader broadsheet"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          articleId: article.id,
                          articleTitle: article.title,
                          isBulk: false
                        })
                      }
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.isBulk ? 'Delete Selected Dispatches?' : 'Delete Article Dispatch?'}
        message={
          deleteModal.isBulk
            ? `Are you sure you want to delete ${selectedIds.length} dispatches? This action will remove them permanently from the newsroom and live readers.`
            : `Are you sure you want to permanently delete "${deleteModal.articleTitle}"?`
        }
        confirmText="Yes, Delete"
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteModal.isBulk) {
            handleBulkDeleteConfirm();
          } else if (deleteModal.articleId) {
            deleteArticle(deleteModal.articleId);
          }
        }}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            articleId: null,
            articleTitle: '',
            isBulk: false
          })
        }
      />

    </div>
  );
};
