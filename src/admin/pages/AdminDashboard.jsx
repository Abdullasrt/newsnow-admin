import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import {
  FileText,
  Eye,
  FileCheck2,
  Zap,
  Inbox,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  ArrowUpRight,
  Clock,
  Layers,
  Star,
  Radio,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { getLiveSiteUrl } from '../../utils/siteUrl';

const CATEGORY_COLORS = {
  Tech: 'bg-blue-600',
  Kerala: 'bg-emerald-600',
  'Kerala / Regional': 'bg-emerald-600',
  Business: 'bg-amber-600',
  Politics: 'bg-rose-600',
  Science: 'bg-cyan-600',
  Culture: 'bg-purple-600'
};

export const AdminDashboard = () => {
  const {
    adminUser,
    articles,
    breakingNews,
    categories,
    enquiries,
    toggleArticleFeatured,
    updateArticle,
    showToast
  } = useNews();

  // Compute stats
  const totalArticles = articles.length;
  const liveArticles = articles.filter(a => a.status !== 'draft');
  const draftArticles = articles.filter(a => a.status === 'draft');
  const inReviewArticles = articles.filter(a => a.status === 'in_review');
  const featuredArticles = articles.filter(a => a.featured);
  const unreadEnquiries = enquiries.filter(e => e.status === 'unread');

  // Currently active cover story (first featured or first article)
  const activeCoverStory = featuredArticles[0] || articles[0];

  // Top 5 stories sorted by views
  const topArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => {
        const parseV = (v) => {
          if (!v) return 0;
          if (typeof v === 'number') return v;
          if (typeof v === 'string' && v.includes('k')) return parseFloat(v) * 1000;
          return parseFloat(v) || 0;
        };
        return parseV(b.views) - parseV(a.views);
      })
      .slice(0, 5);
  }, [articles]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach(c => {
      counts[c] = articles.filter(a => {
        const cat = a.category ? a.category.toLowerCase() : '';
        const match = c.toLowerCase();
        return cat === match || (match.includes('kerala') && cat.includes('kerala'));
      }).length;
    });
    return counts;
  }, [categories, articles]);

  const [todayStr] = React.useState(() =>
    new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  );

  const handleQuickPublishDraft = (article) => {
    updateArticle(article.id, {
      ...article,
      status: 'published',
      publishedAt: article.publishedAt || 'Just now'
    });
    showToast('Story published to live feed', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Newsroom Welcome & Masthead Bar */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              Broadsheet Edition Live • Kochi Desk
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span className="text-xs font-mono text-neutral-400">
              {todayStr}
            </span>
          </div>

          <h2 className="mt-1.5 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-tight">
            Newsroom Desk: {adminUser?.name || 'Chief Editor'}
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl">
            {adminUser?.role || 'Editor-in-Chief'} • {adminUser?.bureau || 'Kochi Executive Bureau'} • Managing South Asian investigative journalism, live breaking wires, and daily digital editions.
          </p>
        </div>

        {/* Quick Editorial Actions */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all hover:scale-102"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Compose Dispatch</span>
          </Link>

          <Link
            to="/admin/breaking"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors"
          >
            <Zap className="w-4 h-4 text-rose-500" />
            <span>Live Ticker ({breakingNews.length})</span>
          </Link>

          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-colors"
          >
            <Inbox className="w-4 h-4 text-amber-500" />
            <span>Tips & Scoops ({unreadEnquiries.length})</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Newsroom Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Published */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Published Dispatches</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif font-black text-2xl text-neutral-900 dark:text-white">
              {totalArticles}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{liveArticles.length} Live</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">{draftArticles.length} Drafts</span>
            </div>
          </div>
        </div>

        {/* Total Impressions / Views */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Est. Monthly Reach</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif font-black text-2xl text-neutral-900 dark:text-white">
              284.5k
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% readership surge</span>
            </div>
          </div>
        </div>

        {/* Editorial Review Queue */}
        <Link
          to="/admin/review-queue"
          className="p-5 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden group hover:border-amber-500/50 transition-colors block"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Review Queue</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif font-black text-2xl text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{inReviewArticles.length}</span>
              {inReviewArticles.length > 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  To Approve
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
              <span>Dispatches awaiting desk signoff</span>
            </div>
          </div>
        </Link>

        {/* Whistleblower Tips & Inquiries */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111317] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>Editorial Tips Desk</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/50">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-serif font-black text-2xl text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{enquiries.length}</span>
              {unreadEnquiries.length > 0 && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30">
                  {unreadEnquiries.length} New
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <span>Whistleblowers & Op-Eds</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Breaking News Ticker Monitor */}
      <div className="bg-gradient-to-r from-neutral-900 via-[#14161b] to-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-lg bg-rose-600/30 text-rose-400 border border-rose-500/40">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-black uppercase tracking-wider">
              Live Wire Marquee
            </span>
            <span className="hidden sm:inline-block text-xs text-neutral-400 font-medium">
              Broadcasting continuously across frontpage
            </span>
          </div>

          <Link
            to="/admin/breaking"
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
          >
            <span>Manage All Wire ({breakingNews.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {breakingNews.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50 flex items-start gap-3 hover:bg-neutral-800/80 transition-colors"
            >
              <Zap className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-neutral-100 line-clamp-1">
                  {item.title}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 mt-1">
                  <span className="text-rose-400 font-bold uppercase">{item.category}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                  {item.articleId && (
                    <>
                      <span>•</span>
                      <span className="text-blue-400">Linked to Article</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Drafts Quick Action (If any drafts exist) */}
      {draftArticles.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/30 dark:bg-amber-950/20 dark:border-amber-500/30 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold text-sm">📝 In-Progress Drafts ({draftArticles.length})</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline-block">
                Ready to review and publish to live readers
              </span>
            </div>
            <Link
              to="/admin/articles"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              All Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {draftArticles.slice(0, 3).map((draft) => (
              <div
                key={draft.id}
                className="bg-white dark:bg-[#111317] rounded-xl p-3 border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                    {draft.title}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    Desk: <span className="text-rose-500 font-bold">{draft.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleQuickPublishDraft(draft)}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition-colors"
                    title="Publish directly to live feed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    to={`/admin/articles/edit/${draft.id}`}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Open editor"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Main Two Column Grid: Top Articles & Editorial Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Top Performing Dispatches Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
                Top Performing Stories
              </h3>
              <p className="text-xs text-neutral-500">
                Most engaged dispatches across all newsroom bureaus
              </p>
            </div>

            <Link
              to="/admin/articles"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              View All Articles ({totalArticles}) →
            </Link>
          </div>

          <div className="bg-white dark:bg-[#111317] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800/80 text-neutral-500 dark:text-neutral-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Headline & Author</th>
                    <th className="py-3 px-3">Desk</th>
                    <th className="py-3 px-3">Readership</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {topArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3 max-w-md">
                          <img
                            src={article.imageUrl || '/cover-story.jpg'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              to={`/admin/articles/edit/${article.id}`}
                              className="font-bold text-neutral-900 dark:text-neutral-100 hover:text-rose-600 dark:hover:text-rose-400 line-clamp-1 text-xs"
                            >
                              {article.title}
                            </Link>
                            <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                              By {article.author?.name || 'Staff Editor'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] font-semibold">
                          {article.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-neutral-600 dark:text-neutral-400">
                        <div>{article.views || '1.2k'} views</div>
                        <div className="text-[10px] text-neutral-400">{article.readTime || '4 min'} read</div>
                      </td>

                      <td className="py-3.5 px-3">
                        {article.status === 'draft' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-semibold text-[10px]">
                            Draft
                          </span>
                        ) : article.featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                            <Star className="w-3 h-3 fill-amber-400" />
                            Cover
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">
                            Live
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleArticleFeatured(article.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              article.featured
                                ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                                : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-amber-500'
                            }`}
                            title={article.featured ? 'Remove from Cover Lead' : 'Promote to Cover Lead'}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Edit dispatch"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Link>

                          <a
                            href={getLiveSiteUrl(`/article/${article.id}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="View on public site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Desk Coverage & Real-time Newsroom Feed */}
        <div className="space-y-6">
          {/* Desk Coverage Distribution */}
          <div className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-500" />
                Desk Distribution
              </h4>
              <Link
                to="/admin/categories"
                className="text-[11px] font-mono text-rose-500 hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {categories.filter(c => c !== 'All').map((cat) => {
                const count = categoryCounts[cat] || 0;
                const percentage = totalArticles > 0 ? Math.round((count / totalArticles) * 100) : 0;
                const colorClass = CATEGORY_COLORS[cat] || 'bg-rose-600';
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      <span>{cat} Desk</span>
                      <span className="font-mono text-neutral-500 text-[11px]">{count} stories ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${colorClass} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(percentage, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Cover Story Showcase */}
          {activeCoverStory && (
            <div className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Hero Cover Feature
                </h4>
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">Frontpage Headliner</span>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-video group">
                <img
                  src={activeCoverStory.imageUrl || '/cover-story.jpg'}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3.5 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                    {activeCoverStory.category}
                  </span>
                  <div className="font-serif font-bold text-xs line-clamp-2 mt-0.5 text-neutral-100">
                    {activeCoverStory.title}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">
                  By {activeCoverStory.author?.name || 'Staff Editor'}
                </span>
                <Link
                  to={`/admin/articles/edit/${activeCoverStory.id}`}
                  className="text-rose-600 dark:text-rose-400 font-semibold hover:underline text-[11px]"
                >
                  Edit Cover Story →
                </Link>
              </div>
            </div>
          )}

          {/* Recent Editorial Log */}
          <div className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-500" />
                Newsroom Wire Activity
              </h4>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">Live Stream</span>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Arun Varma</span> reviewed whistleblower ticket #4821
                  <div className="text-[10px] font-mono text-neutral-400">12 mins ago</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Silicon Coast</span> dispatch surpassed 54,000 views
                  <div className="text-[10px] font-mono text-neutral-400">45 mins ago</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Breaking news bulletin</span> rotated on Kochi live grid
                  <div className="text-[10px] font-mono text-neutral-400">2 hours ago</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Ananya Nambiar</span> updated deep-tech cover feature
                  <div className="text-[10px] font-mono text-neutral-400">Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
