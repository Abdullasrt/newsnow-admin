import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import {
  Menu,
  Sun,
  Moon,
  PlusCircle,
  ExternalLink,
  Bell,
  X
} from 'lucide-react';
import { getLiveSiteUrl } from '../../utils/siteUrl';

export const AdminHeader = ({ onToggleSidebar }) => {
  const { theme, toggleTheme, adminUser, enquiries, articles } = useNews();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive human title from location
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Newsroom Overview';
    if (path === '/admin/articles') return 'Dispatches & Articles';
    if (path === '/admin/articles/new') return 'Compose New Story';
    if (path.startsWith('/admin/articles/edit')) return 'Edit Dispatch';
    if (path === '/admin/breaking') return 'Breaking News Ticker';
    if (path === '/admin/categories') return 'Editorial Desks';
    if (path === '/admin/enquiries') return 'Reader Tips & Scoops';
    if (path === '/admin/analytics') return 'Readership Analytics';
    if (path === '/admin/settings') return 'Newsroom Settings';
    return 'Editorial Desk';
  };

  const unreadCount = enquiries.filter(e => e.status === 'unread').length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0e1014]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-mono uppercase tracking-wider text-neutral-400">
            Admin
          </span>
          <span className="hidden sm:inline-block text-neutral-300 dark:text-neutral-700">/</span>
          <h1 className="font-serif font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick New Article Button */}
        <Link
          to="/admin/articles/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all hover:scale-102"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Story</span>
        </Link>

        {/* View Live Site Shortcut */}
        <a
          href={getLiveSiteUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white text-xs font-medium transition-colors"
          title="Open live public newspaper website in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Live Site</span>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Toggle light or dark theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
            aria-label="Editorial notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white dark:ring-[#0e1014]" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#121418] rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                    Newsroom Alerts
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {enquiries.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/admin/enquiries');
                    }}
                    className="p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer border border-transparent hover:border-neutral-200/50 dark:hover:border-neutral-700/50 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{item.deptName}</span>
                      <span>{item.date.split(',')[0]}</span>
                    </div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate mt-1">
                      {item.subject}
                    </div>
                    <div className="text-neutral-500 text-[11px] line-clamp-1 mt-0.5">
                      {item.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
                <Link
                  to="/admin/enquiries"
                  onClick={() => setShowNotifications(false)}
                  className="text-rose-600 dark:text-rose-400 font-semibold hover:underline"
                >
                  View all in Inbox →
                </Link>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {articles.length} dispatches live
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link
          to="/admin/settings"
          className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800"
        >
          <img
            src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-600/20"
          />
        </Link>
      </div>
    </header>
  );
};
