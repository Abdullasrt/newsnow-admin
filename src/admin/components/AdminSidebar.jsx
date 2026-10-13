import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Zap,
  FolderKanban,
  Inbox,
  BarChart3,
  Settings,
  LogOut,
  X,
  FileCheck2,
  Mail,
  Users
} from 'lucide-react';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const {
    adminUser,
    logoutAdmin,
    articles,
    breakingNews,
    categories,
    enquiries,
    currentRole
  } = useNews();
  const navigate = useNavigate();

  const unreadEnquiriesCount = enquiries.filter(e => e.status === 'unread').length;
  const breakingCount = breakingNews.length;
  const inReviewCount = articles.filter(a => a.status === 'in_review').length;

  // Keyboard shortcut: Press Ctrl+N or Cmd+N to jump to Compose Story
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && e.shiftKey) {
        e.preventDefault();
        navigate('/admin/articles/new');
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onClose]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: 'Editorial Wire',
      items: [
        {
          to: '/admin',
          end: true,
          label: 'Newsroom Overview',
          icon: LayoutDashboard
        },
        {
          to: '/admin/articles',
          label: 'Stories & Dispatches',
          icon: FileText,
          badge: articles.length
        },
        {
          to: '/admin/review-queue',
          label: 'Editorial Review Queue',
          icon: FileCheck2,
          badge: inReviewCount > 0 ? `${inReviewCount} To Review` : null,
          badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse'
        },
        {
          to: '/admin/breaking',
          label: 'Breaking Ticker',
          icon: Zap,
          badge: breakingCount,
          badgePulse: true,
          badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
        }
      ]
    },
    {
      title: 'Beats & Desks',
      items: [
        {
          to: '/admin/categories',
          label: 'Desk Management',
          icon: FolderKanban,
          badge: categories.length
        }
      ]
    },
    {
      title: 'Intel & Engagement',
      items: [
        {
          to: '/admin/enquiries',
          label: 'Whistleblower Inbox',
          icon: Inbox,
          badge: unreadEnquiriesCount > 0 ? `${unreadEnquiriesCount} New` : null,
          badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse'
        },
        {
          to: '/admin/newsletter',
          label: 'Newsletter & Push Wire',
          icon: Mail
        }
      ]
    },
    {
      title: 'Governance & Settings',
      items: [
        {
          to: '/admin/team',
          label: 'Staff Directory & RBAC',
          icon: Users,
          badge: currentRole ? currentRole.split(' ')[0] : null,
          badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
        },
        {
          to: '/admin/analytics',
          label: 'Readership Analytics',
          icon: BarChart3
        },
        {
          to: '/admin/settings',
          label: 'Newsroom Settings',
          icon: Settings
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-[#0c0e12] text-neutral-800 dark:text-neutral-200 border-r border-neutral-200/90 dark:border-neutral-800/80 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 shadow-sm lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 1. Newsroom Brand Header */}
        <div className="h-16 px-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between shrink-0 bg-neutral-50/50 dark:bg-[#0f1116]/50">
          <Link to="/admin" className="flex items-center gap-3 group" onClick={() => onClose && onClose()}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-600 flex items-center justify-center font-black text-white text-xs tracking-tighter shadow-xs shadow-rose-600/30 group-hover:scale-105 transition-transform">
              NN
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black tracking-tight text-base text-neutral-900 dark:text-white">
                  NEWS NOW
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase font-black tracking-wider rounded bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  CMS
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 tracking-wider uppercase block">
                Executive Desk
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden transition-colors"
            aria-label="Close admin menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Live Broadcast Status Banner */}
        <div className="px-5 py-2.5 bg-neutral-100/60 dark:bg-neutral-900/60 border-b border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Newsroom Live
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 font-medium">
            Kochi Bureau
          </span>
        </div>

        {/* 3. Primary Hero Action: Compose Dispatch CTA */}
        <div className="p-3.5 pb-2 shrink-0">
          <Link
            to="/admin/articles/new"
            onClick={() => onClose && onClose()}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs shadow-xs shadow-rose-600/30 transition-all hover:scale-101 active:scale-99"
          >
            <div className="flex items-center gap-2.5">
              <PlusCircle className="w-4 h-4 text-rose-100 group-hover:rotate-90 transition-transform duration-200" />
              <span>Compose Dispatch</span>
            </div>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/20 text-white">
              New
            </span>
          </Link>
        </div>

        {/* 4. Structured Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-400 font-bold">
                {section.title}
              </div>

              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-rose-600 text-white font-semibold shadow-xs shadow-rose-600/20'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <item.icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge !== null && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : item.badgeColor || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}

        </nav>

        {/* 6. User Profile & Sign Out Footer */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-[#090b0e] shrink-0">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                  alt={adminUser?.name || 'Admin'}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-neutral-300 dark:ring-neutral-700"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {adminUser?.name || 'Chief Editor'}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{adminUser?.role || 'Admin'}</span>
                  <span>•</span>
                  <span className="truncate">{adminUser?.bureau || 'Kochi'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 rounded-lg transition-colors shrink-0"
              title="Sign Out of Newsroom Desk"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Active RBAC Role Indicator */}
          <div className="mt-2 px-2 py-1.5 rounded-lg bg-neutral-100/70 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between text-[10px]">
            <span className="text-neutral-400 font-mono uppercase tracking-wider text-[9px] font-bold">Active RBAC:</span>
            <Link
              to="/admin/team"
              onClick={() => onClose && onClose()}
              className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              title="Switch role in Staff & RBAC Simulator"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>{currentRole || 'Chief Editor'}</span>
              <span className="text-[9px] font-mono text-neutral-400">(Switch)</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
