import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Star,
  Columns,
  Quote,
  Layers,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Save,
  RotateCcw
} from 'lucide-react';
import { getLiveSiteUrl } from '../../utils/siteUrl';

export const AdminCurationPage = () => {
  const {
    articles,
    curatedLayout,
    updateCuratedLayout,
    showToast
  } = useNews();

  const liveArticles = articles.filter(a => a.status === 'published');

  // Local curation draft state
  const [heroId, setHeroId] = useState(curatedLayout.heroArticleId || liveArticles[0]?.id || '1');
  const [subLeadIds, setSubLeadIds] = useState(curatedLayout.subLeadArticleIds || ['2', '3', '4']);
  const [opinionIds, setOpinionIds] = useState(curatedLayout.opinionArticleIds || ['5', '6']);
  const [sectionsOrder, setSectionsOrder] = useState(
    curatedLayout.sectionOrder || ['Kerala', 'Tech', 'Business', 'Politics', 'Science', 'Culture']
  );

  const heroArticle = liveArticles.find(a => String(a.id) === String(heroId)) || liveArticles[0];

  const handleMoveSection = (index, direction) => {
    const newOrder = [...sectionsOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSectionsOrder(newOrder);
  };

  const handleSaveLayout = () => {
    updateCuratedLayout({
      heroArticleId: heroId,
      subLeadArticleIds: subLeadIds,
      opinionArticleIds: opinionIds,
      sectionOrder: sectionsOrder
    });
  };

  const handleResetLayout = () => {
    setHeroId('1');
    setSubLeadIds(['2', '3', '4']);
    setOpinionIds(['5', '6']);
    setSectionsOrder(['Kerala', 'Tech', 'Business', 'Politics', 'Science', 'Culture']);
    showToast('Reset curation draft to default newsroom edition', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header with Publish Curation CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
              Broadsheet Visual Architecture
            </span>
          </div>
          <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Homepage & Layout Curation
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Curate the frontpage hierarchy: select the hero cover story, assign secondary columns, opinion features, and order section blocks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleResetLayout}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSaveLayout}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all hover:scale-102 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Publish Frontpage Layout</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Frontpage Blueprint Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Slot Assignment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Slot A: Cover Story Hero Slot */}
          <div className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <h3 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  Slot A: Hero Cover Story
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold">
                Broadsheet Lead #1
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Select Headliner Article
              </label>
              <select
                value={heroId}
                onChange={(e) => setHeroId(e.target.value)}
                aria-label="Select Headliner Article"
                className="w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                {liveArticles.map(a => (
                  <option key={a.id} value={a.id}>
                    [{a.category}] {a.title} ({a.views || '0'} views)
                  </option>
                ))}
              </select>
            </div>

            {/* Live Hero Preview card */}
            {heroArticle && (
              <div className="rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row bg-neutral-50 dark:bg-neutral-900/40">
                <img
                  src={heroArticle.imageUrl || '/cover-story.jpg'}
                  alt=""
                  className="w-full sm:w-48 h-32 object-cover shrink-0"
                />
                <div className="p-3.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-rose-500 uppercase font-bold">
                      {heroArticle.category} Desk
                    </span>
                    <h4 className="font-serif font-bold text-xs text-neutral-900 dark:text-neutral-100 line-clamp-2 mt-0.5">
                      {heroArticle.title}
                    </h4>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-2">
                    By {heroArticle.author?.name || 'Staff'} • Dateline: {heroArticle.dateline || 'Kochi Bureau'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slot B: Secondary Lead Columns (3 Slots) */}
          <div className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-blue-500" />
                <h3 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  Slot B: Secondary Feature Columns (Top 3)
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold">
                3-Column Grid
              </span>
            </div>

            <div className="space-y-3">
              {[0, 1, 2].map((colIndex) => (
                <div key={colIndex} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {colIndex + 1}
                  </span>
                  <select
                    value={subLeadIds[colIndex] || ''}
                    onChange={(e) => {
                      const newSubs = [...subLeadIds];
                      newSubs[colIndex] = e.target.value;
                      setSubLeadIds(newSubs);
                    }}
                    aria-label={`Column ${colIndex + 1} Article`}
                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    {liveArticles.map(a => (
                      <option key={a.id} value={a.id}>
                        [{a.category}] {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Slot C: Opinion & Editorial Slots */}
          <div className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-purple-500" />
                <h3 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  Slot C: Opinion, Op-Ed & Guest Columns
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded font-bold">
                Side Column Op-Ed
              </span>
            </div>

            <div className="space-y-3">
              {[0, 1].map((opIndex) => (
                <div key={opIndex} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {opIndex + 1}
                  </span>
                  <select
                    value={opinionIds[opIndex] || ''}
                    onChange={(e) => {
                      const newOps = [...opinionIds];
                      newOps[opIndex] = e.target.value;
                      setOpinionIds(newOps);
                    }}
                    aria-label={`Opinion Slot ${opIndex + 1} Article`}
                    className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  >
                    {liveArticles.map(a => (
                      <option key={a.id} value={a.id}>
                        [{a.category}] {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Section Priority Reordering */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111317] rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <h3 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  Homepage Section Priority
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Order</span>
            </div>

            <p className="text-xs text-neutral-500">
              Use the reorder arrows to rearrange which desk blocks appear highest on the broadsheet front page.
            </p>

            <div className="space-y-2">
              {sectionsOrder.map((secName, idx) => (
                <div
                  key={secName}
                  className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-neutral-400 text-[11px] font-bold">#{idx + 1}</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{secName} Desk</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveSection(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 1)}
                      disabled={idx === sectionsOrder.length - 1}
                      className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={getLiveSiteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <span>Preview Live Frontpage</span>
                <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
