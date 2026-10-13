import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  CheckCircle2,
  Smartphone,
  Monitor,
  Globe,
  Radio,
  Award,
  Flame,
  Search,
  Download,
  ExternalLink,
  Edit3,
  BarChart2,
  Layers
} from 'lucide-react';

export const AdminAnalyticsPage = () => {
  const { articles, categories, showToast } = useNews();
  
  // Primary Filter States
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d' | '90d'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'beats' | 'authors' | 'traffic'
  const [selectedBeat, setSelectedBeat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Real-time fluctuating readers counter
  const [liveReaders, setLiveReaders] = useState(1428);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveReaders(prev => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        return Math.max(1320, Math.min(1560, prev + delta));
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Multiplier based on timeRange
  const multiplier = timeRange === '90d' ? 3.8 : timeRange === '30d' ? 2.4 : 1;

  // Y-Axis scale guide lines (0k, 20k, 40k, 60k, 80k)
  const yAxisTicks = useMemo(() => [
    { label: '80k', value: 80000 },
    { label: '60k', value: 60000 },
    { label: '40k', value: 40000 },
    { label: '20k', value: 20000 },
    { label: '0k',  value: 0 }
  ], []);

  // Weekly data points for the minimalist modern velocity visualizer
  const velocityData = useMemo(() => {
    const base = [
      { day: 'Mon', date: 'Oct 06', views: 34200, unique: '21.4k', completion: '78%' },
      { day: 'Tue', date: 'Oct 07', views: 39500, unique: '24.8k', completion: '80%' },
      { day: 'Wed', date: 'Oct 08', views: 45800, unique: '29.1k', completion: '82%' },
      { day: 'Thu', date: 'Oct 09', views: 53100, unique: '33.6k', completion: '85%' },
      { day: 'Fri', date: 'Oct 10', views: 64800, unique: '41.2k', completion: '88%', peak: true },
      { day: 'Sat', date: 'Oct 11', views: 41200, unique: '26.0k', completion: '79%' },
      { day: 'Sun', date: 'Oct 12', views: 48000, unique: '30.5k', completion: '81%' }
    ];

    return base.map(d => {
      const scaleFactor = timeRange === '90d' ? 1.12 : timeRange === '30d' ? 1.05 : 1;
      const scaledViews = Math.round(d.views * scaleFactor);
      // Proportion calculated against the 80k Y-axis peak scale
      const heightPercent = Math.min(100, Math.max(4, Math.round((scaledViews / 80000) * 100)));
      return {
        ...d,
        views: scaledViews,
        height: heightPercent
      };
    });
  }, [timeRange]);

  const velocityTotal = useMemo(() => {
    return velocityData.reduce((acc, v) => acc + v.views, 0);
  }, [velocityData]);

  const dailyAverage = useMemo(() => {
    return Math.round(velocityTotal / (velocityData.length || 1));
  }, [velocityTotal, velocityData]);

  const activeInsight = useMemo(() => {
    const targetDay = hoveredDay || selectedDay;
    if (targetDay) {
      return velocityData.find(d => d.day === targetDay);
    }
    return null;
  }, [hoveredDay, selectedDay, velocityData]);

  // Bureau geographic breakdown
  const bureauBreakdown = [
    { name: 'Kochi & Ernakulam (HQ)', percentage: 41.5, readers: '128,400', color: 'bg-rose-600' },
    { name: 'Thiruvananthapuram & Technopark', percentage: 26.2, readers: '81,200', color: 'bg-blue-600' },
    { name: 'Kozhikode & Malabar Coast', percentage: 14.8, readers: '45,800', color: 'bg-emerald-600' },
    { name: 'National Bureau (Delhi & Bengaluru)', percentage: 11.2, readers: '34,700', color: 'bg-amber-600' },
    { name: 'Overseas Diaspora (Gulf, UK, US)', percentage: 6.3, readers: '19,500', color: 'bg-purple-600' }
  ];

  // Acquisition Channels
  const trafficChannels = [
    { name: 'Direct Broadsheet Visitors', share: 44.2, change: '+12.4%', color: 'bg-rose-500' },
    { name: 'Google News & Discover Feed', share: 31.8, change: '+18.9%', color: 'bg-blue-500' },
    { name: 'Social & Wire Syndications', share: 18.5, change: '+4.2%', color: 'bg-amber-500' },
    { name: 'Newsletter & Push Dispatch Wire', share: 5.5, change: '+32.1%', color: 'bg-emerald-500' }
  ];

  // Filtered stories sorted by views
  const topDispatches = useMemo(() => {
    return [...articles]
      .filter(art => {
        const matchesBeat = selectedBeat === 'All' || art.category?.toLowerCase().includes(selectedBeat.toLowerCase());
        const matchesQuery = !searchQuery.trim() ||
          art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBeat && matchesQuery;
      })
      .sort((a, b) => {
        const parseV = (v) => {
          if (!v) return 0;
          if (typeof v === 'number') return v;
          if (typeof v === 'string' && v.includes('k')) return parseFloat(v) * 1000;
          return parseFloat(v) || 0;
        };
        return parseV(b.views) - parseV(a.views);
      });
  }, [articles, selectedBeat, searchQuery]);

  // Aggregate author telemetry
  const authorLeaderboard = useMemo(() => {
    const authorStats = {};

    articles.forEach(art => {
      const authorName = art.author?.name || 'Staff Reporter';
      if (!authorStats[authorName]) {
        authorStats[authorName] = {
          name: authorName,
          bureau: art.author?.role || 'Kochi HQ',
          avatar: art.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
          storyCount: 0,
          totalViews: 0,
          categories: new Set()
        };
      }
      authorStats[authorName].storyCount += 1;
      if (art.category) authorStats[authorName].categories.add(art.category);
      const v = typeof art.views === 'string' && art.views.includes('k')
        ? parseFloat(art.views) * 1000
        : (parseFloat(art.views) || 2400);
      authorStats[authorName].totalViews += Math.round(v);
    });

    return Object.values(authorStats)
      .map(author => ({
        ...author,
        topCategory: Array.from(author.categories)[0] || 'General Wire',
        avgViewsPerStory: Math.round(author.totalViews / (author.storyCount || 1))
      }))
      .sort((a, b) => b.totalViews - a.totalViews);
  }, [articles]);

  // Beat Performance breakdown
  const beatStats = useMemo(() => {
    const stats = {};
    const coreCategories = categories && categories.length > 0
      ? categories.filter(c => c !== 'All')
      : ['Tech', 'Kerala', 'Business', 'Politics', 'Science', 'Culture'];

    coreCategories.forEach(cat => {
      stats[cat] = {
        name: cat,
        storyCount: 0,
        totalViews: 0
      };
    });

    articles.forEach(art => {
      const cat = art.category || 'General';
      const key = coreCategories.find(c => cat.toLowerCase().includes(c.toLowerCase())) || cat;
      if (!stats[key]) {
        stats[key] = { name: key, storyCount: 0, totalViews: 0 };
      }
      stats[key].storyCount += 1;
      const v = typeof art.views === 'string' && art.views.includes('k')
        ? parseFloat(art.views) * 1000
        : (parseFloat(art.views) || 1800);
      stats[key].totalViews += Math.round(v);
    });

    const totalAllViews = Object.values(stats).reduce((acc, curr) => acc + curr.totalViews, 0) || 1;

    return Object.values(stats).map(s => ({
      ...s,
      percentage: Math.round((s.totalViews / totalAllViews) * 100)
    })).sort((a, b) => b.totalViews - a.totalViews);
  }, [articles, categories]);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Headline,Category,Author,Views,ReadTime\n"
      + topDispatches.map(a => `"${a.title.replace(/"/g, '""')}","${a.category}","${a.author?.name || 'Staff'}","${a.views}","${a.readTime}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsnow_readership_telemetry_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Telemetry CSV exported successfully! 📊', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header with Time Range Selector & Export Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase tracking-widest">
              TELEMETRY ENGINE
            </span>
            <span className="text-xs text-neutral-400 font-mono">Realtime Edge Node</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
            Audience & Readership Intelligence
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Realtime reader concurrency, desk distribution, reader dwell times, and journalist attribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time range toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#111317] border border-neutral-200 dark:border-neutral-800 text-xs shadow-xs">
            {[
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: '90d', label: 'Quarterly' }
            ].map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  timeRange === range.id
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Export Report Action */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111317] hover:bg-neutral-50 dark:hover:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 shadow-xs transition-colors"
            title="Download CSV Telemetry Export"
          >
            <Download className="w-3.5 h-3.5 text-rose-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Real-Time Readers Live Concurrency Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-emerald-500/5 to-transparent border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-emerald-400 opacity-30" />
            <Radio className="w-5 h-5 relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white tabular-nums tracking-tight">
                {liveReaders.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider animate-pulse">
                Active Readers
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Concurrent readers across Kochi HQ, Technopark, Delhi, and Global diaspora editions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="font-mono text-[10px] text-neutral-400 uppercase">Live Bounce Rate</div>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">27.8%</div>
            <div className="text-[10px] text-emerald-500 flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> -3.2% vs avg
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="font-mono text-[10px] text-neutral-400 uppercase">Mean Active Depth</div>
            <div className="font-mono font-bold text-neutral-900 dark:text-white text-sm mt-0.5">4m 24s</div>
            <div className="text-[10px] text-neutral-400 font-mono">79% completion</div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="font-mono text-[10px] text-neutral-400 uppercase">Top Live Beat</div>
            <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5 truncate">Tech & Kerala</div>
            <div className="text-[10px] text-neutral-400 font-mono">58% traffic share</div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="font-mono text-[10px] text-neutral-400 uppercase">Server CDN Cache</div>
            <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm mt-0.5">99.4% Hit</div>
            <div className="text-[10px] text-neutral-400 font-mono">18ms response</div>
          </div>
        </div>
      </div>

      {/* 3. Top High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Dispatches Read */}
        <div className="bg-white dark:bg-[#111317] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-medium">Total Dispatches Read</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-serif font-black text-2xl text-neutral-900 dark:text-white">
            {Math.round(312000 * multiplier).toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% vs preceding period</span>
          </div>
        </div>

        {/* Card 2: Mean Read Depth */}
        <div className="bg-white dark:bg-[#111317] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-medium">Mean Read Depth</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-serif font-black text-2xl text-neutral-900 dark:text-white">
            4m 42s
          </div>
          <div className="mt-1 text-xs text-neutral-500 font-mono">
            <span>79% finish longform stories</span>
          </div>
        </div>

        {/* Card 3: Read Completion Rate */}
        <div className="bg-white dark:bg-[#111317] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-medium">Read Completion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-serif font-black text-2xl text-neutral-900 dark:text-white">
            82.6%
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span>High-quality attentive reading</span>
          </div>
        </div>

        {/* Card 4: Subscriber & Return Loyalty */}
        <div className="bg-white dark:bg-[#111317] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-medium">Return Reader Loyalty</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-serif font-black text-2xl text-neutral-900 dark:text-white">
            66.4%
          </div>
          <div className="mt-1 text-xs text-neutral-500 font-mono">
            <span>Returning daily morning readers</span>
          </div>
        </div>
      </div>

      {/* 4. Tabbed Telemetry Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Velocity', icon: BarChart2 },
          { id: 'beats', label: 'Beats & Desks Distribution', icon: Layers },
          { id: 'authors', label: 'Journalist Leaderboard', icon: Award },
          { id: 'traffic', label: 'Traffic & Devices', icon: Globe }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & VELOCITY */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-150">
          
          {/* Left 2 Cols: Minimalist & Modern Bar Visualizer with Y-Axis Scale Lines */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111317] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                    Daily Readership Velocity
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold border border-neutral-200/60 dark:border-neutral-700/60">
                    {timeRange === '7d' ? '7-Day View' : timeRange === '30d' ? '30-Day Cycle' : 'Quarterly Trend'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Aggregated unique broadsheet reads with 80k scale benchmarks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Peak: Friday ({((velocityData.find(d => d.peak)?.views || 64800) / 1000).toFixed(1)}k)
                </span>
              </div>
            </div>

            {/* Chart Area: Y-Axis Guides + Streamlined Gradient Bars */}
            <div className="pt-2">
              <div className="relative flex h-60">
                {/* Y-Axis Scale Labels (80k down to 0k) */}
                <div className="w-9 shrink-0 flex flex-col justify-between items-end pr-2.5 py-0 select-none">
                  {yAxisTicks.map((tick) => (
                    <span
                      key={tick.label}
                      className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 leading-none"
                    >
                      {tick.label}
                    </span>
                  ))}
                </div>

                {/* Plot Area with Guide Lines & Bars */}
                <div className="relative flex-1 h-full">
                  {/* Y-Axis Horizontal Guide Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {yAxisTicks.map((tick, index) => (
                      <div
                        key={tick.label}
                        className={`w-full ${
                          index === yAxisTicks.length - 1
                            ? 'border-b border-neutral-300 dark:border-neutral-700'
                            : 'border-b border-dashed border-neutral-200/70 dark:border-neutral-800/80'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Bars Container */}
                  <div className="relative h-full flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 z-10">
                    {velocityData.map((d) => {
                      const isHovered = hoveredDay === d.day;
                      const isSelected = selectedDay === d.day;
                      const formattedK = (d.views / 1000).toFixed(1) + 'k';

                      return (
                        <div
                          key={d.day}
                          className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                          onMouseEnter={() => setHoveredDay(d.day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onClick={() => setSelectedDay(selectedDay === d.day ? null : d.day)}
                        >
                          {/* Inline Data Value Badge Permanently Positioned Above Bar */}
                          <div
                            className={`mb-1.5 transition-all duration-200 ${
                              d.peak || isHovered || isSelected
                                ? 'scale-105'
                                : 'opacity-90 group-hover:opacity-100'
                            }`}
                          >
                            <span
                              className={`font-mono text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded transition-all ${
                                d.peak
                                  ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/30 ring-1 ring-rose-400'
                                  : isHovered || isSelected
                                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                                  : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100/90 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80'
                              }`}
                            >
                              {formattedK}
                            </span>
                          </div>

                          {/* Streamlined Gradient Bar */}
                          <div
                            className="w-full flex justify-center items-end"
                            style={{ height: `${d.height}%` }}
                          >
                            <div
                              className={`w-full max-w-[36px] sm:max-w-[44px] h-full rounded-t-lg transition-all duration-300 ${
                                d.peak
                                  ? 'bg-gradient-to-t from-rose-700 via-rose-600 to-rose-400 shadow-md shadow-rose-600/20 ring-2 ring-rose-500/40'
                                  : isHovered || isSelected
                                  ? 'bg-gradient-to-t from-neutral-800 to-neutral-400 dark:from-neutral-700 dark:to-neutral-300 shadow-sm'
                                  : 'bg-gradient-to-t from-neutral-200 via-neutral-300 to-neutral-400 dark:from-neutral-800 dark:via-neutral-750 dark:to-neutral-600 group-hover:from-neutral-300 group-hover:to-rose-500 dark:group-hover:from-neutral-700 dark:group-hover:to-rose-500'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* X-Axis Day Labels Row */}
              <div className="flex pt-3 pl-9 pr-0">
                <div className="flex-1 flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4 border-t border-neutral-200/80 dark:border-neutral-800/80 pt-2">
                  {velocityData.map((d) => (
                    <div
                      key={d.day}
                      className="flex-1 text-center cursor-pointer"
                      onClick={() => setSelectedDay(selectedDay === d.day ? null : d.day)}
                    >
                      <span
                        className={`font-mono text-xs font-semibold block transition-colors ${
                          d.peak
                            ? 'text-rose-600 dark:text-rose-400 font-bold'
                            : selectedDay === d.day || hoveredDay === d.day
                            ? 'text-neutral-900 dark:text-white font-bold'
                            : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {d.day}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 hidden sm:block">
                        {d.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active / Inspected Day Context Banner */}
            {activeInsight && (
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center justify-between text-xs gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {activeInsight.day} ({activeInsight.date}):
                  </span>
                  <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
                    {activeInsight.views.toLocaleString()} pageviews
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-500 font-mono">
                    {activeInsight.unique} unique readers
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                    {activeInsight.completion} completion
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  {((activeInsight.views / velocityTotal) * 100).toFixed(1)}% of weekly volume
                </span>
              </div>
            )}

            {/* Footer Summary Stats */}
            <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
                <span>
                  Cycle Total: <strong className="text-neutral-800 dark:text-neutral-200 font-bold">{velocityTotal.toLocaleString()}</strong> views
                </span>
                <span>•</span>
                <span>
                  Daily Average: <strong className="text-neutral-800 dark:text-neutral-200 font-bold">{dailyAverage.toLocaleString()}</strong>/day
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Telemetry Node: Kochi Edge (Synchronized)</span>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Bureau Regional Concentration */}
          <div className="bg-white dark:bg-[#111317] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-5">
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                Readership by Bureau Region
              </h3>
              <p className="text-xs text-neutral-500">
                Geographic concentration of readers accessing the digital newspaper.
              </p>
            </div>

            <div className="space-y-4">
              {bureauBreakdown.map((bureau) => (
                <div key={bureau.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate pr-2">
                      {bureau.name}
                    </span>
                    <span className="font-mono font-bold text-neutral-600 dark:text-neutral-400">
                      {bureau.percentage}% ({bureau.readers})
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${bureau.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${bureau.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500 flex items-center justify-between">
              <span>Primary Gateway:</span>
              <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                Kochi IX & Delhi Pop
              </span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: BEATS & DESKS DISTRIBUTION */}
      {activeTab === 'beats' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beatStats.map((beat) => (
              <div
                key={beat.name}
                className="bg-white dark:bg-[#111317] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white font-mono">
                    {beat.name} Desk
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    {beat.percentage}% Share
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="font-serif font-black text-2xl text-neutral-900 dark:text-white">
                    {beat.totalViews.toLocaleString()}
                  </div>
                  <div className="text-xs font-mono text-neutral-500">
                    {beat.storyCount} active stories
                  </div>
                </div>

                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${beat.percentage}%` }}
                  />
                </div>

                <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
                  <span>Avg Reads/Story:</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {Math.round(beat.totalViews / (beat.storyCount || 1)).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: JOURNALIST LEADERBOARD */}
      {activeTab === 'authors' && (
        <div className="bg-white dark:bg-[#111317] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                Staff Journalist & Bureau Attribution
              </h3>
              <p className="text-xs text-neutral-500">
                Ranked by dispatch publication velocity, reader depth, and cumulative reach.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
              {authorLeaderboard.length} Journalists Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 font-mono text-[10px] uppercase text-neutral-500">
                <tr>
                  <th className="py-2.5 px-3">Rank & Journalist</th>
                  <th className="py-2.5 px-3">Assigned Bureau</th>
                  <th className="py-2.5 px-3">Primary Beat</th>
                  <th className="py-2.5 px-3 text-right">Published Dispatches</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Reach</th>
                  <th className="py-2.5 px-3 text-right">Avg Reads/Story</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {authorLeaderboard.map((author, index) => (
                  <tr key={author.name} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-neutral-400 w-5">
                          #{index + 1}
                        </span>
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                        />
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">
                            {author.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            Editorial Staff
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-neutral-600 dark:text-neutral-400">
                      {author.bureau}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px] font-semibold">
                        {author.topCategory}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                      {author.storyCount} stories
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      {author.totalViews.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-neutral-600 dark:text-neutral-400">
                      {author.avgViewsPerStory.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TRAFFIC & DEVICES */}
      {activeTab === 'traffic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-150">
          
          {/* Traffic Acquisition Channels */}
          <div className="bg-white dark:bg-[#111317] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-5">
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Reader Traffic Acquisition Channels
            </h3>
            <p className="text-xs text-neutral-500">
              Primary pathways through which broadsheet readers discover and access dispatches.
            </p>

            <div className="space-y-4">
              {trafficChannels.map((channel) => (
                <div key={channel.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {channel.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {channel.change}
                      </span>
                      <span className="font-mono font-bold text-neutral-900 dark:text-white">
                        {channel.share}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${channel.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${channel.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device & Platform Form Factors */}
          <div className="bg-white dark:bg-[#111317] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                Device & Reading Form Factors
              </h3>
              <p className="text-xs text-neutral-500">
                Audience hardware and viewport telemetry across responsive screens.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <Smartphone className="w-6 h-6 mx-auto text-rose-500 mb-2" />
                <div className="font-mono font-bold text-lg text-neutral-900 dark:text-white">68.2%</div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Smartphones</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-1">iOS & Android</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <Monitor className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                <div className="font-mono font-bold text-lg text-neutral-900 dark:text-white">26.9%</div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Desktop / Laptop</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-1">macOS & Windows</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60">
                <Globe className="w-6 h-6 mx-auto text-emerald-500 mb-2" />
                <div className="font-mono font-bold text-lg text-neutral-900 dark:text-white">4.9%</div>
                <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Tablets & e-Ink</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-1">iPad & Readers</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Core Web Vitals:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                LCP 0.8s • CLS 0.01 • INP 42ms
              </span>
            </div>
          </div>

        </div>
      )}

      {/* 5. Top-Performing Dispatches Deep Table */}
      <div className="bg-white dark:bg-[#111317] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
                  Top-Performing Dispatches & Stories
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {topDispatches.length} Stories Ranked
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Dispatches ranked by unique reads, engagement depth, and reader retention.
              </p>
            </div>
          </div>

          {/* Search and Beat Filter for Dispatches */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search stories or journalists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 w-52 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedBeat}
              onChange={(e) => setSelectedBeat(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
            >
              <option value="All">All Beats</option>
              {categories && categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stories List */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {topDispatches.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No dispatches match the selected beat or search term.
            </div>
          ) : (
            topDispatches.slice(0, 10).map((story, idx) => (
              <div key={story.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 px-2 rounded-xl transition-colors">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="font-mono font-bold text-sm text-neutral-400 group-hover:text-rose-600 transition-colors shrink-0 w-6 pt-0.5">
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/article/${story.id}`}
                      className="text-xs font-bold text-neutral-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors line-clamp-1 block"
                    >
                      {story.title}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-neutral-400">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-neutral-700 dark:text-neutral-300 font-semibold">
                        {story.category}
                      </span>
                      <span>•</span>
                      <span>By {story.author?.name || 'Staff Reporter'}</span>
                      <span>•</span>
                      <span>{story.publishedAt || 'Recent'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 shrink-0 justify-between sm:justify-end text-xs">
                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1 justify-end">
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{story.views || '1.2k'} reads</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {story.readTime || '4 min'} depth
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/articles/edit/${story.id}`}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Edit Dispatch"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/article/${story.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      title="View Live Broadsheet Article"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
