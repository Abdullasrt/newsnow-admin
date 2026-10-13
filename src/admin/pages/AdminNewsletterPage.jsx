import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Mail,
  Bell,
  Send,
  Radio,
  Copy,
  Check,
  Zap
} from 'lucide-react';

export const AdminNewsletterPage = () => {
  const {
    breakingNews,
    triggerNewsletter,
    triggerPushNotification,
    showToast
  } = useNews();

  // Push notification form state
  const [pushTitle, setPushTitle] = useState('⚡ Flash Alert: Kochi Infopark closes landmark ₹350 Cr neuromorphic chip funding.');
  const [pushAudience, setPushAudience] = useState('All Readers (Global)');
  const [copiedFeed, setCopiedFeed] = useState(null);

  const syndicationFeeds = [
    { name: 'Frontpage Master Broadsheet', url: 'https://newsnow.in/feeds/master.xml', status: 'Active (24/7)', subscribers: '3.4k readers' },
    { name: 'Kerala & Regional Bureau Feed', url: 'https://newsnow.in/feeds/kerala.xml', status: 'Active', subscribers: '8.2k readers' },
    { name: 'Deep-Tech & Silicon Feed', url: 'https://newsnow.in/feeds/tech.xml', status: 'Active', subscribers: '12.1k readers' },
    { name: 'Sovereign Policy & Business Wire', url: 'https://newsnow.in/feeds/business.xml', status: 'Active', subscribers: '4.9k readers' }
  ];

  const handleCopyFeed = (url, name) => {
    navigator.clipboard.writeText(url);
    setCopiedFeed(name);
    showToast(`Syndication URL copied: ${name} 📡`, 'success');
    setTimeout(() => setCopiedFeed(null), 2000);
  };

  const handleSendPush = (e) => {
    e.preventDefault();
    if (!pushTitle.trim()) {
      showToast('Please enter an alert title', 'error');
      return;
    }
    triggerPushNotification(pushTitle.trim());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Masthead */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-rose-600 dark:text-rose-400 font-bold">
            Audience Distribution & Feeds
          </span>
        </div>
        <h2 className="mt-1 font-serif font-black text-2xl sm:text-3xl text-neutral-900 dark:text-white">
          Newsletter Dispatches & Push Alerts
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Broadcast automated email editions, fire real-time mobile push notifications, and monitor audience syndication feeds.
        </p>
      </div>

      {/* 2. Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111317] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-mono">Active Subscribers</span>
            <div className="mt-1 font-serif font-black text-2xl text-neutral-900 dark:text-white">
              14,820
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">+640 this week</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200/50">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111317] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-mono">Open Rate Average</span>
            <div className="mt-1 font-serif font-black text-2xl text-neutral-900 dark:text-white">
              46.8%
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">Industry avg: 22.4%</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200/50">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111317] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500 font-mono">Push Notification CTR</span>
            <div className="mt-1 font-serif font-black text-2xl text-neutral-900 dark:text-white">
              18.2%
            </div>
            <span className="text-[11px] text-rose-500 font-semibold">Immediate read surge</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200/50">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Automated Newsletter Edition Triggers */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Automated Newsletter Editions
            </h3>
            <p className="text-xs text-neutral-500">
              Instantly compile current live dispatches and trigger dispatch to reader inboxes.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-500 font-bold">Mailgun / Resend Connected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Morning Broadsheet */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  Morning Executive Broadsheet
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-mono font-bold">
                  Daily 07:00 IST
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Compiles the top 5 stories across Kerala, Tech, and Business into an executive summary.
              </p>
            </div>
            <button
              onClick={() => triggerNewsletter('Morning Executive Broadsheet')}
              className="mt-4 w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Trigger Dispatch Now</span>
            </button>
          </div>

          {/* Card 2: Breaking Flash Wire */}
          <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-500/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  Emergency Breaking Wire
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 text-[10px] font-mono font-bold">
                  Instant
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Dispatches high-priority bulletins directly to subscribers opted-in to instant alerts ({breakingNews.length} active).
              </p>
            </div>
            <button
              onClick={() => triggerNewsletter('Emergency Breaking Wire')}
              className="mt-4 w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Send Breaking Alert</span>
            </button>
          </div>

          {/* Card 3: Deep-Tech Weekly Digest */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  Silicon Coast Weekend Deep Dive
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-mono font-bold">
                  Saturdays
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Longform investigative essays on semiconductors, green maritime, and sovereign technology.
              </p>
            </div>
            <button
              onClick={() => triggerNewsletter('Silicon Coast Weekend Deep Dive')}
              className="mt-4 w-full py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Weekly Edition</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Real-time Push Notification Broadcast Simulator */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <Bell className="w-4 h-4 text-amber-500" />
          <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
            Broadcast Breaking Push Notification
          </h3>
        </div>

        <form onSubmit={handleSendPush} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Push Alert Headline (Max 120 characters)
            </label>
            <input
              type="text"
              value={pushTitle}
              onChange={(e) => setPushTitle(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">Target Segment:</span>
              <select
                value={pushAudience}
                onChange={(e) => setPushAudience(e.target.value)}
                aria-label="Target Segment"
                className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 font-medium"
              >
                <option value="All Readers (Global)">All Readers (Global Web & Mobile)</option>
                <option value="Kerala Readers">Kerala Regional Subscribers</option>
                <option value="Deep Tech Segment">Deep-Tech & Policy Desk Subscribers</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Broadcast Push Alert</span>
            </button>
          </div>
        </form>
      </div>

      {/* 5. Syndication Feeds Table */}
      <div className="bg-white dark:bg-[#111317] rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-500" />
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Syndication Endpoints
            </h3>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">XML 2.0 Compliant</span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {syndicationFeeds.map(feed => {
            const isCopied = copiedFeed === feed.name;
            return (
              <div key={feed.name} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">{feed.name}</div>
                  <div className="font-mono text-[11px] text-neutral-400 mt-0.5">{feed.url}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                    {feed.status}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                    {feed.subscribers}
                  </span>
                  <button
                    onClick={() => handleCopyFeed(feed.url, feed.name)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 transition-colors"
                    title="Copy Syndication URL"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
